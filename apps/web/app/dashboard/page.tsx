"use client";

import { useWallet } from "../../features/student/useWallet";

export default function DashboardPage() {
  const { data: wallet, isLoading, error } = useWallet();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-lg border border-soft-blue bg-white p-6">
        <h2 className="text-sm text-deep-blue/70">Remaining credits</h2>
        {isLoading && <p className="mt-2 text-3xl font-bold">...</p>}
        {error && <p className="mt-2 text-sm text-red-600">Could not load wallet</p>}
        {wallet && <p className="mt-2 text-3xl font-bold text-deep-blue">{wallet.remaining}</p>}
      </div>
      <div className="rounded-lg border border-soft-blue bg-white p-6">
        <h2 className="text-sm text-deep-blue/70">Purchased</h2>
        {wallet && <p className="mt-2 text-3xl font-bold text-deep-blue">{wallet.purchased}</p>}
      </div>
      <div className="rounded-lg border border-soft-blue bg-white p-6">
        <h2 className="text-sm text-deep-blue/70">Used</h2>
        {wallet && <p className="mt-2 text-3xl font-bold text-deep-blue">{wallet.used}</p>}
      </div>
    </div>
  );
}
