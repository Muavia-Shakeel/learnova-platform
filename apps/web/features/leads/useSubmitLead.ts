"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";

export interface SubmitLeadInput {
  fullName: string;
  email: string;
  whatsapp?: string;
  country?: string;
  grade?: string;
  subjectId?: string;
  notes?: string;
}

export function useSubmitLead() {
  return useMutation({
    mutationFn: (input: SubmitLeadInput) =>
      apiFetch("/api/crm/leads", {
        method: "POST",
        body: JSON.stringify({ ...input, status: "demo-booked" }),
      }),
  });
}
