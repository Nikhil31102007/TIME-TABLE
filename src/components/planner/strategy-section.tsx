"use client";

import { motion } from "framer-motion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PhaseTimeline } from "@/components/planner/phase-timeline";
import { getSubjectTone, plannerData } from "@/lib/study-plan";

export function StrategySection() {
  return (
    <section id="strategy" className="scroll-mt-28 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              Strategy View
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,4vw,4rem)] tracking-[-0.05em] text-[var(--text-primary)]">
              See the phase logic, then act inside it.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            This section makes the macro plan visible: the pre-hackathon push, the
            recovery window, the revision compression, and the final mock-pressure taper.
          </p>
        </div>

        <PhaseTimeline />

        <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {plannerData.strategyCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Card className="h-full p-5">
                  <CardTitle>{card.title}</CardTitle>
                  <div className="mt-4 space-y-3">
                    {card.items.map((item) => (
                      <p key={item} className="text-sm leading-6 text-[var(--muted)]">
                        {item}
                      </p>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              Subject Tactics
            </p>
            <CardTitle className="mt-4 text-3xl">
              Play each paper differently.
            </CardTitle>
            <CardDescription className="mt-3">
              The timetable is global, but scoring moves are local to each subject.
            </CardDescription>

            <div className="mt-6 space-y-4">
              {plannerData.subjectInsights.map((item) => (
                <div
                  key={item.subject.id}
                  className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4"
                >
                  <span
                    className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${getSubjectTone(
                      item.subject.id,
                    )}`}
                  >
                    {item.subject.name}
                  </span>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
