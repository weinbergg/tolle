"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { MirrorConfiguration } from "@/types/configurator";
import { getTemplate } from "@/data/configurator/templates";
import { getPatternsByCategory } from "@/data/configurator/patterns";
import {
  buildShareUrl,
  configToParams,
  defaultConfiguration,
  paramsToConfig,
} from "@/lib/configurator/serializeConfiguration";
import { loadAndApplyCatalog } from "@/lib/configurator/applyCatalog";
import MirrorPreview from "./MirrorPreview";
import StepNavigation, { type ConfiguratorStep } from "./StepNavigation";
import ConfiguratorPanel from "./ConfiguratorPanel";
import PriceEstimate from "./PriceEstimate";

const STEPS: ConfiguratorStep[] = [
  { id: "base", title: "Основа" },
  { id: "composition", title: "Композиция" },
  { id: "center", title: "Центр" },
  { id: "radial", title: "Окружность" },
  { id: "border", title: "Рамка" },
  { id: "petroglyphs", title: "Петроглифы" },
  { id: "addons", title: "Дополнения" },
  { id: "summary", title: "Итог" },
];

const STORAGE_KEY = "toli-configurator";

const firstCenter = getPatternsByCategory("center")[0]?.id;
const firstRadial = getPatternsByCategory("radial")[0]?.id;
const firstBorder = getPatternsByCategory("border")[0]?.id;

type Action =
  | { type: "set"; key: keyof MirrorConfiguration; value: unknown }
  | { type: "template"; value: string }
  | { type: "load"; config: Partial<MirrorConfiguration> };

function reducer(state: MirrorConfiguration, action: Action): MirrorConfiguration {
  switch (action.type) {
    case "load":
      return { ...state, ...action.config };
    case "set":
      return { ...state, [action.key]: action.value } as MirrorConfiguration;
    case "template": {
      const t = getTemplate(action.value);
      const next: MirrorConfiguration = { ...state, templateId: action.value };
      if (t.supportsCenter && !next.centerPatternId && !t.centerOptional) {
        next.centerPatternId = firstCenter;
      }
      if (t.supportsRadial && !next.radialPatternId) {
        next.radialPatternId = firstRadial;
      }
      if (t.supportsBorder && !next.borderPatternId) {
        next.borderPatternId = firstBorder;
      }
      if (t.supportsPetroglyphs && !next.petroglyphs) {
        next.petroglyphs = [];
      }
      return next;
    }
    default:
      return state;
  }
}

function stepRelevance(config: MirrorConfiguration): boolean[] {
  const t = getTemplate(config.templateId);
  return [
    true, // base
    true, // composition
    t.supportsCenter, // center
    t.supportsRadial, // radial
    t.supportsBorder, // border
    !!t.supportsPetroglyphs, // petroglyphs
    true, // addons
    true, // summary
  ];
}

export default function MirrorConfigurator() {
  const [config, dispatch] = useReducer(reducer, defaultConfiguration);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [, setCatalogVersion] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Apply admin-edited catalogue overrides (names, themes, prices, order,
  // visibility) onto the static motif/glyph library, then re-render.
  useEffect(() => {
    let active = true;
    loadAndApplyCatalog().then((changed) => {
      if (active && changed) setCatalogVersion((v) => v + 1);
    });
    return () => {
      active = false;
    };
  }, []);

  // Load from URL params first, then localStorage.
  useEffect(() => {
    let loaded: Partial<MirrorConfiguration> | null = null;
    const params = new URLSearchParams(window.location.search);
    if (Array.from(params.keys()).length > 0) {
      loaded = paramsToConfig(params);
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) loaded = JSON.parse(stored);
      } catch {
        loaded = null;
      }
    }
    if (loaded) dispatch({ type: "load", config: loaded });
    setHydrated(true);
  }, []);

  // Persist to localStorage.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      /* ignore quota / privacy errors */
    }
  }, [config, hydrated]);

  const onChange = useCallback(
    <K extends keyof MirrorConfiguration>(key: K, value: MirrorConfiguration[K]) => {
      dispatch({ type: "set", key, value });
    },
    []
  );

  const onTemplateChange = useCallback((templateId: string) => {
    dispatch({ type: "template", value: templateId });
  }, []);

  const getSketchSvg = useCallback((): string | undefined => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", "600");
    clone.setAttribute("height", "660");
    return new XMLSerializer().serializeToString(clone);
  }, []);

  const relevant = stepRelevance(config);

  const goNext = () => {
    let i = step + 1;
    while (i < STEPS.length - 1 && !relevant[i]) i++;
    setStep(Math.min(i, STEPS.length - 1));
  };
  const goPrev = () => {
    let i = step - 1;
    while (i > 0 && !relevant[i]) i--;
    setStep(Math.max(i, 0));
  };

  const handleCopyLink = async () => {
    try {
      const url = buildShareUrl(config);
      await navigator.clipboard.writeText(url);
      // also reflect in the address bar without navigation
      window.history.replaceState(null, "", `?${configToParams(config).toString()}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const exportSize = 1200;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", String(exportSize));
    clone.setAttribute("height", String(exportSize));
    const xml = new XMLSerializer().serializeToString(clone);
    const dataUrl =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const grad = ctx.createRadialGradient(
        exportSize / 2,
        exportSize / 2,
        exportSize * 0.1,
        exportSize / 2,
        exportSize / 2,
        exportSize * 0.7
      );
      grad.addColorStop(0, "#14110d");
      grad.addColorStop(1, "#070707");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, exportSize, exportSize);
      ctx.drawImage(img, 0, 0, exportSize, exportSize);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "toli-eskiz.png";
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = dataUrl;
  };

  const isSummary = STEPS[step].id === "summary";
  const nextIsSummary = STEPS[Math.min(step + 1, STEPS.length - 1)].id === "summary";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-14">
      {/* Preview column */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze/10 blur-[90px]"
            aria-hidden="true"
          />
          <MirrorPreview
            ref={svgRef}
            config={config}
            className="relative mx-auto w-full max-w-[15rem] drop-shadow-2xl sm:max-w-sm lg:max-w-md"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={handleDownload} className="btn-secondary px-5 py-3 text-xs">
            Скачать эскиз
          </button>
          <button type="button" onClick={handleCopyLink} className="btn-secondary px-5 py-3 text-xs">
            {copied ? "Ссылка скопирована" : "Скопировать ссылку на эскиз"}
          </button>
        </div>

        <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-warm/35">
          Конструктор позволяет создать предварительный художественный эскиз
          изделия. Возможность исполнения, детали материала и итоговая стоимость
          подтверждаются мастером после обработки заявки.
        </p>
      </div>

      {/* Panel column */}
      <div className="pb-28 lg:pb-0">
        <StepNavigation
          steps={STEPS}
          current={step}
          relevant={relevant}
          onSelect={setStep}
        />

        <div className="mt-8 min-h-[20rem]">
          <AnimatePresence mode="wait">
            <ConfiguratorPanel
              key={STEPS[step].id}
              stepId={STEPS[step].id}
              config={config}
              onChange={onChange}
              onTemplateChange={onTemplateChange}
              getSketchSvg={getSketchSvg}
            />
          </AnimatePresence>
        </div>

        {/* Desktop navigation + price */}
        {!isSummary && (
          <div className="mt-10 hidden items-center justify-between gap-6 border-t border-bronze/10 pt-6 lg:flex">
            <button
              type="button"
              onClick={goPrev}
              disabled={step === 0}
              className="btn-secondary px-6 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-30"
            >
              Назад
            </button>
            <PriceEstimate config={config} />
            <button type="button" onClick={goNext} className="btn-primary px-6 py-3 text-xs">
              {nextIsSummary ? "К заявке" : "Далее"}
            </button>
          </div>
        )}

        {isSummary && (
          <div className="mt-10 hidden border-t border-bronze/10 pt-6 lg:block">
            <PriceEstimate config={config} detailed />
            <button
              type="button"
              onClick={() => setStep(0)}
              className="btn-secondary mt-6 px-6 py-3 text-xs"
            >
              Изменить эскиз
            </button>
          </div>
        )}
      </div>

      {/* Mobile fixed bottom bar */}
      {!isSummary && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bronze/20 bg-graphite/95 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <PriceEstimate config={config} />
            <div className="flex shrink-0 gap-2">
              {step > 0 && (
                <button type="button" onClick={goPrev} className="btn-secondary px-4 py-3 text-xs">
                  Назад
                </button>
              )}
              <button type="button" onClick={goNext} className="btn-primary px-5 py-3 text-xs">
                {nextIsSummary ? "К заявке" : "Далее"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
