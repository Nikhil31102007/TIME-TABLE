"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { motion } from "framer-motion";
import { AlarmClockCheck, BrainCircuit, Flame, RefreshCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getTaskStorageKey, type PlannerDay } from "@/lib/study-plan";

const presets = [90, 60, 30];

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function ExecutionPanel({
  day,
  unitProgress,
  taskState,
  onToggleTask,
}: {
  day: PlannerDay;
  unitProgress: number;
  taskState: Record<string, boolean>;
  onToggleTask: (key: string) => void;
}) {
  const productiveBlocks = day.blocks.filter((block) => block.type !== "recovery");
  const completedCount = productiveBlocks.filter((block) => {
    const key = getTaskStorageKey(day.id, block.id);
    return taskState[key];
  }).length;

  const [preset, setPreset] = useState(90);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(90 * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const onTimerFinished = useEffectEvent(() => {
    setRunning(false);
    setSessionsCompleted((current) => current + 1);
  });

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          onTimerFinished();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  const suggestions: string[] = [];

  if (day.dayType === "light") {
    suggestions.push(
      "Keep tonight to one meaningful block. Coverage matters more than squeezing in extra noise.",
    );
  }

  if (productiveBlocks.length - completedCount > 2) {
    suggestions.push(
      "Backlog is growing. Protect one high-credit task and carry only a single remainder forward.",
    );
  }

  if (unitProgress < 35) {
    suggestions.push(
      "Unit completion is still early. Keep DSA, Chemistry, Mathematics, and BEEE ahead of the minor subjects.",
    );
  }

  if (!suggestions.length) {
    suggestions.push(
      "You are on pace. Stay with the current phase plan and use revision time for recall, not rereading.",
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
            Daily Execution
          </p>
          <CardTitle className="mt-4 text-3xl">Run the day, then log it.</CardTitle>
        </div>
        <CardDescription className="max-w-xl">
          The planner turns the selected schedule into a live checklist, timer, and
          recovery-aware guidance loop.
        </CardDescription>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="rounded-[26px] border border-white/8 bg-black/20 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Active day
                </p>
                <p className="mt-3 font-display text-3xl tracking-[-0.05em] text-[var(--text-primary)]">
                  {day.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {day.note || day.description || "Use this panel to keep the selected day moving."}
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-[var(--muted)]">
                {completedCount}/{productiveBlocks.length} complete
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {productiveBlocks.map((block) => {
                const taskKey = getTaskStorageKey(day.id, block.id);
                return (
                  <div
                    key={block.id}
                    className="flex items-start gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4"
                  >
                    <Checkbox
                      checked={taskState[taskKey] ?? false}
                      onCheckedChange={() => onToggleTask(taskKey)}
                    />
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                        {block.time}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">
                        {block.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[26px] border border-white/8 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Adaptive suggestions
                </p>
                <p className="mt-2 text-lg text-[var(--text-primary)]">
                  Respond to pressure without breaking the system.
                </p>
              </div>
              <div className="rounded-full bg-[rgba(245,158,11,0.12)] p-3 text-[var(--accent)]">
                <BrainCircuit className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${index}-${suggestion.slice(0, 12)}`}
                  className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-[var(--muted)]"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <motion.div
            className="rounded-[26px] border border-white/8 bg-black/20 p-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Session timer
                </p>
                <p className="mt-3 font-display text-5xl tracking-[-0.06em] text-[var(--text-primary)]">
                  {formatCountdown(secondsLeft)}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Use long focus blocks when energy is good, then step down to lighter revision.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-[var(--accent)]">
                <AlarmClockCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {presets.map((value) => (
                <button
                  key={value}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    preset === value
                      ? "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] text-[var(--accent)]"
                      : "border-white/8 bg-white/[0.03] text-[var(--muted)]"
                  }`}
                  onClick={() => {
                    setPreset(value);
                    setRunning(false);
                    setSecondsLeft(value * 60);
                  }}
                  type="button"
                >
                  {value} min
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm text-[var(--bg)] transition hover:-translate-y-0.5"
                onClick={() => setRunning((current) => !current)}
                type="button"
              >
                {running ? "Pause session" : "Start session"}
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-[var(--text-primary)] transition hover:border-white/20"
                onClick={() => {
                  setRunning(false);
                  setSecondsLeft(preset * 60);
                }}
                type="button"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Sessions done
                </p>
                <p className="mt-2 text-2xl text-[var(--text-primary)]">
                  {sessionsCompleted}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Completion streak
                </p>
                <p className="mt-2 flex items-center gap-2 text-2xl text-[var(--text-primary)]">
                  <Flame className="h-5 w-5 text-[var(--accent)]" />
                  {Math.max(completedCount, sessionsCompleted)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Card>
  );
}
