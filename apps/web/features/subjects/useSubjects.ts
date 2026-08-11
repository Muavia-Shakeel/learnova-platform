"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface Subject {
  _id: string;
  name: string;
  category: "school" | "exam-prep" | "homeschooling";
  board?: string;
}

export function useSubjects() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => apiFetch<Subject[]>("/api/subjects", { token: accessToken ?? undefined }),
  });
}

export interface CreateSubjectInput {
  name: string;
  category: "school" | "exam-prep" | "homeschooling";
  board?: string;
}

export function useCreateSubject() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubjectInput) =>
      apiFetch<Subject>("/api/subjects", {
        method: "POST",
        token: accessToken!,
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}
