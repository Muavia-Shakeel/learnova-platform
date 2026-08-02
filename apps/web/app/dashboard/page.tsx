"use client";

import Link from "next/link";
import { useWallet } from "../../features/student/useWallet";
import { useStudents } from "../../features/student/useStudents";
import { useLessons, type Lesson } from "../../features/student/useLessons";

function formatLessonTime(startUtc: string) {
  return new Date(startUtc).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StudentLessons({ studentId, studentName }: { studentId: string; studentName: string }) {
  const { data: lessons, isLoading } = useLessons(studentId);
  const upcoming = lessons?.filter((l: Lesson) => l.status === "booked" || l.status === "rescheduled");

  return (
    <div>
      <h3 className="text-sm font-semibold text-deep-blue">{studentName}</h3>
      {isLoading && <p className="mt-1 text-sm text-deep-blue/70">Loading...</p>}
      {upcoming?.length === 0 && <p className="mt-1 text-sm text-deep-blue/70">No upcoming lessons.</p>}
      <div className="mt-2 flex flex-col gap-2">
        {upcoming?.map((lesson) => (
          <div key={lesson._id} className="rounded-lg border border-deep-blue/10 bg-white p-3 text-sm">
            <p className="font-medium text-deep-blue">{lesson.subjectId?.name ?? "Lesson"}</p>
            <p className="text-deep-blue/70">
              with {lesson.tutorId?.fullName} · {formatLessonTime(lesson.startUtc)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: wallet, isLoading, error } = useWallet();
  const { data: students } = useStudents();

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-soft-blue bg-white p-6">
          <h2 className="text-sm text-deep-blue/70">Remaining credits</h2>
          {isLoading && <p className="mt-2 text-3xl font-bold">...</p>}
          {error && <p className="mt-2 text-sm text-red-600">Could not load wallet</p>}
          {wallet && <p className="mt-2 text-3xl font-bold text-deep-blue">{wallet.remaining}</p>}
        </div>
        <div className="rounded-lg border border-soft-blue bg-white p-6">
          <h2 className="text-sm text-deep-blue/70">Purchased</h2>
          {wallet && <p className="mt-2 text-3xl font-bold text-deep-blue">{wallet.purchased}</p>}
        </div>
        <div className="rounded-lg border border-soft-blue bg-white p-6">
          <h2 className="text-sm text-deep-blue/70">Used</h2>
          {wallet && <p className="mt-2 text-3xl font-bold text-deep-blue">{wallet.used}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/students" className="rounded-md border-2 border-deep-blue px-5 py-2.5 text-sm font-semibold text-deep-blue">
          Add a student
        </Link>
        <Link href="/dashboard/tutors" className="rounded-md border-2 border-deep-blue px-5 py-2.5 text-sm font-semibold text-deep-blue">
          Find a tutor
        </Link>
        <Link href="/dashboard/billing" className="rounded-md bg-sage-green px-5 py-2.5 text-sm font-semibold text-white">
          Buy credits
        </Link>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-deep-blue">Upcoming lessons</h2>
        {!students || students.length === 0 ? (
          <p className="mt-2 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
            Add a student to start booking lessons.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {students.map((s) => (
              <StudentLessons key={s._id} studentId={s._id} studentName={s.fullName} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
