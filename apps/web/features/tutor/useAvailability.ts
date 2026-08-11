"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface WeeklySlot {
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
}

export interface MyTutorProfile {
  _id: string;
  userId: { _id: string; fullName: string; email: string };
  timezone: string;
  weeklyAvailability: WeeklySlot[];
}

export function useMyTutorProfile() {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ["tutor", "my-profile", user?._id],
    queryFn: () => apiFetch<MyTutorProfile>(`/api/tutors/${user!._id}`, { token: accessToken! }),
    enabled: !!accessToken && !!user,
  });
}

export function useUpdateAvailability() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { timezone: string; weeklyAvailability: WeeklySlot[] }) =>
      apiFetch("/api/tutors/me/availability", {
        method: "PUT",
        token: accessToken!,
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor", "my-profile", user?._id] });
    },
  });
}
