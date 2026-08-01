import { Schema, model } from "mongoose";

const processedWebhookEventSchema = new Schema(
  {
    provider: { type: String, enum: ["stripe"], required: true },
    eventId: { type: String, required: true },
  },
  { timestamps: true },
);

processedWebhookEventSchema.index({ provider: 1, eventId: 1 }, { unique: true });

export const ProcessedWebhookEvent = model("ProcessedWebhookEvent", processedWebhookEventSchema);
