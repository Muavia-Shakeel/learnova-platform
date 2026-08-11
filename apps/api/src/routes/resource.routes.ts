import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { Resource } from "../models/resource.model";

export const resourceRouter = Router();

resourceRouter.use(requireAuth);

resourceRouter.get("/", async (req, res, next) => {
  try {
    const { subjectId } = req.query as { subjectId?: string };
    const filter = subjectId ? { subjectId } : {};
    const resources = await Resource.find(filter).populate("subjectId").sort({ createdAt: -1 });
    res.status(200).json({ data: resources });
  } catch (err) {
    next(err);
  }
});

resourceRouter.post("/", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ data: resource });
  } catch (err) {
    next(err);
  }
});
