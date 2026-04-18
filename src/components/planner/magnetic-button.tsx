"use client";

import { type ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";

interface MagneticButtonProps extends ButtonProps {
  children: ReactNode;
}

export function MagneticButton({
  children,
  className,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 260, damping: 16 });
  const smoothY = useSpring(y, { stiffness: 260, damping: 16 });

  return (
    <motion.div
      className="inline-flex"
      data-magnetic="true"
      onMouseMove={(event) => {
        const element = ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const nextX = event.clientX - (rect.left + rect.width / 2);
        const nextY = event.clientY - (rect.top + rect.height / 2);
        x.set(nextX * 0.18);
        y.set(nextY * 0.18);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: smoothX, y: smoothY }}
    >
      <Button ref={ref} className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
