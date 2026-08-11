import { Router } from "express";
import { SubjectSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { Subject } from "../models/subject.model";

export const subjectRouter = Router();

subjectRouter.get("/", async (req, res, next) => {
  try {
    const { category } = req.query as { category?: string };
    const filter = category ? { category } : {};
    const subjects = await Subject.find(filter).sort({ name: 1 });
    res.status(200).json({ data: subjects });
  } catch (err) {
    next(err);
  }
});

subjectRouter.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const input = SubjectSchema.parse(req.body);
    const subject = await Subject.create(input);
    res.status(201).json({ data: subject });
  } catch (err) {
    next(err);
  }
});
