"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth/useMe";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/students", label: "Students" },
  { href: "/dashboard/tutors", label: "Tutors" },
  { href: "/dashboard/billing", label: "Billing" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!user) return null;

  const links =
    user.role === "admin"
      ? [
          ...NAV_LINKS,
          { href: "/dashboard/admin", label: "Payments" },
          { href: "/dashboard/admin/careers", label: "Applications" },
        ]
      : NAV_LINKS;

  return (
    <div className="min-h-screen">
      <header className="flex flex-col gap-3 border-b border-soft-blue px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-display text-xl font-bold text-deep-blue">Learnova</span>
          <nav className="flex flex-wrap gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-deep-blue/80 hover:text-deep-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
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
