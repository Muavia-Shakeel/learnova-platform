import { z } from "zod";

export const RoleSchema = z.enum(["student", "parent", "tutor", "admin"]);
export type Role = z.infer<typeof RoleSchema>;
