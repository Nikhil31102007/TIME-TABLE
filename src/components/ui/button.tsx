"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[rgba(245,158,11,0.32)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--text-primary)] px-5 py-3 text-[var(--bg)] shadow-[0_16px_48px_rgba(245,245,245,0.12)] hover:-translate-y-0.5 hover:bg-white",
        ghost:
          "border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[var(--text-primary)] hover:border-white/20 hover:bg-white/[0.08]",
        accent:
          "bg-[var(--accent)] px-5 py-3 text-[var(--bg)] shadow-[0_16px_48px_rgba(245,158,11,0.2)] hover:-translate-y-0.5 hover:bg-[#ffb63c]",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
