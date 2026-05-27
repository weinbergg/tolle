"use client";

import { motion } from "framer-motion";

const workshopBlocks = [
  {
    title: "Поверхность",
    description: "Каждая отражающая поверхность создаётся и полируется вручную",
    gradient: "from-bronze-dark via-graphite to-void",
  },
  {
    title: "Металл",
    description: "Латунь, бронза, серебро — материалы с характером и весом",
    gradient: "from-zinc-800 via-graphite to-bronze-dark",
  },
  {
    title: "Баланс",
    description: "Вес, тактильность и пропорции выверяются на каждом этапе",
    gradient: "from-graphite via-bronze-dark/50 to-void",
  },
];

export default function Workshop() {
  return (
    <section
      id="workshop"
      className="section-padding relative bg-graphite/20"
      aria-labelledby="workshop-heading"
    >
      <div className="section-container">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-label mb-4">Мастерская</p>
            <h2 id="workshop-heading" className="heading-section mb-8 text-warm">
              Ручная работа
            </h2>
            <p className="text-body mb-6">
              Каждое зеркало создаётся небольшими партиями. Важны поверхность,
              вес, баланс металла и света, тактильность и спокойная
              выразительность формы.
            </p>
            <p className="text-body">
              Мастерская — это пространство тишины, металла и внимания к
              детали. Мы не торопим процесс: время — часть качества.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {workshopBlocks.map((block, i) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="group relative overflow-hidden rounded-sm"
              >
                <div
                  className={`relative flex min-h-[180px] items-end bg-gradient-to-br ${block.gradient} p-8 transition-transform duration-700 group-hover:scale-[1.02]`}
                  role="img"
                  aria-label={`${block.title}: ${block.description}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(176,141,87,0.1),transparent_60%)]" aria-hidden="true" />
                  <div className="absolute right-8 top-8 h-16 w-16 rounded-full border border-bronze/20 opacity-40" aria-hidden="true" />
                  <div className="absolute right-12 top-12 h-8 w-8 rounded-full bg-bronze/10 blur-sm" aria-hidden="true" />
                  <div className="relative">
                    <h3 className="mb-2 font-serif text-xl text-bronze-light">
                      {block.title}
                    </h3>
                    <p className="text-sm text-warm/50">{block.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
