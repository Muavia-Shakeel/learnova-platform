import { Schema, model } from "mongoose";

const resourceSchema = new Schema(
  {
    title: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    type: { type: String, enum: ["worksheet", "pdf", "slides", "practice-paper", "flashcards"], required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export const Resource = model("Resource", resourceSchema);
