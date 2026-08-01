import type { PurchasePackageInput } from "@learnova/shared-types";
import { PACKAGE_CREDITS } from "@learnova/shared-types";
import { Payment } from "../models/payment.model";
import { Package } from "../models/package.model";
import { ProcessedWebhookEvent } from "../models/processedWebhookEvent.model";
import { stripe } from "../lib/stripe";
import { addCredits } from "./wallet.service";
import { ApiError } from "../middleware/errorHandler";
import { env } from "../config/env";
import type Stripe from "stripe";

export async function createStripeCheckout(input: PurchasePackageInput) {
  const pkg = await Package.findOne({ tier: input.tier });
  if (!pkg) throw new ApiError(404, "PACKAGE_NOT_FOUND", "Package tier not configured");

  const payment = await Payment.create({
    parentId: input.parentId,
    provider: "stripe",
    packageTier: input.tier,
    amount: pkg.priceGbp,
    currency: input.currency,
    status: "pending",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency.toLowerCase(),
          unit_amount: Math.round(pkg.priceGbp * 100),
          product_data: { name: `Learnova ${input.tier} package (${pkg.credits} credits)` },
        },
      },
    ],
    success_url: `${env.CORS_ORIGIN}/dashboard/payments?status=success`,
    cancel_url: `${env.CORS_ORIGIN}/dashboard/payments?status=cancelled`,
    metadata: { paymentId: payment.id, tier: input.tier },
  });

  payment.providerRef = session.id;
  await payment.save();
  return { checkoutUrl: session.url, paymentId: payment.id };
}

/** Payoneer has no programmatic checkout API here — admin generates a payment link manually and sends it to the parent in their preferred currency. */
export async function createPayoneerPaymentRequest(input: PurchasePackageInput) {
  const pkg = await Package.findOne({ tier: input.tier });
  if (!pkg) throw new ApiError(404, "PACKAGE_NOT_FOUND", "Package tier not configured");

  const payment = await Payment.create({
    parentId: input.parentId,
    provider: "payoneer",
    packageTier: input.tier,
    amount: pkg.priceGbp,
    currency: input.currency,
    status: "pending",
  });
  return { paymentId: payment.id, message: "Admin will generate a Payoneer link and send it in your preferred currency." };
}

export async function markPayoneerPaid(paymentId: string, providerRef: string) {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiError(404, "PAYMENT_NOT_FOUND", "Payment not found");
  payment.status = "paid";
  payment.providerRef = providerRef;
  await payment.save();
  await addCredits(payment.parentId.toString(), PACKAGE_CREDITS[payment.packageTier as keyof typeof PACKAGE_CREDITS], "purchase", payment.id);
  return payment;
}

export async function handleStripeWebhook(event: Stripe.Event) {
  const already = await ProcessedWebhookEvent.findOne({ provider: "stripe", eventId: event.id });
  if (already) return;
  await ProcessedWebhookEvent.create({ provider: "stripe", eventId: event.id });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.paymentId;
    if (!paymentId) return;

    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status === "paid") return;

    payment.status = "paid";
    await payment.save();
    await addCredits(
      payment.parentId.toString(),
      PACKAGE_CREDITS[payment.packageTier as keyof typeof PACKAGE_CREDITS],
      "purchase",
      payment.id,
    );
  }
}
