"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface TutorLesson {
  _id: string;
  studentId: { _id: string; fullName: string };
  subjectId: { _id: string; name: string };
  startUtc: string;
  durationHours: number;
  status: "booked" | "completed" | "cancelled" | "rescheduled" | "ad-hoc" | "free-trial";
  zoomJoinUrl?: string;
}

export function useMyCalendar() {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ["tutor", "my-calendar", user?._id],
    queryFn: () => apiFetch<TutorLesson[]>(`/api/tutors/${user!._id}/calendar`, { token: accessToken! }),
    enabled: !!accessToken && !!user,
  });
}

export function useMarkLessonComplete() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) =>
      apiFetch(`/api/lessons/${lessonId}/complete`, { method: "POST", token: accessToken! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor", "my-calendar", user?._id] });
    },
  });
}
