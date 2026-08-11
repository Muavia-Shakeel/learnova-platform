import { z } from "zod";

export const HomeworkSubmissionSchema = z.object({
  studentId: z.string().min(1),
  tutorId: z.string().min(1),
  subjectId: z.string().min(1),
  fileUrl: z.string().url(),
  note: z.string().max(1000).optional(),
});
export type HomeworkSubmissionInput = z.infer<typeof HomeworkSubmissionSchema>;

export const HomeworkFeedbackSchema = z.object({
  submissionId: z.string().min(1),
  grade: z.string().max(20).optional(),
  feedback: z.string().max(2000),
});
export type HomeworkFeedbackInput = z.infer<typeof HomeworkFeedbackSchema>;

export const CrmLeadStatusSchema = z.enum([
  "new",
  "demo-booked",
  "demo-attended",
  "package-purchased",
  "regular",
  "inactive",
  "follow-up",
]);
export type CrmLeadStatus = z.infer<typeof CrmLeadStatusSchema>;

export const LeadSchema = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email(),
  whatsapp: z.string().min(6).max(20).optional(),
  country: z.string().max(80).optional(),
  grade: z.string().max(40).optional(),
  subjectId: z.string().min(1).optional(),
  notes: z.string().max(1000).optional(),
  status: CrmLeadStatusSchema.default("new"),
  assignedStaffId: z.string().min(1).optional(),
});
export type LeadInput = z.infer<typeof LeadSchema>;

export const ReviewSchema = z.object({
  studentId: z.string().min(1),
  tutorId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(1000).optional(),
});
export type ReviewInput = z.infer<typeof ReviewSchema>;
