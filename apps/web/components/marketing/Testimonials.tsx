import { FadeIn } from "./FadeIn";

const QUOTES = [
  {
    quote:
      "My son's IGCSE Physics grade went from a 5 to a 7 in one term. His tutor knew the Edexcel mark scheme better than his school teacher did.",
    name: "Fatima R.",
    context: "Parent, Dubai — Edexcel IGCSE",
  },
  {
    quote:
      "We switched timezones twice moving between countries and never lost a lesson. The scheduling just adjusted.",
    name: "James O.",
    context: "Parent, Singapore — Cambridge A Levels",
  },
  {
    quote:
      "Booking was the easy part. What kept us was the weekly report — I actually know what my daughter struggled with.",
    name: "Meera K.",
    context: "Parent, Toronto — IB Diploma",
  },
];

export function Testimonials() {
  return (
    <section className="bg-beige py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-deep-blue">Parents, in their own words</h2>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {QUOTES.map((t, i) => (
            <FadeIn key={t.name} delay={i * 120}>
              <div className="relative h-full rounded-2xl bg-off-white p-7 shadow-sm">
                <span className="absolute right-5 top-5 rotate-12 rounded-full border border-dashed border-deep-blue/30 px-2 py-0.5 text-xs uppercase tracking-widest text-deep-blue/80">
                  Verified
                </span>
                <p className="font-display text-lg leading-snug text-deep-blue">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-5 text-sm font-semibold text-deep-blue">{t.name}</p>
                <p className="text-xs text-deep-blue/80">{t.context}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
