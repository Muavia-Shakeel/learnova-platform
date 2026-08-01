import { Router } from "express";
import { ReviewSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { Review } from "../models/review.model";

export const reviewRouter = Router();

reviewRouter.get("/tutor/:tutorId", async (req, res, next) => {
  try {
    const reviews = await Review.find({ tutorId: req.params.tutorId, approved: true }).sort({ createdAt: -1 });
    res.status(200).json({ data: reviews });
  } catch (err) {
    next(err);
  }
});

reviewRouter.use(requireAuth);

reviewRouter.post("/", requireRole("student", "parent"), async (req, res, next) => {
  try {
    const input = ReviewSchema.parse(req.body);
    const review = await Review.create(input);
    res.status(201).json({ data: review });
  } catch (err) {
    next(err);
  }
});

reviewRouter.patch("/:id/approve", requireRole("admin"), async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.status(200).json({ data: review });
  } catch (err) {
    next(err);
  }
});
