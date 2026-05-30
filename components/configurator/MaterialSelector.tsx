"use client";

import type { MirrorConfiguration } from "@/types/configurator";
import { finishes, materials, sizes } from "@/data/configurator/materials";
import { formatRub } from "@/lib/configurator/calculatePrice";
import { cn } from "@/lib/utils";

interface MaterialSelectorProps {
  config: MirrorConfiguration;
  onChange: <K extends keyof MirrorConfiguration>(
    key: K,
    value: MirrorConfiguration[K]
  ) => void;
}

export default function MaterialSelector({ config, onChange }: MaterialSelectorProps) {
  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="text-label mb-4 text-bronze-light/80">Размер</legend>
        <div className="grid grid-cols-3 gap-3">
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => onChange("size", size.id)}
              aria-pressed={config.size === size.id}
              className={cn(
                "rounded-sm border px-3 py-4 text-center transition-all duration-300",
                config.size === size.id
                  ? "border-bronze/60 bg-bronze/15 text-bronze-light"
                  : "border-warm/10 text-warm/55 hover:border-warm/25 hover:text-warm/80"
              )}
            >
              <span className="block font-serif text-lg">{size.name}</span>
              <span className="mt-1 block text-xs text-warm/40">{size.description}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-label mb-4 text-bronze-light/80">Материал</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {materials.map((material) => (
            <button
              key={material.id}
              type="button"
              onClick={() => onChange("materialId", material.id)}
              aria-pressed={config.materialId === material.id}
              className={cn(
                "flex items-center gap-4 rounded-sm border p-3 text-left transition-all duration-300",
                config.materialId === material.id
                  ? "border-bronze/60 bg-bronze/10"
                  : "border-warm/10 hover:border-warm/25"
              )}
            >
              <span
                className="h-10 w-10 shrink-0 rounded-full ring-1 ring-black/40"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${material.highlightColor}, ${material.baseColor} 55%, ${material.shadowColor})`,
                }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-sm text-warm/85">{material.name}</span>
                <span className="block truncate text-xs text-warm/40">
                  {material.description}
                </span>
                {material.priceModifier > 0 && (
                  <span className="text-xs text-bronze/70">
                    +{formatRub(material.priceModifier)}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-label mb-4 text-bronze-light/80">Обработка</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {finishes.map((finish) => (
            <button
              key={finish.id}
              type="button"
              onClick={() => onChange("finish", finish.id)}
              aria-pressed={config.finish === finish.id}
              className={cn(
                "rounded-sm border px-3 py-4 text-left transition-all duration-300",
                config.finish === finish.id
                  ? "border-bronze/60 bg-bronze/15 text-bronze-light"
                  : "border-warm/10 text-warm/55 hover:border-warm/25 hover:text-warm/80"
              )}
            >
              <span className="block text-sm">{finish.name}</span>
              <span className="mt-1 block text-xs text-warm/40">{finish.description}</span>
              {finish.priceModifier > 0 && (
                <span className="mt-1 block text-xs text-bronze/70">
                  +{formatRub(finish.priceModifier)}
                </span>
              )}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
