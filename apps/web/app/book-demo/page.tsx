"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "../../components/marketing/Nav";
import { Footer } from "../../components/marketing/Footer";
import { useSubjects } from "../../features/subjects/useSubjects";
import { useSubmitLead } from "../../features/leads/useSubmitLead";
import { ApiClientError } from "../../lib/api/client";
import { COUNTRIES } from "../../lib/data/countries";

export default function BookDemoPage() {
  const router = useRouter();
  const { data: subjects } = useSubjects();
  const submitLead = useSubmitLead();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [grade, setGrade] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await submitLead.mutateAsync({
        fullName,
        email,
        whatsapp: whatsapp || undefined,
        country: country || undefined,
        grade: grade || undefined,
        subjectId: subjectId || undefined,
        notes: notes || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not submit your request");
    }
  }

  if (success) {
    return (
      <main>
        <Nav />
        <section className="bg-beige py-24">
          <div className="mx-auto max-w-xl px-6 text-center">
            <h1 className="font-display text-3xl font-bold text-deep-blue">Demo request received</h1>
            <p className="mt-4 text-deep-blue/80">
              Our team will match you with a tutor and reach out on email or WhatsApp to schedule your
              free trial lesson.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-full bg-sage-green px-6 py-3 font-semibold text-white"
            >
              Back to home
            </button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Nav />
      <section className="bg-beige py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="rounded-full border border-deep-blue/20 bg-off-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-deep-blue/80">
            Free Trial
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-deep-blue sm:text-5xl">
            Book a free demo lesson
          </h1>
          <p className="mt-4 text-deep-blue/80">
            Tell us a bit about the learner. We&apos;ll match a tutor and set up a free trial lesson.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16">
        <div className="mx-auto max-w-2xl px-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-md border border-soft-blue px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-soft-blue px-4 py-2"
            />
            <input
              type="tel"
              placeholder="WhatsApp number (optional)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="rounded-md border border-soft-blue px-4 py-2"
            />

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-md border border-soft-blue px-4 py-2 text-deep-blue"
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Grade / year"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="rounded-md border border-soft-blue px-4 py-2"
            />

            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="rounded-md border border-soft-blue px-4 py-2 text-deep-blue"
            >
              <option value="">Which subject? (optional)</option>
              {subjects?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Anything else we should know? (optional)"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-md border border-soft-blue px-4 py-2"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitLead.isPending}
              className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
            >
              {submitLead.isPending ? "Submitting..." : "Book my free demo"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
