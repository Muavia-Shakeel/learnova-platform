import { Schema, model } from "mongoose";

const lessonSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "StudentProfile", required: true, index: true },
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    startUtc: { type: Date, required: true },
    durationHours: { type: Number, required: true, min: 0.5 },
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled", "rescheduled", "ad-hoc", "free-trial"],
      default: "booked",
    },
    createdByTutor: { type: Boolean, default: false },
    zoomJoinUrl: { type: String },
    recordingUrl: { type: String },
    creditsDeducted: { type: Number, default: 0 },
  },
  { timestamps: true },
);

lessonSchema.index({ tutorId: 1, startUtc: 1 });

export const Lesson = model("Lesson", lessonSchema);
