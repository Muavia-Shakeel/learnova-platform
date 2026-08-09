import { z } from "zod";

export const TutorApplicationStatusSchema = z.enum(["pending", "approved", "rejected"]);
export type TutorApplicationStatus = z.infer<typeof TutorApplicationStatusSchema>;

export const TutorApplicationSchema = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  whatsapp: z.string().min(6).max(20).optional(),
  subjectIds: z.array(z.string().min(1)).default([]),
  degrees: z.array(z.string().min(1).max(160)).min(1),
  bio: z.string().max(2000).optional(),
  cvUrl: z.string().url(),
  degreeCertificateUrl: z.string().url(),
  demoVideoUrl: z.string().url().optional(),
});
export type TutorApplicationInput = z.infer<typeof TutorApplicationSchema>;

export const ReviewApplicationSchema = z.object({
  rejectionReason: z.string().max(500).optional(),
});
export type ReviewApplicationInput = z.infer<typeof ReviewApplicationSchema>;
