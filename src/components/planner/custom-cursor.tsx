"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );
  const [interactive, setInteractive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const smoothX = useSpring(x, { stiffness: 420, damping: 32, mass: 0.18 });
  const smoothY = useSpring(y, { stiffness: 420, damping: 32, mass: 0.18 });

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");

    const onChange = (event: MediaQueryListEvent) => {
      setEnabled(event.matches);
    };

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target as HTMLElement | null;
      const hoverTarget = target?.closest(
        "a,button,[data-cursor='accent'],[data-magnetic='true']",
      );
      setInteractive(Boolean(hoverTarget));
    };

    media.addEventListener("change", onChange);
    window.addEventListener("pointermove", onMove);

    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("pointermove", onMove);
    };
  }, [x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--text-primary)] mix-blend-difference md:block"
        style={{ x: smoothX, y: smoothY }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[119] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.08)] md:block"
        style={{
          x: smoothX,
          y: smoothY,
          width: interactive ? 68 : 34,
          height: interactive ? 68 : 34,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      />
    </>
  );
}
