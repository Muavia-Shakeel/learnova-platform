import { FadeIn } from "./FadeIn";

const STEPS = [
  {
    step: "01",
    title: "Book a free trial",
    body: "Tell us the subject, board, and grade. Pick a time that works in your timezone.",
  },
  {
    step: "02",
    title: "Meet your tutor",
    body: "We match you to a vetted subject-expert who already teaches your exact curriculum.",
  },
  {
    step: "03",
    title: "Track real progress",
    body: "Homework, attendance, and grades land in one dashboard — for you and your child.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-beige py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-deep-blue">How it works</h2>
          <p className="mt-3 text-deep-blue/80">Three steps from &quot;curious&quot; to &quot;enrolled.&quot;</p>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((item, i) => (
            <FadeIn key={item.step} delay={i * 120}>
              <div className="h-full rounded-2xl bg-off-white p-7">
                <span className="font-display text-4xl font-bold text-sage-green">{item.step}</span>
                <h3 className="mt-4 text-lg font-semibold text-deep-blue">{item.title}</h3>
                <p className="mt-2 text-sm text-deep-blue/80">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
