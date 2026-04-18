"use client";

import { motion } from "framer-motion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { plannerData, plannerMeta } from "@/lib/study-plan";
import { formatPercent } from "@/lib/utils";

export function FallbackSection({
  unitProgress,
  taskProgress,
}: {
  unitProgress: number;
  taskProgress: number;
}) {
  return (
    <section id="fallback" className="scroll-mt-28 px-5 pb-24 pt-20 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              Fallback and Finish
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,4vw,4rem)] tracking-[-0.05em] text-[var(--text-primary)]">
              Protect momentum when real life hits.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            These fallbacks are built from the imported timetable itself, so the UI
            can shift from ideal mode into recovery mode without becoming generic or noisy.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {plannerData.fallbackCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.65,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Card
                className={`h-full p-6 ${
                  card.tone === "danger"
                    ? "border-[rgba(245,158,11,0.22)]"
                    : card.tone === "warning"
                      ? "border-[rgba(37,99,235,0.22)]"
                      : ""
                }`}
              >
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

        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-white/8 bg-black/25 p-6 lg:border-b-0 lg:border-r">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                Completion Summary
              </p>
              <CardTitle className="mt-4 text-3xl">
                Stay calm. Finish clean.
              </CardTitle>
              <CardDescription className="mt-3 max-w-lg">
                Exams start on {plannerMeta.examStartDate}. The goal is not a flashy
                finish, it is a composed one.
              </CardDescription>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Unit progress
                </p>
                <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">
                  {formatPercent(unitProgress)}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Task progress
                </p>
                <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">
                  {formatPercent(taskProgress)}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Effective days
                </p>
                <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">
                  {plannerData.totalStudyDays}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
