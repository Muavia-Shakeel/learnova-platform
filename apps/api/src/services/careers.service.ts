import bcrypt from "bcryptjs";
import type { TutorApplicationInput } from "@learnova/shared-types";
import { TutorApplication } from "../models/tutorApplication.model";
import { User } from "../models/user.model";
import { TutorProfile } from "../models/tutorProfile.model";
import { ApiError } from "../middleware/errorHandler";

export async function submitApplication(input: TutorApplicationInput) {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) throw new ApiError(409, "EMAIL_TAKEN", "Email already registered");

  const existingApplication = await TutorApplication.findOne({
    email: input.email,
    status: { $in: ["pending", "approved"] },
  });
  if (existingApplication) throw new ApiError(409, "APPLICATION_EXISTS", "An application with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const application = await TutorApplication.create({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
    whatsapp: input.whatsapp,
    subjectIds: input.subjectIds,
    degrees: input.degrees,
    bio: input.bio,
    cvUrl: input.cvUrl,
    degreeCertificateUrl: input.degreeCertificateUrl,
    demoVideoUrl: input.demoVideoUrl,
  });
  return application;
}

export async function approveApplication(applicationId: string, adminId: string) {
  const application = await TutorApplication.findById(applicationId).select("+passwordHash");
  if (!application) throw new ApiError(404, "APPLICATION_NOT_FOUND", "Application not found");
  if (application.status !== "pending") throw new ApiError(400, "ALREADY_REVIEWED", "Application already reviewed");

  const user = await User.create({
    email: application.email,
    passwordHash: application.passwordHash,
    fullName: application.fullName,
    role: "tutor",
    whatsapp: application.whatsapp,
  });

  await TutorProfile.create({
    userId: user.id,
    subjectIds: application.subjectIds,
    degrees: application.degrees,
    bio: application.bio,
    timezone: "Europe/London",
    weeklyAvailability: [],
  });

  application.status = "approved";
  application.reviewedBy = adminId as any;
  application.reviewedAt = new Date();
  application.resultingUserId = user.id;
  await application.save();

  application.passwordHash = undefined as any;
  return application;
}

export async function rejectApplication(applicationId: string, adminId: string, rejectionReason?: string) {
  const application = await TutorApplication.findById(applicationId);
  if (!application) throw new ApiError(404, "APPLICATION_NOT_FOUND", "Application not found");
  if (application.status !== "pending") throw new ApiError(400, "ALREADY_REVIEWED", "Application already reviewed");

  application.status = "rejected";
  application.rejectionReason = rejectionReason;
  application.reviewedBy = adminId as any;
  application.reviewedAt = new Date();
  await application.save();

  return application;
}
