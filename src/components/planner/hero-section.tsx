"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowRight, CalendarRange, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/planner/magnetic-button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { plannerData, plannerMeta } from "@/lib/study-plan";

gsap.registerPlugin(ScrollTrigger);

const ambientNodes = [
  { left: "8%", top: "18%", size: 140 },
  { left: "22%", top: "74%", size: 80 },
  { left: "48%", top: "28%", size: 180 },
  { left: "76%", top: "16%", size: 120 },
  { left: "84%", top: "68%", size: 160 },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const copy = copyRef.current;
    const panel = panelRef.current;

    if (!section || !title || !copy || !panel) {
      return;
    }

    const split = new SplitType(title, {
      types: "lines,words",
      lineClass: "hero-line",
      wordClass: "hero-word",
    });

    const ctx = gsap.context(() => {
      gsap.from(split.words, {
        yPercent: 120,
        opacity: 0,
        duration: 1.15,
        stagger: 0.045,
        ease: "power4.out",
      });

      gsap.from(copy.children, {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.3,
      });

      gsap.to(copy, {
        y: -56,
        opacity: 0.45,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(panel, {
        y: -92,
        scale: 0.92,
        rotateX: 8,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => {
      split.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative min-h-[130svh] scroll-mt-28 overflow-hidden px-5 pb-12 pt-8 sm:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_42%),radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.08),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.18),rgba(13,13,13,0.9)_45%,rgba(13,13,13,1))]" />
      {ambientNodes.map((node, index) => (
        <motion.span
          key={`${node.left}-${node.top}`}
          className="absolute rounded-full border border-white/6 bg-white/[0.03] blur-3xl"
          initial={{ opacity: 0.18, scale: 0.85 }}
          animate={{
            opacity: [0.16, 0.24, 0.16],
            scale: [0.9, 1.06, 0.92],
          }}
          transition={{
            duration: 9 + index,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: node.left,
            top: node.top,
            width: node.size,
            height: node.size,
          }}
        />
      ))}

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div ref={copyRef} className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Adaptive Study Planner
          </div>

          <div className="space-y-5">
            <p className="max-w-xl text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
              Premium dark interface for a constrained 19-day prep window
            </p>
            <h1
              ref={titleRef}
              className="max-w-4xl font-display text-[clamp(3.2rem,8vw,7rem)] font-medium leading-[0.92] tracking-[-0.06em] text-[var(--text-primary)]"
            >
              Turn a tight exam runway into a precise, calm execution system.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              Start on{" "}
              <span className="text-[var(--text-primary)]">
                {plannerMeta.planStartDate}
              </span>
              , protect the{" "}
              <span className="text-[var(--text-primary)]">
                {plannerMeta.hackathonRange}
              </span>{" "}
              gap, and aim for{" "}
              <span className="text-[var(--text-primary)]">
                {plannerMeta.targetScore}
              </span>{" "}
              with a phase-based rhythm built around real energy limits.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <MagneticButton
              variant="accent"
              size="lg"
              onClick={() =>
                document
                  .getElementById("phase-1")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Enter the planner
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              size="lg"
              onClick={() =>
                document
                  .getElementById("strategy")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              See the strategy
            </MagneticButton>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {plannerData.overviewStats.slice(0, 3).map((stat) => (
              <Card
                key={stat.label}
                className="border-white/8 bg-white/[0.03] p-5 shadow-none"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  {stat.label}
                </p>
                <p className="mt-3 font-display text-4xl tracking-[-0.06em] text-[var(--text-primary)]">
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div ref={panelRef} className="lg:justify-self-end">
          <Card className="relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.16),transparent_34%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Exam runway
                  </p>
                  <CardTitle className="mt-2 text-2xl">
                    {plannerMeta.examStartDate}
                  </CardTitle>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.05] p-3 text-[var(--accent)]">
                  <CalendarRange className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Active objective
                </p>
                <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--text-primary)]">
                  SGPA {plannerMeta.sgpa}
                </p>
                <CardDescription className="mt-3 max-w-md">
                  The planner is weighted toward DSA, Chemistry, Mathematics, and
                  BEEE before the hackathon break, then compresses revision into
                  mock-driven recovery.
                </CardDescription>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-white/8 bg-black/20 p-5 shadow-none">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[rgba(37,99,235,0.14)] p-2 text-[#8ab2ff]">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        Goal state
                      </p>
                      <p className="mt-1 text-base text-[var(--text-primary)]">
                        {plannerMeta.targetScore}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="border-white/8 bg-black/20 p-5 shadow-none">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Total blocks scheduled
                  </p>
                  <p className="mt-3 font-display text-3xl tracking-[-0.05em] text-[var(--text-primary)]">
                    {plannerData.totalBlocks}
                  </p>
                </Card>
              </div>

              <div className="space-y-4 rounded-[24px] border border-white/8 bg-black/20 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  <span>Priority stack</span>
                  <span>{plannerData.totalTargetHours}h total target</span>
                </div>
                <div className="space-y-3">
                  {plannerData.subjectHours.slice(0, 4).map((subject) => (
                    <div key={subject.subject}>
                      <div className="mb-2 flex items-center justify-between text-sm text-[var(--text-primary)]">
                        <span>{subject.subject}</span>
                        <span className="text-[var(--muted)]">{subject.hoursLabel}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(37,99,235,0.92),rgba(245,158,11,0.88))]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${subject.progressPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
