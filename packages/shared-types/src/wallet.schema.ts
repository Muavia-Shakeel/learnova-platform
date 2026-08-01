import { z } from "zod";

export const PackageTierSchema = z.enum(["starter", "silver", "gold", "diamond"]);
export type PackageTier = z.infer<typeof PackageTierSchema>;

export const PACKAGE_CREDITS: Record<PackageTier, number> = {
  starter: 10,
  silver: 20,
  gold: 40,
  diamond: 80,
};

export const CreditTransactionReasonSchema = z.enum([
  "purchase",
  "lesson-deduct",
  "refund",
  "referral-bonus",
  "manual-adjustment",
]);
export type CreditTransactionReason = z.infer<typeof CreditTransactionReasonSchema>;

export const PurchasePackageSchema = z.object({
  parentId: z.string().min(1),
  tier: PackageTierSchema,
  currency: z.string().length(3),
  paymentMethod: z.enum(["stripe", "payoneer"]),
});
export type PurchasePackageInput = z.infer<typeof PurchasePackageSchema>;
