"use client";

import { useMemo, useState } from "react";
import type { Pattern } from "@/types/configurator";
import PatternThumb from "./PatternThumb";
import { formatRub } from "@/lib/configurator/calculatePrice";
import { getThemes, type CustomZone } from "@/data/configurator/themes";
import { cn } from "@/lib/utils";

interface PatternSelectorProps {
  patterns: Pattern[];
  selectedId?: string;
  allowNone?: boolean;
  noneLabel?: string;
  onSelect: (id: string | undefined) => void;
  disabled?: boolean;
  disabledHint?: string;
}

const ALL = "__all__";

export default function PatternSelector({
  patterns,
  selectedId,
  allowNone,
  noneLabel = "Без символа",
  onSelect,
  disabled,
  disabledHint,
}: PatternSelectorProps) {
  const zone = (patterns[0]?.category ?? "center") as CustomZone;

  // Themes that actually contain at least one of the supplied patterns.
  const themes = useMemo(() => {
    const used = new Set(patterns.map((p) => p.theme));
    return getThemes(zone).filter((t) => used.has(t.id));
  }, [patterns, zone]);

  const [activeTheme, setActiveTheme] = useState<string>(ALL);

  const visible = useMemo(
    () =>
      activeTheme === ALL
        ? patterns
        : patterns.filter((p) => p.theme === activeTheme),
    [patterns, activeTheme]
  );

  if (disabled) {
    return (
      <p className="rounded-sm border border-warm/10 bg-void/30 px-4 py-6 text-sm text-warm/40">
        {disabledHint ?? "Этот элемент не используется в выбранной композиции."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {themes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTheme(ALL)}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-xs transition-colors",
              activeTheme === ALL
                ? "border-bronze/50 bg-bronze/10 text-bronze-light"
                : "border-warm/10 text-warm/55 hover:border-bronze/30"
            )}
          >
            Все
          </button>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTheme(t.id)}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-xs transition-colors",
                activeTheme === t.id
                  ? "border-bronze/50 bg-bronze/10 text-bronze-light"
                  : "border-warm/10 text-warm/55 hover:border-bronze/30"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {allowNone && (
          <button
            type="button"
            onClick={() => onSelect(undefined)}
            aria-pressed={!selectedId}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-sm border p-3 transition-all duration-300",
              !selectedId
                ? "border-bronze/60 bg-bronze/10"
                : "border-warm/10 hover:border-warm/25"
            )}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-warm/10 text-xs text-warm/40">
              нет
            </span>
            <span className="text-xs text-warm/60">{noneLabel}</span>
          </button>
        )}

        {visible.map((pattern) => {
          const active = selectedId === pattern.id;
          return (
            <button
              key={pattern.id}
              type="button"
              onClick={() => onSelect(pattern.id)}
              aria-pressed={active}
              title={pattern.description}
              className={cn(
                "flex flex-col items-center gap-2 rounded-sm border p-3 text-center transition-all duration-300",
                active
                  ? "border-bronze/60 bg-bronze/10"
                  : "border-warm/10 hover:border-warm/25"
              )}
            >
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #1a1512, #0e0e0e 70%, #050505)",
                }}
              >
                <PatternThumb pattern={pattern} className="h-12 w-12" />
              </span>
              <span className="text-xs text-warm/70">{pattern.name}</span>
              {pattern.priceModifier > 0 && (
                <span className="text-[10px] text-bronze/60">
                  +{formatRub(pattern.priceModifier)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
