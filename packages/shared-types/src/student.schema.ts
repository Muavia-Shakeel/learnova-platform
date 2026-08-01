import { z } from "zod";

export const StudentProfileSchema = z.object({
  parentId: z.string().min(1),
  fullName: z.string().min(1).max(120),
  country: z.string().min(1).max(80),
  board: z.string().min(1).max(80),
  grade: z.string().min(1).max(40),
  subjectIds: z.array(z.string().min(1)).default([]),
  assignedTutorId: z.string().min(1).optional(),
});
export type StudentProfileInput = z.infer<typeof StudentProfileSchema>;
