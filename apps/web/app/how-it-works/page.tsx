import type { Metadata } from "next";
import { Nav } from "../../components/marketing/Nav";
import { HowItWorks } from "../../components/marketing/HowItWorks";
import { BookingDetails } from "../../components/marketing/BookingDetails";
import { DashboardPreview } from "../../components/marketing/DashboardPreview";
import { CalendarLegend } from "../../components/marketing/CalendarLegend";
import { ContactCta } from "../../components/marketing/ContactCta";
import { Footer } from "../../components/marketing/Footer";

export const metadata: Metadata = {
  title: "How it works — Learnova",
  description: "From free trial to tracked progress — how a Learnova lesson actually gets booked and taught.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Nav />
      <section className="bg-beige py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="rounded-full border border-deep-blue/20 bg-off-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-deep-blue/80">
            How it works
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-deep-blue sm:text-5xl">
            No sales call. No long onboarding.
          </h1>
          <p className="mt-4 text-deep-blue/80">
            Most parents go from &quot;just looking&quot; to a booked first lesson in under 10 minutes.
            Here&apos;s exactly what happens at each step.
          </p>
        </div>
      </section>
      <HowItWorks />
      <BookingDetails />
      <DashboardPreview />
      <CalendarLegend />
      <ContactCta />
      <Footer />
    </main>
  );
}
