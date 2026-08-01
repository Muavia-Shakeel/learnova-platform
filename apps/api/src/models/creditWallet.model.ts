import { Schema, model } from "mongoose";

const creditWalletSchema = new Schema(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    purchased: { type: Number, default: 0 },
    used: { type: Number, default: 0 },
  },
  { timestamps: true },
);

creditWalletSchema.virtual("remaining").get(function remaining(this: { purchased: number; used: number }) {
  return this.purchased - this.used;
});

export const CreditWallet = model("CreditWallet", creditWalletSchema);
