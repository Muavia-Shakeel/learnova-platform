"use client";

import { useState } from "react";
import { useResources, useCreateResource, type ResourceType } from "../../../../features/tutor/useResources";
import { useSubjects } from "../../../../features/subjects/useSubjects";
import { LinkOrUploadField } from "../../../../components/shared/LinkOrUploadField";
import { ApiClientError } from "../../../../lib/api/client";

const TYPES: ResourceType[] = ["worksheet", "pdf", "slides", "practice-paper", "flashcards"];

export default function TutorResourcesPage() {
  const { data: resources, isLoading } = useResources();
  const { data: subjects } = useSubjects();
  const createResource = useCreateResource();

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [type, setType] = useState<ResourceType>("worksheet");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createResource.mutateAsync({ title, subjectId, type, fileUrl });
      setTitle("");
      setSubjectId("");
      setFileUrl("");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not add resource");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-2xl font-bold text-deep-blue">Resource library</h1>
        <p className="mt-1 text-sm text-deep-blue/80">Worksheets, slides, and practice papers.</p>

        {isLoading && <p className="mt-6 text-sm text-deep-blue/70">Loading...</p>}
        {resources?.length === 0 && (
          <p className="mt-6 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
            No resources yet.
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          {resources?.map((r) => (
            <a
              key={r._id}
              href={r.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-deep-blue/10 bg-white p-4 text-sm hover:border-sage-green"
            >
              <p className="font-medium text-deep-blue">{r.title}</p>
              <p className="text-deep-blue/70">
                {r.subjectId?.name} · {r.type}
              </p>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-deep-blue">Add a resource</h2>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2"
          />
          <select
            required
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="rounded-md border border-soft-blue px-4 py-2"
          >
            <option value="">Select a subject</option>
            {subjects?.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ResourceType)}
            className="rounded-md border border-soft-blue px-4 py-2"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <LinkOrUploadField
            label="File"
            kind="document"
            required
            value={fileUrl}
            onChange={setFileUrl}
            linkPlaceholder="https://drive.google.com/..."
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={createResource.isPending}
            className="rounded-md bg-sage-green px-6 py-3 font-medium text-white disabled:opacity-60"
          >
            {createResource.isPending ? "Adding..." : "Add resource"}
          </button>
        </form>
      </div>
    </div>
  );
}
