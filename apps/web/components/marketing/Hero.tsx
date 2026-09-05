import Link from "next/link";
import type { HomeContentInput } from "@learnova/shared-types";
import { CurriculumStamp } from "./CurriculumStamp";
import { StatsStrip } from "./StatsStrip";
import { PerforatedDivider } from "./PerforatedDivider";

const CURRICULA = ["Cambridge", "IB", "GCSE", "A Levels", "Edexcel", "IGCSE"];

const DEFAULT_HERO: HomeContentInput["hero"] = {
  eyebrow: "A learning passport, stamped in 30+ countries",
  headline: "Learn Beyond Limits",
  subheadline: "Expert tutors. Flexible learning. Global access. All in one place.",
  primaryCtaText: "Book a Free Trial",
  primaryCtaHref: "/book-demo",
  secondaryCtaText: "Find a Tutor",
  secondaryCtaHref: "/subjects",
};

export function Hero({ content = DEFAULT_HERO }: { content?: HomeContentInput["hero"] }) {
  return (
    <section className="bg-beige">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col items-start gap-6 text-left">
          <span className="rounded-full border border-deep-blue/20 bg-off-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-deep-blue/80">
            {content.eyebrow}
          </span>
          <h1 className="font-display text-5xl font-bold leading-[1.05] text-deep-blue sm:text-6xl">
            {content.headline}
          </h1>
          <p className="max-w-md text-lg text-deep-blue/80">{content.subheadline}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={content.primaryCtaHref}
              className="rounded-full bg-sage-green px-7 py-3.5 font-semibold text-white shadow-sm transition-transform hover:scale-105"
            >
              {content.primaryCtaText}
            </Link>
            <Link
              href={content.secondaryCtaHref}
              className="rounded-full border-2 border-deep-blue px-7 py-3.5 font-semibold text-deep-blue transition-colors hover:bg-deep-blue hover:text-off-white"
            >
              {content.secondaryCtaText}
            </Link>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-4 rounded-3xl border border-deep-blue/10 bg-off-white/60 p-10">
          {CURRICULA.map((label, i) => (
            <CurriculumStamp key={label} label={label} index={i} />
          ))}
        </div>
      </div>

      <PerforatedDivider />

      <div className="bg-off-white py-10">
        <StatsStrip />
      </div>
    </section>
  );
}
