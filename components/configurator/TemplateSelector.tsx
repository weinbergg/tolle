"use client";

import type { MirrorConfiguration } from "@/types/configurator";
import { templates } from "@/data/configurator/templates";
import { formatRub } from "@/lib/configurator/calculatePrice";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  config: MirrorConfiguration;
  onChange: (templateId: string) => void;
}

function TemplateGlyph({ id }: { id: string }) {
  const dot = (cx: number, cy: number, r = 6) => (
    <circle cx={cx} cy={cy} r={r} fill="currentColor" />
  );
  const ring = (
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
  );
  const radial = (count: number) =>
    Array.from({ length: count }, (_, i) => {
      const a = ((i * 360) / count - 90) * (Math.PI / 180);
      return dot(50 + 28 * Math.cos(a), 50 + 28 * Math.sin(a), 4);
    });

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-10 text-bronze-light/70" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {id === "center-single" && dot(50, 50, 9)}
      {id === "center-with-border" && (
        <>
          {ring}
          {dot(50, 50, 8)}
        </>
      )}
      {id === "radial-6" && radial(6)}
      {id === "radial-8" && radial(8)}
      {id === "center-plus-radial-6" && (
        <>
          {dot(50, 50, 7)}
          {radial(6)}
        </>
      )}
      {id === "center-plus-radial-plus-border" && (
        <>
          {ring}
          {dot(50, 50, 7)}
          {radial(8)}
        </>
      )}
    </svg>
  );
}

export default function TemplateSelector({ config, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onChange(template.id)}
          aria-pressed={config.templateId === template.id}
          className={cn(
            "flex items-start gap-4 rounded-sm border p-4 text-left transition-all duration-300",
            config.templateId === template.id
              ? "border-bronze/60 bg-bronze/10"
              : "border-warm/10 hover:border-warm/25"
          )}
        >
          <TemplateGlyph id={template.id} />
          <span className="min-w-0">
            <span className="block text-sm text-warm/85">{template.name}</span>
            <span className="block text-xs leading-relaxed text-warm/45">
              {template.description}
            </span>
            {template.priceModifier > 0 && (
              <span className="mt-1 block text-xs text-bronze/70">
                +{formatRub(template.priceModifier)}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
