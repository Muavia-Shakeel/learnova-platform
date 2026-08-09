"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface TutorApplication {
  _id: string;
  fullName: string;
  email: string;
  whatsapp?: string;
  subjectIds: Array<{ _id: string; name: string }>;
  degrees: string[];
  bio?: string;
  cvUrl: string;
  degreeCertificateUrl: string;
  demoVideoUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export function usePendingApplications() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["admin", "careers", "pending"],
    queryFn: () => apiFetch<TutorApplication[]>("/api/admin/careers?status=pending", { token: accessToken! }),
    enabled: !!accessToken,
  });
}

export function useApproveApplication() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) =>
      apiFetch(`/api/admin/careers/${applicationId}/approve`, { method: "POST", token: accessToken! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers", "pending"] });
    },
  });
}

export function useRejectApplication() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, rejectionReason }: { applicationId: string; rejectionReason?: string }) =>
      apiFetch(`/api/admin/careers/${applicationId}/reject`, {
        method: "POST",
        token: accessToken!,
        body: JSON.stringify({ rejectionReason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers", "pending"] });
    },
  });
}
