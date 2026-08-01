import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, enum: ["stripe", "payoneer"], required: true },
    packageTier: { type: String, enum: ["starter", "silver", "gold", "diamond"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    providerRef: { type: String },
    invoiceUrl: { type: String },
  },
  { timestamps: true },
);

export const Payment = model("Payment", paymentSchema);
