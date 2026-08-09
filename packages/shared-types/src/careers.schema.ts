import { z } from "zod";

export const TutorApplicationStatusSchema = z.enum(["pending", "approved", "rejected"]);
export type TutorApplicationStatus = z.infer<typeof TutorApplicationStatusSchema>;

export const TutorApplicationSchema = z.object({
  // Page 1
  fullName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  country: z.string().min(1).max(80),
  profilePhotoUrl: z.string().url().optional(),

  // Page 2
  highestQualification: z.string().min(1).max(160),
  institution: z.string().min(1).max(160),
  subjectIds: z.array(z.string().min(1)).default([]),
  yearsOfExperience: z.number().int().min(0).max(60),
  bio: z.string().max(2000).optional(),
  cvUrl: z.string().url(),
  degreeCertificateUrl: z.string().url(),
  demoVideoUrl: z.string().url().optional(),

  declarationAccepted: z.literal(true),
});
export type TutorApplicationInput = z.infer<typeof TutorApplicationSchema>;

export const ReviewApplicationSchema = z.object({
  rejectionReason: z.string().max(500).optional(),
});
export type ReviewApplicationInput = z.infer<typeof ReviewApplicationSchema>;
