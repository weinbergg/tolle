"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MirrorCanvas = dynamic(() => import("./MirrorCanvas"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative h-48 w-48 animate-pulse rounded-full border border-bronze/30 bg-gradient-to-br from-graphite to-bronze-dark md:h-64 md:w-64">
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-void via-graphite to-bronze-dark/80" />
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1 rounded-full border border-bronze/50 bg-bronze-dark" />
      </div>
    </div>
  );
}

function StaticMirrorFallback() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      aria-label="Декоративное изображение зеркала Толе"
      role="img"
    >
      <div className="relative">
        <div className="absolute -inset-8 rounded-full bg-bronze/5 blur-3xl" />
        <div className="relative h-56 w-56 rounded-full border-2 border-bronze/40 bg-gradient-to-br from-bronze-dark via-graphite to-void shadow-2xl md:h-72 md:w-72 lg:h-80 lg:w-80">
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-void via-graphite/90 to-bronze-dark/60">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-bronze/10 to-bronze-light/5" />
            <div className="absolute left-1/4 top-1/4 h-1/3 w-1/3 rounded-full bg-bronze-light/5 blur-xl" />
          </div>
          <div className="absolute -inset-1 rounded-full border border-bronze/20" />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-bronze/30"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translateY(-${112}px)`,
              }}
            />
          ))}
        </div>
        <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-2 rounded-full border border-bronze/50 bg-bronze-dark">
          <div className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-bronze/40" />
        </div>
      </div>
    </div>
  );
}

export default function ToliMirrorScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useStatic, setUseStatic] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const isLowEnd =
      typeof navigator !== "undefined" &&
      ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ));

    if (isLowEnd || motionQuery.matches) {
      setUseStatic(true);
    }

    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (!mounted || reducedMotion || useStatic) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      containerRef.current.style.setProperty("--parallax-x", `${x * 20}px`);
      containerRef.current.style.setProperty("--parallax-y", `${y * 20}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted, reducedMotion, useStatic]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative h-full w-full",
        !reducedMotion && !useStatic && "transition-transform duration-700 ease-out"
      )}
      style={
        !reducedMotion && !useStatic
          ? {
              transform:
                "translate(var(--parallax-x, 0px), var(--parallax-y, 0px))",
            }
          : undefined
      }
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 gradient-radial-bronze" aria-hidden="true" />
      {!mounted ? (
        <SceneFallback />
      ) : useStatic || reducedMotion ? (
        <StaticMirrorFallback />
      ) : (
        <Suspense fallback={<SceneFallback />}>
          <MirrorCanvas reducedMotion={reducedMotion} />
        </Suspense>
      )}
    </motion.div>
  );
}
