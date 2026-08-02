const ROTATIONS = ["-rotate-6", "rotate-3", "-rotate-3", "rotate-6", "-rotate-2", "rotate-2"];

export function CurriculumStamp({ label, index = 0 }: { label: string; index?: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      className={`${rotation} flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border-2 border-dashed border-deep-blue/40 bg-beige text-deep-blue transition-transform duration-300 hover:rotate-0 sm:h-24 sm:w-24`}
    >
      <span aria-hidden className="text-xs tracking-[0.2em]">
        ★
      </span>
      <span className="px-1 text-center text-[11px] font-semibold uppercase leading-tight tracking-wider sm:text-xs">
        {label}
      </span>
    </div>
  );
}
