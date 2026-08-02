import { ConstellationMark } from "./ConstellationMark";
import { MobileNav } from "./MobileNav";

const LINKS = [
  { href: "#subjects", label: "Subjects" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-deep-blue/10 bg-off-white/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" aria-label="Learnova home">
          <ConstellationMark />
        </a>
        <nav className="hidden items-center gap-8 sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-deep-blue/80 transition-colors hover:text-deep-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden sm:block">
          <a
            href="/register"
            className="rounded-full bg-sage-green px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Book a Free Trial
          </a>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
