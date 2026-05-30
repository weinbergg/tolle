"use client";

import type { MirrorConfiguration } from "@/types/configurator";
import { calculatePrice, formatRub } from "@/lib/configurator/calculatePrice";

interface PriceEstimateProps {
  config: MirrorConfiguration;
  detailed?: boolean;
}

export default function PriceEstimate({ config, detailed }: PriceEstimateProps) {
  const { lines, total } = calculatePrice(config);

  return (
    <div className="w-full">
      {detailed && (
        <dl className="mb-4 space-y-2 text-sm">
          {lines.map((line, i) => (
            <div key={i} className="flex justify-between gap-4 text-warm/55">
              <dt>{line.label}</dt>
              <dd className="shrink-0 tabular-nums">{formatRub(line.amount)}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-label">Ориентировочно</span>
        <span className="font-serif text-2xl text-bronze-light tabular-nums">
          {formatRub(total)}
        </span>
      </div>
    </div>
  );
}
