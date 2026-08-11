"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";
import type { Subject } from "../subjects/useSubjects";

export interface AdminStudentProfile {
  _id: string;
  fullName: string;
  country: string;
  board: string;
  grade: string;
  subjectIds: Subject[];
  parentId: { _id: string; fullName: string; email: string };
  assignedTutorId?: { _id: string; fullName: string; email: string };
}

export function useAllStudents() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["admin", "students"],
    queryFn: () => apiFetch<AdminStudentProfile[]>("/api/students", { token: accessToken! }),
    enabled: !!accessToken,
  });
}

export function useAssignTutor() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, tutorId }: { studentId: string; tutorId: string }) =>
      apiFetch(`/api/students/${studentId}/assign-tutor`, {
        method: "PATCH",
        token: accessToken!,
        body: JSON.stringify({ tutorId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
    },
  });
}
