import { Router } from "express";
import { HomeworkSubmissionSchema, HomeworkFeedbackSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { HomeworkSubmission } from "../models/homeworkSubmission.model";

export const homeworkRouter = Router();

homeworkRouter.use(requireAuth);

homeworkRouter.post("/", requireRole("student", "parent"), async (req, res, next) => {
  try {
    const input = HomeworkSubmissionSchema.parse(req.body);
    const submission = await HomeworkSubmission.create(input);
    res.status(201).json({ data: submission });
  } catch (err) {
    next(err);
  }
});

homeworkRouter.get("/student/:studentId", async (req, res, next) => {
  try {
    const submissions = await HomeworkSubmission.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.status(200).json({ data: submissions });
  } catch (err) {
    next(err);
  }
});

homeworkRouter.patch("/:id/feedback", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const input = HomeworkFeedbackSchema.parse({ ...req.body, submissionId: req.params.id });
    const submission = await HomeworkSubmission.findByIdAndUpdate(
      input.submissionId,
      { grade: input.grade, feedback: input.feedback },
      { new: true },
    );
    res.status(200).json({ data: submission });
  } catch (err) {
    next(err);
  }
});
