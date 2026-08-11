"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface AdminOverview {
  dailyRevenue: number;
  monthlyRevenue: number;
  students: number;
  activeTutors: number;
  lessonsToday: number;
  completedLessons: number;
  pendingPayments: number;
  newEnquiries: number;
}

export function useAdminOverview() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => apiFetch<AdminOverview>("/api/admin/dashboard", { token: accessToken! }),
    enabled: !!accessToken,
  });
}
