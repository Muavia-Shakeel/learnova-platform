"use client";

import { useState } from "react";
import { useLeads, useUpdateLead, type LeadStatus } from "../../../../features/admin/useLeads";
import { useTutors } from "../../../../features/tutor/useTutors";

const STATUSES: LeadStatus[] = [
  "new",
  "demo-booked",
  "demo-attended",
  "package-purchased",
  "regular",
  "inactive",
  "follow-up",
];

export default function AdminLeadsPage() {
  const { data: leads, isLoading } = useLeads();
  const { data: tutors } = useTutors();
  const updateLead = useUpdateLead();
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [schedule, setSchedule] = useState<Record<string, string>>({});

  async function assignTutor(leadId: string) {
    const assignedStaffId = selection[leadId];
    if (!assignedStaffId) return;
    await updateLead.mutateAsync({ leadId, assignedStaffId, status: "demo-booked" });
  }

  async function scheduleDemo(leadId: string, currentTutorId?: string) {
    const localDateTime = schedule[leadId];
    const assignedStaffId = selection[leadId] || currentTutorId;
    if (!localDateTime || !assignedStaffId) return;
    await updateLead.mutateAsync({
      leadId,
      assignedStaffId,
      status: "demo-booked",
      scheduledAt: new Date(localDateTime).toISOString(),
    });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-blue">Leads & demos</h1>
      <p className="mt-1 text-sm text-deep-blue/80">
        Enquiries from the site. Assign a tutor to run the demo, and track status as they convert.
      </p>

      {isLoading && <p className="mt-6 text-sm text-deep-blue/70">Loading...</p>}
      {leads?.length === 0 && (
        <p className="mt-6 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
          No leads yet.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {leads?.map((lead) => (
          <div
            key={lead._id}
            className="flex flex-col gap-3 rounded-lg border border-deep-blue/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-deep-blue">{lead.fullName}</p>
              <p className="text-sm text-deep-blue/70">
                {lead.email}
                {lead.whatsapp ? ` · ${lead.whatsapp}` : ""}
              </p>
              <p className="text-sm text-deep-blue/70">
                {[lead.country, lead.grade, lead.subjectId?.name].filter(Boolean).join(" · ") || "No details given"}
              </p>
              {lead.notes && <p className="mt-1 text-sm italic text-deep-blue/70">&ldquo;{lead.notes}&rdquo;</p>}
              <p className="mt-1 text-sm">
                <span className="font-medium text-deep-blue">Tutor: </span>
                {lead.assignedStaffId ? (
                  <span className="text-sage-green">{lead.assignedStaffId.fullName}</span>
                ) : (
                  <span className="text-red-600">Unassigned</span>
                )}
              </p>
              {lead.scheduledAt && (
                <p className="mt-1 text-sm">
                  <span className="font-medium text-deep-blue">Demo scheduled: </span>
                  <span className="text-sage-green">{new Date(lead.scheduledAt).toLocaleString()}</span>
                  {lead.meetingUrl && (
                    <>
                      {" · "}
                      <a href={lead.meetingUrl} target="_blank" rel="noreferrer" className="font-semibold underline">
                        Join link
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={lead.status}
                onChange={(e) => updateLead.mutate({ leadId: lead._id, status: e.target.value as LeadStatus })}
                className="rounded-md border border-soft-blue px-3 py-2 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={selection[lead._id] ?? ""}
                onChange={(e) => setSelection((prev) => ({ ...prev, [lead._id]: e.target.value }))}
                className="rounded-md border border-soft-blue px-3 py-2 text-sm"
              >
                <option value="">Assign tutor</option>
                {tutors?.map((t) => (
                  <option key={t._id} value={t.userId._id}>
                    {t.userId.fullName}
                  </option>
                ))}
              </select>
              <button
                onClick={() => assignTutor(lead._id)}
                disabled={!selection[lead._id] || updateLead.isPending}
                className="rounded-md border-2 border-deep-blue px-4 py-2 text-sm font-semibold text-deep-blue disabled:opacity-60"
              >
                Assign
              </button>
              <input
                type="datetime-local"
                value={schedule[lead._id] ?? ""}
                onChange={(e) => setSchedule((prev) => ({ ...prev, [lead._id]: e.target.value }))}
                className="rounded-md border border-soft-blue px-3 py-2 text-sm"
              />
              <button
                onClick={() => scheduleDemo(lead._id, lead.assignedStaffId?._id)}
                disabled={!schedule[lead._id] || (!selection[lead._id] && !lead.assignedStaffId) || updateLead.isPending}
                className="rounded-md bg-sage-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Schedule demo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
