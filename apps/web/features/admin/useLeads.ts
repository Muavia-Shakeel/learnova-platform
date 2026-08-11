"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export type LeadStatus = "new" | "demo-booked" | "demo-attended" | "package-purchased" | "regular" | "inactive" | "follow-up";

export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  whatsapp?: string;
  country?: string;
  grade?: string;
  subjectId?: { _id: string; name: string };
  notes?: string;
  status: LeadStatus;
  assignedStaffId?: { _id: string; fullName: string; email: string };
  createdAt: string;
}

export function useLeads(status?: LeadStatus) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["admin", "leads", status ?? "all"],
    queryFn: () =>
      apiFetch<Lead[]>(`/api/crm/leads${status ? `?status=${status}` : ""}`, { token: accessToken! }),
    enabled: !!accessToken,
  });
}

export function useUpdateLead() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, status, assignedStaffId }: { leadId: string; status?: LeadStatus; assignedStaffId?: string }) =>
      apiFetch<Lead>(`/api/crm/leads/${leadId}`, {
        method: "PATCH",
        token: accessToken!,
        body: JSON.stringify({ status, assignedStaffId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    },
  });
}
