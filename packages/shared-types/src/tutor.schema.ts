import { z } from "zod";

export const WeeklySlotSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startMinute: z.number().int().min(0).max(1439),
  endMinute: z.number().int().min(1).max(1440),
});
export type WeeklySlotInput = z.infer<typeof WeeklySlotSchema>;

export const TutorProfileSchema = z.object({
  userId: z.string().min(1),
  fullName: z.string().min(1).max(120),
  subjectIds: z.array(z.string().min(1)).default([]),
  degrees: z.array(z.string().min(1).max(160)).default([]),
  curriculum: z.array(z.string().min(1).max(80)).default([]),
  bio: z.string().max(2000).optional(),
  timezone: z.string().min(1).max(64),
  weeklyAvailability: z.array(WeeklySlotSchema).default([]),
});
export type TutorProfileInput = z.infer<typeof TutorProfileSchema>;
