"use client";

import { motion } from "framer-motion";
import type { MirrorConfiguration } from "@/types/configurator";
import { getTemplate } from "@/data/configurator/templates";
import { getPatternsByCategory } from "@/data/configurator/patterns";
import MaterialSelector from "./MaterialSelector";
import TemplateSelector from "./TemplateSelector";
import PatternSelector from "./PatternSelector";
import PetroglyphBoard from "./PetroglyphBoard";
import AddonSelector from "./AddonSelector";
import ConfigurationSummary from "./ConfigurationSummary";
import ConfiguratorContactForm from "./ConfiguratorContactForm";

interface ConfiguratorPanelProps {
  stepId: string;
  config: MirrorConfiguration;
  onChange: <K extends keyof MirrorConfiguration>(
    key: K,
    value: MirrorConfiguration[K]
  ) => void;
  onTemplateChange: (templateId: string) => void;
  getSketchSvg?: () => string | undefined;
}

const STEP_META: Record<string, { title: string; hint: string }> = {
  base: { title: "Основа и материал", hint: "Размер, металл и характер обработки" },
  composition: { title: "Композиция", hint: "Схема размещения символов и узоров" },
  center: { title: "Центральный символ", hint: "Главный мотив в центре зеркала" },
  radial: { title: "Узор по окружности", hint: "Повторяющийся элемент по кругу" },
  border: { title: "Орнаментальная рамка", hint: "Внешний орнамент по краю поля" },
  petroglyphs: { title: "Петроглифы", hint: "Расставьте символы по точкам или загрузите своё" },
  addons: { title: "Дополнения", hint: "Подвес, гравировка и упаковка" },
  summary: { title: "Итог и заявка", hint: "Проверьте эскиз и отправьте мастеру" },
};

export default function ConfiguratorPanel({
  stepId,
  config,
  onChange,
  onTemplateChange,
  getSketchSvg,
}: ConfiguratorPanelProps) {
  const template = getTemplate(config.templateId);
  const meta = STEP_META[stepId];

  return (
    <motion.div
      key={stepId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="mb-6">
        <h2 className="font-serif text-2xl text-warm">{meta.title}</h2>
        <p className="mt-1 text-sm text-warm/45">{meta.hint}</p>
      </header>

      {stepId === "base" && <MaterialSelector config={config} onChange={onChange} />}

      {stepId === "composition" && (
        <TemplateSelector config={config} onChange={onTemplateChange} />
      )}

      {stepId === "center" && (
        <PatternSelector
          patterns={getPatternsByCategory("center")}
          selectedId={config.centerPatternId}
          allowNone={template.centerOptional}
          onSelect={(id) => onChange("centerPatternId", id)}
          disabled={!template.supportsCenter}
          disabledHint="В выбранной композиции нет центрального символа."
        />
      )}

      {stepId === "radial" && (
        <PatternSelector
          patterns={getPatternsByCategory("radial")}
          selectedId={config.radialPatternId}
          onSelect={(id) => onChange("radialPatternId", id)}
          disabled={!template.supportsRadial}
          disabledHint="В выбранной композиции нет узоров по окружности."
        />
      )}

      {stepId === "border" && (
        <PatternSelector
          patterns={getPatternsByCategory("border")}
          selectedId={config.borderPatternId}
          onSelect={(id) => onChange("borderPatternId", id)}
          disabled={!template.supportsBorder}
          disabledHint="В выбранной композиции нет орнаментальной рамки."
        />
      )}

      {stepId === "petroglyphs" && (
        <PetroglyphBoard config={config} onChange={onChange} />
      )}

      {stepId === "addons" && <AddonSelector config={config} onChange={onChange} />}

      {stepId === "summary" && (
        <div className="space-y-8">
          <ConfigurationSummary config={config} />
          <p className="rounded-sm border border-bronze/20 bg-bronze/5 px-4 py-3 text-xs leading-relaxed text-warm/55">
            Финальная стоимость и возможность исполнения подтверждаются мастером
            после рассмотрения эскиза.
          </p>
          <ConfiguratorContactForm config={config} getSketchSvg={getSketchSvg} />
        </div>
      )}
    </motion.div>
  );
}
