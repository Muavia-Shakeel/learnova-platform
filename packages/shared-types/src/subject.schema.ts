import { z } from "zod";

export const SubjectCategorySchema = z.enum([
  "school",
  "exam-prep",
  "homeschooling",
]);
export type SubjectCategory = z.infer<typeof SubjectCategorySchema>;

export const SubjectSchema = z.object({
  name: z.string().min(1).max(80),
  category: SubjectCategorySchema,
  board: z.string().max(80).optional(),
});
export type SubjectInput = z.infer<typeof SubjectSchema>;
