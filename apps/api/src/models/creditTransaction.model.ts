import { Schema, model } from "mongoose";

const creditTransactionSchema = new Schema(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "CreditWallet", required: true, index: true },
    delta: { type: Number, required: true },
    reason: {
      type: String,
      enum: ["purchase", "lesson-deduct", "refund", "referral-bonus", "manual-adjustment"],
      required: true,
    },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true },
);

export const CreditTransaction = model("CreditTransaction", creditTransactionSchema);
