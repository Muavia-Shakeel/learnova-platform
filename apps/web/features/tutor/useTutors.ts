"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";
import type { Subject } from "../subjects/useSubjects";

export interface TutorProfile {
  _id: string;
  userId: { _id: string; fullName: string; email: string };
  subjectIds: Subject[];
  degrees: string[];
  curriculum: string[];
  bio?: string;
  timezone: string;
}

export function useTutors() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["tutors"],
    queryFn: () => apiFetch<TutorProfile[]>("/api/tutors", { token: accessToken ?? undefined }),
    enabled: !!accessToken,
  });
}
