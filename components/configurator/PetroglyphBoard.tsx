"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MirrorConfiguration, PetroglyphPlacement } from "@/types/configurator";
import {
  PETROGLYPH_GROUPS,
  petroglyphs,
  type PetroglyphGroup,
} from "@/data/configurator/petroglyphs";
import { anchorPoints } from "@/data/configurator/petroglyphPoints";
import { getMaterial } from "@/data/configurator/materials";
import { cn } from "@/lib/utils";
import PetroglyphMark from "./PetroglyphMark";

const SIZE = 400;
const CENTER = SIZE / 2;
const FIELD = 150;

type Tool =
  | { kind: "glyph"; glyphId: string }
  | { kind: "image"; dataUrl: string }
  | { kind: "eraser" }
  | null;

interface PetroglyphBoardProps {
  config: MirrorConfiguration;
  onChange: <K extends keyof MirrorConfiguration>(
    key: K,
    value: MirrorConfiguration[K]
  ) => void;
}

/** Downscale an uploaded image to a square data URL for inline storage. */
function fileToDataUrl(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(max / img.width, max / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("no ctx"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function MiniGlyph({ glyphId, color }: { glyphId: string; color: string }) {
  const glyph = petroglyphs.find((p) => p.id === glyphId);
  if (!glyph) return null;
  return (
    <svg viewBox="0 0 100 100" className="h-10 w-10" aria-hidden="true">
      {glyph.shapes.map((s, i) =>
        s.filled ? (
          <path key={i} d={s.d} fill={color} />
        ) : (
          <path
            key={i}
            d={s.d}
            fill="none"
            stroke={color}
            strokeWidth={2.4 * (s.weight ?? 1)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      )}
    </svg>
  );
}

export default function PetroglyphBoard({ config, onChange }: PetroglyphBoardProps) {
  const material = getMaterial(config.materialId);
  const placements = useMemo(() => config.petroglyphs ?? [], [config.petroglyphs]);

  const [group, setGroup] = useState<PetroglyphGroup>("animals");
  const [tool, setTool] = useState<Tool>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const placementByPoint = useMemo(() => {
    const m = new Map<string, PetroglyphPlacement>();
    placements.forEach((p) => m.set(p.pointId, p));
    return m;
  }, [placements]);

  const update = (next: PetroglyphPlacement[]) => onChange("petroglyphs", next);

  const handlePoint = (pointId: string) => {
    if (!tool) return;
    if (tool.kind === "eraser") {
      update(placements.filter((p) => p.pointId !== pointId));
      return;
    }
    const placement: PetroglyphPlacement =
      tool.kind === "glyph"
        ? { pointId, glyphId: tool.glyphId }
        : { pointId, customImage: tool.dataUrl };
    update([...placements.filter((p) => p.pointId !== pointId), placement]);
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setTool({ kind: "image", dataUrl });
    } catch {
      /* ignore */
    }
  };

  const groupGlyphs = petroglyphs
    .filter((p) => p.group === group && (p.available ?? true))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const toolLabel =
    tool?.kind === "eraser"
      ? "Ластик — нажмите на точку, чтобы убрать символ"
      : tool?.kind === "image"
        ? "Своё изображение — нажмите на точку, чтобы разместить"
        : tool?.kind === "glyph"
          ? `${petroglyphs.find((p) => p.id === tool.glyphId)?.name ?? ""} — нажмите на точку`
          : "Выберите символ, затем нажмите на точку на зеркале";

  return (
    <div className="space-y-6">
      {/* Interactive enlarged mirror */}
      <div className="relative mx-auto w-full max-w-sm">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze/10 blur-[70px]"
          aria-hidden="true"
        />
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="relative w-full drop-shadow-2xl"
          role="group"
          aria-label="Интерактивное зеркало для размещения петроглифов"
        >
          <defs>
            <radialGradient id="pb-face" cx="0.38" cy="0.32" r="0.9">
              <stop offset="0%" stopColor={material.highlightColor} stopOpacity={0.9} />
              <stop offset="55%" stopColor={material.baseColor} />
              <stop offset="100%" stopColor={material.shadowColor} />
            </radialGradient>
            <linearGradient id="pb-bezel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={material.highlightColor} />
              <stop offset="50%" stopColor={material.baseColor} />
              <stop offset="100%" stopColor={material.shadowColor} />
            </linearGradient>
            <clipPath id="pb-clip">
              <circle cx={CENTER} cy={CENTER} r={FIELD} />
            </clipPath>
          </defs>

          <circle cx={CENTER} cy={CENTER} r={184} fill={`url(#pb-bezel)`} />
          <circle cx={CENTER} cy={CENTER} r={170} fill="none" stroke={`url(#pb-bezel)`} strokeWidth={14} />
          <circle cx={CENTER} cy={CENTER} r={FIELD} fill={`url(#pb-face)`} />

          <g clipPath="url(#pb-clip)">
            {/* placed marks */}
            <AnimatePresence>
              {anchorPoints.map((pt) => {
                const placement = placementByPoint.get(pt.id);
                if (!placement) return null;
                return (
                  <motion.g
                    key={`mark-${pt.id}`}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                  >
                    <PetroglyphMark
                      placement={placement}
                      point={pt}
                      engravingColor={material.engravingColor}
                      shadowColor={material.shadowColor}
                    />
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </g>

          {/* Interactive targets (above clip so they're always tappable).
              Empty slots are revealed only once a symbol/tool is chosen, so the
              mirror reads cleanly beforehand. Each marker pairs a dark halo with
              a light dashed ring + centre dot, so it stays visible on any metal
              (including silver/white). */}
          {anchorPoints.map((pt) => {
            const filled = placementByPoint.has(pt.id);
            const hit = Math.max(pt.size / 2, 20);
            const ringR = Math.min(pt.size / 2, 15);
            return (
              <g
                key={`pt-${pt.id}`}
                onClick={() => handlePoint(pt.id)}
                className={cn(tool ? "cursor-pointer" : "cursor-default")}
                role="button"
                aria-label={`Точка ${pt.id}${filled ? " (занята)" : ""}`}
              >
                <circle cx={pt.x} cy={pt.y} r={hit} fill="transparent" />
                {!filled && tool && (
                  <g style={{ pointerEvents: "none" }}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={ringR}
                      fill="rgba(0,0,0,0.20)"
                      stroke="rgba(0,0,0,0.55)"
                      strokeWidth={1.6}
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={ringR}
                      fill="none"
                      stroke="#F4E6C6"
                      strokeWidth={1.5}
                      strokeDasharray="3 3.5"
                    />
                    <circle cx={pt.x} cy={pt.y} r={1.9} fill="#F4E6C6" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-center text-xs text-warm/55">{toolLabel}</p>

      {/* Tool: groups */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {PETROGLYPH_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={cn(
                "rounded-sm border px-3 py-2 text-xs transition-colors",
                group === g.id
                  ? "border-bronze/50 bg-bronze/10 text-bronze-light"
                  : "border-warm/10 text-warm/55 hover:border-bronze/30"
              )}
            >
              {g.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={cn(
              "rounded-sm border px-3 py-2 text-xs transition-colors",
              tool?.kind === "image"
                ? "border-bronze/50 bg-bronze/10 text-bronze-light"
                : "border-warm/10 text-warm/55 hover:border-bronze/30"
            )}
          >
            Своё изображение
          </button>
          <button
            type="button"
            onClick={() => setTool({ kind: "eraser" })}
            className={cn(
              "rounded-sm border px-3 py-2 text-xs transition-colors",
              tool?.kind === "eraser"
                ? "border-burgundy/50 bg-burgundy/10 text-warm"
                : "border-warm/10 text-warm/55 hover:border-burgundy/40"
            )}
          >
            Ластик
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
      </div>

      {/* Glyph palette */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {groupGlyphs.map((glyph) => {
          const active = tool?.kind === "glyph" && tool.glyphId === glyph.id;
          return (
            <button
              key={glyph.id}
              type="button"
              onClick={() => setTool({ kind: "glyph", glyphId: glyph.id })}
              title={glyph.name}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-sm border p-1 transition-colors",
                active
                  ? "border-bronze/60 bg-bronze/10 text-bronze-light"
                  : "border-warm/10 text-warm/70 hover:border-bronze/30"
              )}
            >
              <MiniGlyph glyphId={glyph.id} color={active ? "#E8C98B" : "#C79A60"} />
              <span className="truncate text-[10px] leading-none text-warm/45">{glyph.name}</span>
            </button>
          );
        })}
      </div>

      {tool?.kind === "image" && (
        <div className="flex items-center gap-3 rounded-sm border border-bronze/20 bg-bronze/5 px-3 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tool.dataUrl} alt="Загруженное изображение" className="h-10 w-10 rounded-sm object-cover" />
          <span className="text-xs text-warm/60">
            Изображение готово — нажмите на точку, чтобы разместить его.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-bronze/10 pt-4">
        <span className="text-xs text-warm/45">
          Размещено символов: {placements.length}
        </span>
        {placements.length > 0 && (
          <button
            type="button"
            onClick={() => update([])}
            className="text-xs text-warm/55 underline-offset-4 hover:text-warm hover:underline"
          >
            Очистить всё
          </button>
        )}
      </div>
    </div>
  );
}
