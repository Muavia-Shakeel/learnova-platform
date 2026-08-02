"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface Subject {
  _id: string;
  name: string;
  category: "school" | "exam-prep" | "homeschooling";
}

export function useSubjects() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => apiFetch<Subject[]>("/api/subjects", { token: accessToken ?? undefined }),
    enabled: !!accessToken,
  });
}
