"use client";

import type { MirrorConfiguration } from "@/types/configurator";
import { getStones } from "@/data/configurator/stones";
import { formatRub } from "@/lib/configurator/calculatePrice";
import { cn } from "@/lib/utils";

interface StoneSelectorProps {
  config: MirrorConfiguration;
  onChange: <K extends keyof MirrorConfiguration>(
    key: K,
    value: MirrorConfiguration[K]
  ) => void;
}

function StoneSwatch({
  color,
  highlight,
  shadow,
}: {
  color: string;
  highlight: string;
  shadow: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
      <defs>
        <radialGradient id={`sw-${color}`} cx="0.4" cy="0.34" r="0.75">
          <stop offset="0%" stopColor={highlight} />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor={shadow} />
        </radialGradient>
      </defs>
      <circle cx={20} cy={20} r={15} fill={`url(#sw-${color})`} stroke={shadow} strokeWidth={1} />
      <circle cx={15} cy={14} r={3} fill="#fff" opacity={0.7} />
    </svg>
  );
}

export default function StoneSelector({ config, onChange }: StoneSelectorProps) {
  const stones = getStones();
  const selected = config.stoneId ?? "none";

  return (
    <div className="space-y-4">
      <p className="text-sm text-warm/55">
        Камень вставляется в центр обратной стороны зеркала. Эскиз развернётся и
        приблизит вставку, чтобы её можно было рассмотреть.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stones.map((stone) => {
          const active = selected === stone.id;
          return (
            <button
              key={stone.id}
              type="button"
              onClick={() => onChange("stoneId", stone.id)}
              aria-pressed={active}
              className={cn(
                "flex items-start gap-3 rounded-sm border px-4 py-3 text-left transition-all duration-300",
                active
                  ? "border-bronze/60 bg-bronze/10"
                  : "border-warm/10 hover:border-warm/25"
              )}
            >
              <StoneSwatch
                color={stone.color}
                highlight={stone.highlight}
                shadow={stone.shadow}
              />
              <span className="min-w-0">
                <span className="block text-sm text-warm/85">{stone.name}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-warm/45">
                  {stone.description}
                </span>
                {stone.priceModifier > 0 && (
                  <span className="mt-1 block text-xs text-bronze/70">
                    +{formatRub(stone.priceModifier)}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
