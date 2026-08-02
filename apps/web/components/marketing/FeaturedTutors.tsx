import { FadeIn } from "./FadeIn";

// Placeholder roster — swap for real tutor profiles once onboarding is live.
const TUTORS = [
  {
    name: "Amara Okafor",
    subject: "Mathematics · A Levels",
    credential: "MSc Mathematics, Imperial College London",
  },
  {
    name: "Daniyal Raza",
    subject: "Physics · IB",
    credential: "BSc Physics, LUMS — 8 years teaching IB",
  },
  {
    name: "Priya Nair",
    subject: "English · IELTS",
    credential: "MA TESOL — former Cambridge examiner",
  },
  {
    name: "Marcus Webb",
    subject: "Computer Science · GCSE",
    credential: "BEng Computing, Imperial College London",
  },
];

export function FeaturedTutors() {
  return (
    <section id="tutors" className="bg-off-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-deep-blue">Featured tutors</h2>
          <p className="mt-3 text-deep-blue/70">Every tutor is degree-verified before their first lesson.</p>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TUTORS.map((tutor, i) => (
            <FadeIn key={tutor.name} delay={i * 100}>
              <div className="group relative h-full rounded-2xl border border-deep-blue/10 bg-beige/40 p-6">
                <span className="absolute -top-3 right-4 -rotate-6 rounded-full border border-dashed border-sage-green bg-off-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sage-green">
                  ✓ Verified
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-blue/40 font-display text-lg font-bold text-deep-blue">
                  {tutor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-4 font-semibold text-deep-blue">{tutor.name}</h3>
                <p className="text-sm text-sage-green">{tutor.subject}</p>
                <p className="mt-2 text-xs text-deep-blue/70">{tutor.credential}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
