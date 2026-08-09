"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "../../components/marketing/Nav";
import { Footer } from "../../components/marketing/Footer";
import { useSubjects } from "../../features/subjects/useSubjects";
import { useSubmitApplication } from "../../features/careers/useCareers";
import { ApiClientError } from "../../lib/api/client";

export default function CareersPage() {
  const router = useRouter();
  const { data: subjects } = useSubjects();
  const submitApplication = useSubmitApplication();

  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Page 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  // Page 2
  const [highestQualification, setHighestQualification] = useState("");
  const [institution, setInstitution] = useState("");
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [bio, setBio] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [degreeCertificateUrl, setDegreeCertificateUrl] = useState("");
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  function toggleSubject(id: string) {
    setSubjectIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function onNext(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!declarationAccepted) {
      setError("Please confirm the declaration before submitting.");
      return;
    }

    try {
      await submitApplication.mutateAsync({
        fullName,
        email,
        password,
        phone,
        country,
        profilePhotoUrl: profilePhotoUrl || undefined,
        highestQualification,
        institution,
        subjectIds,
        yearsOfExperience: Number(yearsOfExperience),
        bio: bio || undefined,
        cvUrl,
        degreeCertificateUrl,
        demoVideoUrl: demoVideoUrl || undefined,
        declarationAccepted: true,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not submit application");
    }
  }

  if (success) {
    return (
      <main>
        <Nav />
        <section className="bg-beige py-24">
          <div className="mx-auto max-w-xl px-6 text-center">
            <h1 className="font-display text-3xl font-bold text-deep-blue">Application received</h1>
            <p className="mt-4 text-deep-blue/80">
              We&apos;ll review your CV, degree, and demo video. You&apos;ll be able to log in with the
              email and password you just set once we approve your application.
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
            Careers
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-deep-blue sm:text-5xl">
            Teach on Learnova
          </h1>
          <p className="mt-4 text-deep-blue/80">
            Submit your CV, degree, and a short demo lesson. Our team reviews every application before
            you can log in and start teaching.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-8 flex items-center gap-3 text-sm font-medium text-deep-blue/70">
            <span className={step === 1 ? "text-deep-blue" : ""}>1. Basic details</span>
            <span aria-hidden>→</span>
            <span className={step === 2 ? "text-deep-blue" : ""}>2. Qualifications</span>
          </div>

          {step === 1 && (
            <form onSubmit={onNext} className="flex flex-col gap-4">
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
                type="password"
                placeholder="Set a password (for once you're approved)"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                type="text"
                placeholder="Phone number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                type="text"
                placeholder="Country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
                Profile photo link (optional)
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={profilePhotoUrl}
                  onChange={(e) => setProfilePhotoUrl(e.target.value)}
                  className="rounded-md border border-soft-blue px-4 py-2 font-normal"
                />
              </label>

              <button type="submit" className="rounded-md bg-sage-green px-6 py-3 font-medium text-white">
                Next
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Highest qualification (e.g. BSc Mathematics)"
                required
                value={highestQualification}
                onChange={(e) => setHighestQualification(e.target.value)}
                className="rounded-md border border-soft-blue px-4 py-2"
              />
              <input
                type="text"
                placeholder="University / Institution"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="rounded-md border border-soft-blue px-4 py-2"
              />

              {subjects && subjects.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-deep-blue">Subjects you teach</p>
                  <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                    {subjects.map((subject) => (
                      <button
                        key={subject._id}
                        type="button"
                        onClick={() => toggleSubject(subject._id)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          subjectIds.includes(subject._id)
                            ? "border-sage-green bg-sage-green text-white"
                            : "border-deep-blue/20 text-deep-blue"
                        }`}
                      >
                        {subject.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <input
                type="number"
                placeholder="Years of experience"
                required
                min={0}
                max={60}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="rounded-md border border-soft-blue px-4 py-2"
              />

              <textarea
                placeholder="Short bio (100–200 words)"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-md border border-soft-blue px-4 py-2"
              />

              <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
                Link to your CV
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  className="rounded-md border border-soft-blue px-4 py-2 font-normal"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
                Link to your degree certificate
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={degreeCertificateUrl}
                  onChange={(e) => setDegreeCertificateUrl(e.target.value)}
                  className="rounded-md border border-soft-blue px-4 py-2 font-normal"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
                Link to a demo lesson video (optional)
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={demoVideoUrl}
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                  className="rounded-md border border-soft-blue px-4 py-2 font-normal"
                />
              </label>

              <label className="flex items-start gap-2 text-sm text-deep-blue">
                <input
                  type="checkbox"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="mt-1"
                />
                I confirm the information provided is accurate.
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-md border-2 border-deep-blue px-6 py-3 font-medium text-deep-blue"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitApplication.isPending}
                  className="flex-1 rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
                >
                  {submitApplication.isPending ? "Submitting..." : "Submit application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
