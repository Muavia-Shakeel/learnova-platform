"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      apiFetch<{ success: boolean }>("/api/auth/change-password", {
        method: "POST",
        token: accessToken!,
        body: JSON.stringify(input),
      }),
  });
}
