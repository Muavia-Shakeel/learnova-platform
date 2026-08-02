"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toUtc } from "@learnova/shared-tz";
import { useStudents } from "../../../features/student/useStudents";
import { useTutors } from "../../../features/tutor/useTutors";
import { useBookLesson } from "../../../features/student/useLessons";
import { ApiClientError } from "../../../lib/api/client";

export default function BookLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTutorId = searchParams.get("tutorId") ?? "";

  const { data: students } = useStudents();
  const { data: tutors } = useTutors();
  const bookLesson = useBookLesson();

  const [studentId, setStudentId] = useState("");
  const [tutorId, setTutorId] = useState(preselectedTutorId);
  const [subjectId, setSubjectId] = useState("");
  const [localDateTime, setLocalDateTime] = useState("");
  const [durationHours, setDurationHours] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedTutor = tutors?.find((t) => t.userId._id === tutorId);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const startUtc = toUtc(localDateTime, browserZone).toISO();
      if (!startUtc) throw new Error("Invalid date/time");

      await bookLesson.mutateAsync({ studentId, tutorId, subjectId, startUtc, durationHours });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not book lesson");
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-bold text-deep-blue">Book a lesson</h1>

      {(!students || students.length === 0) && (
        <p className="mt-4 rounded-lg border border-dashed border-deep-blue/20 p-4 text-sm text-deep-blue/70">
          Add a student first before booking a lesson.{" "}
          <a href="/dashboard/students" className="font-semibold underline">
            Add one now →
          </a>
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
          Student
          <select
            required
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2 font-normal"
          >
            <option value="">Select a student</option>
            {students?.map((s) => (
              <option key={s._id} value={s._id}>
                {s.fullName}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
          Tutor
          <select
            required
            value={tutorId}
            onChange={(e) => setTutorId(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2 font-normal"
          >
            <option value="">Select a tutor</option>
            {tutors?.map((t) => (
              <option key={t._id} value={t.userId._id}>
                {t.userId.fullName}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
          Subject
          <select
            required
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2 font-normal"
          >
            <option value="">Select a subject</option>
            {selectedTutor?.subjectIds.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
          Date & time (your local time)
          <input
            type="datetime-local"
            required
            value={localDateTime}
            onChange={(e) => setLocalDateTime(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
          Duration
          <select
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
            className="rounded-md border border-soft-blue px-4 py-2 font-normal"
          >
            <option value={0.5}>30 minutes</option>
            <option value={1}>1 hour</option>
            <option value={1.5}>1.5 hours</option>
            <option value={2}>2 hours</option>
          </select>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-sage-green">Lesson booked! Redirecting...</p>}

        <button
          type="submit"
          disabled={bookLesson.isPending}
          className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {bookLesson.isPending ? "Booking..." : "Book lesson"}
        </button>
      </form>
    </div>
  );
}
