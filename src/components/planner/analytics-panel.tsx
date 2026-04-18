"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  getSubjectStorageKey,
  getTaskStorageKey,
  plannerData,
  type SubjectMeta,
} from "@/lib/study-plan";
import { clamp, formatPercent } from "@/lib/utils";

function getSubjectPercent(
  subject: SubjectMeta,
  unitState: Record<string, boolean>,
) {
  const complete = subject.units.filter((unit) =>
    unitState[getSubjectStorageKey(subject.id, unit)],
  ).length;
  return (complete / subject.units.length) * 100;
}

export function AnalyticsPanel({
  unitState,
  taskState,
}: {
  unitState: Record<string, boolean>;
  taskState: Record<string, boolean>;
}) {
  const totalUnits = plannerData.subjects.reduce(
    (count, subject) => count + subject.units.length,
    0,
  );
  const completedUnits = plannerData.subjects.reduce((count, subject) => {
    return (
      count +
      subject.units.filter((unit) => unitState[getSubjectStorageKey(subject.id, unit)])
        .length
    );
  }, 0);

  const totalTaskCount = plannerData.allStudyDays.reduce((count, day) => {
    return count + day.blocks.filter((block) => block.type !== "recovery").length;
  }, 0);

  const completedTaskCount = plannerData.allStudyDays.reduce((count, day) => {
    const finished = day.blocks.filter((block) => {
      if (block.type === "recovery") return false;
      return taskState[getTaskStorageKey(day.id, block.id)];
    }).length;
    return count + finished;
  }, 0);

  const unitCompletion = totalUnits ? (completedUnits / totalUnits) * 100 : 0;
  const taskCompletion = totalTaskCount
    ? (completedTaskCount / totalTaskCount) * 100
    : 0;
  const remainingHours = Math.max(
    plannerData.totalTargetHours * (1 - unitCompletion / 100),
    0,
  );
  const projectedScore = clamp(
    Math.round(24 + unitCompletion * 0.22 + taskCompletion * 0.16),
    0,
    50,
  );

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
            Performance Analytics
          </p>
          <CardTitle className="mt-4 text-3xl">Feedback that stays actionable.</CardTitle>
        </div>
        <CardDescription className="max-w-xl">
          The estimates below are heuristic, but they keep the system honest about
          coverage, execution consistency, and remaining load.
        </CardDescription>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Unit completion
          </p>
          <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">
            {formatPercent(unitCompletion)}
          </p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Execution completion
          </p>
          <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">
            {formatPercent(taskCompletion)}
          </p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Projected score
          </p>
          <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">
            {projectedScore}/50
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[26px] border border-white/8 bg-black/20 p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Study distribution
              </p>
              <p className="mt-2 text-lg text-[var(--text-primary)]">
                Scheduled hours versus current completion
              </p>
            </div>
            <p className="text-sm text-[var(--muted)]">
              {remainingHours.toFixed(1)}h remaining
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {plannerData.scheduledMinutesBySubject.map(({ subject, scheduledHours }) => {
              const percent = getSubjectPercent(subject, unitState);
              const width = Math.max((scheduledHours / plannerData.totalTargetHours) * 100, 8);

              return (
                <div key={subject.id}>
                  <div className="mb-2 flex items-center justify-between text-sm text-[var(--text-primary)]">
                    <span>{subject.name}</span>
                    <span className="text-[var(--muted)]">
                      {scheduledHours}h scheduled • {formatPercent(percent)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(37,99,235,0.88),rgba(245,158,11,0.78))]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[26px] border border-white/8 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Subject strength
          </p>
          <div className="mt-5 space-y-3">
            {plannerData.subjects.map((subject) => {
              const percent = getSubjectPercent(subject, unitState);
              return (
                <div
                  key={subject.id}
                  className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-[var(--text-primary)]">
                      {subject.name}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      {formatPercent(percent)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {subject.strapline}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
