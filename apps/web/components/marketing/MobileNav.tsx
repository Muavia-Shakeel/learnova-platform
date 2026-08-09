"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/subjects", label: "Subjects" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/careers", label: "Careers" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-deep-blue/20"
      >
        <span
          className={`h-0.5 w-5 bg-deep-blue transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`h-0.5 w-5 bg-deep-blue transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`h-0.5 w-5 bg-deep-blue transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-deep-blue/10 bg-off-white px-6 py-4 shadow-md">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-deep-blue hover:bg-soft-blue/30"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-2 text-sm font-medium text-deep-blue hover:bg-soft-blue/30"
          >
            Log in
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-sage-green px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Book a Free Trial
          </Link>
        </div>
      )}
    </div>
  );
}
