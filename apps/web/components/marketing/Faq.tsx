"use client";

import { useState } from "react";
import { FadeIn } from "./FadeIn";

const ITEMS = [
  {
    q: "How does a lesson credit work?",
    a: "1 credit equals 1 hour. Lessons can be booked in flexible lengths — half-hour, 90 minutes, whatever fits — and credits deduct proportionally.",
  },
  {
    q: "Do credits expire?",
    a: "No. Buy a package once and use the hours whenever you're ready — there's no clock running against you.",
  },
  {
    q: "Which curricula do you cover?",
    a: "Cambridge, Edexcel, IB, GCSE, IGCSE, A Levels, NCEA, the Australian Curriculum, and full exam prep for IELTS, TOEFL, SAT, ACT, and AP.",
  },
  {
    q: "What timezone are lessons scheduled in?",
    a: "Your child's local timezone by default. If that's not set, we fall back to UK time — and everyone always sees times converted correctly on their own calendar.",
  },
  {
    q: "How are tutors vetted?",
    a: "Every tutor submits a CV, degree certificate, and a demo lesson before they're approved to teach on Learnova.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-beige py-24">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <h2 className="font-display text-4xl font-bold text-deep-blue">Questions, answered</h2>
        </FadeIn>

        <div className="mt-10 divide-y divide-deep-blue/10 rounded-2xl bg-off-white">
          {ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="px-6">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-medium text-deep-blue">{item.q}</span>
                  <span
                    className={`shrink-0 text-xl text-sage-green transition-transform ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && <p className="pb-5 text-sm text-deep-blue/70">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
