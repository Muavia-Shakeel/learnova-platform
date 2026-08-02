import { Router } from "express";
import { DateTime } from "luxon";
import { requireAuth, requireRole } from "../middleware/auth";
import { Lesson } from "../models/lesson.model";
import { Payment } from "../models/payment.model";
import { StudentProfile } from "../models/studentProfile.model";
import { TutorProfile } from "../models/tutorProfile.model";
import { Lead } from "../models/lead.model";

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
