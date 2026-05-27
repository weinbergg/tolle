"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqItems } from "@/data/products";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="section-padding relative"
      aria-labelledby="faq-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-label mb-4">Вопросы</p>
          <h2 id="faq-heading" className="heading-section text-warm">
            Часто задаваемые вопросы
          </h2>
        </motion.div>

        <div className="mx-auto max-w-3xl divide-y divide-bronze/10">
          {faqItems.map((item, i) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <h3>
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors duration-300 hover:text-bronze-light"
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-serif text-lg text-warm md:text-xl">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bronze/20 text-bronze/60 transition-transform duration-300",
                      openIndex === i && "rotate-45 border-bronze/40"
                    )}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                  >
                    <p className="pb-6 text-sm leading-relaxed text-warm/60 md:text-base">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
