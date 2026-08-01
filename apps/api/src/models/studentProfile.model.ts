import { Schema, model } from "mongoose";

const studentProfileSchema = new Schema(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fullName: { type: String, required: true },
    country: { type: String, required: true },
    board: { type: String, required: true },
    grade: { type: String, required: true },
    timezone: { type: String },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    assignedTutorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const StudentProfile = model("StudentProfile", studentProfileSchema);
