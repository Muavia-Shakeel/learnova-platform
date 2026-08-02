"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/useMe";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-soft-blue px-6 py-4">
        <span className="font-display text-xl font-bold text-deep-blue">Learnova</span>
        <div className="flex items-center gap-4 text-sm">
          <span>{user.fullName}</span>
          <button onClick={logout} className="text-deep-blue underline">
            Log out
          </button>
        </div>
      </header>
      <main className="px-6 py-10">{children}</main>
    </div>
  );
}
