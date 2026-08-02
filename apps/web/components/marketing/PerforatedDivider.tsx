export function PerforatedDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-3 w-full bg-[radial-gradient(circle,rgba(31,58,95,0.25)_1.5px,transparent_1.5px)] bg-[length:16px_16px] bg-repeat-x ${className}`}
    />
  );
}
