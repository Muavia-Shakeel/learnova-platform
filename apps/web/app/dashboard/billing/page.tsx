"use client";

import { useState } from "react";
import { useAuth } from "../../../lib/auth/useMe";
import { useCheckout, type PackageTier } from "../../../features/student/usePayments";
import { ApiClientError } from "../../../lib/api/client";

const TIERS: { tier: PackageTier; credits: number; price: number }[] = [
  { tier: "starter", credits: 10, price: 89 },
  { tier: "silver", credits: 20, price: 169 },
  { tier: "gold", credits: 40, price: 319 },
  { tier: "diamond", credits: 80, price: 599 },
];

export default function BillingPage() {
  const { user } = useAuth();
  const checkout = useCheckout();
  const [result, setResult] = useState<{ tier: PackageTier; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(tier: PackageTier, paymentMethod: "stripe" | "payoneer") {
    setError(null);
    setResult(null);
    try {
      const res = await checkout.mutateAsync({
        parentId: user!._id,
        tier,
        currency: "GBP",
        paymentMethod,
      });
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }
      setResult({ tier, message: res.message ?? "Payment request created." });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not start checkout");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-blue">Buy credits</h1>
      <p className="mt-1 text-sm text-deep-blue/80">1 credit = 1 hour. Credits never expire.</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {result && (
        <p className="mt-4 rounded-lg border border-sage-green bg-sage-green/10 p-4 text-sm text-deep-blue">
          <strong className="capitalize">{result.tier}</strong> package requested — {result.message}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => (
          <div key={t.tier} className="flex flex-col rounded-lg border border-deep-blue/10 bg-white p-5">
            <h2 className="font-display text-lg font-bold capitalize text-deep-blue">{t.tier}</h2>
            <p className="mt-2 font-display text-2xl font-bold text-deep-blue">£{t.price}</p>
            <p className="text-sm text-deep-blue/70">{t.credits} credits</p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => buy(t.tier, "stripe")}
                disabled={checkout.isPending}
                className="rounded-md border-2 border-deep-blue px-4 py-2 text-sm font-semibold text-deep-blue disabled:opacity-60"
              >
                Pay by card
              </button>
              <button
                onClick={() => buy(t.tier, "payoneer")}
                disabled={checkout.isPending}
                className="rounded-md bg-sage-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Pay via Payoneer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
