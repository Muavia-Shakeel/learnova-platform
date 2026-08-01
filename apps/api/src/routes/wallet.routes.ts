import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getOrCreateWallet } from "../services/wallet.service";
import { CreditTransaction } from "../models/creditTransaction.model";

export const walletRouter = Router();

walletRouter.use(requireAuth);

walletRouter.get("/me", async (req, res, next) => {
  try {
    const wallet = await getOrCreateWallet(req.user!.id);
    const transactions = await CreditTransaction.find({ walletId: wallet.id }).sort({ createdAt: -1 }).limit(50);
    res.status(200).json({
      data: {
        purchased: wallet.purchased,
        used: wallet.used,
        remaining: wallet.purchased - wallet.used,
        transactions,
      },
    });
  } catch (err) {
    next(err);
  }
});
