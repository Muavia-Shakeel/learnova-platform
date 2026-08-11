"use client";

import { useEffect, useState } from "react";
import {
  useMyTutorProfile,
  useUpdateAvailability,
  type WeeklySlot,
} from "../../../../features/tutor/useAvailability";
import { useMyCalendar, useMarkLessonComplete } from "../../../../features/tutor/useMyCalendar";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatLessonTime(startUtc: string) {
  return new Date(startUtc).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TutorCalendarPage() {
  const { data: profile } = useMyTutorProfile();
  const updateAvailability = useUpdateAvailability();
  const { data: lessons, isLoading: lessonsLoading } = useMyCalendar();
  const markComplete = useMarkLessonComplete();

  const [timezone, setTimezone] = useState("Europe/London");
  const [slots, setSlots] = useState<WeeklySlot[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setTimezone(profile.timezone);
      setSlots(profile.weeklyAvailability);
    }
  }, [profile]);

  function addSlot() {
    const startMinute = timeToMinutes(startTime);
    const endMinute = timeToMinutes(endTime);
    if (endMinute <= startMinute) return;
    setSlots((prev) => [...prev, { dayOfWeek, startMinute, endMinute }]);
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveAvailability() {
    setSaved(false);
    await updateAvailability.mutateAsync({ timezone, weeklyAvailability: slots });
    setSaved(true);
  }

  const upcoming = lessons?.filter((l) => l.status === "booked" || l.status === "rescheduled" || l.status === "ad-hoc");
  const completed = lessons?.filter((l) => l.status === "completed");

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-deep-blue">Your weekly availability</h1>
        <p className="mt-1 text-sm text-deep-blue/80">
          Students can only book lessons inside these hours. Times are in your own timezone.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
            Timezone
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="Europe/London"
              className="rounded-md border border-soft-blue px-3 py-2 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
            Day
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="rounded-md border border-soft-blue px-3 py-2 font-normal"
            >
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
            From
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-md border border-soft-blue px-3 py-2 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-deep-blue">
            To
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-md border border-soft-blue px-3 py-2 font-normal"
            />
          </label>
          <button
            type="button"
            onClick={addSlot}
            className="rounded-md border-2 border-deep-blue px-4 py-2 text-sm font-semibold text-deep-blue"
          >
            Add slot
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {slots.length === 0 && <p className="text-sm text-deep-blue/70">No availability set yet.</p>}
          {slots.map((slot, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-deep-blue/10 bg-white px-4 py-2 text-sm">
              <span className="font-medium text-deep-blue">{DAYS[slot.dayOfWeek]}</span>
              <span className="text-deep-blue/70">
                {minutesToTime(slot.startMinute)} – {minutesToTime(slot.endMinute)}
              </span>
              <button type="button" onClick={() => removeSlot(i)} className="ml-auto text-xs text-red-600 underline">
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={saveAvailability}
          disabled={updateAvailability.isPending}
          className="mt-4 rounded-md bg-sage-green px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {updateAvailability.isPending ? "Saving..." : "Save availability"}
        </button>
        {saved && <p className="mt-2 text-sm text-sage-green">Availability saved.</p>}
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-deep-blue">Upcoming lessons</h2>
        {lessonsLoading && <p className="mt-2 text-sm text-deep-blue/70">Loading...</p>}
        {upcoming?.length === 0 && <p className="mt-2 text-sm text-deep-blue/70">No upcoming lessons.</p>}
        <div className="mt-3 flex flex-col gap-2">
          {upcoming?.map((lesson) => (
            <div
              key={lesson._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-deep-blue/10 bg-white p-4 text-sm"
            >
              <div>
                <p className="font-medium text-deep-blue">{lesson.subjectId?.name}</p>
                <p className="text-deep-blue/70">
                  {lesson.studentId?.fullName} · {formatLessonTime(lesson.startUtc)} · {lesson.durationHours}h
                </p>
                {lesson.zoomJoinUrl && (
                  <a href={lesson.zoomJoinUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sage-green underline">
                    Join video call
                  </a>
                )}
              </div>
              <button
                onClick={() => markComplete.mutate(lesson._id)}
                disabled={markComplete.isPending}
                className="rounded-md border-2 border-deep-blue px-3 py-1.5 text-xs font-semibold text-deep-blue disabled:opacity-60"
              >
                Mark completed
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-deep-blue">Completed lessons</h2>
        {completed?.length === 0 && <p className="mt-2 text-sm text-deep-blue/70">None yet.</p>}
        <div className="mt-3 flex flex-col gap-2">
          {completed?.map((lesson) => (
            <div key={lesson._id} className="rounded-lg border border-deep-blue/10 bg-beige/30 p-4 text-sm">
              <p className="font-medium text-deep-blue">{lesson.subjectId?.name}</p>
              <p className="text-deep-blue/70">
                {lesson.studentId?.fullName} · {formatLessonTime(lesson.startUtc)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
