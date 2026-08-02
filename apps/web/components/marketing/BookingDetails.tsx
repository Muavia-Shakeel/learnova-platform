import { FadeIn } from "./FadeIn";

const ITEMS = [
  {
    title: "Choose your duration",
    body: "Book by the hour, with flexible lengths — 1, 1.5, 2, even 2.5 hours — to fit your child's schedule.",
  },
  {
    title: "Pick from real availability",
    body: "You only ever see the times your tutor has actually published. No back-and-forth emails to find a slot.",
  },
  {
    title: "Scheduled in your timezone",
    body: "Lesson times convert automatically to your child's timezone — or UK time by default if none is set.",
  },
  {
    title: "Reschedule or cancel",
    body: "Move a lesson within the cancellation policy and your credit comes straight back to your wallet.",
  },
  {
    title: "Join with one click",
    body: "The Zoom link sits on the lesson itself — no hunting through email for it five minutes before class.",
  },
  {
    title: "Reminders, automatically",
    body: "Email reminders go out ahead of every lesson, so a missed class is a rare thing, not a regular one.",
  },
];

export function BookingDetails() {
  return (
    <section className="bg-off-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-deep-blue">Booking, in the details</h2>
          <p className="mt-3 text-deep-blue/80">The part most tutoring sites skip explaining.</p>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-deep-blue/10 bg-beige/40 p-6">
                <h3 className="font-semibold text-deep-blue">{item.title}</h3>
                <p className="mt-2 text-sm text-deep-blue/80">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
