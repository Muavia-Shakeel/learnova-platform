export default function HomePage() {
  return (
    <main>
      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="font-display text-5xl font-bold text-deep-blue">
          Learn Beyond Limits
        </h1>
        <p className="max-w-xl text-lg">
          Expert tutors. Flexible learning. Global access. All in one place.
        </p>
        <div className="flex gap-4">
          <a
            href="/demo"
            className="rounded-md bg-sage-green px-6 py-3 font-medium text-white"
          >
            Book a Free Trial
          </a>
          <a
            href="/tutors"
            className="rounded-md border border-deep-blue px-6 py-3 font-medium text-deep-blue"
          >
            Find a Tutor
          </a>
        </div>
      </section>
    </main>
  );
}
