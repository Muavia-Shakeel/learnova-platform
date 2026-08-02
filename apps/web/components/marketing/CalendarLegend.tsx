import { FadeIn } from "./FadeIn";

const STATUSES = [
  { label: "Completed", color: "bg-emerald-600" },
  { label: "Upcoming / booked", color: "bg-sky-blue" },
  { label: "Rescheduled", color: "bg-amber-500" },
  { label: "Cancelled", color: "bg-red-500" },
  { label: "Ad hoc lesson", color: "bg-orange-500" },
];

export function CalendarLegend() {
  return (
    <section className="bg-off-white py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <FadeIn>
          <h2 className="font-display text-4xl font-bold text-deep-blue">Your calendar, at a glance</h2>
          <p className="mt-3 text-deep-blue/80">
            Every lesson is colour-coded, for students, tutors, and admins alike.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {STATUSES.map((status) => (
              <div key={status.label} className="flex items-center gap-2">
                <span aria-hidden className={`h-3 w-3 shrink-0 rounded-full ${status.color}`} />
                <span className="text-sm font-medium text-deep-blue">{status.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
