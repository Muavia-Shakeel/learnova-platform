"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export type ResourceType = "worksheet" | "pdf" | "slides" | "practice-paper" | "flashcards";

export interface Resource {
  _id: string;
  title: string;
  subjectId: { _id: string; name: string };
  type: ResourceType;
  fileUrl: string;
  createdAt: string;
}

export function useResources(subjectId?: string) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["resources", subjectId ?? "all"],
    queryFn: () =>
      apiFetch<Resource[]>(`/api/resources${subjectId ? `?subjectId=${subjectId}` : ""}`, {
        token: accessToken!,
      }),
    enabled: !!accessToken,
  });
}

export interface CreateResourceInput {
  title: string;
  subjectId: string;
  type: ResourceType;
  fileUrl: string;
}

export function useCreateResource() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateResourceInput) =>
      apiFetch<Resource>("/api/resources", {
        method: "POST",
        token: accessToken!,
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}
