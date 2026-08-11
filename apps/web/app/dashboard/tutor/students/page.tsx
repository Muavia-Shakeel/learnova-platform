"use client";

import { useMyStudents } from "../../../../features/tutor/useMyStudents";

export default function TutorStudentsPage() {
  const { data: students, isLoading, error } = useMyStudents();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-blue">My students</h1>
      <p className="mt-1 text-sm text-deep-blue/80">Students assigned to you by admin.</p>

      {isLoading && <p className="mt-6 text-sm text-deep-blue/70">Loading...</p>}
      {error && <p className="mt-6 text-sm text-red-600">Could not load students.</p>}
      {students?.length === 0 && (
        <p className="mt-6 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
          No students assigned yet.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {students?.map((s) => (
          <div key={s._id} className="rounded-lg border border-deep-blue/10 bg-white p-5">
            <p className="font-semibold text-deep-blue">{s.fullName}</p>
            <p className="mt-1 text-sm text-deep-blue/70">
              {s.country} · {s.board} · {s.grade}
            </p>
            {s.subjectIds?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {s.subjectIds.map((sub) => (
                  <span key={sub._id} className="rounded-full bg-soft-blue/40 px-2 py-0.5 text-xs text-deep-blue">
                    {sub.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
