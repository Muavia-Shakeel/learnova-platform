import { Router } from "express";
import { WeeklySlotSchema } from "@learnova/shared-types";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth";
import { TutorProfile } from "../models/tutorProfile.model";
import { Lesson } from "../models/lesson.model";

const UpdateAvailabilitySchema = z.object({
  timezone: z.string().min(1),
  weeklyAvailability: z.array(WeeklySlotSchema),
});

export const tutorRouter = Router();

tutorRouter.get("/", async (req, res, next) => {
  try {
    const { subjectId } = req.query as { subjectId?: string };
    const filter = subjectId ? { subjectIds: subjectId } : {};
    const tutors = await TutorProfile.find(filter)
      .populate("subjectIds")
      .populate("userId", "fullName email");
    res.status(200).json({ data: tutors });
  } catch (err) {
    next(err);
  }
});

tutorRouter.get("/:id", async (req, res, next) => {
  try {
    const tutor = await TutorProfile.findOne({ userId: req.params.id }).populate("subjectIds");
    res.status(200).json({ data: tutor });
  } catch (err) {
    next(err);
  }
});

tutorRouter.get("/:id/calendar", requireAuth, async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ tutorId: req.params.id }).sort({ startUtc: 1 });
    res.status(200).json({ data: lessons });
  } catch (err) {
    next(err);
  }
});

tutorRouter.put("/me/availability", requireAuth, requireRole("tutor"), async (req, res, next) => {
  try {
    const input = UpdateAvailabilitySchema.parse(req.body);
    const tutor = await TutorProfile.findOneAndUpdate(
      { userId: req.user!.id },
      { weeklyAvailability: input.weeklyAvailability, timezone: input.timezone },
      { new: true, upsert: true },
    );
    res.status(200).json({ data: tutor });
  } catch (err) {
    next(err);
  }
});
