import { FadeIn } from "./FadeIn";

const GROUPS = [
  {
    title: "School subjects",
    blurb: "Core curriculum, taught to your board.",
    items: [
      "Mathematics",
      "English",
      "Biology",
      "Chemistry",
      "Physics",
      "Computer Science",
      "Economics",
      "Accounting",
      "Business",
      "Psychology",
      "History",
      "Geography",
    ],
  },
  {
    title: "Exam preparation",
    blurb: "IELTS to A Levels — tutors who know the mark scheme.",
    items: [
      "IELTS",
      "TOEFL",
      "SAT",
      "ACT",
      "AP",
      "GCSE",
      "IGCSE",
      "A Levels",
      "IB",
      "NCEA",
      "Australian Curriculum",
      "Cambridge",
      "Edexcel",
    ],
  },
  {
    title: "Homeschooling",
    blurb: "A full plan, or just the subjects you need help with.",
    items: [
      "Full-time homeschooling",
      "Subject-specific support",
      "Personalized curriculum",
      "Weekly learning plans",
      "Assessments",
      "Progress tracking",
    ],
  },
];

export function Subjects() {
  return (
    <section id="subjects" className="bg-off-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-deep-blue">What we teach</h2>
          <p className="mt-3 text-deep-blue/70">
            Every subject is matched to your child&apos;s country, board, and grade — not a generic syllabus.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {GROUPS.map((group, i) => (
            <FadeIn key={group.title} delay={i * 120}>
              <div className="flex h-full flex-col rounded-2xl border border-deep-blue/10 bg-beige/40 p-7">
                <h3 className="font-display text-xl font-bold text-deep-blue">{group.title}</h3>
                <p className="mt-1 text-sm text-deep-blue/70">{group.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-deep-blue/15 bg-off-white px-3 py-1 text-xs font-medium text-deep-blue/80"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
