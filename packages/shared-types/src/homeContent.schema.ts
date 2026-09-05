import { z } from "zod";

export const HeroContentSchema = z.object({
  eyebrow: z.string().max(120),
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(200),
  primaryCtaText: z.string().max(40),
  primaryCtaHref: z.string().max(200),
  secondaryCtaText: z.string().max(40),
  secondaryCtaHref: z.string().max(200),
});

export const ExploreLinkSchema = z.object({
  href: z.string().max(200),
  title: z.string().max(60),
  blurb: z.string().max(160),
});

export const ContactCtaContentSchema = z.object({
  headline: z.string().max(120),
  blurb: z.string().max(240),
  primaryCtaText: z.string().max(40),
  primaryCtaHref: z.string().max(200),
  secondaryCtaText: z.string().max(40),
  secondaryCtaHref: z.string().max(200),
});

export const HomeContentSchema = z.object({
  hero: HeroContentSchema,
  exploreLinks: z.array(ExploreLinkSchema).min(1).max(6),
  contactCta: ContactCtaContentSchema,
});
export type HomeContentInput = z.infer<typeof HomeContentSchema>;
