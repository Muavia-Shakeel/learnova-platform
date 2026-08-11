import { Router } from "express";
import { WeeklySlotSchema } from "@learnova/shared-types";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth";
import { TutorProfile } from "../models/tutorProfile.model";
import { Lesson } from "../models/lesson.model";

function isValidTimezone(tz: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const UpdateAvailabilitySchema = z.object({
  timezone: z.string().min(1).refine(isValidTimezone, "Must be a valid IANA timezone, e.g. Asia/Karachi"),
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
    const tutor = await TutorProfile.findOne({ userId: req.params.id })
      .populate("subjectIds")
      .populate("userId", "fullName email");
    res.status(200).json({ data: tutor });
  } catch (err) {
    next(err);
  }
});

tutorRouter.get("/:id/calendar", requireAuth, async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ tutorId: req.params.id })
      .populate("studentId", "fullName")
      .populate("subjectId", "name")
      .sort({ startUtc: 1 });
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
