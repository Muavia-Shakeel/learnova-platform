"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "../../components/marketing/Nav";
import { Footer } from "../../components/marketing/Footer";
import { LinkOrUploadField } from "../../components/shared/LinkOrUploadField";
import { useSubjects } from "../../features/subjects/useSubjects";
import { useSubmitApplication } from "../../features/careers/useCareers";
import { ApiClientError } from "../../lib/api/client";
import { uploadToCloudinary, validatePhotoFile, UploadValidationError } from "../../lib/upload/uploadToCloudinary";
import { COUNTRIES } from "../../lib/data/countries";

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
  const [countryCode, setCountryCode] = useState("+92");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

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

  async function onPhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    try {
      validatePhotoFile(file);
    } catch (err) {
      setPhotoError(err instanceof UploadValidationError ? err.message : "Invalid file");
      e.target.value = "";
      return;
    }

    setPhotoUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProfilePhotoUrl(url);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setPhotoUploading(false);
    }
  }

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
        phone: `${countryCode} ${phoneNumber}`.trim(),
        country,
        profilePhotoUrl: profilePhotoUrl || undefined,
        highestQualification,
        institution,
        subjectIds,
        yearsOfExperience: Number(yearsOfExperience),
        bio,
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
              We&apos;ll review your CV, degree, and demo video. If you&apos;re approved, we&apos;ll
              email you a temporary password to log in with.
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

              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-28 rounded-md border border-soft-blue px-2 py-2"
                  aria-label="Country code"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.name} value={c.dialCode}>
                      {c.dialCode}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="Phone number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 rounded-md border border-soft-blue px-4 py-2"
                />
              </div>

              <select
                required
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

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-deep-blue">Profile photo (optional)</label>
                <p className="text-xs text-deep-blue/70">
                  Front-facing headshot, plain/neutral background, face clearly visible. JPG, PNG, or
                  WEBP, under 2MB.
                </p>

                <div className="flex items-center gap-4">
                  {profilePhotoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profilePhotoUrl}
                      alt="Profile preview"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onPhotoSelected}
                    disabled={photoUploading}
                    className="text-sm text-deep-blue"
                  />
                  {photoUploading && <span className="text-xs text-deep-blue/70">Uploading...</span>}
                </div>
                {photoError && <p className="text-xs text-red-600">{photoError}</p>}
              </div>

              <button
                type="submit"
                disabled={photoUploading}
                className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
              >
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
                required
                minLength={50}
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-md border border-soft-blue px-4 py-2"
              />

              <LinkOrUploadField
                label="CV"
                kind="document"
                required
                value={cvUrl}
                onChange={setCvUrl}
                linkPlaceholder="https://drive.google.com/..."
              />

              <LinkOrUploadField
                label="Degree certificate"
                kind="document"
                required
                value={degreeCertificateUrl}
                onChange={setDegreeCertificateUrl}
                linkPlaceholder="https://drive.google.com/..."
              />

              <LinkOrUploadField
                label="Demo lesson video (optional)"
                kind="video"
                value={demoVideoUrl}
                onChange={setDemoVideoUrl}
                linkPlaceholder="https://youtube.com/..."
              />

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
                  disabled={!declarationAccepted || submitApplication.isPending}
                  className="flex-1 rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed"
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
