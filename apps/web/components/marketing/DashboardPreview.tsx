import { FadeIn } from "./FadeIn";

const ITEMS = [
  "Upcoming lessons",
  "Remaining credits",
  "Package purchased",
  "Homework",
  "Class recordings",
  "Teacher notes",
  "Attendance",
  "Payment history & invoices",
  "Referral rewards",
];

export function DashboardPreview() {
  return (
    <section className="bg-beige py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-deep-blue">What's on your dashboard</h2>
          <p className="mt-3 text-deep-blue/80">
            Once the free trial converts to a paid package, your dashboard becomes the one place you
            check.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl bg-off-white px-5 py-4 text-sm font-medium text-deep-blue"
              >
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-sage-green" />
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
