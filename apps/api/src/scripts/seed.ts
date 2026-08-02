import "dotenv/config";
import mongoose from "mongoose";
import { PACKAGE_CREDITS, type PackageTier } from "@learnova/shared-types";
import { env } from "../config/env";
import { Subject } from "../models/subject.model";
import { Package } from "../models/package.model";

const SCHOOL_SUBJECTS = [
  "Mathematics",
  "English",
  "Biology",
  "Chemistry",
  "Physics",
  "Computer Science",
  "Economics",
  "Accounting",
  "Business",
  "Psychology",
  "History",
  "Geography",
];

const EXAM_PREP_SUBJECTS = [
  "IELTS",
  "TOEFL",
  "SAT",
  "ACT",
  "AP",
  "GCSE",
  "IGCSE",
  "A Levels",
  "IB",
  "NCEA",
  "Australian Curriculum",
  "Cambridge",
  "Edexcel",
];

const PACKAGE_PRICES_GBP: Record<PackageTier, number> = {
  starter: 89,
  silver: 169,
  gold: 319,
  diamond: 599,
};

async function seed() {
  await mongoose.connect(env.MONGO_URI);

  for (const name of SCHOOL_SUBJECTS) {
    await Subject.updateOne({ name, category: "school" }, { name, category: "school" }, { upsert: true });
  }
  for (const name of EXAM_PREP_SUBJECTS) {
    await Subject.updateOne({ name, category: "exam-prep" }, { name, category: "exam-prep" }, { upsert: true });
  }

  for (const tier of Object.keys(PACKAGE_CREDITS) as PackageTier[]) {
    await Package.updateOne(
      { tier },
      { tier, credits: PACKAGE_CREDITS[tier], priceGbp: PACKAGE_PRICES_GBP[tier] },
      { upsert: true },
    );
  }

  console.log(`Seeded ${SCHOOL_SUBJECTS.length + EXAM_PREP_SUBJECTS.length} subjects and ${Object.keys(PACKAGE_CREDITS).length} packages.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
