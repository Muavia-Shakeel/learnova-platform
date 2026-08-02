import { Router } from "express";
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
