import { Router } from "express";
import { HomeContentSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { HomeContent } from "../models/homeContent.model";

export const homeContentRouter = Router();

homeContentRouter.get("/", async (_req, res, next) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) content = await HomeContent.create({});
    res.status(200).json({ data: content });
  } catch (err) {
    next(err);
  }
});

homeContentRouter.put("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const input = HomeContentSchema.parse(req.body);
    const content = await HomeContent.findOneAndUpdate({}, input, { new: true, upsert: true });
    res.status(200).json({ data: content });
  } catch (err) {
    next(err);
  }
});
