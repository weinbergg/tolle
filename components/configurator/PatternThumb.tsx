"use client";

import type { Pattern } from "@/types/configurator";

interface PatternThumbProps {
  pattern: Pattern;
  color?: string;
  className?: string;
}

/** Compact preview of a single motif on a neutral swatch. */
export default function PatternThumb({
  pattern,
  color = "#D8C7A3",
  className,
}: PatternThumbProps) {
  const isBorder = pattern.category === "border";

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isBorder ? (
        <>
          <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="2" />
          {(pattern.rings ?? [1]).map((frac, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={38 * frac * 0.82 + 4}
              fill="none"
              stroke={color}
              strokeWidth="1.4"
              opacity={0.8}
            />
          ))}
          {Array.from({ length: Math.min(pattern.tileRepeat ?? 16, 24) }, (_, i) => {
            const angle = (i * 360) / Math.min(pattern.tileRepeat ?? 16, 24);
            return (
              <g
                key={i}
                transform={`rotate(${angle} 50 50) translate(50 12) scale(0.3) translate(-50 -50)`}
              >
                {pattern.shapes.map((s, j) =>
                  s.filled ? (
                    <path key={j} d={s.d} fill={color} />
                  ) : (
                    <path
                      key={j}
                      d={s.d}
                      fill="none"
                      stroke={color}
                      strokeWidth={2 * (s.weight ?? 1)}
                      strokeLinecap="round"
                    />
                  )
                )}
              </g>
            );
          })}
        </>
      ) : (
        <g transform="translate(50 50) scale(0.78) translate(-50 -50)">
          {pattern.shapes.map((s, j) =>
            s.filled ? (
              <path key={j} d={s.d} fill={color} />
            ) : (
              <path
                key={j}
                d={s.d}
                fill="none"
                stroke={color}
                strokeWidth={2.2 * (s.weight ?? 1)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )
          )}
        </g>
      )}
    </svg>
  );
}
