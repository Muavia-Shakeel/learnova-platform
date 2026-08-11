import { Router } from "express";
import { StudentProfileSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { StudentProfile } from "../models/studentProfile.model";

export const studentRouter = Router();

studentRouter.use(requireAuth);

studentRouter.post("/", requireRole("parent", "admin", "student"), async (req, res, next) => {
  try {
    const input = StudentProfileSchema.parse(req.body);
    if (req.user!.role === "student") {
      input.parentId = req.user!.id;
      const existing = await StudentProfile.findOne({ parentId: req.user!.id });
      if (existing) {
        res.status(409).json({ message: "Profile already exists" });
        return;
      }
    }
    const student = await StudentProfile.create(input);
    res.status(201).json({ data: student });
  } catch (err) {
    next(err);
  }
});

studentRouter.get("/", requireRole("admin"), async (req, res, next) => {
  try {
    const students = await StudentProfile.find()
      .populate("subjectIds")
      .populate("assignedTutorId", "fullName email")
      .populate("parentId", "fullName email");
    res.status(200).json({ data: students });
  } catch (err) {
    next(err);
  }
});

studentRouter.get("/parent/:parentId", async (req, res, next) => {
  try {
    const students = await StudentProfile.find({ parentId: req.params.parentId });
    res.status(200).json({ data: students });
  } catch (err) {
    next(err);
  }
});

studentRouter.get("/tutor/:tutorId", async (req, res, next) => {
  try {
    const students = await StudentProfile.find({ assignedTutorId: req.params.tutorId }).populate("subjectIds");
    res.status(200).json({ data: students });
  } catch (err) {
    next(err);
  }
});

studentRouter.get("/:id", async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.id).populate("subjectIds");
    res.status(200).json({ data: student });
  } catch (err) {
    next(err);
  }
});

studentRouter.patch("/:id/assign-tutor", requireRole("admin"), async (req, res, next) => {
  try {
    const { tutorId } = req.body as { tutorId: string };
    const student = await StudentProfile.findByIdAndUpdate(req.params.id, { assignedTutorId: tutorId }, { new: true });
    res.status(200).json({ data: student });
  } catch (err) {
    next(err);
  }
});
