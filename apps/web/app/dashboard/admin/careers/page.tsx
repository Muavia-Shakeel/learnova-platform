"use client";

import { useState } from "react";
import { useAuth } from "../../../../lib/auth/useMe";
import {
  usePendingApplications,
  useApproveApplication,
  useRejectApplication,
} from "../../../../features/admin/useCareerApplications";

export default function AdminCareersPage() {
  const { user } = useAuth();
  const { data: applications, isLoading } = usePendingApplications();
  const approve = useApproveApplication();
  const reject = useRejectApplication();
  const [reasons, setReasons] = useState<Record<string, string>>({});

  if (user && user.role !== "admin") {
    return (
      <div className="rounded-lg border border-deep-blue/10 bg-white p-6">
        <p className="text-deep-blue">Admins only.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-blue">Tutor applications</h1>
      <p className="mt-1 text-sm text-deep-blue/80">
        Review CV, degree, and demo video before approving. Approving creates their login.
      </p>

      {isLoading && <p className="mt-6 text-sm text-deep-blue/70">Loading...</p>}
      {applications?.length === 0 && (
        <p className="mt-6 rounded-lg border border-dashed border-deep-blue/20 p-6 text-sm text-deep-blue/70">
          No pending applications.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {applications?.map((app) => (
          <div key={app._id} className="rounded-lg border border-deep-blue/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-deep-blue">{app.fullName}</p>
                <p className="text-sm text-deep-blue/70">{app.email}</p>
                {app.whatsapp && <p className="text-sm text-deep-blue/70">WhatsApp: {app.whatsapp}</p>}
              </div>
              <div className="flex flex-wrap gap-1">
                {app.subjectIds.map((s) => (
                  <span key={s._id} className="rounded-full bg-soft-blue/40 px-2 py-0.5 text-xs text-deep-blue">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-3 text-sm text-deep-blue">
              <span className="font-medium">Degrees:</span> {app.degrees.join(", ")}
            </p>
            {app.bio && <p className="mt-1 text-sm text-deep-blue/80">{app.bio}</p>}

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <a href={app.cvUrl} target="_blank" rel="noreferrer" className="font-semibold text-sage-green underline">
                View CV
              </a>
              <a
                href={app.degreeCertificateUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sage-green underline"
              >
                View degree certificate
              </a>
              {app.demoVideoUrl && (
                <a href={app.demoVideoUrl} target="_blank" rel="noreferrer" className="font-semibold text-sage-green underline">
                  Watch demo video
                </a>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => approve.mutate(app._id)}
                disabled={approve.isPending}
                className="rounded-md bg-sage-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Approve
              </button>
              <input
                type="text"
                placeholder="Rejection reason (optional)"
                value={reasons[app._id] ?? ""}
                onChange={(e) => setReasons((prev) => ({ ...prev, [app._id]: e.target.value }))}
                className="rounded-md border border-soft-blue px-3 py-2 text-sm"
              />
              <button
                onClick={() => reject.mutate({ applicationId: app._id, rejectionReason: reasons[app._id] })}
                disabled={reject.isPending}
                className="rounded-md border-2 border-deep-blue px-4 py-2 text-sm font-semibold text-deep-blue disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
