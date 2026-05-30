import type { MirrorStone } from "@/types/configurator";

/**
 * Gemstones that can be set into the concave back of the mirror. The first
 * entry ("none") means no stone. Colours drive the faceted SVG gem drawn in
 * MirrorBack. This list is the static source of truth; the admin panel can
 * later override names, descriptions, prices, order and visibility by id.
 */
export const stones: MirrorStone[] = [
  {
    id: "none",
    name: "Без камня",
    description: "Чистая зеркальная обратная сторона без вставки.",
    color: "#3a342b",
    highlight: "#6b5f49",
    shadow: "#15120d",
    priceModifier: 0,
    order: 0,
  },
  {
    id: "ruby",
    name: "Рубин",
    description: "Камень жизненной силы и страсти. Глубокий тёплый красный тон.",
    color: "#8a1322",
    highlight: "#d8455c",
    shadow: "#3a0710",
    priceModifier: 9000,
    order: 1,
  },
  {
    id: "carnelian",
    name: "Сердолик",
    description: "Тёплый оберег: символ энергии, защиты и творческой силы.",
    color: "#b8480f",
    highlight: "#e88a45",
    shadow: "#5a1f06",
    priceModifier: 4500,
    order: 2,
  },
  {
    id: "turquoise",
    name: "Бирюза",
    description: "Небесный камень — символ чистоты, удачи и пути.",
    color: "#1f8a8a",
    highlight: "#5fd0c7",
    shadow: "#0a3a3a",
    priceModifier: 6000,
    order: 3,
  },
  {
    id: "onyx",
    name: "Чёрный оникс",
    description: "Камень сосредоточенности и защиты. Глубокий графитовый блеск.",
    color: "#26242a",
    highlight: "#5a5660",
    shadow: "#0a090c",
    priceModifier: 5000,
    order: 4,
  },
  {
    id: "moonstone",
    name: "Лунный камень",
    description: "Камень интуиции и внутренней тишины с холодным переливом.",
    color: "#b9c4d8",
    highlight: "#f1f5fb",
    shadow: "#5d6678",
    priceModifier: 7000,
    order: 5,
  },
  {
    id: "amber",
    name: "Янтарь",
    description: "Солнечная смола: тепло, память рода и мягкое свечение.",
    color: "#b6731a",
    highlight: "#eaab44",
    shadow: "#5e3608",
    priceModifier: 4000,
    order: 6,
  },
];

export function getStone(id: string | undefined): MirrorStone {
  return stones.find((s) => s.id === id) ?? stones[0];
}

export function getStones(): MirrorStone[] {
  return stones
    .filter((s) => s.available ?? true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
