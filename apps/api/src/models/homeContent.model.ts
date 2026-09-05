import { Schema, model } from "mongoose";

const homeContentSchema = new Schema(
  {
    hero: {
      eyebrow: { type: String, default: "A learning passport, stamped in 30+ countries" },
      headline: { type: String, default: "Learn Beyond Limits" },
      subheadline: { type: String, default: "Expert tutors. Flexible learning. Global access. All in one place." },
      primaryCtaText: { type: String, default: "Book a Free Trial" },
      primaryCtaHref: { type: String, default: "/book-demo" },
      secondaryCtaText: { type: String, default: "Find a Tutor" },
      secondaryCtaHref: { type: String, default: "/subjects" },
    },
    exploreLinks: {
      type: [
        {
          href: String,
          title: String,
          blurb: String,
        },
      ],
      default: [
        { href: "/subjects", title: "Subjects", blurb: "School, exam prep, and homeschooling — every board covered." },
        { href: "/how-it-works", title: "How it works", blurb: "Book a trial, meet your tutor, track progress." },
        { href: "/pricing", title: "Pricing", blurb: "Credit packages that never expire." },
        { href: "/faq", title: "FAQ", blurb: "Credits, timezones, and vetting — answered." },
      ],
    },
    contactCta: {
      headline: { type: String, default: "Still deciding? Talk to a real person." },
      blurb: {
        type: String,
        default: "Drop your WhatsApp number when you book a free trial and our team will reach out directly — no ticket queue.",
      },
      primaryCtaText: { type: String, default: "Book a Free Trial" },
      primaryCtaHref: { type: String, default: "/book-demo" },
      secondaryCtaText: { type: String, default: "Chat on WhatsApp" },
      secondaryCtaHref: { type: String, default: "#" },
    },
  },
  { timestamps: true },
);

export const HomeContent = model("HomeContent", homeContentSchema);
