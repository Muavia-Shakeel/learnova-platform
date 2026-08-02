import { FadeIn } from "./FadeIn";

const OPTIONS = [
  { title: "Full-time homeschooling", body: "A complete weekly timetable across every core subject, run entirely through Learnova." },
  { title: "Subject-specific support", body: "Keep your child in school and bring in a tutor only where they're behind or ahead." },
  { title: "Personalized curriculum", body: "Built around your child's pace, not a fixed school-year syllabus." },
  { title: "Weekly learning plans", body: "A plan for the week ahead, agreed with your tutor, not decided lesson-by-lesson." },
  { title: "Assessments", body: "Periodic tests to check what's actually landed, not just what's been covered." },
  { title: "Progress tracking", body: "Attendance, homework, and test scores in one dashboard you can check anytime." },
];

export function HomeschoolingDetail() {
  return (
    <section className="bg-beige py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-deep-blue">Homeschooling, done properly</h2>
          <p className="mt-3 text-deep-blue/80">Full-time, or just the parts you need — you choose the shape.</p>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map((opt, i) => (
            <FadeIn key={opt.title} delay={i * 80}>
              <div className="h-full rounded-2xl bg-off-white p-6">
                <h3 className="font-semibold text-deep-blue">{opt.title}</h3>
                <p className="mt-2 text-sm text-deep-blue/80">{opt.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
