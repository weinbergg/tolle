"use client";

import { motion } from "framer-motion";
import { orderSteps } from "@/data/products";
import { CONTACT } from "@/lib/utils";

export default function OrderSteps() {
  return (
    <section
      id="order"
      className="section-padding relative bg-graphite/30"
      aria-labelledby="order-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="text-label mb-4">Процесс</p>
          <h2 id="order-heading" className="heading-section mb-6 text-warm">
            Как заказать
          </h2>
        </motion.div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {orderSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center"
            >
              <span
                className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-bronze/30 font-serif text-xl text-bronze-light"
                aria-hidden="true"
              >
                {step.step}
              </span>
              <h3 className="mb-3 font-serif text-xl text-warm">{step.title}</h3>
              <p className="text-sm leading-relaxed text-warm/50">
                {step.description}
              </p>
              {i < orderSteps.length - 1 && (
                <div
                  className="absolute right-0 top-6 hidden h-px w-full translate-x-1/2 bg-bronze/10 md:block"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-label text-warm/40">Свяжитесь с нами</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={CONTACT.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              aria-label="Написать в Telegram"
            >
              Telegram
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label="Написать в WhatsApp"
            >
              WhatsApp
            </a>
            <a
              href={CONTACT.email}
              className="btn-secondary"
              aria-label="Написать на email"
            >
              Email
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
