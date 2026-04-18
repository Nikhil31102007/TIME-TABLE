"use client";

import dynamic from "next/dynamic";

const PlannerShell = dynamic(
  () =>
    import("@/components/planner/planner-shell").then(
      (module) => module.PlannerShell,
    ),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          <div className="h-[52svh] animate-pulse rounded-[36px] border border-white/8 bg-white/[0.03]" />
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="h-[28rem] animate-pulse rounded-[32px] border border-white/8 bg-white/[0.03]" />
            <div className="h-[28rem] animate-pulse rounded-[32px] border border-white/8 bg-white/[0.03]" />
          </div>
        </div>
      </main>
    ),
  },
);

export function PlannerEntry() {
  return <PlannerShell />;
}
