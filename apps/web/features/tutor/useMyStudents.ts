"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/useMe";
import type { Subject } from "../subjects/useSubjects";

export interface AssignedStudent {
  _id: string;
  fullName: string;
  country: string;
  board: string;
  grade: string;
  subjectIds: Subject[];
}

export function useMyStudents() {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ["tutor", "my-students", user?._id],
    queryFn: () => apiFetch<AssignedStudent[]>(`/api/students/tutor/${user!._id}`, { token: accessToken! }),
    enabled: !!accessToken && !!user,
  });
}
