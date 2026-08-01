import { Router } from "express";
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from "@learnova/shared-types";
import * as authService from "../services/auth.service";

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
