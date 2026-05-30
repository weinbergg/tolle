"use client";

import { cn } from "@/lib/utils";

export interface ConfiguratorStep {
  id: string;
  title: string;
}

interface StepNavigationProps {
  steps: ConfiguratorStep[];
  current: number;
  relevant: boolean[];
  onSelect: (index: number) => void;
}

export default function StepNavigation({
  steps,
  current,
  relevant,
  onSelect,
}: StepNavigationProps) {
  // Only show steps relevant to the chosen composition, renumbered sequentially
  // (so e.g. "Петроглифы" appears only for the free-scatter composition and the
  // center/border steps disappear for it — no confusing inapplicable options).
  const visible = steps
    .map((step, i) => ({ step, index: i }))
    .filter(({ index }) => relevant[index]);

  return (
    <nav aria-label="Шаги конструктора">
      <ol className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visible.map(({ step, index }, displayIdx) => {
          const active = index === current;
          return (
            <li key={step.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition-all duration-300",
                  active
                    ? "border-bronze/60 bg-bronze/15 text-bronze-light"
                    : "border-warm/10 text-warm/55 hover:border-warm/25 hover:text-warm/80"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                    active ? "bg-bronze/30 text-warm" : "bg-warm/5 text-warm/50"
                  )}
                >
                  {displayIdx + 1}
                </span>
                <span className="whitespace-nowrap">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
