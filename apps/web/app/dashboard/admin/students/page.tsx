"use client";

import { useState } from "react";
import { useAllStudents, useAssignTutor } from "../../../../features/admin/useStudentsAdmin";
import { useTutors } from "../../../../features/tutor/useTutors";

export default function AdminStudentsPage() {
  const { data: students, isLoading } = useAllStudents();
  const { data: tutors } = useTutors();
  const assignTutor = useAssignTutor();
  const [selection, setSelection] = useState<Record<string, string>>({});

  async function assign(studentId: string) {
    const tutorId = selection[studentId];
    if (!tutorId) return;
    await assignTutor.mutateAsync({ studentId, tutorId });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-blue">Students</h1>
      <p className="mt-1 text-sm text-deep-blue/80">Assign a tutor to each student. Students never pick their own.</p>

      {isLoading && <p className="mt-6 text-sm text-deep-blue/70">Loading...</p>}
      {students?.length === 0 && (
        <p className="mt-6 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
          No students yet.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {students?.map((s) => (
          <div
            key={s._id}
            className="flex flex-col gap-3 rounded-lg border border-deep-blue/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-deep-blue">{s.fullName}</p>
              <p className="text-sm text-deep-blue/70">
                {s.country} · {s.board} · {s.grade} · parent: {s.parentId?.fullName}
              </p>
              {s.subjectIds?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.subjectIds.map((sub) => (
                    <span key={sub._id} className="rounded-full bg-soft-blue/40 px-2 py-0.5 text-xs text-deep-blue">
                      {sub.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm">
                <span className="font-medium text-deep-blue">Current tutor: </span>
                {s.assignedTutorId ? (
                  <span className="text-sage-green">{s.assignedTutorId.fullName}</span>
                ) : (
                  <span className="text-red-600">Unassigned</span>
                )}
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={selection[s._id] ?? ""}
                onChange={(e) => setSelection((prev) => ({ ...prev, [s._id]: e.target.value }))}
                className="rounded-md border border-soft-blue px-3 py-2 text-sm"
              >
                <option value="">Select a tutor</option>
                {tutors?.map((t) => (
                  <option key={t._id} value={t.userId._id}>
                    {t.userId.fullName}
                  </option>
                ))}
              </select>
              <button
                onClick={() => assign(s._id)}
                disabled={!selection[s._id] || assignTutor.isPending}
                className="rounded-md bg-sage-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
