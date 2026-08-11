import { Schema, model } from "mongoose";

const leadSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String },
    country: { type: String },
    grade: { type: String },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    notes: { type: String },
    status: {
      type: String,
      enum: ["new", "demo-booked", "demo-attended", "package-purchased", "regular", "inactive", "follow-up"],
      default: "new",
    },
    assignedStaffId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Lead = model("Lead", leadSchema);
