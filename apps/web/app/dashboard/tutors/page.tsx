"use client";

import Link from "next/link";
import { useTutors } from "../../../features/tutor/useTutors";

export default function TutorsPage() {
  const { data: tutors, isLoading, error } = useTutors();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-blue">Find a tutor</h1>
      <p className="mt-1 text-sm text-deep-blue/80">Book a lesson with any tutor below.</p>

      {isLoading && <p className="mt-6 text-sm text-deep-blue/70">Loading...</p>}
      {error && <p className="mt-6 text-sm text-red-600">Could not load tutors.</p>}
      {tutors?.length === 0 && (
        <p className="mt-6 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
          No tutors available yet.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tutors?.map((tutor) => (
          <div key={tutor._id} className="rounded-lg border border-deep-blue/10 bg-white p-5">
            <p className="font-semibold text-deep-blue">{tutor.userId?.fullName ?? "Tutor"}</p>
            <p className="mt-1 text-xs text-deep-blue/70">{tutor.timezone}</p>
            {tutor.subjectIds?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {tutor.subjectIds.map((s) => (
                  <span
                    key={s._id}
                    className="rounded-full bg-soft-blue/40 px-2 py-0.5 text-xs text-deep-blue"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`/dashboard/book?tutorId=${tutor.userId._id}`}
              className="mt-4 block rounded-md bg-sage-green px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Book a lesson
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
