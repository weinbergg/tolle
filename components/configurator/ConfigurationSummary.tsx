"use client";

import type { MirrorConfiguration } from "@/types/configurator";
import { finishes, getMaterial, sizes } from "@/data/configurator/materials";
import { getTemplate } from "@/data/configurator/templates";
import { getPattern } from "@/data/configurator/patterns";

interface ConfigurationSummaryProps {
  config: MirrorConfiguration;
}

const PENDANT_LABELS: Record<MirrorConfiguration["pendant"], string> = {
  ring: "Кольцо",
  "leather-cord": "Кожаный шнур",
  chain: "Цепочка",
};

const PACKAGING_LABELS: Record<MirrorConfiguration["packaging"], string> = {
  standard: "Стандартная",
  gift: "Подарочная",
};

export default function ConfigurationSummary({ config }: ConfigurationSummaryProps) {
  const size = sizes.find((s) => s.id === config.size);
  const material = getMaterial(config.materialId);
  const finish = finishes.find((f) => f.id === config.finish);
  const template = getTemplate(config.templateId);
  const center = getPattern(config.centerPatternId);
  const radial = getPattern(config.radialPatternId);
  const border = getPattern(config.borderPatternId);

  const rows: { label: string; value: string }[] = [
    { label: "Размер", value: size?.name ?? config.size },
    { label: "Материал", value: material.name },
    { label: "Обработка", value: finish?.name ?? config.finish },
    { label: "Композиция", value: template.name },
  ];

  if (template.supportsCenter) {
    rows.push({ label: "Центральный символ", value: center?.name ?? "Без символа" });
  }
  if (template.supportsRadial) {
    rows.push({ label: "Узор по кругу", value: radial?.name ?? "Не выбран" });
  }
  if (template.supportsBorder) {
    rows.push({ label: "Рамка", value: border?.name ?? "Не выбрана" });
  }
  if (template.supportsPetroglyphs) {
    const count = config.petroglyphs?.length ?? 0;
    rows.push({
      label: "Петроглифы",
      value: count > 0 ? `${count} шт.` : "Не размещены",
    });
  }
  rows.push({ label: "Подвес", value: PENDANT_LABELS[config.pendant] });
  if (config.engravingText?.trim()) {
    rows.push({ label: "Гравировка", value: `«${config.engravingText.trim()}»` });
  }
  rows.push({ label: "Упаковка", value: PACKAGING_LABELS[config.packaging] });

  return (
    <dl className="divide-y divide-bronze/10">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-4 py-3 text-sm">
          <dt className="text-warm/45">{row.label}</dt>
          <dd className="text-right text-warm/85">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
