import { Schema, model } from "mongoose";

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["school", "exam-prep", "homeschooling"], required: true },
    board: { type: String },
  },
  { timestamps: true },
);

export const Subject = model("Subject", subjectSchema);
