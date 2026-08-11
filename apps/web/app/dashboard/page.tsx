"use client";

import Link from "next/link";
import { useAuth } from "../../lib/auth/useMe";
import { useWallet } from "../../features/student/useWallet";
import { useStudents } from "../../features/student/useStudents";
import { useLessons, type Lesson } from "../../features/student/useLessons";
import { useMyStudents } from "../../features/tutor/useMyStudents";
import { useMyCalendar } from "../../features/tutor/useMyCalendar";

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

function ParentDashboard() {
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
        <Link href="/dashboard/book" className="rounded-md border-2 border-deep-blue px-5 py-2.5 text-sm font-semibold text-deep-blue">
          Book a lesson
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

function StudentDashboard() {
  const { data: wallet, isLoading, error } = useWallet();
  const { data: students } = useStudents();
  const profile = students?.[0];

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
          {profile ? "Edit my profile" : "Set up my profile"}
        </Link>
        <Link href="/dashboard/book" className="rounded-md border-2 border-deep-blue px-5 py-2.5 text-sm font-semibold text-deep-blue">
          Book a lesson
        </Link>
        <Link href="/dashboard/billing" className="rounded-md bg-sage-green px-5 py-2.5 text-sm font-semibold text-white">
          Buy credits
        </Link>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-deep-blue">Upcoming lessons</h2>
        {!profile ? (
          <p className="mt-2 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
            Set up your profile to start booking lessons.
          </p>
        ) : (
          <div className="mt-4">
            <StudentLessons studentId={profile._id} studentName={profile.fullName} />
          </div>
        )}
      </div>
    </div>
  );
}

function TutorDashboard() {
  const { data: students } = useMyStudents();
  const { data: lessons } = useMyCalendar();
  const upcoming = lessons?.filter((l) => l.status === "booked" || l.status === "rescheduled" || l.status === "ad-hoc");

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-soft-blue bg-white p-6">
          <h2 className="text-sm text-deep-blue/70">My students</h2>
          <p className="mt-2 text-3xl font-bold text-deep-blue">{students?.length ?? "..."}</p>
        </div>
        <div className="rounded-lg border border-soft-blue bg-white p-6">
          <h2 className="text-sm text-deep-blue/70">Upcoming lessons</h2>
          <p className="mt-2 text-3xl font-bold text-deep-blue">{upcoming?.length ?? "..."}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/tutor/students" className="rounded-md border-2 border-deep-blue px-5 py-2.5 text-sm font-semibold text-deep-blue">
          My students
        </Link>
        <Link href="/dashboard/tutor/calendar" className="rounded-md border-2 border-deep-blue px-5 py-2.5 text-sm font-semibold text-deep-blue">
          Calendar & availability
        </Link>
        <Link href="/dashboard/tutor/resources" className="rounded-md bg-sage-green px-5 py-2.5 text-sm font-semibold text-white">
          Resource library
        </Link>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-deep-blue">Next up</h2>
        {upcoming?.length === 0 && (
          <p className="mt-2 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
            No upcoming lessons.
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          {upcoming?.slice(0, 5).map((lesson) => (
            <div key={lesson._id} className="rounded-lg border border-deep-blue/10 bg-white p-3 text-sm">
              <p className="font-medium text-deep-blue">{lesson.subjectId?.name}</p>
              <p className="text-deep-blue/70">
                {lesson.studentId?.fullName} · {formatLessonTime(lesson.startUtc)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/dashboard/admin/students" className="rounded-md border-2 border-deep-blue px-5 py-2.5 text-sm font-semibold text-deep-blue">
        Assign tutors
      </Link>
      <Link href="/dashboard/admin" className="rounded-md border-2 border-deep-blue px-5 py-2.5 text-sm font-semibold text-deep-blue">
        Pending payments
      </Link>
      <Link href="/dashboard/admin/careers" className="rounded-md bg-sage-green px-5 py-2.5 text-sm font-semibold text-white">
        Tutor applications
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;
  if (user.role === "tutor") return <TutorDashboard />;
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "student") return <StudentDashboard />;
  return <ParentDashboard />;
}
