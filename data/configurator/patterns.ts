import type { Pattern, PatternShape } from "@/types/configurator";

/**
 * All motifs are authored in a normalised 100x100 box with local centre
 * (50, 50). Geometry is generated procedurally so it stays crisp at any scale
 * and can be tinted to read as engraving. The matching standalone files live in
 * /public/configurator and can be replaced later without touching this logic.
 */

const C = 50;

function rad(deg: number): number {
  return ((deg - 90) * Math.PI) / 180; // 0deg points up
}

function n(v: number): number {
  return Math.round(v * 100) / 100;
}

function polar(r: number, deg: number): [number, number] {
  const a = rad(deg);
  return [n(C + r * Math.cos(a)), n(C + r * Math.sin(a))];
}

function line(r1: number, deg1: number, r2: number, deg2: number): string {
  const [x1, y1] = polar(r1, deg1);
  const [x2, y2] = polar(r2, deg2);
  return `M${x1},${y1} L${x2},${y2}`;
}

function circlePath(r: number): string {
  return `M${n(C - r)},${C} a${r},${r} 0 1,0 ${n(2 * r)},0 a${r},${r} 0 1,0 ${n(-2 * r)},0`;
}

function circlePathAt(cx: number, cy: number, r: number): string {
  return `M${n(cx - r)},${cy} a${r},${r} 0 1,0 ${n(2 * r)},0 a${r},${r} 0 1,0 ${n(-2 * r)},0`;
}

function spokes(count: number, r1: number, r2: number, weight = 1): PatternShape[] {
  return Array.from({ length: count }, (_, i) => ({
    d: line(r1, (i * 360) / count, r2, (i * 360) / count),
    weight,
  }));
}

function spiral(turns: number, maxR: number, steps = 120): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = t * maxR;
    const deg = t * turns * 360;
    const [x, y] = polar(r, deg);
    d += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  }
  return d;
}

// ---------- CENTER MOTIFS ----------

const sunWheel: PatternShape[] = [
  { d: circlePath(33), weight: 1.2 },
  { d: circlePath(13) },
  ...spokes(12, 14, 32, 1),
  { d: circlePath(3), filled: true },
];

const birds: PatternShape[] = [
  { d: "M22,56 Q36,42 50,53 Q64,42 78,56", weight: 1.4 },
  { d: "M38,44 Q44,38 50,43 Q56,38 62,44", weight: 1.2 },
];

const spiralMotif: PatternShape[] = [
  { d: spiral(2.5, 32), weight: 1.3 },
  { d: circlePath(34) },
];

const tree: PatternShape[] = [
  { d: "M50,76 L50,38", weight: 1.3 },
  { d: "M50,38 L50,28", weight: 1.1 },
  { d: "M50,54 L40,46 M50,54 L60,46", weight: 0.9 },
  { d: "M50,46 L42,39 M50,46 L58,39", weight: 0.9 },
  { d: "M50,38 L44,32 M50,38 L56,32", weight: 0.9 },
  { d: "M50,76 L43,82 M50,76 L57,82", weight: 0.9 },
  { d: circlePath(28) },
];

const moonPhases: PatternShape[] = [
  // waxing crescent (clean circular arcs)
  { d: "M30,41 A9,9 0 0,0 30,59 A13,13 0 0,1 30,41 Z", weight: 1 },
  // half moon: circle outline + vertical divider
  { d: circlePathAt(50, 50, 9), weight: 1 },
  { d: "M50,41 L50,59", weight: 0.8 },
  // full moon: circle outline
  { d: circlePathAt(70, 50, 9), weight: 1 },
];

const eye: PatternShape[] = [
  { d: "M28,50 Q50,36 72,50 Q50,64 28,50 Z", weight: 1.2 },
  { d: "M43,50 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0", weight: 1 },
  { d: "M47,50 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0", filled: true },
  { d: "M50,28 L50,22 M37,32 L34,27 M63,32 L66,27", weight: 0.7 },
];

// ---------- RADIAL MOTIFS ----------

const solarRay: PatternShape[] = [
  { d: "M50,16 L54,50 L50,82 L46,50 Z", filled: true },
];

const feather: PatternShape[] = (() => {
  const shapes: PatternShape[] = [{ d: "M50,16 L50,76", weight: 1.2 }];
  for (let i = 0; i < 6; i++) {
    const y = 26 + i * 8;
    const len = 14 - i * 1.2;
    shapes.push({ d: `M50,${y} L${n(50 - len)},${y + 7}`, weight: 0.8 });
    shapes.push({ d: `M50,${y} L${n(50 + len)},${y + 7}`, weight: 0.8 });
  }
  return shapes;
})();

const triangleMark: PatternShape[] = [
  { d: "M50,20 L61,44 L39,44 Z", weight: 1.1 },
  { d: "M50,52 L50,72", weight: 0.9 },
  { d: "M44,62 L56,62", weight: 0.9 },
];

const crescent: PatternShape[] = [
  { d: "M50,34 A16,16 0 0,0 50,66 A23,23 0 0,1 50,34 Z", weight: 1 },
];

const star4: PatternShape[] = [
  {
    d: "M50,34 L53.5,46.5 L66,50 L53.5,53.5 L50,66 L46.5,53.5 L34,50 L46.5,46.5 Z",
    filled: true,
  },
];

const seed: PatternShape[] = [
  { d: "M50,34 Q58,52 50,66 Q42,52 50,34 Z", weight: 1 },
  { d: "M50,42 L50,60", weight: 0.6 },
];

// ---------- BORDER TILES ----------

const borderGeometric: PatternShape[] = [{ d: "M50,40 L56,52 L44,52 Z", weight: 1 }];
const borderWave: PatternShape[] = [{ d: "M42,50 Q50,42 58,50", weight: 1.1 }];
const borderSolar: PatternShape[] = [{ d: "M50,40 L52,53 L48,53 Z", filled: true }];
const borderDots: PatternShape[] = [{ d: circlePathAt(50, 50, 3), filled: true }];
const borderLeaf: PatternShape[] = [{ d: "M50,43 Q55,50 50,57 Q45,50 50,43 Z", weight: 0.9 }];

// ---------- ADDITIONAL CENTER MOTIFS ----------

const concentric: PatternShape[] = [
  { d: circlePath(32), weight: 1.1 },
  { d: circlePath(22) },
  { d: circlePath(12) },
  { d: circlePath(3), filled: true },
];

const antlers: PatternShape[] = [
  { d: "M50,74 L50,50", weight: 1.4 },
  { d: "M50,50 C40,40 36,30 38,20", weight: 1.3 },
  { d: "M50,50 C60,40 64,30 62,20", weight: 1.3 },
  { d: "M44,36 C38,32 34,31 30,32", weight: 0.9 },
  { d: "M56,36 C62,32 66,31 70,32", weight: 0.9 },
  { d: "M40,27 C35,25 32,25 29,26", weight: 0.8 },
  { d: "M60,27 C65,25 68,25 71,26", weight: 0.8 },
  { d: circlePath(34) },
];

// ---------- ADDITIONAL RADIAL MOTIFS ----------

const chevron: PatternShape[] = [
  { d: "M40,42 L50,32 L60,42", weight: 1.1 },
  { d: "M40,54 L50,44 L60,54", weight: 1.1 },
  { d: "M40,66 L50,56 L60,66", weight: 1.1 },
];

const leaf: PatternShape[] = [
  { d: "M50,22 Q62,50 50,78 Q38,50 50,22 Z", weight: 1.1 },
  { d: "M50,30 L50,72", weight: 0.7 },
  { d: "M50,44 L44,40 M50,44 L56,40 M50,54 L44,50 M50,54 L56,50 M50,64 L45,60 M50,64 L55,60", weight: 0.6 },
];

export const patterns: Pattern[] = [
  // -------- CENTER --------
  {
    id: "sun-wheel",
    name: "Солнечное колесо",
    category: "center",
    theme: "solar",
    file: "/configurator/symbols/center/sun-wheel.svg",
    description: "Лучевой круг — архетип солнца и цикла",
    priceModifier: 2500,
    allowedTemplates: [],
    available: true,
    shapes: sunWheel,
  },
  {
    id: "raven",
    name: "Птицы",
    category: "center",
    theme: "nature",
    file: "/configurator/symbols/center/raven.svg",
    description: "Лаконичный силуэт птиц в полёте",
    priceModifier: 2000,
    allowedTemplates: [],
    available: true,
    shapes: birds,
  },
  {
    id: "spiral",
    name: "Спираль",
    category: "center",
    theme: "geometry",
    file: "/configurator/symbols/center/spiral.svg",
    description: "Спираль — движение и развитие формы",
    priceModifier: 2000,
    allowedTemplates: [],
    available: true,
    shapes: spiralMotif,
  },
  {
    id: "tree",
    name: "Древо",
    category: "center",
    theme: "nature",
    file: "/configurator/symbols/center/tree.svg",
    description: "Древо — связь миров и опора рода",
    priceModifier: 3000,
    allowedTemplates: [],
    available: true,
    shapes: tree,
  },
  {
    id: "moon-phases",
    name: "Фазы луны",
    category: "center",
    theme: "lunar",
    file: "/configurator/symbols/center/moon-phases.svg",
    description: "Три фазы луны — цикл и время",
    priceModifier: 2500,
    allowedTemplates: [],
    available: true,
    shapes: moonPhases,
  },
  {
    id: "eye",
    name: "Око",
    category: "center",
    theme: "shamanic",
    file: "/configurator/symbols/center/eye.svg",
    description: "Око — внимание и созерцание",
    priceModifier: 2800,
    allowedTemplates: [],
    available: true,
    shapes: eye,
  },
  {
    id: "concentric",
    name: "Концентры",
    category: "center",
    theme: "geometry",
    file: "/configurator/symbols/center/concentric.svg",
    description: "Концентрические круги — порядок и сосредоточение",
    priceModifier: 2200,
    allowedTemplates: [],
    available: true,
    shapes: concentric,
  },
  {
    id: "antlers",
    name: "Рога",
    category: "center",
    theme: "shamanic",
    file: "/configurator/symbols/center/antlers.svg",
    description: "Оленьи рога — сила и связь с духом зверя",
    priceModifier: 3200,
    allowedTemplates: [],
    available: true,
    shapes: antlers,
  },
  // -------- RADIAL --------
  {
    id: "solar-ray",
    name: "Солнечный луч",
    category: "radial",
    theme: "solar",
    file: "/configurator/symbols/radial/solar-ray.svg",
    description: "Удлинённый луч, направленный наружу",
    priceModifier: 3000,
    allowedTemplates: [],
    available: true,
    shapes: solarRay,
  },
  {
    id: "feather",
    name: "Перо",
    category: "radial",
    theme: "nature",
    file: "/configurator/symbols/radial/feather.svg",
    description: "Стилизованное перо тонкой гравировкой",
    priceModifier: 3500,
    allowedTemplates: [],
    available: true,
    shapes: feather,
  },
  {
    id: "triangle-mark",
    name: "Треугольный знак",
    category: "radial",
    theme: "geometry",
    file: "/configurator/symbols/radial/triangle-mark.svg",
    description: "Геометрический повторяющийся знак",
    priceModifier: 2500,
    allowedTemplates: [],
    available: true,
    shapes: triangleMark,
  },
  {
    id: "crescent",
    name: "Полумесяц",
    category: "radial",
    theme: "lunar",
    file: "/configurator/symbols/radial/crescent.svg",
    description: "Повторяющийся лунный серп",
    priceModifier: 2500,
    allowedTemplates: [],
    available: true,
    shapes: crescent,
  },
  {
    id: "star",
    name: "Звезда",
    category: "radial",
    theme: "solar",
    file: "/configurator/symbols/radial/star.svg",
    description: "Четырёхлучевая звезда-ориентир",
    priceModifier: 2500,
    allowedTemplates: [],
    available: true,
    shapes: star4,
  },
  {
    id: "seed",
    name: "Зерно",
    category: "radial",
    theme: "nature",
    file: "/configurator/symbols/radial/seed.svg",
    description: "Капля-зерно, символ начала",
    priceModifier: 2200,
    allowedTemplates: [],
    available: true,
    shapes: seed,
  },
  {
    id: "chevron",
    name: "Шеврон",
    category: "radial",
    theme: "geometry",
    file: "/configurator/symbols/radial/chevron.svg",
    description: "Тройной угловой знак, направленный к центру",
    priceModifier: 2300,
    allowedTemplates: [],
    available: true,
    shapes: chevron,
  },
  {
    id: "leaf",
    name: "Лист",
    category: "radial",
    theme: "nature",
    file: "/configurator/symbols/radial/leaf.svg",
    description: "Лист с прожилками — рост и природа",
    priceModifier: 2400,
    allowedTemplates: [],
    available: true,
    shapes: leaf,
  },
  // -------- BORDER --------
  {
    id: "border-geometric-01",
    name: "Геометрический бордюр",
    category: "border",
    theme: "geometry",
    file: "/configurator/symbols/borders/border-geometric-01.svg",
    description: "Ряд треугольников и двойная окантовка",
    priceModifier: 3000,
    allowedTemplates: [],
    available: true,
    shapes: borderGeometric,
    rings: [1.0, 0.88],
    tileRepeat: 28,
  },
  {
    id: "border-wave-01",
    name: "Волновой бордюр",
    category: "border",
    theme: "nature",
    file: "/configurator/symbols/borders/border-wave-01.svg",
    description: "Плавная волна по окружности",
    priceModifier: 3500,
    allowedTemplates: [],
    available: true,
    shapes: borderWave,
    rings: [1.0],
    tileRepeat: 36,
  },
  {
    id: "border-solar-01",
    name: "Солнечный бордюр",
    category: "border",
    theme: "solar",
    file: "/configurator/symbols/borders/border-solar-01.svg",
    description: "Частые лучи и тонкая окантовка",
    priceModifier: 4000,
    allowedTemplates: [],
    available: true,
    shapes: borderSolar,
    rings: [1.0],
    tileRepeat: 56,
  },
  {
    id: "border-dots-01",
    name: "Точечный бордюр",
    category: "border",
    theme: "geometry",
    file: "/configurator/symbols/borders/border-dots-01.svg",
    description: "Ряд точек по окружности",
    priceModifier: 2800,
    allowedTemplates: [],
    available: true,
    shapes: borderDots,
    rings: [1.0],
    tileRepeat: 44,
  },
  {
    id: "border-leaf-01",
    name: "Растительный бордюр",
    category: "border",
    theme: "nature",
    file: "/configurator/symbols/borders/border-leaf-01.svg",
    description: "Повторяющийся лист по краю поля",
    priceModifier: 3600,
    allowedTemplates: [],
    available: true,
    shapes: borderLeaf,
    rings: [1.0],
    tileRepeat: 30,
  },
];

export function getPatternsByCategory(
  category: Pattern["category"]
): Pattern[] {
  return patterns
    .filter((p) => p.category === category && p.available)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Theme ids that actually contain at least one available pattern in a zone. */
export function getUsedThemes(category: Pattern["category"]): string[] {
  const seen = new Set<string>();
  getPatternsByCategory(category).forEach((p) => seen.add(p.theme));
  return Array.from(seen);
}

export function getPattern(id: string | undefined): Pattern | undefined {
  if (!id) return undefined;
  return patterns.find((p) => p.id === id);
}
