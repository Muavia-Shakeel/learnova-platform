import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "StudentProfile", required: true },
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Review = model("Review", reviewSchema);
