import { Schema, model } from "mongoose";

const homeworkSubmissionSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "StudentProfile", required: true, index: true },
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    fileUrl: { type: String, required: true },
    note: { type: String },
    grade: { type: String },
    feedback: { type: String },
  },
  { timestamps: true },
);

export const HomeworkSubmission = model("HomeworkSubmission", homeworkSubmissionSchema);
