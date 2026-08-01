import { z } from "zod";

export const LessonStatusSchema = z.enum([
  "booked",
  "completed",
  "cancelled",
  "rescheduled",
  "ad-hoc",
  "free-trial",
]);
export type LessonStatus = z.infer<typeof LessonStatusSchema>;

export const CreateLessonSchema = z.object({
  studentId: z.string().min(1),
  tutorId: z.string().min(1),
  startUtc: z.string().datetime(),
  durationHours: z.number().min(0.5).max(6).multipleOf(0.5),
  subjectId: z.string().min(1),
});
export type CreateLessonInput = z.infer<typeof CreateLessonSchema>;

export const RescheduleLessonSchema = z.object({
  lessonId: z.string().min(1),
  newStartUtc: z.string().datetime(),
});
export type RescheduleLessonInput = z.infer<typeof RescheduleLessonSchema>;

export const CreateAdHocLessonSchema = CreateLessonSchema.extend({
  createdByTutor: z.literal(true).default(true),
});
export type CreateAdHocLessonInput = z.infer<typeof CreateAdHocLessonSchema>;
