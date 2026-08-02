"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";

export interface StudentProfile {
  _id: string;
  parentId: string;
  fullName: string;
  country: string;
  board: string;
  grade: string;
  subjectIds: string[];
  assignedTutorId?: string;
}

export function useStudents() {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ["students", user?._id],
    queryFn: () => apiFetch<StudentProfile[]>(`/api/students/parent/${user!._id}`, { token: accessToken! }),
    enabled: !!accessToken && !!user,
  });
}

export interface CreateStudentInput {
  fullName: string;
  country: string;
  board: string;
  grade: string;
  subjectIds: string[];
}

export function useCreateStudent() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStudentInput) =>
      apiFetch<StudentProfile>("/api/students", {
        method: "POST",
        token: accessToken!,
        body: JSON.stringify({ ...input, parentId: user!._id }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", user?._id] });
    },
  });
}
