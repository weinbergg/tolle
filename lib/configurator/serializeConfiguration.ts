import type { MirrorConfiguration } from "@/types/configurator";
import { finishes, getMaterial, sizes } from "@/data/configurator/materials";
import { getTemplate } from "@/data/configurator/templates";
import { getPattern } from "@/data/configurator/patterns";
import { getPetroglyph } from "@/data/configurator/petroglyphs";
import { getStone } from "@/data/configurator/stones";
import { calculatePrice, formatRub } from "./calculatePrice";

export const defaultConfiguration: MirrorConfiguration = {
  size: "55",
  materialId: "bronze-dark",
  finish: "polished",
  templateId: "center-with-border",
  centerPatternId: "sun-wheel",
  radialPatternId: undefined,
  borderPatternId: "border-geometric-01",
  stoneId: "none",
  pendant: "leather-cord",
  engravingText: "",
  packaging: "standard",
  comment: "",
};

const PENDANT_LABELS: Record<MirrorConfiguration["pendant"], string> = {
  ring: "Кольцо",
  "leather-cord": "Кожаный шнур",
  chain: "Цепочка",
};

const PACKAGING_LABELS: Record<MirrorConfiguration["packaging"], string> = {
  standard: "Стандартная",
  gift: "Подарочная",
};

/** Human-readable multi-line summary for the order request. */
export function buildReadableSummary(config: MirrorConfiguration): string {
  const size = sizes.find((s) => s.id === config.size);
  const material = getMaterial(config.materialId);
  const finish = finishes.find((f) => f.id === config.finish);
  const template = getTemplate(config.templateId);
  const center = getPattern(config.centerPatternId);
  const radial = getPattern(config.radialPatternId);
  const border = getPattern(config.borderPatternId);
  const price = calculatePrice(config);

  const rows: string[] = [
    "Эскиз зеркала Толе",
    `• Размер: ${size?.name ?? config.size}`,
    `• Материал: ${material.name}`,
    `• Покрытие: ${finish?.name ?? config.finish}`,
    `• Композиция: ${template.name}`,
  ];

  if (template.supportsCenter) {
    rows.push(`• Центральный символ: ${center?.name ?? "без символа"}`);
  }
  if (template.supportsRadial) {
    rows.push(`• Узор по кругу: ${radial?.name ?? "не выбран"}`);
  }
  if (template.supportsBorder) {
    rows.push(`• Рамка: ${border?.name ?? "не выбрана"}`);
  }
  if (template.supportsPetroglyphs) {
    const placements = config.petroglyphs ?? [];
    if (placements.length === 0) {
      rows.push("• Петроглифы: не размещены");
    } else {
      rows.push(`• Петроглифы (${placements.length}):`);
      placements.forEach((p) => {
        const label = p.customImage
          ? "своё изображение"
          : getPetroglyph(p.glyphId)?.name ?? "символ";
        rows.push(`   – точка ${p.pointId}: ${label}`);
      });
    }
  }

  const stone = getStone(config.stoneId);
  rows.push(`• Камень на обороте: ${stone.id === "none" ? "без камня" : stone.name}`);

  rows.push(`• Подвес: ${PENDANT_LABELS[config.pendant]}`);
  if (config.engravingText && config.engravingText.trim()) {
    rows.push(`• Гравировка: «${config.engravingText.trim()}»`);
  }
  rows.push(`• Упаковка: ${PACKAGING_LABELS[config.packaging]}`);
  if (config.comment && config.comment.trim()) {
    rows.push(`• Комментарий: ${config.comment.trim()}`);
  }
  rows.push(`• Ориентировочная стоимость: ${formatRub(price.total)}`);

  return rows.join("\n");
}

const KEYS: Record<string, keyof MirrorConfiguration> = {
  s: "size",
  m: "materialId",
  f: "finish",
  t: "templateId",
  c: "centerPatternId",
  r: "radialPatternId",
  b: "borderPatternId",
  g: "stoneId",
  p: "pendant",
  e: "engravingText",
  k: "packaging",
};

/** Encode configuration into compact URL search params. */
export function configToParams(config: MirrorConfiguration): URLSearchParams {
  const params = new URLSearchParams();
  for (const [short, key] of Object.entries(KEYS)) {
    const value = config[key];
    if (value !== undefined && value !== null && value !== "") {
      params.set(short, String(value));
    }
  }
  return params;
}

/** Parse a query string back into a partial configuration. */
export function paramsToConfig(
  params: URLSearchParams
): Partial<MirrorConfiguration> {
  const partial: Record<string, string> = {};
  for (const [short, key] of Object.entries(KEYS)) {
    const value = params.get(short);
    if (value !== null) {
      partial[key] = value;
    }
  }
  return partial as Partial<MirrorConfiguration>;
}

export function buildShareUrl(config: MirrorConfiguration): string {
  if (typeof window === "undefined") return "";
  const params = configToParams(config);
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}
