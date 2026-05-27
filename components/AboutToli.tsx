"use client";

import { motion } from "framer-motion";
import { aboutCards } from "@/data/products";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AboutToli() {
  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="absolute inset-0 gradient-radial-bronze opacity-30" aria-hidden="true" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-label mb-4">О предмете</p>
          <h2 id="about-heading" className="heading-section mb-8 text-warm">
            Что такое зеркало Толе
          </h2>
          <p className="text-body text-balance">
            Толе — зеркальный символический артефакт, связанный с шаманскими и
            ритуальными традициями Центральной и Восточной Азии. В современной
            мастерской он переосмысляется как авторский объект: украшение,
            предмет созерцания, элемент личного пространства и коллекционный
            артефакт.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutCards.map((card, i) => (
            <motion.article
              key={card.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="glass-card group p-8 transition-all duration-500 hover:border-bronze/40"
            >
              <div
                className="mb-6 h-px w-8 bg-bronze/40 transition-all duration-500 group-hover:w-12"
                aria-hidden="true"
              />
              <h3 className="mb-4 font-serif text-xl text-bronze-light">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-warm/60">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
