"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  const selected = useMemo(
    () => patterns.find((p) => p.id === selectedId),
    [patterns, selectedId]
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

      <AnimatePresence initial={false} mode="wait">
        {selected && selected.description && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-1 rounded-sm border border-bronze/25 bg-bronze/[0.06] px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-serif text-sm text-bronze-light">{selected.name}</p>
                {selected.priceModifier > 0 && (
                  <span className="shrink-0 text-[11px] text-bronze/70">
                    +{formatRub(selected.priceModifier)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-warm/65">
                {selected.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
