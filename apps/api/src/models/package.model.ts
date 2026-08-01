import { Schema, model } from "mongoose";

const packageSchema = new Schema(
  {
    tier: { type: String, enum: ["starter", "silver", "gold", "diamond"], required: true, unique: true },
    credits: { type: Number, required: true },
    priceGbp: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Package = model("Package", packageSchema);
