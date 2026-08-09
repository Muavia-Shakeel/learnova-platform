import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { authenticator } from "otplib";
import type { RegisterInput, LoginInput } from "@learnova/shared-types";
import { User } from "../models/user.model";
import { RefreshToken } from "../models/refreshToken.model";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { ApiError } from "../middleware/errorHandler";

export async function register(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) throw new ApiError(409, "EMAIL_TAKEN", "Email already registered");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    email: input.email,
    passwordHash,
    fullName: input.fullName,
    role: input.role,
    whatsapp: input.whatsapp,
  });
  return issueTokens(user.id, user.role);
}

export async function login(input: LoginInput) {
  const user = await User.findOne({ email: input.email });
  if (!user) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");

  if (user.twoFactor?.enabled) {
    if (!input.totpCode) throw new ApiError(401, "TOTP_REQUIRED", "2FA code required");
    const valid2fa = authenticator.check(input.totpCode, user.twoFactor.secret!);
    if (!valid2fa) throw new ApiError(401, "INVALID_TOTP", "Invalid 2FA code");
  }

  return issueTokens(user.id, user.role);
}

export async function refresh(token: string) {
  const payload = verifyRefreshToken(token);
  const tokenHash = hashToken(token);
  const stored = await RefreshToken.findOne({ userId: payload.sub, tokenHash, revokedAt: null });
  if (!stored) throw new ApiError(401, "INVALID_REFRESH", "Refresh token not recognized");
  stored.revokedAt = new Date();
  await stored.save();
  return issueTokens(payload.sub, payload.role);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "USER_NOT_FOUND", "User not found");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new ApiError(401, "INVALID_CREDENTIALS", "Current password is incorrect");

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.mustChangePassword = false;
  await user.save();
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function issueTokens(userId: string, role: import("@learnova/shared-types").Role) {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId, role });
  await RefreshToken.create({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return { accessToken, refreshToken };
}
