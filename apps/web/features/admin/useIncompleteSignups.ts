"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface IncompleteSignup {
  _id: string;
  fullName: string;
  email: string;
  role: "student" | "parent";
  createdAt: string;
}

export function useIncompleteSignups() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["admin", "incomplete-signups"],
    queryFn: () => apiFetch<IncompleteSignup[]>("/api/admin/incomplete-signups", { token: accessToken! }),
    enabled: !!accessToken,
  });
}
