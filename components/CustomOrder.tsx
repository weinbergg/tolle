"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { customOrderOptions } from "@/data/products";
import { cn, scrollToSection } from "@/lib/utils";

type OptionKey = keyof typeof customOrderOptions;

const optionLabels: Record<OptionKey, string> = {
  sizes: "Размер",
  metals: "Металл / покрытие",
  pendants: "Подвес",
  engravings: "Гравировка",
  symbols: "Символ",
  packaging: "Упаковка",
};

export default function CustomOrder() {
  const [selections, setSelections] = useState<Record<OptionKey, string>>({
    sizes: customOrderOptions.sizes[2],
    metals: customOrderOptions.metals[0],
    pendants: customOrderOptions.pendants[1],
    engravings: customOrderOptions.engravings[0],
    symbols: customOrderOptions.symbols[0],
    packaging: customOrderOptions.packaging[0],
  });

  const handleSelect = (key: OptionKey, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const handleDiscuss = () => {
    scrollToSection("contact");
    setTimeout(() => {
      const select = document.getElementById("product-select") as HTMLSelectElement;
      const comment = document.getElementById("comment") as HTMLTextAreaElement;
      if (select) {
        select.value = "toli-custom";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (comment) {
        const config = Object.entries(selections)
          .map(([key, val]) => `${optionLabels[key as OptionKey]}: ${val}`)
          .join("\n");
        comment.value = `Индивидуальный заказ:\n${config}`;
      }
    }, 500);
  };

  return (
    <section
      id="custom-order"
      className="section-padding relative overflow-hidden"
      aria-labelledby="custom-order-heading"
    >
      <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-burgundy/5 blur-[100px]" aria-hidden="true" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-label mb-4">Индивидуальный заказ</p>
          <h2 id="custom-order-heading" className="heading-section mb-6 text-warm">
            Создайте своё зеркало
          </h2>
          <p className="text-body">
            Выберите параметры — мы обсудим детали, сроки и стоимость в
            диалоге. Каждое индивидуальное изделие создаётся в мастерской с
            нуля.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-10">
            {(Object.keys(customOrderOptions) as OptionKey[]).map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <h3 className="text-label mb-4 text-bronze-light/80">
                  {optionLabels[key]}
                </h3>
                <div className="flex flex-wrap gap-2" role="group" aria-label={optionLabels[key]}>
                  {customOrderOptions[key].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(key, option)}
                      className={cn(
                        "rounded-sm border px-4 py-2.5 text-sm transition-all duration-300",
                        selections[key] === option
                          ? "border-bronze/60 bg-bronze/15 text-bronze-light"
                          : "border-warm/10 text-warm/50 hover:border-warm/20 hover:text-warm/70"
                      )}
                      aria-pressed={selections[key] === option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card flex flex-col justify-between p-10"
          >
            <div>
              <h3 className="mb-8 font-serif text-2xl text-warm">
                Ваша конфигурация
              </h3>
              <dl className="space-y-4">
                {(Object.keys(selections) as OptionKey[]).map((key) => (
                  <div
                    key={key}
                    className="flex justify-between gap-4 border-b border-bronze/10 pb-4 text-sm"
                  >
                    <dt className="text-warm/40">{optionLabels[key]}</dt>
                    <dd className="text-right text-warm/70">{selections[key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-10">
              <p className="mb-6 text-sm text-warm/40">
                Стоимость рассчитывается индивидуально после обсуждения
                конфигурации.
              </p>
              <button
                onClick={handleDiscuss}
                className="btn-primary w-full"
                aria-label="Обсудить индивидуальный заказ"
              >
                Обсудить заказ
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
