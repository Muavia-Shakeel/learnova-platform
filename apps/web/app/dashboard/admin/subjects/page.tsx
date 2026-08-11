"use client";

import { useState } from "react";
import { useSubjects, useCreateSubject, type CreateSubjectInput } from "../../../../features/subjects/useSubjects";
import { ApiClientError } from "../../../../lib/api/client";

const CATEGORIES: CreateSubjectInput["category"][] = ["school", "exam-prep", "homeschooling"];

export default function AdminSubjectsPage() {
  const { data: subjects, isLoading } = useSubjects();
  const createSubject = useCreateSubject();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<CreateSubjectInput["category"]>("school");
  const [board, setBoard] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createSubject.mutateAsync({ name, category, board: board || undefined });
      setName("");
      setBoard("");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not add subject");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div>
        <h1 className="font-display text-2xl font-bold text-deep-blue">Subjects</h1>
        <p className="mt-1 text-sm text-deep-blue/80">Every subject tutors and students can be matched on.</p>

        {isLoading && <p className="mt-6 text-sm text-deep-blue/70">Loading...</p>}
        <div className="mt-4 flex flex-col gap-2">
          {subjects?.map((s) => (
            <div key={s._id} className="rounded-lg border border-deep-blue/10 bg-white p-3 text-sm">
              <p className="font-medium text-deep-blue">{s.name}</p>
              <p className="text-deep-blue/70">
                {s.category}
                {s.board ? ` · ${s.board}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-deep-blue">Add a subject</h2>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Subject name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CreateSubjectInput["category"])}
            className="rounded-md border border-soft-blue px-4 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Board (optional, e.g. Cambridge, IB)"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={createSubject.isPending}
            className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
          >
            {createSubject.isPending ? "Adding..." : "Add subject"}
          </button>
        </form>
      </div>
    </div>
  );
}
