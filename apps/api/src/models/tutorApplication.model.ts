import { Schema, model } from "mongoose";

const tutorApplicationSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    profilePhotoUrl: { type: String },
    highestQualification: { type: String, required: true },
    institution: { type: String, required: true },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    yearsOfExperience: { type: Number, required: true, min: 0 },
    bio: { type: String },
    cvUrl: { type: String, required: true },
    degreeCertificateUrl: { type: String, required: true },
    demoVideoUrl: { type: String },
    declarationAccepted: { type: Boolean, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rejectionReason: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    resultingUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const TutorApplication = model("TutorApplication", tutorApplicationSchema);
