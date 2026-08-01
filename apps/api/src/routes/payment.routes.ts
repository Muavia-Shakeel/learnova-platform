import { Router, raw } from "express";
import type Stripe from "stripe";
import { PurchasePackageSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import * as paymentService from "../services/payment.service";
import { stripe } from "../lib/stripe";
import { env } from "../config/env";
import { ApiError } from "../middleware/errorHandler";

// Mounted separately in app.ts, before the global express.json() parser —
// Stripe signature verification requires the raw, unparsed request body.
export const paymentWebhookRouter = Router();

paymentWebhookRouter.post("/stripe", raw({ type: "application/json" }), async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    if (typeof signature !== "string") throw new ApiError(400, "MISSING_SIGNATURE", "Missing Stripe signature");
    const event: Stripe.Event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
    await paymentService.handleStripeWebhook(event);
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
});

export const paymentRouter = Router();

paymentRouter.use(requireAuth);

paymentRouter.post("/checkout", requireRole("parent"), async (req, res, next) => {
  try {
    const input = PurchasePackageSchema.parse(req.body);
    if (input.paymentMethod === "stripe") {
      const result = await paymentService.createStripeCheckout(input);
      return res.status(201).json({ data: result });
    }
    const result = await paymentService.createPayoneerPaymentRequest(input);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
});

paymentRouter.post("/:id/payoneer-confirm", requireRole("admin"), async (req, res, next) => {
  try {
    const { providerRef } = req.body as { providerRef: string };
    const payment = await paymentService.markPayoneerPaid(req.params.id, providerRef);
    res.status(200).json({ data: payment });
  } catch (err) {
    next(err);
  }
});
