import { Schema, model } from "mongoose";

const tutorApplicationSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    whatsapp: { type: String },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    degrees: [{ type: String, required: true }],
    bio: { type: String },
    cvUrl: { type: String, required: true },
    degreeCertificateUrl: { type: String, required: true },
    demoVideoUrl: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rejectionReason: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    resultingUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const TutorApplication = model("TutorApplication", tutorApplicationSchema);
