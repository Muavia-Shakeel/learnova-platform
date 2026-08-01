import { CreditWallet } from "../models/creditWallet.model";
import { CreditTransaction } from "../models/creditTransaction.model";
import { ApiError } from "../middleware/errorHandler";
import type { CreditTransactionReason } from "@learnova/shared-types";

export async function getOrCreateWallet(parentId: string) {
  let wallet = await CreditWallet.findOne({ parentId });
  if (!wallet) wallet = await CreditWallet.create({ parentId, purchased: 0, used: 0 });
  return wallet;
}

export async function addCredits(parentId: string, amount: number, reason: CreditTransactionReason, paymentId?: string) {
  const wallet = await getOrCreateWallet(parentId);
  wallet.purchased += amount;
  await wallet.save();
  await CreditTransaction.create({ walletId: wallet.id, delta: amount, reason, paymentId });
  return wallet;
}

export async function deductCredits(parentId: string, hours: number, lessonId: string) {
  const wallet = await getOrCreateWallet(parentId);
  const remaining = wallet.purchased - wallet.used;
  if (remaining < hours) {
    throw new ApiError(400, "INSUFFICIENT_CREDITS", `Only ${remaining} credit(s) remaining`);
  }
  wallet.used += hours;
  await wallet.save();
  await CreditTransaction.create({
    walletId: wallet.id,
    delta: -hours,
    reason: "lesson-deduct",
    lessonId,
  });
  return wallet;
}

export async function refundCredits(parentId: string, hours: number, lessonId: string) {
  const wallet = await getOrCreateWallet(parentId);
  wallet.used = Math.max(0, wallet.used - hours);
  await wallet.save();
  await CreditTransaction.create({
    walletId: wallet.id,
    delta: hours,
    reason: "refund",
    lessonId,
  });
  return wallet;
}
