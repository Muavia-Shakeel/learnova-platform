"use client";

import { useEffect, useState } from "react";
import type { HomeContentInput } from "@learnova/shared-types";
import { useHomeContent, useUpdateHomeContent } from "../../../../features/homeContent/useHomeContent";
import { ApiClientError } from "../../../../lib/api/client";

export default function AdminHomeContentPage() {
  const { data, isLoading } = useHomeContent();
  const updateHomeContent = useUpdateHomeContent();

  const [form, setForm] = useState<HomeContentInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(null);
    setSaved(false);
    try {
      await updateHomeContent.mutateAsync(form);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not save home page content");
    }
  }

  if (isLoading || !form) return <p className="text-sm text-deep-blue/70">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-blue">Home Page Content</h1>
      <p className="mt-1 text-sm text-deep-blue/80">Edit the text shown on the public marketing home page.</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-10">
        <section>
          <h2 className="font-display text-lg font-bold text-deep-blue">Hero</h2>
          <div className="mt-3 flex flex-col gap-3">
            <input
              value={form.hero.eyebrow}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, eyebrow: e.target.value } })}
              placeholder="Eyebrow tag"
              className="rounded-md border border-soft-blue px-4 py-2"
            />
            <input
              value={form.hero.headline}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, headline: e.target.value } })}
              placeholder="Headline"
              required
              className="rounded-md border border-soft-blue px-4 py-2"
            />
            <textarea
              value={form.hero.subheadline}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, subheadline: e.target.value } })}
              placeholder="Subheadline"
              className="rounded-md border border-soft-blue px-4 py-2"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.hero.primaryCtaText}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, primaryCtaText: e.target.value } })}
                placeholder="Primary CTA text"
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                value={form.hero.primaryCtaHref}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, primaryCtaHref: e.target.value } })}
                placeholder="Primary CTA link"
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                value={form.hero.secondaryCtaText}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, secondaryCtaText: e.target.value } })}
                placeholder="Secondary CTA text"
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                value={form.hero.secondaryCtaHref}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, secondaryCtaHref: e.target.value } })}
                placeholder="Secondary CTA link"
                className="rounded-md border border-soft-blue px-4 py-2"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-deep-blue">Explore links</h2>
          <div className="mt-3 flex flex-col gap-4">
            {form.exploreLinks.map((link, i) => (
              <div key={i} className="grid gap-2 rounded-lg border border-deep-blue/10 p-3 sm:grid-cols-3">
                <input
                  value={link.title}
                  onChange={(e) => {
                    const next = [...form.exploreLinks];
                    next[i] = { ...next[i], title: e.target.value };
                    setForm({ ...form, exploreLinks: next });
                  }}
                  placeholder="Title"
                  className="rounded-md border border-soft-blue px-3 py-2 text-sm"
                />
                <input
                  value={link.href}
                  onChange={(e) => {
                    const next = [...form.exploreLinks];
                    next[i] = { ...next[i], href: e.target.value };
                    setForm({ ...form, exploreLinks: next });
                  }}
                  placeholder="Link"
                  className="rounded-md border border-soft-blue px-3 py-2 text-sm"
                />
                <input
                  value={link.blurb}
                  onChange={(e) => {
                    const next = [...form.exploreLinks];
                    next[i] = { ...next[i], blurb: e.target.value };
                    setForm({ ...form, exploreLinks: next });
                  }}
                  placeholder="Blurb"
                  className="rounded-md border border-soft-blue px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-deep-blue">Contact CTA</h2>
          <div className="mt-3 flex flex-col gap-3">
            <input
              value={form.contactCta.headline}
              onChange={(e) => setForm({ ...form, contactCta: { ...form.contactCta, headline: e.target.value } })}
              placeholder="Headline"
              className="rounded-md border border-soft-blue px-4 py-2"
            />
            <textarea
              value={form.contactCta.blurb}
              onChange={(e) => setForm({ ...form, contactCta: { ...form.contactCta, blurb: e.target.value } })}
              placeholder="Blurb"
              className="rounded-md border border-soft-blue px-4 py-2"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.contactCta.primaryCtaText}
                onChange={(e) => setForm({ ...form, contactCta: { ...form.contactCta, primaryCtaText: e.target.value } })}
                placeholder="Primary CTA text"
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                value={form.contactCta.primaryCtaHref}
                onChange={(e) => setForm({ ...form, contactCta: { ...form.contactCta, primaryCtaHref: e.target.value } })}
                placeholder="Primary CTA link"
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                value={form.contactCta.secondaryCtaText}
                onChange={(e) => setForm({ ...form, contactCta: { ...form.contactCta, secondaryCtaText: e.target.value } })}
                placeholder="Secondary CTA text"
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                value={form.contactCta.secondaryCtaHref}
                onChange={(e) => setForm({ ...form, contactCta: { ...form.contactCta, secondaryCtaHref: e.target.value } })}
                placeholder="Secondary CTA link"
                className="rounded-md border border-soft-blue px-4 py-2"
              />
            </div>
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-sage-green">Saved.</p>}
        <button
          type="submit"
          disabled={updateHomeContent.isPending}
          className="w-fit rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {updateHomeContent.isPending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
