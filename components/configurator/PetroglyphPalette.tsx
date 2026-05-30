"use client";

import { useMemo, useRef, useState } from "react";
import type { MirrorConfiguration, PetroglyphTool } from "@/types/configurator";
import {
  PETROGLYPH_GROUPS,
  petroglyphs,
  type PetroglyphGroup,
} from "@/data/configurator/petroglyphs";
import { cn } from "@/lib/utils";

interface PetroglyphPaletteProps {
  config: MirrorConfiguration;
  onChange: <K extends keyof MirrorConfiguration>(
    key: K,
    value: MirrorConfiguration[K]
  ) => void;
  tool: PetroglyphTool;
  setTool: (tool: PetroglyphTool) => void;
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
  if (glyph.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={glyph.image}
        alt={glyph.name}
        className="h-10 w-10 object-contain"
      />
    );
  }
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

export default function PetroglyphPalette({
  config,
  onChange,
  tool,
  setTool,
}: PetroglyphPaletteProps) {
  const placements = useMemo(() => config.petroglyphs ?? [], [config.petroglyphs]);
  const [group, setGroup] = useState<PetroglyphGroup>("animals");
  const fileRef = useRef<HTMLInputElement>(null);

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
      ? "Ластик активен — нажмите на занятую точку на зеркале, чтобы убрать символ."
      : tool?.kind === "image"
        ? "Изображение готово — нажмите на кружок на зеркале, чтобы разместить его."
        : tool?.kind === "glyph"
          ? `${petroglyphs.find((p) => p.id === tool.glyphId)?.name ?? ""} — нажмите на кружок на зеркале.`
          : "Выберите символ ниже — на зеркале появятся точки для размещения.";

  return (
    <div className="space-y-5">
      <p className="rounded-sm border border-bronze/20 bg-bronze/5 px-3 py-2 text-xs leading-relaxed text-warm/65">
        {toolLabel}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
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
            onClick={() => setTool(tool?.kind === "eraser" ? null : { kind: "eraser" })}
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

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {groupGlyphs.map((glyph) => {
          const active = tool?.kind === "glyph" && tool.glyphId === glyph.id;
          return (
            <button
              key={glyph.id}
              type="button"
              onClick={() =>
                setTool(active ? null : { kind: "glyph", glyphId: glyph.id })
              }
              title={glyph.name}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-sm border p-1 transition-colors",
                active
                  ? "border-bronze/60 bg-bronze/10 text-bronze-light"
                  : "border-warm/10 text-warm/70 hover:border-bronze/30"
              )}
            >
              <MiniGlyph glyphId={glyph.id} color={active ? "#E8C98B" : "#C79A60"} />
              <span className="truncate text-[10px] leading-none text-warm/45">
                {glyph.name}
              </span>
            </button>
          );
        })}
      </div>

      {tool?.kind === "image" && (
        <div className="flex items-center gap-3 rounded-sm border border-bronze/20 bg-bronze/5 px-3 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tool.dataUrl}
            alt="Загруженное изображение"
            className="h-10 w-10 rounded-sm object-cover"
          />
          <span className="text-xs text-warm/60">
            Изображение готово — нажмите на кружок на зеркале.
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
            onClick={() => onChange("petroglyphs", [])}
            className="text-xs text-warm/55 underline-offset-4 hover:text-warm hover:underline"
          >
            Очистить всё
          </button>
        )}
      </div>
    </div>
  );
}
