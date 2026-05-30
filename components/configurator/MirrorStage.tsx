"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { MirrorConfiguration, PetroglyphTool } from "@/types/configurator";
import MirrorPreview, { type PreviewView } from "./MirrorPreview";
import MirrorBack from "./MirrorBack";

export interface MirrorStageProps {
  config: MirrorConfiguration;
  /** Front camera focus region. */
  view?: PreviewView;
  /** Which face is shown. */
  side?: "front" | "back";
  /** Zoom the back in to the stone. */
  backFocused?: boolean;
  reducedMotion?: boolean;
  interactive?: boolean;
  tool?: PetroglyphTool;
  onPlacePoint?: (pointId: string) => void;
  className?: string;
}

/**
 * The single interactive mirror canvas. It flips between the engraved front and
 * the gem-set back with a 3D rotation, and the front/back each fly their camera
 * to the relevant zone. The forwarded ref points at the FRONT svg so exports
 * keep capturing the engraved sketch.
 */
const MirrorStage = forwardRef<SVGSVGElement, MirrorStageProps>(function MirrorStage(
  {
    config,
    view = "overview",
    side = "front",
    backFocused = false,
    reducedMotion = false,
    interactive = false,
    tool = null,
    onPlacePoint,
    className,
  },
  ref
) {
  const isBack = side === "back";

  return (
    <div className={className} style={{ perspective: 1400 }}>
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d", aspectRatio: "400 / 464" }}
        animate={{ rotateY: isBack ? 180 : 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.9, ease: [0.6, 0, 0.2, 1] }
        }
      >
        {/* FRONT */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <MirrorPreview
            ref={ref}
            config={config}
            view={view}
            reducedMotion={reducedMotion}
            interactive={interactive}
            tool={tool}
            onPlacePoint={onPlacePoint}
            className="h-full w-full drop-shadow-2xl"
          />
        </div>

        {/* BACK (pre-rotated so it reads correctly once the card flips) */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <MirrorBack
            config={config}
            focused={backFocused}
            reducedMotion={reducedMotion}
            className="h-full w-full drop-shadow-2xl"
          />
        </div>
      </motion.div>
    </div>
  );
});

export default MirrorStage;
