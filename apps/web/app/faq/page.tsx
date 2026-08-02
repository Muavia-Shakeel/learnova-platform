import type { Metadata } from "next";
import { Nav } from "../../components/marketing/Nav";
import { Faq } from "../../components/marketing/Faq";
import { ContactCta } from "../../components/marketing/ContactCta";
import { Footer } from "../../components/marketing/Footer";

export const metadata: Metadata = {
  title: "FAQ — Learnova",
  description: "Answers on credits, timezones, curricula, and tutor vetting.",
};

export default function FaqPage() {
  return (
    <main>
      <Nav />
      <section className="bg-beige py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="rounded-full border border-deep-blue/20 bg-off-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-deep-blue/80">
            FAQ
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-deep-blue sm:text-5xl">
            Still have a question?
          </h1>
          <p className="mt-4 text-deep-blue/80">
            The most common ones parents ask before booking a first lesson.
          </p>
        </div>
      </section>
      <Faq />
      <ContactCta />
      <Footer />
    </main>
  );
}
