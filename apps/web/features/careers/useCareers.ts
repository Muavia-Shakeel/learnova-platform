"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";

export interface TutorApplicationInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  profilePhotoUrl?: string;
  highestQualification: string;
  institution: string;
  subjectIds: string[];
  yearsOfExperience: number;
  bio?: string;
  cvUrl: string;
  degreeCertificateUrl: string;
  demoVideoUrl?: string;
  declarationAccepted: true;
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
