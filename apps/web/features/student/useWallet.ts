"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

interface WalletSummary {
  purchased: number;
  used: number;
  remaining: number;
  transactions: Array<{ _id: string; delta: number; reason: string; createdAt: string }>;
}

export function useWallet() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["wallet", "me"],
    queryFn: () => apiFetch<WalletSummary>("/api/wallet/me", { token: accessToken! }),
    enabled: !!accessToken,
  });
}
