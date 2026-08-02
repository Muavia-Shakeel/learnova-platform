const STATS = [
  { value: "2,500+", label: "Students" },
  { value: "300+", label: "Expert tutors" },
  { value: "30+", label: "Countries" },
  { value: "10,000+", label: "Lessons completed" },
];

export function StatsStrip() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.label}>
          <p className="font-display text-3xl font-bold text-deep-blue sm:text-4xl">{stat.value}</p>
          <p className="mt-1 text-sm text-deep-blue/80">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
