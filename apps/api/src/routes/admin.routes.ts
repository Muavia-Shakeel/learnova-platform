import { Router } from "express";
import { DateTime } from "luxon";
import { ReviewApplicationSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { Lesson } from "../models/lesson.model";
import { Payment } from "../models/payment.model";
import { StudentProfile } from "../models/studentProfile.model";
import { TutorProfile } from "../models/tutorProfile.model";
import { User } from "../models/user.model";
import { Lead } from "../models/lead.model";
import { TutorApplication } from "../models/tutorApplication.model";
import * as careersService from "../services/careers.service";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/dashboard", async (_req, res, next) => {
  try {
    const startOfDay = DateTime.utc().startOf("day").toJSDate();
    const startOfMonth = DateTime.utc().startOf("month").toJSDate();

    const [dailyRevenueAgg, monthlyRevenueAgg, studentCount, activeTutorCount, lessonsToday, completedLessons, pendingPayments, newEnquiries] =
      await Promise.all([
        Payment.aggregate([
          { $match: { status: "paid", createdAt: { $gte: startOfDay } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Payment.aggregate([
          { $match: { status: "paid", createdAt: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        StudentProfile.countDocuments(),
        TutorProfile.countDocuments(),
        Lesson.countDocuments({ startUtc: { $gte: startOfDay } }),
        Lesson.countDocuments({ status: "completed" }),
        Payment.countDocuments({ status: "pending" }),
        Lead.countDocuments({ status: "new" }),
      ]);

    res.status(200).json({
      data: {
        dailyRevenue: dailyRevenueAgg[0]?.total ?? 0,
        monthlyRevenue: monthlyRevenueAgg[0]?.total ?? 0,
        students: studentCount,
        activeTutors: activeTutorCount,
        lessonsToday,
        completedLessons,
        pendingPayments,
        newEnquiries,
      },
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/incomplete-signups", async (_req, res, next) => {
  try {
    const profiledParentIds = await StudentProfile.distinct("parentId");
    const users = await User.find(
      { role: { $in: ["student", "parent"] }, _id: { $nin: profiledParentIds } },
      "fullName email role createdAt",
    ).sort({ createdAt: -1 });
    res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/payments/pending", async (_req, res, next) => {
  try {
    const payments = await Payment.find({ status: "pending" })
      .populate("parentId", "fullName email")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: payments });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/careers", async (req, res, next) => {
  try {
    const { status } = req.query as { status?: string };
    const applications = await TutorApplication.find({ status: status ?? "pending" })
      .populate("subjectIds")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: applications });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/careers/:id/approve", async (req, res, next) => {
  try {
    const application = await careersService.approveApplication(req.params.id, req.user!.id);
    res.status(200).json({ data: application });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/careers/:id/reject", async (req, res, next) => {
  try {
    const input = ReviewApplicationSchema.parse(req.body);
    const application = await careersService.rejectApplication(req.params.id, req.user!.id, input.rejectionReason);
    res.status(200).json({ data: application });
  } catch (err) {
    next(err);
  }
});
