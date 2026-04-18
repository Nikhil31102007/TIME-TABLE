"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookCopy,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardList,
  Coffee,
  FlaskConical,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  getDayTone,
  getSubjectTone,
  getTaskStorageKey,
  type PlannerBlock,
  type PlannerDay,
} from "@/lib/study-plan";
import { cn } from "@/lib/utils";

function getBlockIcon(block: PlannerBlock) {
  switch (block.type) {
    case "mock":
      return FlaskConical;
    case "revision":
      return ClipboardList;
    case "recovery":
      return Coffee;
    case "logistics":
    case "admin":
      return BriefcaseBusiness;
    default:
      return BookCopy;
  }
}

export function DayCard({
  day,
  open,
  selected,
  taskState,
  onOpenChange,
  onFocusDay,
  onToggleTask,
}: {
  day: PlannerDay;
  open: boolean;
  selected: boolean;
  taskState: Record<string, boolean>;
  onOpenChange: (next: boolean) => void;
  onFocusDay: () => void;
  onToggleTask: (taskKey: string) => void;
}) {
  const productiveBlocks = day.blocks.filter((block) => block.type !== "recovery");
  const completedBlocks = productiveBlocks.filter((block) => {
    const key = getTaskStorageKey(day.id, block.id);
    return taskState[key];
  }).length;
  const tone = getDayTone(day.dayType);

  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange}>
      <motion.div
        layout
        whileHover={{ y: -4, rotateX: 1.8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card
          className={cn(
            "relative overflow-hidden border-white/10 bg-white/[0.03] transition-colors",
            selected && "border-[rgba(245,158,11,0.35)] bg-white/[0.05]",
          )}
        >
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-100",
              tone.glow,
            )}
          />
          <div className="relative p-5 sm:p-6">
            <Collapsible.Trigger asChild>
              <button
                className="flex w-full flex-col gap-4 text-left"
                onClick={onFocusDay}
                type="button"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em]",
                          tone.tone,
                        )}
                      >
                        {day.badge}
                      </span>
                      {selected ? (
                        <span className="rounded-full bg-[rgba(245,158,11,0.14)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                          Active day
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <p className="font-display text-2xl tracking-[-0.04em] text-[var(--text-primary)]">
                        {day.title}
                      </p>
                      {day.subtitle ? (
                        <p className="mt-1 text-sm text-[var(--muted)]">{day.subtitle}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        Progress
                      </p>
                      <p className="mt-2 text-base text-[var(--text-primary)]">
                        {completedBlocks}/{productiveBlocks.length} blocks
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-[var(--muted)]">
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          open && "rotate-180 text-[var(--text-primary)]",
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {day.focusSubjects.map((subject) => (
                    <span
                      key={subject.id}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em]",
                        getSubjectTone(subject.id),
                      )}
                    >
                      {subject.short}
                    </span>
                  ))}
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    {Math.round(day.productiveMinutes / 60)}h workload
                  </span>
                </div>

                {day.note ? (
                  <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
                    {day.note}
                  </p>
                ) : null}
                {!day.note && day.description ? (
                  <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
                    {day.description}
                  </p>
                ) : null}
              </button>
            </Collapsible.Trigger>

            <AnimatePresence initial={false}>
              {open ? (
                <Collapsible.Content forceMount asChild>
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 space-y-3 border-t border-white/8 pt-6">
                      {day.blocks.length ? (
                        day.blocks.map((block) => {
                          const Icon = getBlockIcon(block);
                          const taskKey = getTaskStorageKey(day.id, block.id);
                          const canToggle = block.type !== "recovery";

                          return (
                            <div
                              key={block.id}
                              className={cn(
                                "grid gap-4 rounded-[24px] border border-white/8 bg-black/20 px-4 py-4 sm:grid-cols-[140px_1fr_auto] sm:items-start",
                                block.type === "recovery" && "border-white/6 bg-white/[0.02]",
                              )}
                            >
                              <p className="text-sm text-[var(--muted)]">{block.time}</p>
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 rounded-full border border-white/8 bg-white/[0.04] p-2 text-[var(--muted)]">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm leading-6 text-[var(--text-primary)]">
                                      {block.text}
                                    </p>
                                    {block.subjects.length ? (
                                      <div className="flex flex-wrap gap-2">
                                        {block.subjects.map((subject) => (
                                          <span
                                            key={`${block.id}-${subject.id}`}
                                            className={cn(
                                              "rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]",
                                              getSubjectTone(subject.id),
                                            )}
                                          >
                                            {subject.name}
                                          </span>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              {canToggle ? (
                                <div className="flex items-center justify-end pt-1">
                                  <Checkbox
                                    checked={taskState[taskKey] ?? false}
                                    onCheckedChange={() => onToggleTask(taskKey)}
                                  />
                                </div>
                              ) : null}
                            </div>
                          );
                        })
                      ) : (
                        <p className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-5 text-sm leading-6 text-[var(--muted)]">
                          {day.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Collapsible.Content>
              ) : null}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </Collapsible.Root>
  );
}
