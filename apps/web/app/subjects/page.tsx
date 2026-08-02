import type { Metadata } from "next";
import { Nav } from "../../components/marketing/Nav";
import { Subjects } from "../../components/marketing/Subjects";
import { ContactCta } from "../../components/marketing/ContactCta";
import { Footer } from "../../components/marketing/Footer";

export const metadata: Metadata = {
  title: "Subjects — Learnova",
  description: "School subjects, exam preparation, and homeschooling support across every major curriculum.",
};

export default function SubjectsPage() {
  return (
    <main>
      <Nav />
      <section className="bg-beige py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="rounded-full border border-deep-blue/20 bg-off-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-deep-blue/80">
            Subjects
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-deep-blue sm:text-5xl">
            One tutor roster, every curriculum
          </h1>
          <p className="mt-4 text-deep-blue/80">
            Cambridge, IB, GCSE, Edexcel, or a US high school transcript — the subject list below is
            taught by tutors already trained on your specific board.
          </p>
        </div>
      </section>
      <Subjects />
      <ContactCta />
      <Footer />
    </main>
  );
}
