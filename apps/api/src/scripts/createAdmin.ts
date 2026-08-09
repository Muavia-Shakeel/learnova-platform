import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { User } from "../models/user.model";

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const fullName = process.argv[4] ?? "Admin";

  if (!email || !password) {
    console.error("Usage: tsx src/scripts/createAdmin.ts <email> <password> [fullName]");
    process.exit(1);
  }

  await mongoose.connect(env.MONGO_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    console.error(`User with email ${email} already exists (role: ${existing.role}).`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, passwordHash, fullName, role: "admin" });

  console.log(`Admin account created: ${email}`);
  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
