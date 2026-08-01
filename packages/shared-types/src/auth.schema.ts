import { z } from "zod";
import { RoleSchema } from "./role.schema";

export const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  fullName: z.string().min(1).max(120),
  role: RoleSchema.default("parent"),
  whatsapp: z.string().min(6).max(20).optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  totpCode: z.string().length(6).optional(),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const Enable2FASchema = z.object({
  totpCode: z.string().length(6),
});
export type Enable2FAInput = z.infer<typeof Enable2FASchema>;
