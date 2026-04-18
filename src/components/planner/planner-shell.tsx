"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { AnalyticsPanel } from "@/components/planner/analytics-panel";
import { ExecutionPanel } from "@/components/planner/execution-panel";
import { FallbackSection } from "@/components/planner/fallback-section";
import { HeroSection } from "@/components/planner/hero-section";
import { ProgressTracker } from "@/components/planner/progress-tracker";
import { SectionNav } from "@/components/planner/section-nav";
import { TimetableSection } from "@/components/planner/timetable-section";
import { Card } from "@/components/ui/card";
import {
  getSubjectStorageKey,
  getTaskStorageKey,
  plannerData,
} from "@/lib/study-plan";
import { usePersistedMap } from "@/hooks/use-persisted-map";

const StrategySection = dynamic(
  () =>
    import("@/components/planner/strategy-section").then(
      (module) => module.StrategySection,
    ),
  {
    loading: () => <Card className="mx-5 h-80 animate-pulse sm:mx-8" />,
  },
);

export function PlannerShell() {
  const unitStore = usePersistedMap("adaptive-study-planner:units");
  const taskStore = usePersistedMap("adaptive-study-planner:tasks");
  const [selectedDayId, setSelectedDayId] = useState(plannerData.nextStudyDay.id);

  const selectedDay =
    plannerData.allStudyDays.find((day) => day.id === selectedDayId) ??
    plannerData.nextStudyDay;

  const totalUnits = plannerData.subjects.reduce(
    (count, subject) => count + subject.units.length,
    0,
  );
  const completedUnits = plannerData.subjects.reduce((count, subject) => {
    return (
      count +
      subject.units.filter((unit) =>
        unitStore.state[getSubjectStorageKey(subject.id, unit)],
      ).length
    );
  }, 0);
  const unitProgress = totalUnits ? (completedUnits / totalUnits) * 100 : 0;

  const totalTasks = plannerData.allStudyDays.reduce((count, day) => {
    return count + day.blocks.filter((block) => block.type !== "recovery").length;
  }, 0);
  const completedTasks = plannerData.allStudyDays.reduce((count, day) => {
    return (
      count +
      day.blocks.filter(
        (block) =>
          block.type !== "recovery" &&
          taskStore.state[getTaskStorageKey(day.id, block.id)],
      ).length
    );
  }, 0);
  const taskProgress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <LenisProvider>
      <div className="relative overflow-x-clip pb-10">
        <HeroSection />
        <SectionNav />

        <section className="px-5 pb-8 pt-14 sm:px-8">
          <div className="mx-auto max-w-7xl space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProgressTracker
                onToggleUnit={unitStore.toggle}
                unitState={unitStore.state}
              />
            </motion.div>
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <ExecutionPanel
                day={selectedDay}
                taskState={taskStore.state}
                unitProgress={unitProgress}
                onToggleTask={taskStore.toggle}
              />
              <AnalyticsPanel
                taskState={taskStore.state}
                unitState={unitStore.state}
              />
            </div>
          </div>
        </section>

        {plannerData.phases.map((phase) => (
          <TimetableSection
            key={phase.id}
            activeDayId={selectedDay.id}
            phase={phase}
            taskState={taskStore.state}
            onFocusDay={setSelectedDayId}
            onToggleTask={taskStore.toggle}
          />
        ))}

        <StrategySection />
        <FallbackSection taskProgress={taskProgress} unitProgress={unitProgress} />
      </div>
    </LenisProvider>
  );
}
