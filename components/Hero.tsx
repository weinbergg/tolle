"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ToliMirrorScene from "./ToliMirrorScene";
import { scrollToSection } from "@/lib/utils";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      aria-label="Главный экран"
    >
      <div className="absolute inset-0 bg-void" aria-hidden="true" />
      <div
        className="absolute inset-0 gradient-radial-smoke opacity-60"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze/5 blur-[120px] animate-gradient-shift"
        aria-hidden="true"
      />

      <div className="section-container relative z-10 flex flex-1 flex-col">
        <header className="flex items-center justify-between py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-serif text-xl tracking-[0.3em] text-bronze-light md:text-2xl">
              ТОЛЕ
            </span>
          </motion.div>
          <motion.nav
            className="hidden items-center gap-8 md:flex"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            aria-label="Основная навигация"
          >
            {[
              { label: "Коллекция", id: "collection" },
              { label: "О бренде", id: "about" },
              { label: "Контакты", id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-label text-warm/50 transition-colors duration-300 hover:text-bronze-light"
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/constructor"
              className="text-label text-bronze-light/80 transition-colors duration-300 hover:text-bronze-light"
            >
              Конструктор
            </Link>
          </motion.nav>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-16 pt-8 lg:flex-row lg:gap-16">
          <motion.div
            className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left lg:flex-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-label mb-6">Авторская мастерская</p>
            <h1 className="heading-display text-balance mb-6 text-warm">
              Шаманские зеркала Толе
            </h1>
            <p className="text-body text-balance mb-10 max-w-xl">
              Авторские символические артефакты ручной работы — на границе
              украшения, объекта созерцания и коллекционного предмета.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/constructor"
                className="btn-primary"
                aria-label="Открыть конструктор зеркала"
              >
                Создать своё зеркало
              </Link>
              <button
                onClick={() => scrollToSection("collection")}
                className="btn-secondary"
                aria-label="Перейти к коллекции зеркал"
              >
                Смотреть коллекцию
              </button>
            </div>
          </motion.div>

          <motion.div
            className="order-1 h-[340px] w-full max-w-md lg:order-2 lg:h-[500px] lg:max-w-lg lg:flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ToliMirrorScene />
          </motion.div>
        </div>

        <motion.p
          className="mx-auto max-w-2xl pb-8 text-center text-xs leading-relaxed text-warm/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Изделия являются декоративными и символическими предметами. Описания не
          являются обещанием медицинского, финансового или сверхъестественного
          результата.
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-label text-warm/20">Листайте</span>
          <div className="h-8 w-px bg-gradient-to-b from-bronze/40 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
