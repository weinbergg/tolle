"use client";

import { forwardRef, useEffect, useMemo, useRef } from "react";
import { animate } from "framer-motion";
import type { MirrorConfiguration } from "@/types/configurator";
import { getMaterial } from "@/data/configurator/materials";
import { getStone } from "@/data/configurator/stones";

const SIZE = 400;
const CENTER = SIZE / 2;
const FIELD = 150;

const VB_W = 400;
const VB_H = 464;
const RATIO = VB_H / VB_W;

interface VB {
  x: number;
  y: number;
  w: number;
  h: number;
}

function focus(cx: number, cy: number, w: number): VB {
  const h = w * RATIO;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

const VIEWS = {
  overview: { x: 0, y: -64, w: VB_W, h: VB_H } as VB,
  stone: focus(CENTER, CENTER, 150),
};

const vbStr = (v: VB) => `${v.x} ${v.y} ${v.w} ${v.h}`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpVB = (a: VB, b: VB, t: number): VB => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

/** A faceted gem set into a metal bezel. */
function Gem({
  color,
  highlight,
  shadow,
  metalId,
  r = 40,
}: {
  color: string;
  highlight: string;
  shadow: string;
  metalId: string;
  r?: number;
}) {
  const facets = 8;
  const inner = r * 0.5;
  const outerPts: string[] = [];
  const facetLines: JSX.Element[] = [];
  for (let i = 0; i < facets; i++) {
    const a = (i / facets) * Math.PI * 2 - Math.PI / 2;
    const x = CENTER + Math.cos(a) * r;
    const y = CENTER + Math.sin(a) * r;
    outerPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    const ai = ((i + 0.5) / facets) * Math.PI * 2 - Math.PI / 2;
    const ix = CENTER + Math.cos(ai) * inner;
    const iy = CENTER + Math.sin(ai) * inner;
    facetLines.push(
      <line
        key={`f-${i}`}
        x1={x}
        y1={y}
        x2={ix}
        y2={iy}
        stroke={shadow}
        strokeWidth={0.8}
        opacity={0.5}
      />
    );
  }
  // crown table polygon (inner octagon)
  const tablePts: string[] = [];
  for (let i = 0; i < facets; i++) {
    const a = ((i + 0.5) / facets) * Math.PI * 2 - Math.PI / 2;
    tablePts.push(
      `${(CENTER + Math.cos(a) * inner).toFixed(1)},${(
        CENTER +
        Math.sin(a) * inner
      ).toFixed(1)}`
    );
  }

  return (
    <g>
      {/* metal bezel holding the stone */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={r + 6}
        fill="none"
        stroke={`url(#${metalId})`}
        strokeWidth={7}
      />
      {/* gem body */}
      <polygon points={outerPts.join(" ")} fill={`url(#${metalId}-gem)`} />
      {/* radial facets */}
      {facetLines}
      {/* lines from rim to table corners */}
      {outerPts.map((p, i) => {
        const [x, y] = p.split(",").map(Number);
        const t = tablePts[i].split(",").map(Number);
        return (
          <line
            key={`c-${i}`}
            x1={x}
            y1={y}
            x2={t[0]}
            y2={t[1]}
            stroke={shadow}
            strokeWidth={0.7}
            opacity={0.4}
          />
        );
      })}
      {/* table */}
      <polygon
        points={tablePts.join(" ")}
        fill={highlight}
        opacity={0.28}
        stroke={highlight}
        strokeWidth={0.6}
      />
      {/* sparkle */}
      <circle cx={CENTER - r * 0.32} cy={CENTER - r * 0.34} r={r * 0.1} fill="#fff" opacity={0.75} />
      <circle cx={CENTER + r * 0.2} cy={CENTER + r * 0.22} r={r * 0.05} fill="#fff" opacity={0.5} />
    </g>
  );
}

export interface MirrorBackProps {
  config: MirrorConfiguration;
  className?: string;
  /** Whether to zoom in to the stone. */
  focused?: boolean;
  reducedMotion?: boolean;
  idPrefix?: string;
}

const MirrorBack = forwardRef<SVGSVGElement, MirrorBackProps>(function MirrorBack(
  { config, className, focused = false, reducedMotion = false, idPrefix = "mb" },
  ref
) {
  const material = getMaterial(config.materialId);
  const stone = getStone(config.stoneId);

  const localRef = useRef<SVGSVGElement | null>(null);
  const currentVB = useRef<VB>(VIEWS.overview);

  const setRefs = (el: SVGSVGElement | null) => {
    localRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.MutableRefObject<SVGSVGElement | null>).current = el;
  };

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    const target = focused ? VIEWS.stone : VIEWS.overview;
    if (reducedMotion) {
      currentVB.current = target;
      el.setAttribute("viewBox", vbStr(target));
      return;
    }
    const from = currentVB.current;
    const controls = animate(0, 1, {
      duration: 0.75,
      ease: [0.65, 0, 0.2, 1],
      onUpdate: (t) => {
        const vb = lerpVB(from, target, t);
        currentVB.current = vb;
        el.setAttribute("viewBox", vbStr(vb));
      },
    });
    return () => controls.stop();
  }, [focused, reducedMotion]);

  const ids = useMemo(
    () => ({
      base: `${idPrefix}-base`,
      concave: `${idPrefix}-concave`,
      bezel: `${idPrefix}-bezel`,
      gem: `${idPrefix}-bezel-gem`,
      shadow: `${idPrefix}-shadow`,
    }),
    [idPrefix]
  );

  return (
    <svg
      ref={setRefs}
      viewBox={vbStr(VIEWS.overview)}
      className={className}
      role="img"
      aria-label="Обратная сторона зеркала Толе с камнем"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={ids.base} cx="0.36" cy="0.3" r="0.85">
          <stop offset="0%" stopColor={material.highlightColor} />
          <stop offset="45%" stopColor={material.baseColor} />
          <stop offset="100%" stopColor={material.shadowColor} />
        </radialGradient>
        {/* concave bowl: darker in the centre */}
        <radialGradient id={ids.concave} cx="0.5" cy="0.5" r="0.62">
          <stop offset="0%" stopColor={material.shadowColor} />
          <stop offset="55%" stopColor={material.baseColor} />
          <stop offset="100%" stopColor={material.highlightColor} />
        </radialGradient>
        <linearGradient id={ids.bezel} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={material.highlightColor} />
          <stop offset="50%" stopColor={material.baseColor} />
          <stop offset="100%" stopColor={material.shadowColor} />
        </linearGradient>
        <radialGradient id={ids.gem} cx="0.4" cy="0.34" r="0.75">
          <stop offset="0%" stopColor={stone.highlight} />
          <stop offset="55%" stopColor={stone.color} />
          <stop offset="100%" stopColor={stone.shadow} />
        </radialGradient>
        <filter id={ids.shadow} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* base + rim */}
      <circle cx={CENTER} cy={CENTER} r={184} fill={`url(#${ids.base})`} filter={`url(#${ids.shadow})`} />
      <circle cx={CENTER} cy={CENTER} r={170} fill="none" stroke={`url(#${ids.bezel})`} strokeWidth={14} />

      {/* concave bowl */}
      <circle cx={CENTER} cy={CENTER} r={FIELD} fill={`url(#${ids.concave})`} />
      {/* lathe rings */}
      {[0.9, 0.72, 0.54, 0.36].map((f) => (
        <circle
          key={f}
          cx={CENTER}
          cy={CENTER}
          r={FIELD * f}
          fill="none"
          stroke={material.shadowColor}
          strokeWidth={0.8}
          opacity={0.25}
        />
      ))}

      {/* optional back engraving */}
      {config.engravingText && config.engravingText.trim() && (
        <text
          x={CENTER}
          y={CENTER + 96}
          textAnchor="middle"
          fontSize={13}
          fontFamily="serif"
          letterSpacing={1.5}
          fill={material.engravingColor}
          opacity={0.8}
        >
          {config.engravingText.trim().slice(0, 28)}
        </text>
      )}

      {/* stone (or a plain boss when none) */}
      {stone.id === "none" ? (
        <>
          <circle cx={CENTER} cy={CENTER} r={18} fill={`url(#${ids.bezel})`} opacity={0.9} />
          <circle cx={CENTER} cy={CENTER} r={10} fill={material.shadowColor} opacity={0.6} />
        </>
      ) : (
        <Gem
          color={stone.color}
          highlight={stone.highlight}
          shadow={stone.shadow}
          metalId={ids.bezel}
          r={40}
        />
      )}
    </svg>
  );
});

export default MirrorBack;
