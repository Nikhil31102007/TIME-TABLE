"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { plannerData } from "@/lib/study-plan";

gsap.registerPlugin(ScrollTrigger);

const segmentDescriptions = [
  "Lock the four core subjects before the hackathon steals momentum.",
  "Protect the gap. No guilt, just lightweight recall and clean recovery.",
  "Convert notes into recall systems and start PYQs while memory is still fresh.",
  "Run mock pressure, then fix only what the errors expose.",
  "Walk in with compact cheat sheets and a low-chaos brain.",
];

export function PhaseTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline-segment",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const activeSegment = plannerData.timeline[activeIndex] ?? plannerData.timeline[0];

  return (
    <div ref={sectionRef} className="space-y-8">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[28px] border border-white/8 bg-black/20 p-3">
          <div className="flex h-16 overflow-hidden rounded-[22px]">
            {plannerData.timeline.map((segment, index) => (
              <button
                key={segment.label}
                className="timeline-segment relative flex min-w-0 flex-1 items-center justify-center border-r border-black/15 px-3 text-center last:border-r-0"
                onClick={() => setActiveIndex(index)}
                style={{
                  flex: segment.weight,
                  background:
                    index === activeIndex
                      ? "linear-gradient(180deg, rgba(245,158,11,0.28), rgba(255,255,255,0.06))"
                      : "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                }}
                type="button"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-primary)] sm:text-sm">
                  {segment.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Active segment
            </p>
            <CardTitle className="mt-3 text-2xl">{activeSegment.label}</CardTitle>
            <CardDescription className="mt-3 max-w-2xl">
              {segmentDescriptions[activeIndex]}
            </CardDescription>
          </Card>

          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Timeline slider
            </p>
            <input
              className="mt-5 w-full accent-[var(--accent)]"
              max={plannerData.timeline.length - 1}
              min={0}
              onChange={(event) => setActiveIndex(Number(event.target.value))}
              step={1}
              type="range"
              value={activeIndex}
            />
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Scrub through the plan to see how the workload shifts from coverage
              to compression to exam simulation.
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {plannerData.overviewCards.map((card, index) => (
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
    </div>
  );
}
