import type { MirrorFinish, MirrorMaterial } from "@/types/configurator";

export const materials: MirrorMaterial[] = [
  {
    id: "bronze-dark",
    name: "Тёмная бронза",
    description: "Глубокий тёплый металл с насыщенным тоном",
    texture: "/configurator/materials/bronze-dark.webp",
    baseColor: "#6e5733",
    highlightColor: "#cda86b",
    shadowColor: "#241a0e",
    engravingColor: "#e7d3a8",
    priceModifier: 0,
  },
  {
    id: "bronze-aged",
    name: "Состаренная бронза",
    description: "Ручная патина и живая, благородная фактура",
    texture: "/configurator/materials/bronze-aged.webp",
    baseColor: "#7c6a44",
    highlightColor: "#b7a273",
    shadowColor: "#2c2716",
    engravingColor: "#1f2417",
    priceModifier: 4000,
  },
  {
    id: "silver-brushed",
    name: "Светлый металл",
    description: "Холодный шлифованный тон с мягким блеском",
    texture: "/configurator/materials/silver-brushed.webp",
    baseColor: "#9a9c9e",
    highlightColor: "#eef0f2",
    shadowColor: "#33363a",
    engravingColor: "#2a2d30",
    priceModifier: 8000,
  },
  {
    id: "blackened-metal",
    name: "Чернёный металл",
    description: "Глубокая графитовая поверхность с бронзовым ободом",
    texture: "/configurator/materials/blackened-metal.webp",
    baseColor: "#2a2723",
    highlightColor: "#7d6c4f",
    shadowColor: "#0a0908",
    engravingColor: "#c7a878",
    priceModifier: 5000,
  },
];

export const finishes: {
  id: MirrorFinish;
  name: string;
  description: string;
  priceModifier: number;
}[] = [
  {
    id: "matte",
    name: "Матовая",
    description: "Сдержанная поверхность без резких бликов",
    priceModifier: 0,
  },
  {
    id: "polished",
    name: "Полированная",
    description: "Зеркальный блеск и выраженное отражение",
    priceModifier: 3000,
  },
  {
    id: "aged",
    name: "С патиной",
    description: "Углублённый рельеф и благородная старина",
    priceModifier: 4000,
  },
];

export const sizes: {
  id: "40" | "55" | "70";
  name: string;
  description: string;
  basePrice: number;
}[] = [
  { id: "40", name: "40 мм", description: "Компактный носимый формат", basePrice: 18000 },
  { id: "55", name: "55 мм", description: "Универсальный баланс веса и формы", basePrice: 26000 },
  { id: "70", name: "70 мм", description: "Крупный коллекционный объект", basePrice: 34000 },
];

export function getMaterial(id: string): MirrorMaterial {
  return materials.find((m) => m.id === id) ?? materials[0];
}
