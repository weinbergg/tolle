"use client";

import { forwardRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  MirrorConfiguration,
  MirrorFinish,
  Pattern,
  PatternShape,
} from "@/types/configurator";
import { getMaterial } from "@/data/configurator/materials";
import { getTemplate } from "@/data/configurator/templates";
import { getPattern } from "@/data/configurator/patterns";
import { getAnchorPoint } from "@/data/configurator/petroglyphPoints";
import PetroglyphMark from "./PetroglyphMark";

const SIZE = 400;
const CENTER = SIZE / 2;
const FIELD = 150; // reflective engraving field radius

interface FinishStyle {
  highlightOpacity: number;
  faceContrast: number;
  patinaOpacity: number;
}

const FINISH_STYLES: Record<MirrorFinish, FinishStyle> = {
  matte: { highlightOpacity: 0.18, faceContrast: 0.18, patinaOpacity: 0.05 },
  polished: { highlightOpacity: 0.5, faceContrast: 0.32, patinaOpacity: 0.04 },
  aged: { highlightOpacity: 0.24, faceContrast: 0.22, patinaOpacity: 0.14 },
};

function Shapes({
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

/** Engraved motif: a soft shadow copy under a lighter incised line. */
function Engraving({
  shapes,
  transform,
  baseWidth,
  engravingColor,
  shadowColor,
}: {
  shapes: PatternShape[];
  transform: string;
  baseWidth: number;
  engravingColor: string;
  shadowColor: string;
}) {
  return (
    <>
      <g opacity={0.45} transform="translate(0.8 1)">
        <Shapes shapes={shapes} color={shadowColor} baseWidth={baseWidth} transform={transform} />
      </g>
      <Shapes shapes={shapes} color={engravingColor} baseWidth={baseWidth} transform={transform} />
    </>
  );
}

function CenterLayer({
  pattern,
  hasRadial,
  engravingColor,
  shadowColor,
}: {
  pattern: Pattern;
  hasRadial: boolean;
  engravingColor: string;
  shadowColor: string;
}) {
  const size = hasRadial ? 96 : 134;
  const s = size / 100;
  const transform = `translate(${CENTER} ${CENTER}) scale(${s}) translate(-50 -50)`;
  return (
    <Engraving
      shapes={pattern.shapes}
      transform={transform}
      baseWidth={2.2}
      engravingColor={engravingColor}
      shadowColor={shadowColor}
    />
  );
}

function RadialLayer({
  pattern,
  count,
  engravingColor,
  shadowColor,
}: {
  pattern: Pattern;
  count: number;
  engravingColor: string;
  shadowColor: string;
}) {
  const rr = FIELD * 0.62;
  const size = count >= 8 ? 60 : 70;
  const s = size / 100;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * 360) / count;
        const transform = `rotate(${angle} ${CENTER} ${CENTER}) translate(${CENTER} ${CENTER - rr}) scale(${s}) translate(-50 -50)`;
        return (
          <Engraving
            key={i}
            shapes={pattern.shapes}
            transform={transform}
            baseWidth={2}
            engravingColor={engravingColor}
            shadowColor={shadowColor}
          />
        );
      })}
    </>
  );
}

function BorderLayer({
  pattern,
  engravingColor,
  shadowColor,
}: {
  pattern: Pattern;
  engravingColor: string;
  shadowColor: string;
}) {
  const repeat = pattern.tileRepeat ?? 32;
  const rings = pattern.rings ?? [1];
  const tileR = FIELD * 0.97;
  const size = 36;
  const s = size / 100;
  return (
    <>
      {rings.map((frac, idx) => (
        <circle
          key={`ring-${idx}`}
          cx={CENTER}
          cy={CENTER}
          r={FIELD * frac}
          fill="none"
          stroke={engravingColor}
          strokeWidth={1.6}
          opacity={0.85}
        />
      ))}
      {Array.from({ length: repeat }, (_, i) => {
        const angle = (i * 360) / repeat;
        const transform = `rotate(${angle} ${CENTER} ${CENTER}) translate(${CENTER} ${CENTER - tileR}) scale(${s}) translate(-50 -50)`;
        return (
          <Shapes
            key={i}
            shapes={pattern.shapes}
            color={engravingColor}
            baseWidth={2}
            transform={transform}
          />
        );
      })}
    </>
  );
}

// ---------- PENDANT (necklace) ----------

type Pt = [number, number];

function quad(p0: Pt, p1: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

function quadAngle(p0: Pt, p1: Pt, p2: Pt, t: number): number {
  const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function Pendant({
  type,
  metalId,
  metalColor,
  metalHighlight,
}: {
  type: "ring" | "leather-cord" | "chain";
  metalId: string;
  metalColor: string;
  metalHighlight: string;
}) {
  const apex: Pt = [200, 2];
  const leftCtl: Pt = [150, -28];
  const rightCtl: Pt = [250, -28];
  const leftTop: Pt = [122, -62];
  const rightTop: Pt = [278, -62];
  const p0L: Pt = leftTop;
  const p0R: Pt = rightTop;

  const leftPath = `M${leftTop[0]},${leftTop[1]} Q${leftCtl[0]},${leftCtl[1]} ${apex[0]},${apex[1]}`;
  const rightPath = `M${rightTop[0]},${rightTop[1]} Q${rightCtl[0]},${rightCtl[1]} ${apex[0]},${apex[1]}`;

  const bail = (
    <g>
      <circle cx={200} cy={6} r={11} fill="none" stroke={`url(#${metalId})`} strokeWidth={6} />
      <circle cx={200} cy={19} r={5} fill="none" stroke={`url(#${metalId})`} strokeWidth={3.5} />
    </g>
  );

  if (type === "ring") {
    return (
      <g>
        <circle cx={200} cy={0} r={17} fill="none" stroke={`url(#${metalId})`} strokeWidth={6} />
        {bail}
      </g>
    );
  }

  if (type === "chain") {
    const links: JSX.Element[] = [];
    [
      [p0L, leftCtl, apex],
      [p0R, rightCtl, apex],
    ].forEach((seg, s) => {
      const steps = 13;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const [x, y] = quad(seg[0], seg[1], seg[2], t);
        const a = quadAngle(seg[0], seg[1], seg[2], t) + (i % 2 === 0 ? 0 : 90);
        links.push(
          <ellipse
            key={`${s}-${i}`}
            cx={x}
            cy={y}
            rx={4.2}
            ry={2.4}
            fill="none"
            stroke={metalColor}
            strokeWidth={1.8}
            transform={`rotate(${a} ${x} ${y})`}
          />
        );
      }
    });
    return (
      <g>
        {links}
        {bail}
      </g>
    );
  }

  // leather-cord — two braided strands
  const leather = "#5a4632";
  const leatherHi = "#7d6242";
  return (
    <g>
      {[leftPath, rightPath].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={leather} strokeWidth={7} strokeLinecap="round" />
          <path
            d={d}
            fill="none"
            stroke={leatherHi}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          <path
            d={d}
            fill="none"
            stroke="#3c3022"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="2 6"
            strokeDashoffset={4}
          />
        </g>
      ))}
      {bail}
      {/* metal end caps */}
      <circle cx={200} cy={4} r={6} fill={metalColor} stroke={metalHighlight} strokeWidth={1} />
    </g>
  );
}

export interface MirrorPreviewProps {
  config: MirrorConfiguration;
  className?: string;
  animateShimmer?: boolean;
  idPrefix?: string;
}

const MirrorPreview = forwardRef<SVGSVGElement, MirrorPreviewProps>(
  function MirrorPreview(
    { config, className, animateShimmer = true, idPrefix = "mp" },
    ref
  ) {
    const material = getMaterial(config.materialId);
    const template = getTemplate(config.templateId);
    const finish = FINISH_STYLES[config.finish];

    const center = template.supportsCenter
      ? getPattern(config.centerPatternId)
      : undefined;
    const radial = template.supportsRadial
      ? getPattern(config.radialPatternId)
      : undefined;
    const border = template.supportsBorder
      ? getPattern(config.borderPatternId)
      : undefined;
    const placements = template.supportsPetroglyphs ? config.petroglyphs ?? [] : [];

    const ids = useMemo(
      () => ({
        base: `${idPrefix}-base`,
        face: `${idPrefix}-face`,
        bezel: `${idPrefix}-bezel`,
        spec: `${idPrefix}-spec`,
        clip: `${idPrefix}-clip`,
        shadow: `${idPrefix}-shadow`,
      }),
      [idPrefix]
    );

    return (
      <svg
        ref={ref}
        viewBox={`0 -64 ${SIZE} ${SIZE + 64}`}
        className={className}
        role="img"
        aria-label="Превью эскиза зеркала Толе"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={ids.base} cx="0.36" cy="0.3" r="0.85">
            <stop offset="0%" stopColor={material.highlightColor} />
            <stop offset="45%" stopColor={material.baseColor} />
            <stop offset="100%" stopColor={material.shadowColor} />
          </radialGradient>
          <radialGradient id={ids.face} cx="0.38" cy="0.32" r="0.9">
            <stop offset="0%" stopColor={material.highlightColor} stopOpacity={0.9} />
            <stop
              offset={`${40 + finish.faceContrast * 30}%`}
              stopColor={material.baseColor}
            />
            <stop offset="100%" stopColor={material.shadowColor} />
          </radialGradient>
          <linearGradient id={ids.bezel} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={material.highlightColor} />
            <stop offset="50%" stopColor={material.baseColor} />
            <stop offset="100%" stopColor={material.shadowColor} />
          </linearGradient>
          <radialGradient id={ids.spec} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={finish.highlightOpacity} />
            <stop offset="60%" stopColor="#ffffff" stopOpacity={finish.highlightOpacity * 0.2} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
          <clipPath id={ids.clip}>
            <circle cx={CENTER} cy={CENTER} r={FIELD} />
          </clipPath>
          <filter id={ids.shadow} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* 0. pendant / necklace behind the disc */}
        <Pendant
          type={config.pendant}
          metalId={ids.bezel}
          metalColor={material.highlightColor}
          metalHighlight={material.baseColor}
        />

        {/* 1. outer shadow + 2. metallic base */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={184}
          fill={`url(#${ids.base})`}
          filter={`url(#${ids.shadow})`}
        />

        {/* 3. bezel / rim */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={170}
          fill="none"
          stroke={`url(#${ids.bezel})`}
          strokeWidth={14}
        />
        <circle cx={CENTER} cy={CENTER} r={163} fill="none" stroke={material.shadowColor} strokeWidth={1.5} opacity={0.5} />

        {/* 4. inner reflective face */}
        <circle cx={CENTER} cy={CENTER} r={FIELD} fill={`url(#${ids.face})`} />

        {/* engraving layers, clipped to the face */}
        <g clipPath={`url(#${ids.clip})`}>
          {border && (
            <AnimatePresence mode="wait">
              <motion.g
                key={`border-${border.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <BorderLayer
                  pattern={border}
                  engravingColor={material.engravingColor}
                  shadowColor={material.shadowColor}
                />
              </motion.g>
            </AnimatePresence>
          )}

          {radial && template.radialCount && (
            <AnimatePresence mode="wait">
              <motion.g
                key={`radial-${radial.id}-${template.radialCount}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <RadialLayer
                  pattern={radial}
                  count={template.radialCount}
                  engravingColor={material.engravingColor}
                  shadowColor={material.shadowColor}
                />
              </motion.g>
            </AnimatePresence>
          )}

          {center && (
            <AnimatePresence mode="wait">
              <motion.g
                key={`center-${center.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <CenterLayer
                  pattern={center}
                  hasRadial={!!radial}
                  engravingColor={material.engravingColor}
                  shadowColor={material.shadowColor}
                />
              </motion.g>
            </AnimatePresence>
          )}

          {placements.length > 0 && (
            <AnimatePresence>
              {placements.map((pl) => {
                const pt = getAnchorPoint(pl.pointId);
                if (!pt) return null;
                return (
                  <motion.g
                    key={`glyph-${pl.pointId}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <PetroglyphMark
                      placement={pl}
                      point={pt}
                      engravingColor={material.engravingColor}
                      shadowColor={material.shadowColor}
                    />
                  </motion.g>
                );
              })}
            </AnimatePresence>
          )}

          {/* 9. subtle patina / texture */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={FIELD}
            fill="none"
            stroke={material.shadowColor}
            strokeWidth={FIELD}
            opacity={finish.patinaOpacity}
            style={{ mixBlendMode: "multiply" }}
          />

          {/* 5. soft specular highlight */}
          <ellipse
            cx={CENTER - 34}
            cy={CENTER - 40}
            rx={90}
            ry={70}
            fill={`url(#${ids.spec})`}
            className={animateShimmer ? "mirror-shimmer" : undefined}
          />
        </g>

      </svg>
    );
  }
);

export default MirrorPreview;
