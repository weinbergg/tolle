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
      aria-label="Изображение бронзового зеркала Толе с отражением леса"
      role="img"
    >
      <div className="relative">
        {/* soft bronze halo so the object never gets lost on the dark page */}
        <div className="absolute -inset-12 rounded-full bg-bronze/10 blur-[80px]" />
        {/* bail */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-5 -translate-x-1/2 -translate-y-3 rounded-full border-2 border-bronze-light/70 bg-transparent" />
        {/* convex round cabochon */}
        <div
          className="relative h-64 w-64 overflow-hidden rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-bronze-light/50 md:h-80 md:w-80 lg:h-[22rem] lg:w-[22rem]"
          style={{
            background:
              "radial-gradient(120% 90% at 38% 28%, #f3e6cf 0%, #d8b988 16%, #B08D57 42%, #6e5733 72%, #2c2317 100%), linear-gradient(160deg, #4a5a39 0%, transparent 45%)",
            backgroundBlendMode: "screen, normal",
          }}
        >
          {/* reflected forest / sunset hint on the convex surface */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 50% at 60% 75%, rgba(74,90,57,0.55) 0%, rgba(40,52,33,0.25) 35%, transparent 60%)",
            }}
          />
          {/* bright specular highlight */}
          <div className="absolute left-[22%] top-[18%] h-16 w-10 rounded-[50%] bg-warm/60 blur-md" />
          {/* warm horizon glow */}
          <div className="absolute bottom-[20%] left-1/2 h-10 w-32 -translate-x-1/2 rounded-[50%] bg-[#f0d2a0]/30 blur-lg" />
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
      {/* layered bronze halo so the polished object reads against the dark page */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-4/5 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze/15 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze-light/10 blur-[60px]"
        aria-hidden="true"
      />
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
