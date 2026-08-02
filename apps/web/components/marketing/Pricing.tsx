import { FadeIn } from "./FadeIn";

const TIERS = [
  { tier: "Starter", credits: 10, price: 89, highlight: false },
  { tier: "Silver", credits: 20, price: 169, highlight: false },
  { tier: "Gold", credits: 40, price: 319, highlight: true },
  { tier: "Diamond", credits: 80, price: 599, highlight: false },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-off-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-deep-blue">Simple, credit-based pricing</h2>
          <p className="mt-3 text-deep-blue/70">
            1 credit = 1 hour of tutoring. Credits never expire, and lessons can run any length from 30
            minutes up.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <div
              key={t.tier}
              className={`flex flex-col rounded-2xl p-7 ${
                t.highlight
                  ? "border-2 border-sage-green bg-beige/60"
                  : "border border-deep-blue/10 bg-beige/30"
              }`}
            >
              {t.highlight && (
                <span className="mb-3 w-fit rounded-full bg-sage-green px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-deep-blue">{t.tier}</h3>
              <p className="mt-4 font-display text-4xl font-bold text-deep-blue">
                £{t.price}
                <span className="text-base font-normal text-deep-blue/60"> GBP</span>
              </p>
              <p className="mt-1 text-sm text-deep-blue/70">{t.credits} lesson credits</p>
              <a
                href="/register"
                className={`mt-6 rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-105 ${
                  t.highlight ? "bg-sage-green text-white" : "border-2 border-deep-blue text-deep-blue"
                }`}
              >
                Choose {t.tier}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
