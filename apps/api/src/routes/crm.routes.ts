import { Router } from "express";
import { LeadSchema } from "@learnova/shared-types";
import { requireAuth, requireRole } from "../middleware/auth";
import { Lead } from "../models/lead.model";
import { sendDemoScheduledEmail } from "../services/email.service";

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
    const { status, assignedStaffId, scheduledAt } = req.body as {
      status?: string;
      assignedStaffId?: string;
      scheduledAt?: string;
    };

    const update: Record<string, unknown> = { status, assignedStaffId };
    if (scheduledAt) {
      update.scheduledAt = new Date(scheduledAt);
      update.meetingUrl = `https://meet.jit.si/learnova-demo-${req.params.id}`;
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true }).populate(
      "assignedStaffId",
      "fullName email",
    );
    if (!lead) {
      res.status(404).json({ error: { code: "LEAD_NOT_FOUND", message: "Lead not found" } });
      return;
    }

    if (scheduledAt && lead.assignedStaffId && lead.meetingUrl) {
      const tutor = lead.assignedStaffId as unknown as { fullName: string; email: string };
      await sendDemoScheduledEmail([lead.email, tutor.email], {
        leadName: lead.fullName,
        tutorName: tutor.fullName,
        startUtc: lead.scheduledAt!,
        joinUrl: lead.meetingUrl,
      });
    }

    res.status(200).json({ data: lead });
  } catch (err) {
    next(err);
  }
});
