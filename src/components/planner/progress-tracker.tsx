"use client";

import { motion } from "framer-motion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getSubjectStorageKey,
  getSubjectTone,
  plannerData,
  type SubjectMeta,
} from "@/lib/study-plan";
import { formatPercent } from "@/lib/utils";

function getCompletion(
  subject: SubjectMeta,
  unitState: Record<string, boolean>,
) {
  const completed = subject.units.filter((unit) =>
    unitState[getSubjectStorageKey(subject.id, unit)],
  ).length;

  return {
    completed,
    percent: (completed / subject.units.length) * 100,
  };
}

export function ProgressTracker({
  unitState,
  onToggleUnit,
}: {
  unitState: Record<string, boolean>;
  onToggleUnit: (key: string) => void;
}) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
            Unit Tracker
          </p>
          <CardTitle className="mt-4 text-3xl">Complete units, not vibes.</CardTitle>
        </div>
        <CardDescription className="max-w-xl">
          Toggle each unit as you finish it. Progress bars balance target hours,
          current completion, and scheduled load from the imported timetable.
        </CardDescription>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {plannerData.subjects.map((subject, index) => {
          const progress = getCompletion(subject, unitState);
          const scheduledHours = plannerData.scheduledMinutesBySubject.find(
            (item) => item.subject.id === subject.id,
          )?.scheduledHours;

          return (
            <motion.div
              key={subject.id}
              className="rounded-[26px] border border-white/8 bg-black/20 p-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.65,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -3, rotateX: 1.5 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${getSubjectTone(subject.id)}`}
                  >
                    {subject.name}
                  </span>
                  <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                    {subject.strapline}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl tracking-[-0.05em] text-[var(--text-primary)]">
                    {formatPercent(progress.percent)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    {progress.completed}/{subject.units.length} units
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Progress value={progress.percent} />
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  <span>{subject.targetHours}h target</span>
                  <span>{scheduledHours ?? 0}h scheduled</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {subject.units.map((unit) => {
                  const key = getSubjectStorageKey(subject.id, unit);
                  const checked = unitState[key] ?? false;

                  return (
                    <button
                      key={key}
                      className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] transition-all ${
                        checked
                          ? "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] text-[var(--accent)]"
                          : "border-white/8 bg-white/[0.03] text-[var(--muted)] hover:text-[var(--text-primary)]"
                      }`}
                      onClick={() => onToggleUnit(key)}
                      type="button"
                    >
                      {unit}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
