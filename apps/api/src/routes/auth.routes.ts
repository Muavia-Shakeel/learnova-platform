import { Router } from "express";
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from "@learnova/shared-types";
import * as authService from "../services/auth.service";
import { requireAuth } from "../middleware/auth";
import { User } from "../models/user.model";
import { ApiError } from "../middleware/errorHandler";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const input = RegisterSchema.parse(req.body);
    const tokens = await authService.register(input);
    res.status(201).json({ data: tokens });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const input = LoginSchema.parse(req.body);
    const tokens = await authService.login(input);
    res.status(200).json({ data: tokens });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const input = RefreshTokenSchema.parse(req.body);
    const tokens = await authService.refresh(input.refreshToken);
    res.status(200).json({ data: tokens });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.id).select("email fullName role whatsapp");
    if (!user) throw new ApiError(404, "USER_NOT_FOUND", "User not found");
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
});
