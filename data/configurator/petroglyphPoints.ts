/**
 * Anchor points for the free-scatter (petroglyph) composition. Coordinates are
 * in the same 400x400 viewBox used by MirrorPreview, with the disc centre at
 * (200, 200) and a reflective field radius of 150. Each point carries a default
 * footprint (px in that viewBox) so library glyphs and uploads render at a sane
 * size for their position.
 */

export interface AnchorPoint {
  id: string;
  x: number;
  y: number;
  /** Default glyph footprint in viewBox px. */
  size: number;
}

const CX = 200;
const CY = 200;

function ring(count: number, radius: number, size: number, prefix: string, offsetDeg = 0): AnchorPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const a = ((i * 360) / count + offsetDeg - 90) * (Math.PI / 180);
    return {
      id: `${prefix}-${i}`,
      x: +(CX + Math.cos(a) * radius).toFixed(1),
      y: +(CY + Math.sin(a) * radius).toFixed(1),
      size,
    };
  });
}

export const anchorPoints: AnchorPoint[] = [
  { id: "center", x: CX, y: CY, size: 86 },
  ...ring(6, 66, 54, "inner"),
  ...ring(8, 120, 44, "outer", 22.5),
];

export function getAnchorPoint(id: string | undefined): AnchorPoint | undefined {
  if (!id) return undefined;
  return anchorPoints.find((p) => p.id === id);
}
