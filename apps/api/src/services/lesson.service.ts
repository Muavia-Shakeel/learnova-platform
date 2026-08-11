import { DateTime } from "luxon";
import type { CreateLessonInput, RescheduleLessonInput } from "@learnova/shared-types";
import { Lesson } from "../models/lesson.model";
import { TutorProfile } from "../models/tutorProfile.model";
import { StudentProfile } from "../models/studentProfile.model";
import { User } from "../models/user.model";
import { Subject } from "../models/subject.model";
import { ApiError } from "../middleware/errorHandler";
import { deductCredits, refundCredits } from "./wallet.service";
import * as emailService from "./email.service";

function jitsiLink(lessonId: string) {
  return `https://meet.jit.si/learnova-${lessonId}`;
}

interface NotifiableLesson {
  studentId: unknown;
  tutorId: unknown;
  subjectId: unknown;
  startUtc: Date;
  durationHours: number;
  zoomJoinUrl?: string | null;
}

async function notifyLessonParties(lesson: NotifiableLesson, kind: "scheduled" | "rescheduled" | "cancelled") {
  const [student, tutor, subject] = await Promise.all([
    StudentProfile.findById(lesson.studentId),
    User.findById(lesson.tutorId),
    Subject.findById(lesson.subjectId),
  ]);
  if (!student || !tutor || !subject) return;
  const parent = await User.findById(student.parentId);

  const recipients = [parent?.email, tutor.email].filter(Boolean) as string[];
  if (recipients.length === 0) return;

  const params = {
    studentName: student.fullName,
    tutorName: tutor.fullName,
    subjectName: subject.name,
    startUtc: lesson.startUtc,
    durationHours: lesson.durationHours,
    joinUrl: lesson.zoomJoinUrl ?? "",
  };

  if (kind === "scheduled") await emailService.sendLessonScheduledEmail(recipients, params);
  else if (kind === "rescheduled") await emailService.sendLessonRescheduledEmail(recipients, params);
  else await emailService.sendLessonCancelledEmail(recipients, params);
}

async function assertWithinAvailability(tutorId: string, startUtc: DateTime, durationHours: number) {
  const tutor = await TutorProfile.findOne({ userId: tutorId });
  if (!tutor) throw new ApiError(404, "TUTOR_NOT_FOUND", "Tutor profile not found");

  const local = startUtc.setZone(tutor.timezone);
  const endLocal = local.plus({ hours: durationHours });
  const dayOfWeek = local.weekday % 7;
  const startMinute = local.hour * 60 + local.minute;
  const endMinute = startMinute + durationHours * 60;

  const fits = tutor.weeklyAvailability.some(
    (slot) => slot.dayOfWeek === dayOfWeek && startMinute >= slot.startMinute && endMinute <= slot.endMinute,
  );
  if (!fits) {
    throw new ApiError(409, "OUTSIDE_AVAILABILITY", "Requested time is outside tutor's published availability");
  }

  const overlap = await Lesson.findOne({
    tutorId,
    status: { $in: ["booked", "rescheduled", "ad-hoc"] },
    startUtc: { $lt: endLocal.toUTC().toJSDate() },
    $expr: {
      $gt: [{ $add: ["$startUtc", { $multiply: ["$durationHours", 60 * 60 * 1000] }] }, startUtc.toJSDate()],
    },
  });
  if (overlap) throw new ApiError(409, "SLOT_TAKEN", "This slot overlaps an existing lesson");
}

export async function bookLesson(input: CreateLessonInput) {
  const startUtc = DateTime.fromISO(input.startUtc, { zone: "utc" });
  await assertWithinAvailability(input.tutorId, startUtc, input.durationHours);

  const student = await StudentProfile.findById(input.studentId);
  if (!student) throw new ApiError(404, "STUDENT_NOT_FOUND", "Student profile not found");

  const lesson = await Lesson.create({
    studentId: input.studentId,
    tutorId: input.tutorId,
    subjectId: input.subjectId,
    startUtc: startUtc.toJSDate(),
    durationHours: input.durationHours,
    status: "booked",
    creditsDeducted: input.durationHours,
  });

  try {
    await deductCredits(student.parentId.toString(), input.durationHours, lesson.id);
  } catch (err) {
    await lesson.deleteOne();
    throw err;
  }

  lesson.zoomJoinUrl = jitsiLink(lesson.id);
  await lesson.save();
  await notifyLessonParties(lesson, "scheduled");
  return lesson;
}

export async function createAdHocLesson(input: CreateLessonInput) {
  const startUtc = DateTime.fromISO(input.startUtc, { zone: "utc" });
  const student = await StudentProfile.findById(input.studentId);
  if (!student) throw new ApiError(404, "STUDENT_NOT_FOUND", "Student profile not found");

  const lesson = await Lesson.create({
    studentId: input.studentId,
    tutorId: input.tutorId,
    subjectId: input.subjectId,
    startUtc: startUtc.toJSDate(),
    durationHours: input.durationHours,
    status: "ad-hoc",
    createdByTutor: true,
  });

  lesson.zoomJoinUrl = jitsiLink(lesson.id);
  await lesson.save();
  await notifyLessonParties(lesson, "scheduled");
  return lesson;
}

export async function cancelLesson(lessonId: string) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new ApiError(404, "LESSON_NOT_FOUND", "Lesson not found");

  lesson.status = "cancelled";
  await lesson.save();

  if (lesson.creditsDeducted > 0) {
    const student = await StudentProfile.findById(lesson.studentId);
    if (student) await refundCredits(student.parentId.toString(), lesson.creditsDeducted, lesson.id);
  }
  await notifyLessonParties(lesson, "cancelled");
  return lesson;
}

export async function rescheduleLesson(input: RescheduleLessonInput) {
  const lesson = await Lesson.findById(input.lessonId);
  if (!lesson) throw new ApiError(404, "LESSON_NOT_FOUND", "Lesson not found");

  const newStart = DateTime.fromISO(input.newStartUtc, { zone: "utc" });
  await assertWithinAvailability(lesson.tutorId.toString(), newStart, lesson.durationHours);

  lesson.startUtc = newStart.toJSDate();
  lesson.status = "rescheduled";
  await lesson.save();
  await notifyLessonParties(lesson, "rescheduled");
  return lesson;
}

export async function markCompleted(lessonId: string) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new ApiError(404, "LESSON_NOT_FOUND", "Lesson not found");
  lesson.status = "completed";
  await lesson.save();
  return lesson;
}
