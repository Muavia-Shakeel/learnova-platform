"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth/useMe";
import type { Role } from "@learnova/shared-types";

const PARENT_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/students", label: "Students" },
  { href: "/dashboard/billing", label: "Billing" },
];

const STUDENT_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/students", label: "My Profile" },
  { href: "/dashboard/billing", label: "Billing" },
];

const TUTOR_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tutor/students", label: "My Students" },
  { href: "/dashboard/tutor/calendar", label: "Calendar" },
  { href: "/dashboard/tutor/resources", label: "Resources" },
];

const ADMIN_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/admin/students", label: "Students" },
  { href: "/dashboard/admin/leads", label: "Leads & Demos" },
  { href: "/dashboard/admin/subjects", label: "Subjects" },
  { href: "/dashboard/admin/resources", label: "Resources" },
  { href: "/dashboard/admin", label: "Payments" },
  { href: "/dashboard/admin/careers", label: "Applications" },
];

interface ShellProps {
  fullName: string;
  onLogout: () => void;
  children: React.ReactNode;
}

function AdminShell({ fullName, onLogout, children }: ShellProps) {
  return (
    <div className="flex min-h-screen bg-off-white">
      <aside className="flex w-56 flex-shrink-0 flex-col bg-deep-blue px-4 py-6 text-white">
        <span className="font-display text-lg font-bold">AdminLite</span>
        <nav className="mt-8 flex flex-col gap-1">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
          <span className="text-white/70">{fullName}</span>
          <button onClick={onLogout} className="text-left text-white underline">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 px-8 py-10">{children}</main>
    </div>
  );
}

function TutorShell({ fullName, onLogout, children }: ShellProps) {
  return (
    <div className="min-h-screen bg-off-white">
      <header className="flex flex-col gap-3 border-b border-sage-green/30 bg-sage-green/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-display text-xl font-bold text-sage-green">Learnova · Tutor Hub</span>
          <nav className="flex flex-wrap gap-4">
            {TUTOR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-deep-blue/80 hover:text-sage-green"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>{fullName}</span>
          <button onClick={onLogout} className="text-deep-blue underline">
            Log out
          </button>
        </div>
      </header>
      <main className="px-6 py-10">{children}</main>
    </div>
  );
}

function LearnerShell({ fullName, onLogout, links, children }: ShellProps & { links: typeof PARENT_LINKS }) {
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
          <span>{fullName}</span>
          <button onClick={onLogout} className="text-deep-blue underline">
            Log out
          </button>
        </div>
      </header>
      <main className="px-6 py-10">{children}</main>
    </div>
  );
}

function shellFor(role: Role) {
  if (role === "tutor") return "tutor" as const;
  if (role === "admin") return "admin" as const;
  return "learner" as const;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.mustChangePassword) {
      router.replace("/change-password");
    }
  }, [loading, user, router]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!user || user.mustChangePassword) return null;

  const shell = shellFor(user.role);

  if (shell === "admin") {
    return (
      <AdminShell fullName={user.fullName} onLogout={logout}>
        {children}
      </AdminShell>
    );
  }

  if (shell === "tutor") {
    return (
      <TutorShell fullName={user.fullName} onLogout={logout}>
        {children}
      </TutorShell>
    );
  }

  return (
    <LearnerShell fullName={user.fullName} onLogout={logout} links={user.role === "student" ? STUDENT_LINKS : PARENT_LINKS}>
      {children}
    </LearnerShell>
  );
}
