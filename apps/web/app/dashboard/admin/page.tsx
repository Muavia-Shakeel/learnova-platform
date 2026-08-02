"use client";

import { useState } from "react";
import { useAuth } from "../../../lib/auth/useMe";
import { usePendingPayments, useConfirmPayoneerPayment } from "../../../features/admin/usePendingPayments";

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const { data: payments, isLoading } = usePendingPayments();
  const confirmPayment = useConfirmPayoneerPayment();
  const [refs, setRefs] = useState<Record<string, string>>({});

  if (user && user.role !== "admin") {
    return (
      <div className="rounded-lg border border-deep-blue/10 bg-white p-6">
        <p className="text-deep-blue">Admins only.</p>
      </div>
    );
  }

  async function confirm(paymentId: string) {
    const providerRef = refs[paymentId] || `manual-${Date.now()}`;
    await confirmPayment.mutateAsync({ paymentId, providerRef });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-blue">Pending payments</h1>
      <p className="mt-1 text-sm text-deep-blue/80">
        Confirm a Payoneer payment once you've verified it manually — credits are added automatically.
      </p>

      {isLoading && <p className="mt-6 text-sm text-deep-blue/70">Loading...</p>}
      {payments?.length === 0 && (
        <p className="mt-6 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
          No pending payments.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {payments?.map((p) => (
          <div
            key={p._id}
            className="flex flex-col gap-3 rounded-lg border border-deep-blue/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-deep-blue">
                {p.parentId?.fullName ?? "Unknown"} — <span className="capitalize">{p.packageTier}</span>
              </p>
              <p className="text-sm text-deep-blue/70">
                {p.currency} {p.amount} · {p.provider}
              </p>
            </div>
            {p.provider === "payoneer" && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Payment reference"
                  value={refs[p._id] ?? ""}
                  onChange={(e) => setRefs((prev) => ({ ...prev, [p._id]: e.target.value }))}
                  className="rounded-md border border-soft-blue px-3 py-2 text-sm"
                />
                <button
                  onClick={() => confirm(p._id)}
                  disabled={confirmPayment.isPending}
                  className="rounded-md bg-sage-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
