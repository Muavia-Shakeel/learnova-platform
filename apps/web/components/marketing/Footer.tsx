import { ConstellationMark } from "./ConstellationMark";

export function Footer() {
  return (
    <footer className="bg-off-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <ConstellationMark />
        <p className="text-sm text-deep-blue/60">
          © {new Date().getFullYear()} Learnova. Learn beyond limits.
        </p>
      </div>
    </footer>
  );
}
