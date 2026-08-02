"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface Lesson {
  _id: string;
  studentId: string;
  tutorId: { _id: string; fullName: string; email: string };
  subjectId: { _id: string; name: string };
  startUtc: string;
  durationHours: number;
  status: "booked" | "completed" | "cancelled" | "rescheduled" | "ad-hoc" | "free-trial";
}

export function useLessons(studentId?: string) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["lessons", studentId],
    queryFn: () => apiFetch<Lesson[]>(`/api/lessons/student/${studentId}`, { token: accessToken! }),
    enabled: !!accessToken && !!studentId,
  });
}

export interface BookLessonInput {
  studentId: string;
  tutorId: string;
  subjectId: string;
  startUtc: string;
  durationHours: number;
}

export function useBookLesson() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BookLessonInput) =>
      apiFetch<Lesson>("/api/lessons", {
        method: "POST",
        token: accessToken!,
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", variables.studentId] });
      queryClient.invalidateQueries({ queryKey: ["wallet", "me"] });
    },
  });
}
