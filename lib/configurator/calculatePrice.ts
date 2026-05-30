import type {
  MirrorConfiguration,
  PriceBreakdown,
  PriceLine,
} from "@/types/configurator";
import { finishes, getMaterial, sizes } from "@/data/configurator/materials";
import { getTemplate } from "@/data/configurator/templates";
import { getPattern } from "@/data/configurator/patterns";
import { getStone } from "@/data/configurator/stones";

export const PENDANT_PRICES: Record<MirrorConfiguration["pendant"], number> = {
  ring: 0,
  "leather-cord": 1500,
  chain: 3500,
};

export const PACKAGING_PRICES: Record<MirrorConfiguration["packaging"], number> = {
  standard: 0,
  gift: 3000,
};

export const ENGRAVING_PRICE = 2500;
export const PETROGLYPH_PRICE = 1200;

const PENDANT_LABELS: Record<MirrorConfiguration["pendant"], string> = {
  ring: "Кольцо",
  "leather-cord": "Кожаный шнур",
  chain: "Цепочка",
};

const PACKAGING_LABELS: Record<MirrorConfiguration["packaging"], string> = {
  standard: "Стандартная упаковка",
  gift: "Подарочная упаковка",
};

export function calculatePrice(config: MirrorConfiguration): PriceBreakdown {
  const lines: PriceLine[] = [];

  const size = sizes.find((s) => s.id === config.size) ?? sizes[0];
  lines.push({ label: `Основа ${size.name}`, amount: size.basePrice });

  const material = getMaterial(config.materialId);
  if (material.priceModifier > 0) {
    lines.push({ label: material.name, amount: material.priceModifier });
  }

  const finish = finishes.find((f) => f.id === config.finish) ?? finishes[0];
  if (finish.priceModifier > 0) {
    lines.push({ label: `Покрытие: ${finish.name}`, amount: finish.priceModifier });
  }

  const template = getTemplate(config.templateId);
  if (template.priceModifier > 0) {
    lines.push({ label: `Композиция: ${template.name}`, amount: template.priceModifier });
  }

  const center = getPattern(config.centerPatternId);
  if (center && template.supportsCenter) {
    lines.push({ label: `Центр: ${center.name}`, amount: center.priceModifier });
  }

  const radial = getPattern(config.radialPatternId);
  if (radial && template.supportsRadial) {
    lines.push({ label: `Окружность: ${radial.name}`, amount: radial.priceModifier });
  }

  const border = getPattern(config.borderPatternId);
  if (border && template.supportsBorder) {
    lines.push({ label: `Рамка: ${border.name}`, amount: border.priceModifier });
  }

  if (template.supportsPetroglyphs) {
    const count = config.petroglyphs?.length ?? 0;
    if (count > 0) {
      lines.push({
        label: `Петроглифы (${count})`,
        amount: count * PETROGLYPH_PRICE,
      });
    }
  }

  const stone = getStone(config.stoneId);
  if (stone.id !== "none" && stone.priceModifier > 0) {
    lines.push({ label: `Камень: ${stone.name}`, amount: stone.priceModifier });
  }

  if (PENDANT_PRICES[config.pendant] > 0) {
    lines.push({
      label: `Подвес: ${PENDANT_LABELS[config.pendant]}`,
      amount: PENDANT_PRICES[config.pendant],
    });
  }

  if (config.engravingText && config.engravingText.trim().length > 0) {
    lines.push({ label: "Гравировка на обороте", amount: ENGRAVING_PRICE });
  }

  if (PACKAGING_PRICES[config.packaging] > 0) {
    lines.push({
      label: PACKAGING_LABELS[config.packaging],
      amount: PACKAGING_PRICES[config.packaging],
    });
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { lines, total };
}

export function formatRub(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}
