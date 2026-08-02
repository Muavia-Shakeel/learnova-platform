"use client";

import { useState } from "react";
import { useStudents, useCreateStudent } from "../../../features/student/useStudents";
import { useSubjects } from "../../../features/subjects/useSubjects";
import { ApiClientError } from "../../../lib/api/client";

export default function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const { data: subjects } = useSubjects();
  const createStudent = useCreateStudent();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [board, setBoard] = useState("");
  const [grade, setGrade] = useState("");
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function toggleSubject(id: string) {
    setSubjectIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createStudent.mutateAsync({ fullName, country, board, grade, subjectIds });
      setFullName("");
      setCountry("");
      setBoard("");
      setGrade("");
      setSubjectIds([]);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not add student");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-2xl font-bold text-deep-blue">Your students</h1>
        <p className="mt-1 text-sm text-deep-blue/80">Children linked to your account.</p>

        <div className="mt-6 flex flex-col gap-3">
          {isLoading && <p className="text-sm text-deep-blue/70">Loading...</p>}
          {students?.length === 0 && (
            <p className="rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
              No students yet — add your child on the right to start booking lessons.
            </p>
          )}
          {students?.map((s) => (
            <div key={s._id} className="rounded-lg border border-deep-blue/10 bg-white p-4">
              <p className="font-semibold text-deep-blue">{s.fullName}</p>
              <p className="text-sm text-deep-blue/70">
                {s.country} · {s.board} · {s.grade}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-deep-blue">Add a student</h2>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
          <input
            type="text"
            placeholder="Board (e.g. Cambridge, IB, GCSE)"
            required
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2"
          />
          <input
            type="text"
            placeholder="Grade / year"
            required
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2"
          />

          {subjects && subjects.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-deep-blue">Subjects</p>
              <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
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

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={createStudent.isPending}
            className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
          >
            {createStudent.isPending ? "Adding..." : "Add student"}
          </button>
        </form>
      </div>
    </div>
  );
}
