import { Router } from "express";
import { TutorApplicationSchema } from "@learnova/shared-types";
import * as careersService from "../services/careers.service";

export const careersRouter = Router();

careersRouter.post("/apply", async (req, res, next) => {
  try {
    const input = TutorApplicationSchema.parse(req.body);
    const application = await careersService.submitApplication(input);
    res.status(201).json({
      data: { id: application.id, status: application.status },
    });
  } catch (err) {
    next(err);
  }
});
