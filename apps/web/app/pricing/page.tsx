import type { Metadata } from "next";
import { Nav } from "../../components/marketing/Nav";
import { Pricing } from "../../components/marketing/Pricing";
import { ContactCta } from "../../components/marketing/ContactCta";
import { Footer } from "../../components/marketing/Footer";

export const metadata: Metadata = {
  title: "Pricing — Learnova",
  description: "Credit-based tutoring packages that never expire, with flexible lesson lengths.",
};

const PAYMENT_METHODS = [
  { name: "Card", detail: "Visa, Mastercard, Apple Pay, Google Pay via Stripe — instant." },
  { name: "Bank transfer", detail: "Stripe-processed bank transfer for larger packages." },
  { name: "Payoneer", detail: "We send a payment link in your preferred currency; credits land once confirmed." },
];

export default function PricingPage() {
  return (
    <main>
      <Nav />
      <section className="bg-beige py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="rounded-full border border-deep-blue/20 bg-off-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-deep-blue/80">
            Pricing
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-deep-blue sm:text-5xl">
            Pay for hours, not a subscription
          </h1>
          <p className="mt-4 text-deep-blue/80">
            Buy a credit package once. There&apos;s no monthly lock-in and no expiry clock — use the
            hours whenever your child needs them.
          </p>
        </div>
      </section>
      <Pricing />

      <section className="bg-beige py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-2xl font-bold text-deep-blue">How you can pay</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.name} className="rounded-2xl bg-off-white p-6">
                <h3 className="font-semibold text-deep-blue">{method.name}</h3>
                <p className="mt-2 text-sm text-deep-blue/80">{method.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
      <Footer />
    </main>
  );
}
