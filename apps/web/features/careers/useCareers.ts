"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";

export interface TutorApplicationInput {
  fullName: string;
  email: string;
  password: string;
  whatsapp?: string;
  subjectIds: string[];
  degrees: string[];
  bio?: string;
  cvUrl: string;
  degreeCertificateUrl: string;
  demoVideoUrl?: string;
}

interface ApplicationResult {
  id: string;
  status: string;
}

export function useSubmitApplication() {
  return useMutation({
    mutationFn: (input: TutorApplicationInput) =>
      apiFetch<ApplicationResult>("/api/careers/apply", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });
}
