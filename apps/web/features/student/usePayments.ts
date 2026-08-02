"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export type PackageTier = "starter" | "silver" | "gold" | "diamond";

export interface CheckoutInput {
  parentId: string;
  tier: PackageTier;
  currency: string;
  paymentMethod: "stripe" | "payoneer";
}

interface CheckoutResult {
  checkoutUrl?: string;
  paymentId: string;
  message?: string;
}

export function useCheckout() {
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: (input: CheckoutInput) =>
      apiFetch<CheckoutResult>("/api/payments/checkout", {
        method: "POST",
        token: accessToken!,
        body: JSON.stringify(input),
      }),
  });
}
