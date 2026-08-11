import { Router } from "express";
import { LeadSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { Lead } from "../models/lead.model";

export const crmRouter = Router();

crmRouter.post("/leads", async (req, res, next) => {
  try {
    const input = LeadSchema.parse(req.body);
    const lead = await Lead.create(input);
    res.status(201).json({ data: lead });
  } catch (err) {
    next(err);
  }
});

crmRouter.use(requireAuth, requireRole("admin"));

crmRouter.get("/leads", async (req, res, next) => {
  try {
    const { status } = req.query as { status?: string };
    const filter = status ? { status } : {};
    const leads = await Lead.find(filter)
      .populate("assignedStaffId", "fullName email")
      .populate("subjectId")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: leads });
  } catch (err) {
    next(err);
  }
});

crmRouter.patch("/leads/:id", async (req, res, next) => {
  try {
    const { status, assignedStaffId } = req.body as { status?: string; assignedStaffId?: string };
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status, assignedStaffId }, { new: true }).populate(
      "assignedStaffId",
      "fullName email",
    );
    res.status(200).json({ data: lead });
  } catch (err) {
    next(err);
  }
});
