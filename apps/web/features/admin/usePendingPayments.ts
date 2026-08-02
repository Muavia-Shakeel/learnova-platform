"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface PendingPayment {
  _id: string;
  parentId: { _id: string; fullName: string; email: string };
  provider: "stripe" | "payoneer";
  packageTier: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export function usePendingPayments() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["admin", "pending-payments"],
    queryFn: () => apiFetch<PendingPayment[]>("/api/admin/payments/pending", { token: accessToken! }),
    enabled: !!accessToken,
  });
}

export function useConfirmPayoneerPayment() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, providerRef }: { paymentId: string; providerRef: string }) =>
      apiFetch(`/api/payments/${paymentId}/payoneer-confirm`, {
        method: "POST",
        token: accessToken!,
        body: JSON.stringify({ providerRef }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-payments"] });
    },
  });
}
