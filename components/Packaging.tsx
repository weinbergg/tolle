"use client";

import { motion } from "framer-motion";
import { packagingItems } from "@/data/products";

export default function Packaging() {
  return (
    <section
      id="packaging"
      className="section-padding relative overflow-hidden"
      aria-labelledby="packaging-heading"
    >
      <div className="absolute inset-0 gradient-radial-bronze opacity-20" aria-hidden="true" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="text-label mb-4">Комплектация</p>
          <h2 id="packaging-heading" className="heading-section mb-6 text-warm">
            Упаковка
          </h2>
          <p className="text-body mx-auto max-w-xl">
            Каждое изделие сопровождается продуманной комплектацией — от
            защитной упаковки до карточки с описанием символики.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {packagingItems.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-card group p-6 text-center transition-all duration-500 hover:border-bronze/40"
            >
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-bronze/20 bg-bronze/5 transition-all duration-500 group-hover:border-bronze/40 group-hover:bg-bronze/10"
                aria-hidden="true"
              >
                <div className="h-6 w-6 rounded-sm border border-bronze/30 bg-gradient-to-br from-bronze-dark to-graphite" />
              </div>
              <h3 className="mb-3 font-serif text-lg text-bronze-light">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-warm/50">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
