"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { plannerMeta, type SectionId } from "@/lib/study-plan";
import { cn } from "@/lib/utils";

export function SectionNav() {
  const [active, setActive] = useState<SectionId>("overview");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const sections = plannerMeta.sections
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visible?.target.id) {
          startTransition(() => setActive(visible.target.id as SectionId));
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      className="sticky top-4 z-50 mt-6 flex justify-center"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-[rgba(10,10,10,0.78)] px-3 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        {plannerMeta.sections.map((item) => (
          <button
            key={item.id}
            className={cn(
              "rounded-full px-4 py-2.5 text-sm transition-colors",
              active === item.id
                ? "bg-white text-[var(--bg)]"
                : "text-[var(--muted)] hover:text-[var(--text-primary)]",
            )}
            onClick={() =>
              document
                .getElementById(item.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
