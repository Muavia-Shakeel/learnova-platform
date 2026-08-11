import { DateTime } from "luxon";
import { resend, EMAIL_FROM } from "../lib/resend";
import { logger } from "../config/logger";
import { env } from "../config/env";
import { User } from "../models/user.model";

async function send(to: string | string[], subject: string, html: string) {
  try {
    await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
  } catch (err) {
    logger.error({ err, to, subject }, "Failed to send email");
  }
}

function formatUtc(date: Date) {
  return DateTime.fromJSDate(date).toUTC().toFormat("ccc, dd LLL yyyy 'at' HH:mm 'UTC'");
}

export async function sendApplicationReceivedEmail(to: string, fullName: string) {
  await send(
    to,
    "Learnova — application received",
    `<p>Hi ${fullName},</p>
     <p>We've received your tutor application. Our team will review your CV, degree, and demo video and get back to you soon.</p>
     <p>If you're approved, we'll email you login details.</p>
     <p>— Learnova</p>`,
  );
}

export async function sendNewApplicationAdminAlert(applicantName: string, applicantEmail: string) {
  const admins = await User.find({ role: "admin" }).select("email");
  const adminEmails = admins.map((a) => a.email);
  if (adminEmails.length === 0) return;

  await send(
    adminEmails,
    "New tutor application on Learnova",
    `<p>${applicantName} (${applicantEmail}) just submitted a tutor application.</p>
     <p>Review it in the admin dashboard under Applications.</p>`,
  );
}

export async function sendApplicationApprovedEmail(to: string, fullName: string, tempPassword: string) {
  await send(
    to,
    "You're approved to teach on Learnova",
    `<p>Hi ${fullName},</p>
     <p>Your tutor application has been approved. Log in with:</p>
     <p>Email: ${to}<br />Temporary password: <strong>${tempPassword}</strong></p>
     <p>You'll be asked to set a new password the first time you log in.</p>
     <p><a href="${env.CORS_ORIGIN}/login">Log in to Learnova</a></p>
     <p>— Learnova</p>`,
  );
}

export async function sendApplicationRejectedEmail(to: string, fullName: string, reason?: string) {
  await send(
    to,
    "Update on your Learnova application",
    `<p>Hi ${fullName},</p>
     <p>Thanks for applying to teach on Learnova. We're not able to move forward with your application at this time.</p>
     ${reason ? `<p>${reason}</p>` : ""}
     <p>— Learnova</p>`,
  );
}

interface LessonEmailParams {
  studentName: string;
  tutorName: string;
  subjectName: string;
  startUtc: Date;
  durationHours: number;
  joinUrl: string;
}

export async function sendLessonScheduledEmail(to: string | string[], p: LessonEmailParams) {
  await send(
    to,
    `Lesson scheduled — ${p.subjectName} on ${formatUtc(p.startUtc)}`,
    `<p>A lesson has been scheduled:</p>
     <p><strong>${p.studentName}</strong> with <strong>${p.tutorName}</strong> — ${p.subjectName}<br />
     ${formatUtc(p.startUtc)} · ${p.durationHours}h</p>
     <p><a href="${p.joinUrl}">Join the video call</a></p>
     <p>— Learnova</p>`,
  );
}

export async function sendLessonRescheduledEmail(to: string | string[], p: LessonEmailParams) {
  await send(
    to,
    `Lesson rescheduled — ${p.subjectName}`,
    `<p>This lesson was moved to a new time:</p>
     <p><strong>${p.studentName}</strong> with <strong>${p.tutorName}</strong> — ${p.subjectName}<br />
     New time: ${formatUtc(p.startUtc)} · ${p.durationHours}h</p>
     <p><a href="${p.joinUrl}">Join the video call</a></p>
     <p>— Learnova</p>`,
  );
}

export async function sendLessonCancelledEmail(to: string | string[], p: Omit<LessonEmailParams, "joinUrl">) {
  await send(
    to,
    `Lesson cancelled — ${p.subjectName}`,
    `<p>This lesson has been cancelled:</p>
     <p><strong>${p.studentName}</strong> with <strong>${p.tutorName}</strong> — ${p.subjectName}<br />
     Was scheduled: ${formatUtc(p.startUtc)}</p>
     <p>— Learnova</p>`,
  );
}

export async function sendDemoScheduledEmail(to: string | string[], p: { leadName: string; tutorName: string; startUtc: Date; joinUrl: string }) {
  await send(
    to,
    `Your free demo lesson is scheduled — ${formatUtc(p.startUtc)}`,
    `<p>Hi ${p.leadName},</p>
     <p>Your free demo lesson with <strong>${p.tutorName}</strong> is scheduled for:</p>
     <p>${formatUtc(p.startUtc)}</p>
     <p><a href="${p.joinUrl}">Join the video call</a></p>
     <p>— Learnova</p>`,
  );
}
