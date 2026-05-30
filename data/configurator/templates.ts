import type { CompositionTemplate } from "@/types/configurator";

export const templates: CompositionTemplate[] = [
  {
    id: "center-single",
    name: "Один символ",
    description: "Единственный символ в центре поверхности",
    supportsCenter: true,
    supportsRadial: false,
    supportsBorder: false,
    priceModifier: 0,
  },
  {
    id: "center-with-border",
    name: "Символ и рамка",
    description: "Центральный символ в орнаментальной рамке",
    supportsCenter: true,
    supportsRadial: false,
    supportsBorder: true,
    priceModifier: 4000,
  },
  {
    id: "radial-6",
    name: "Шесть по кругу",
    description: "Шесть символов, равномерно по окружности",
    supportsCenter: false,
    supportsRadial: true,
    supportsBorder: false,
    radialCount: 6,
    priceModifier: 5000,
  },
  {
    id: "radial-8",
    name: "Восемь по кругу",
    description: "Восемь символов, равномерно по окружности",
    supportsCenter: false,
    supportsRadial: true,
    supportsBorder: false,
    radialCount: 8,
    priceModifier: 6000,
  },
  {
    id: "center-plus-radial-6",
    name: "Центр и шесть",
    description: "Центральный символ и шесть элементов по кругу",
    supportsCenter: true,
    supportsRadial: true,
    supportsBorder: false,
    centerOptional: true,
    radialCount: 6,
    priceModifier: 8000,
  },
  {
    id: "center-plus-radial-plus-border",
    name: "Центр, круг и бордюр",
    description: "Полная композиция: центр, окружность и внешняя рамка",
    supportsCenter: true,
    supportsRadial: true,
    supportsBorder: true,
    centerOptional: true,
    radialCount: 8,
    priceModifier: 12000,
  },
  {
    id: "free-scatter",
    name: "Свободная россыпь",
    description:
      "Расставьте петроглифы по интерактивным точкам — звери, фигуры, символы или своё изображение",
    supportsCenter: false,
    supportsRadial: false,
    supportsBorder: false,
    supportsPetroglyphs: true,
    priceModifier: 9000,
  },
];

export function getTemplate(id: string): CompositionTemplate {
  return templates.find((t) => t.id === id) ?? templates[0];
}
