import { Schema, model } from "mongoose";

const weeklySlotSchema = new Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startMinute: { type: Number, min: 0, max: 1439, required: true },
    endMinute: { type: Number, min: 1, max: 1440, required: true },
  },
  { _id: false },
);

const tutorProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    degrees: [{ type: String }],
    curriculum: [{ type: String }],
    bio: { type: String },
    timezone: { type: String, required: true },
    weeklyAvailability: [weeklySlotSchema],
  },
  { timestamps: true },
);

export const TutorProfile = model("TutorProfile", tutorProfileSchema);
