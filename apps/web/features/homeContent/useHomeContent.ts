"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HomeContentInput } from "@learnova/shared-types";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export function useHomeContent() {
  return useQuery({
    queryKey: ["home-content"],
    queryFn: () => apiFetch<HomeContentInput>("/api/home-content"),
  });
}

export function useUpdateHomeContent() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: HomeContentInput) =>
      apiFetch<HomeContentInput>("/api/home-content", {
        method: "PUT",
        token: accessToken!,
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-content"] });
    },
  });
}
