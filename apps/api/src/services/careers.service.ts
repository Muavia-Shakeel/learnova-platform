import bcrypt from "bcryptjs";
import type { TutorApplicationInput } from "@learnova/shared-types";
import { TutorApplication } from "../models/tutorApplication.model";
import { User } from "../models/user.model";
import { TutorProfile } from "../models/tutorProfile.model";
import { ApiError } from "../middleware/errorHandler";
import * as emailService from "./email.service";

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
    phone: input.phone,
    country: input.country,
    profilePhotoUrl: input.profilePhotoUrl,
    highestQualification: input.highestQualification,
    institution: input.institution,
    subjectIds: input.subjectIds,
    yearsOfExperience: input.yearsOfExperience,
    bio: input.bio,
    cvUrl: input.cvUrl,
    degreeCertificateUrl: input.degreeCertificateUrl,
    demoVideoUrl: input.demoVideoUrl,
    declarationAccepted: input.declarationAccepted,
  });

  await Promise.all([
    emailService.sendApplicationReceivedEmail(application.email, application.fullName),
    emailService.sendNewApplicationAdminAlert(application.fullName, application.email),
  ]);

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
    whatsapp: application.phone,
  });

  await TutorProfile.create({
    userId: user.id,
    subjectIds: application.subjectIds,
    degrees: [`${application.highestQualification}, ${application.institution}`],
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
  await emailService.sendApplicationApprovedEmail(application.email, application.fullName);
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

  await emailService.sendApplicationRejectedEmail(application.email, application.fullName, rejectionReason);
  return application;
}
