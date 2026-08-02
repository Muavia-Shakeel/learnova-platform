import Link from "next/link";
import { FadeIn } from "./FadeIn";

const LINKS = [
  { href: "/subjects", title: "Subjects", blurb: "School, exam prep, and homeschooling — every board covered." },
  { href: "/how-it-works", title: "How it works", blurb: "Book a trial, meet your tutor, track progress." },
  { href: "/pricing", title: "Pricing", blurb: "Credit packages that never expire." },
  { href: "/faq", title: "FAQ", blurb: "Credits, timezones, and vetting — answered." },
];

export function ExploreLinks() {
  return (
    <section className="bg-off-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold text-deep-blue">Explore Learnova</h2>
        </FadeIn>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((link, i) => (
            <FadeIn key={link.href} delay={i * 100}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-2xl border border-deep-blue/10 bg-beige/40 p-6 transition-colors hover:border-sage-green"
              >
                <h3 className="font-semibold text-deep-blue">{link.title}</h3>
                <p className="mt-2 flex-1 text-sm text-deep-blue/80">{link.blurb}</p>
                <span className="mt-4 text-sm font-semibold text-sage-green transition-transform group-hover:translate-x-1">
                  Learn more →
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
