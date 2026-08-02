import { Router } from "express";
import { CreateLessonSchema, RescheduleLessonSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { Lesson } from "../models/lesson.model";
import * as lessonService from "../services/lesson.service";

export const lessonRouter = Router();

lessonRouter.use(requireAuth);

lessonRouter.get("/student/:studentId", async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ studentId: req.params.studentId })
      .populate("tutorId", "fullName email")
      .populate("subjectId")
      .sort({ startUtc: 1 });
    res.status(200).json({ data: lessons });
  } catch (err) {
    next(err);
  }
});

lessonRouter.post("/", requireRole("parent", "student", "admin"), async (req, res, next) => {
  try {
    const input = CreateLessonSchema.parse(req.body);
    const lesson = await lessonService.bookLesson(input);
    res.status(201).json({ data: lesson });
  } catch (err) {
    next(err);
  }
});

lessonRouter.post("/ad-hoc", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const input = CreateLessonSchema.parse(req.body);
    const lesson = await lessonService.createAdHocLesson(input);
    res.status(201).json({ data: lesson });
  } catch (err) {
    next(err);
  }
});

lessonRouter.post("/reschedule", async (req, res, next) => {
  try {
    const input = RescheduleLessonSchema.parse(req.body);
    const lesson = await lessonService.rescheduleLesson(input);
    res.status(200).json({ data: lesson });
  } catch (err) {
    next(err);
  }
});

lessonRouter.post("/:id/cancel", async (req, res, next) => {
  try {
    const lesson = await lessonService.cancelLesson(req.params.id);
    res.status(200).json({ data: lesson });
  } catch (err) {
    next(err);
  }
});

lessonRouter.post("/:id/complete", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const lesson = await lessonService.markCompleted(req.params.id);
    res.status(200).json({ data: lesson });
  } catch (err) {
    next(err);
  }
});
