import type { PatternShape } from "@/types/configurator";

/**
 * Petroglyph library — simple, recognisable rock-art figures authored in a
 * normalised 100x100 box centred at (50,50). Used for the free-scatter
 * composition where the customer places symbols onto interactive points,
 * mirroring the look of the real engraved Toli discs.
 */

export type PetroglyphGroup = "animals" | "figures" | "symbols";

export interface Petroglyph {
  id: string;
  name: string;
  group: PetroglyphGroup;
  shapes: PatternShape[];
  /** Visible in the picker (toggled from the admin catalogue). */
  available?: boolean;
  /** Display order within its group. */
  order?: number;
  /**
   * Optional raster/SVG image (data URL or public path) for admin-uploaded
   * glyphs. When set it is rendered instead of the vector `shapes`.
   */
  image?: string;
}

const S = 2.2; // default engraving stroke weight (×base)

export const petroglyphs: Petroglyph[] = [
  // ---------- ANIMALS ----------
  {
    id: "deer",
    name: "Олень",
    group: "animals",
    shapes: [
      { d: "M26,54 L60,54", weight: S },
      { d: "M30,54 L28,70 M40,54 L38,70 M52,54 L54,70 M58,54 L60,70", weight: 1.6 },
      { d: "M60,54 L70,40", weight: S },
      { d: "M70,40 L64,30 M70,40 L76,30 M67,35 L62,30 M73,35 L78,30", weight: 1.4 },
      { d: "M26,54 L20,48", weight: 1.6 },
    ],
  },
  {
    id: "horse",
    name: "Конь",
    group: "animals",
    shapes: [
      { d: "M24,52 Q42,46 60,52", weight: S },
      { d: "M28,52 L26,70 M38,52 L37,70 M52,52 L53,70 M60,52 L62,70", weight: 1.6 },
      { d: "M60,52 L72,44 L70,32", weight: S },
      { d: "M70,32 L74,30 M70,32 L66,30", weight: 1.4 },
      { d: "M24,52 Q18,52 16,60", weight: 1.6 },
    ],
  },
  {
    id: "ibex",
    name: "Козерог",
    group: "animals",
    shapes: [
      { d: "M30,56 L58,56", weight: S },
      { d: "M34,56 L33,70 M42,56 L41,70 M50,56 L52,70 M56,56 L58,70", weight: 1.6 },
      { d: "M58,56 L66,46", weight: S },
      { d: "M66,46 Q78,40 74,26 M66,46 Q72,42 70,30", weight: 1.6 },
    ],
  },
  {
    id: "bird",
    name: "Птица",
    group: "animals",
    shapes: [
      { d: "M22,52 Q40,40 50,52 Q60,40 78,52", weight: S },
      { d: "M50,52 L50,64", weight: 1.6 },
      { d: "M44,64 L56,64", weight: 1.4 },
    ],
  },
  {
    id: "fish",
    name: "Рыба",
    group: "animals",
    shapes: [
      { d: "M28,50 Q50,36 70,50 Q50,64 28,50 Z", weight: S },
      { d: "M70,50 L80,42 M70,50 L80,58", weight: 1.6 },
      { d: "M40,47 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0", filled: true },
    ],
  },
  {
    id: "snake",
    name: "Змея",
    group: "animals",
    shapes: [
      { d: "M24,50 Q34,38 44,50 Q54,62 64,50 Q72,40 78,48", weight: S },
      { d: "M78,48 L82,45 M78,48 L82,51", weight: 1.4 },
    ],
  },
  // ---------- FIGURES ----------
  {
    id: "shaman",
    name: "Шаман",
    group: "figures",
    shapes: [
      { d: "M50,30 a6,6 0 1,0 0.1,0", weight: 1.6 },
      { d: "M50,36 L50,62", weight: S },
      { d: "M50,42 L36,34 M50,42 L64,34", weight: 1.6 },
      { d: "M50,62 L40,78 M50,62 L60,78", weight: 1.6 },
      { d: "M44,24 L50,30 L56,24", weight: 1.4 },
    ],
  },
  {
    id: "hunter",
    name: "Охотник",
    group: "figures",
    shapes: [
      { d: "M46,30 a5,5 0 1,0 0.1,0", weight: 1.6 },
      { d: "M46,35 L46,60", weight: S },
      { d: "M46,60 L38,76 M46,60 L54,76", weight: 1.6 },
      { d: "M46,44 L60,40", weight: 1.6 },
      { d: "M64,28 Q72,44 64,60", weight: 1.6 },
      { d: "M64,28 L64,60", weight: 1.2 },
    ],
  },
  {
    id: "dancer",
    name: "Танцор",
    group: "figures",
    shapes: [
      { d: "M50,28 a5,5 0 1,0 0.1,0", weight: 1.6 },
      { d: "M50,33 L48,58", weight: S },
      { d: "M49,42 L34,40 M49,42 L64,48", weight: 1.6 },
      { d: "M48,58 L38,74 M48,58 L60,72", weight: 1.6 },
    ],
  },
  // ---------- SYMBOLS ----------
  {
    id: "sun",
    name: "Солнце",
    group: "symbols",
    shapes: [
      { d: "M38,50 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0", weight: 1.6 },
      ...Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 50 + Math.cos(a) * 14;
        const y1 = 50 + Math.sin(a) * 14;
        const x2 = 50 + Math.cos(a) * 22;
        const y2 = 50 + Math.sin(a) * 22;
        return { d: `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`, weight: 1.4 };
      }),
    ],
  },
  {
    id: "spiral",
    name: "Спираль",
    group: "symbols",
    shapes: [
      {
        d: (() => {
          let d = "";
          const steps = 90;
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const r = t * 24;
            const ang = t * 3 * Math.PI * 2;
            const x = 50 + Math.cos(ang) * r;
            const y = 50 + Math.sin(ang) * r;
            d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
          }
          return d;
        })(),
        weight: 1.6,
      },
    ],
  },
  {
    id: "crescent",
    name: "Полумесяц",
    group: "symbols",
    shapes: [{ d: "M50,28 A22,22 0 0,0 50,72 A30,30 0 0,1 50,28 Z", weight: 1.6 }],
  },
  {
    id: "star",
    name: "Звезда",
    group: "symbols",
    shapes: [
      {
        d: "M50,28 L55,45 L72,45 L58,55 L63,72 L50,61 L37,72 L42,55 L28,45 L45,45 Z",
        weight: 1.4,
      },
    ],
  },
  {
    id: "tree",
    name: "Древо",
    group: "symbols",
    shapes: [
      { d: "M50,74 L50,34", weight: S },
      { d: "M50,50 L38,40 M50,50 L62,40 M50,42 L40,34 M50,42 L60,34 M50,34 L44,28 M50,34 L56,28", weight: 1.4 },
    ],
  },
  {
    id: "eye",
    name: "Око",
    group: "symbols",
    shapes: [
      { d: "M30,50 Q50,36 70,50 Q50,64 30,50 Z", weight: 1.6 },
      { d: "M44,50 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0", weight: 1.4 },
      { d: "M48,50 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0", filled: true },
    ],
  },
  {
    id: "hand",
    name: "Ладонь",
    group: "symbols",
    shapes: [
      { d: "M40,68 L40,48 Q40,44 44,44 Q48,44 48,48", weight: 1.5 },
      { d: "M48,48 L48,40 M54,48 L54,38 M60,50 L60,42", weight: 1.5 },
      { d: "M40,48 L40,40", weight: 1.5 },
      { d: "M40,68 Q50,72 60,68 L60,50", weight: 1.5 },
    ],
  },
  {
    id: "wave",
    name: "Вода",
    group: "symbols",
    shapes: [
      { d: "M28,44 Q39,36 50,44 Q61,52 72,44", weight: 1.5 },
      { d: "M28,56 Q39,48 50,56 Q61,64 72,56", weight: 1.5 },
    ],
  },
];

export const PETROGLYPH_GROUPS: { id: PetroglyphGroup; name: string }[] = [
  { id: "animals", name: "Звери" },
  { id: "figures", name: "Фигуры" },
  { id: "symbols", name: "Символы" },
];

export function getPetroglyph(id: string | undefined): Petroglyph | undefined {
  if (!id) return undefined;
  return petroglyphs.find((p) => p.id === id);
}
