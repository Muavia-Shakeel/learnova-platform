import type { HomeContentInput } from "@learnova/shared-types";
import { FadeIn } from "./FadeIn";

const DEFAULT_CONTACT_CTA: HomeContentInput["contactCta"] = {
  headline: "Still deciding? Talk to a real person.",
  blurb: "Drop your WhatsApp number when you book a free trial and our team will reach out directly — no ticket queue.",
  primaryCtaText: "Book a Free Trial",
  primaryCtaHref: "/book-demo",
  secondaryCtaText: "Chat on WhatsApp",
  secondaryCtaHref: "#",
};

export function ContactCta({ content = DEFAULT_CONTACT_CTA }: { content?: HomeContentInput["contactCta"] }) {
  return (
    <section className="bg-deep-blue py-20">
      <FadeIn className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-off-white sm:text-4xl">{content.headline}</h2>
        <p className="max-w-lg text-off-white/70">{content.blurb}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={content.primaryCtaHref}
            className="rounded-full bg-sage-green px-7 py-3.5 font-semibold text-white transition-transform hover:scale-105"
          >
            {content.primaryCtaText}
          </a>
          <a
            href={content.secondaryCtaHref}
            className="rounded-full border-2 border-off-white/40 px-7 py-3.5 font-semibold text-off-white transition-colors hover:bg-off-white/10"
          >
            {content.secondaryCtaText}
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
