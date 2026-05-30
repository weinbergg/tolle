"use client";

import type { MirrorConfiguration } from "@/types/configurator";
import {
  PACKAGING_PRICES,
  PENDANT_PRICES,
  formatRub,
} from "@/lib/configurator/calculatePrice";
import { cn } from "@/lib/utils";

interface AddonSelectorProps {
  config: MirrorConfiguration;
  onChange: <K extends keyof MirrorConfiguration>(
    key: K,
    value: MirrorConfiguration[K]
  ) => void;
}

const ENGRAVING_LIMIT = 40;

const pendants: { id: MirrorConfiguration["pendant"]; name: string }[] = [
  { id: "ring", name: "Кольцо" },
  { id: "leather-cord", name: "Кожаный шнур" },
  { id: "chain", name: "Цепочка" },
];

const packagingOptions: { id: MirrorConfiguration["packaging"]; name: string; desc: string }[] = [
  { id: "standard", name: "Стандартная", desc: "Текстильный мешочек и карточка символики" },
  { id: "gift", name: "Подарочная", desc: "Жёсткая коробка и премиальная комплектация" },
];

export default function AddonSelector({ config, onChange }: AddonSelectorProps) {
  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="text-label mb-4 text-bronze-light/80">Подвес</legend>
        <div className="grid grid-cols-3 gap-3">
          {pendants.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange("pendant", p.id)}
              aria-pressed={config.pendant === p.id}
              className={cn(
                "rounded-sm border px-3 py-4 text-center transition-all duration-300",
                config.pendant === p.id
                  ? "border-bronze/60 bg-bronze/15 text-bronze-light"
                  : "border-warm/10 text-warm/55 hover:border-warm/25 hover:text-warm/80"
              )}
            >
              <span className="block text-sm">{p.name}</span>
              {PENDANT_PRICES[p.id] > 0 && (
                <span className="mt-1 block text-xs text-bronze/70">
                  +{formatRub(PENDANT_PRICES[p.id])}
                </span>
              )}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="engraving" className="text-label mb-3 block text-bronze-light/80">
          Гравировка на обороте
        </label>
        <input
          id="engraving"
          type="text"
          maxLength={ENGRAVING_LIMIT}
          value={config.engravingText ?? ""}
          onChange={(e) => onChange("engravingText", e.target.value)}
          placeholder="Инициалы, дата или короткая надпись"
          className="w-full rounded-sm border border-warm/10 bg-void/50 px-4 py-3 text-warm transition-colors duration-300 placeholder:text-warm/20 focus:border-bronze/40 focus:outline-none"
        />
        <div className="mt-2 flex justify-between text-xs text-warm/35">
          <span>Необязательно</span>
          <span>
            {(config.engravingText ?? "").length}/{ENGRAVING_LIMIT}
          </span>
        </div>
      </div>

      <fieldset>
        <legend className="text-label mb-4 text-bronze-light/80">Упаковка</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {packagingOptions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange("packaging", p.id)}
              aria-pressed={config.packaging === p.id}
              className={cn(
                "rounded-sm border px-4 py-4 text-left transition-all duration-300",
                config.packaging === p.id
                  ? "border-bronze/60 bg-bronze/10"
                  : "border-warm/10 hover:border-warm/25"
              )}
            >
              <span className="block text-sm text-warm/85">{p.name}</span>
              <span className="mt-1 block text-xs text-warm/45">{p.desc}</span>
              {PACKAGING_PRICES[p.id] > 0 && (
                <span className="mt-1 block text-xs text-bronze/70">
                  +{formatRub(PACKAGING_PRICES[p.id])}
                </span>
              )}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="addon-comment" className="text-label mb-3 block text-bronze-light/80">
          Комментарий мастеру
        </label>
        <textarea
          id="addon-comment"
          rows={3}
          value={config.comment ?? ""}
          onChange={(e) => onChange("comment", e.target.value)}
          placeholder="Пожелания по композиции, символике или исполнению"
          className="w-full resize-none rounded-sm border border-warm/10 bg-void/50 px-4 py-3 text-warm transition-colors duration-300 placeholder:text-warm/20 focus:border-bronze/40 focus:outline-none"
        />
      </div>
    </div>
  );
}
