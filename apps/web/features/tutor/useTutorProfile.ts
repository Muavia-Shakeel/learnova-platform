"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";
import type { TutorProfile } from "./useTutors";

export function useTutorProfile(tutorId?: string) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["tutor-profile", tutorId],
    queryFn: () => apiFetch<TutorProfile>(`/api/tutors/${tutorId}`, { token: accessToken ?? undefined }),
    enabled: !!accessToken && !!tutorId,
  });
}
