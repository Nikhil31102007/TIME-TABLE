"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayCard } from "@/components/planner/day-card";
import { getSubjectTone, type PlannerPhase } from "@/lib/study-plan";

export function TimetableSection({
  phase,
  activeDayId,
  taskState,
  onFocusDay,
  onToggleTask,
}: {
  phase: PlannerPhase;
  activeDayId: string;
  taskState: Record<string, boolean>;
  onFocusDay: (dayId: string) => void;
  onToggleTask: (taskKey: string) => void;
}) {
  const weeks = Array.from(new Set(phase.entries.map((entry) => entry.week)));
  const initialWeek = weeks[0] ?? "";
  const [selectedWeek, setSelectedWeek] = useState(initialWeek);
  const [openId, setOpenId] = useState(
    phase.entries.find((entry) => entry.kind === "day")?.id ?? phase.entries[0]?.id ?? "",
  );

  const filteredEntries = phase.entries.filter((entry) => entry.week === selectedWeek);
  const resolvedOpenId = filteredEntries.some((entry) => entry.id === openId)
    ? openId
    : filteredEntries[0]?.id ?? "";
  const studyDays = phase.entries.filter((entry) => entry.kind === "day");
  const productiveHours = Math.round(
    studyDays.reduce((total, entry) => total + entry.productiveMinutes, 0) / 60,
  );
  const focusSubjects = Array.from(
    new Map(
      studyDays
        .flatMap((entry) => entry.focusSubjects)
        .map((subject) => [subject.id, subject]),
    ).values(),
  );

  return (
    <section id={phase.anchor} className="scroll-mt-28 px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              {phase.eyebrow}
            </p>
            <CardTitle className="mt-4 text-3xl">{phase.label}</CardTitle>
            <CardDescription className="mt-3">{phase.description}</CardDescription>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Active range
                </p>
                <p className="mt-2 text-lg text-[var(--text-primary)]">{phase.range}</p>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Study days
                </p>
                <p className="mt-2 text-lg text-[var(--text-primary)]">{studyDays.length}</p>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Productive hours
                </p>
                <p className="mt-2 text-lg text-[var(--text-primary)]">{productiveHours}h</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Primary subjects
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {focusSubjects.map((subject) => (
                  <span
                    key={subject.id}
                    className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${getSubjectTone(subject.id)}`}
                  >
                    {subject.name}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tabs value={selectedWeek} onValueChange={setSelectedWeek}>
            {weeks.length > 1 ? (
              <TabsList className="mb-6 w-full justify-start overflow-x-auto rounded-[24px]">
                {weeks.map((week) => (
                  <TabsTrigger key={week} className="min-w-max" value={week}>
                    {week}
                  </TabsTrigger>
                ))}
              </TabsList>
            ) : null}

            {weeks.map((week) => (
              <TabsContent key={week} value={week} className="space-y-5">
                {filteredEntries
                  .filter((entry) => entry.week === week)
                  .map((entry) => (
                    <DayCard
                      key={entry.id}
                      day={entry}
                      open={resolvedOpenId === entry.id}
                      selected={activeDayId === entry.id}
                      taskState={taskState}
                      onFocusDay={() => onFocusDay(entry.id)}
                      onOpenChange={(next) => {
                        setOpenId(next ? entry.id : "");
                        if (next) {
                          onFocusDay(entry.id);
                        }
                      }}
                      onToggleTask={onToggleTask}
                    />
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
