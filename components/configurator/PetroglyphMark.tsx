import type { PetroglyphPlacement } from "@/types/configurator";
import type { AnchorPoint } from "@/data/configurator/petroglyphPoints";
import type { PatternShape } from "@/types/configurator";
import { getPetroglyph } from "@/data/configurator/petroglyphs";

function Strokes({
  shapes,
  color,
  baseWidth,
  transform,
}: {
  shapes: PatternShape[];
  color: string;
  baseWidth: number;
  transform: string;
}) {
  return (
    <g transform={transform}>
      {shapes.map((s, i) =>
        s.filled ? (
          <path key={i} d={s.d} fill={color} stroke="none" />
        ) : (
          <path
            key={i}
            d={s.d}
            fill="none"
            stroke={color}
            strokeWidth={baseWidth * (s.weight ?? 1)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      )}
    </g>
  );
}

export interface PetroglyphMarkProps {
  placement: PetroglyphPlacement;
  point: AnchorPoint;
  engravingColor: string;
  shadowColor: string;
}

/** Renders a single placed petroglyph (library glyph or uploaded image). */
export default function PetroglyphMark({
  placement,
  point,
  engravingColor,
  shadowColor,
}: PetroglyphMarkProps) {
  const scale = placement.scale ?? 1;
  const footprint = point.size * scale;

  if (placement.customImage) {
    const s = footprint * 1.05;
    return (
      <image
        href={placement.customImage}
        x={point.x - s / 2}
        y={point.y - s / 2}
        width={s}
        height={s}
        preserveAspectRatio="xMidYMid meet"
        opacity={0.92}
        style={{ filter: "grayscale(1) contrast(1.25) brightness(1.05)" }}
      />
    );
  }

  const glyph = getPetroglyph(placement.glyphId);
  if (!glyph) return null;

  const k = footprint / 100;
  const transform = `translate(${point.x} ${point.y}) scale(${k}) translate(-50 -50)`;
  const baseWidth = 2.4;

  return (
    <g>
      <g opacity={0.4} transform="translate(0.8 1)">
        <Strokes shapes={glyph.shapes} color={shadowColor} baseWidth={baseWidth} transform={transform} />
      </g>
      <Strokes shapes={glyph.shapes} color={engravingColor} baseWidth={baseWidth} transform={transform} />
    </g>
  );
}
