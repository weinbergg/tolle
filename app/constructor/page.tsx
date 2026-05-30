import type { Metadata } from "next";
import Link from "next/link";
import MirrorConfigurator from "@/components/configurator/MirrorConfigurator";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  title: "Конструктор зеркала Толе | Соберите авторский эскиз",
  description:
    "Интерактивный конструктор зеркала Толе: выберите материал, символы, орнамент и отправьте художественный эскиз мастеру.",
  openGraph: {
    title: "Конструктор зеркала Толе | Соберите авторский эскиз",
    description:
      "Интерактивный конструктор зеркала Толе: материал, символы, орнамент и отправка эскиза мастеру.",
    type: "website",
    locale: "ru_RU",
    siteName: "Толе",
  },
};

export default function ConstructorPage() {
  return (
    <>
      <Analytics event="constructor" />
      <header className="border-b border-bronze/10">
        <div className="section-container flex items-center justify-between py-6">
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.3em] text-bronze-light transition-colors hover:text-warm"
          >
            ТОЛЕ
          </Link>
          <Link
            href="/"
            className="text-label text-warm/50 transition-colors hover:text-bronze-light"
          >
            ← На главную
          </Link>
        </div>
      </header>

      <main className="section-container py-14 md:py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-label mb-4">Конструктор</p>
          <h1 className="heading-section mb-5 text-warm">Соберите своё зеркало Толе</h1>
          <p className="text-body">
            Выберите основу, материал, символы и орнамент — и получите
            предварительный художественный эскиз. Композиции ограничены тем, что
            мастер действительно может изготовить вручную.
          </p>
        </div>

        <MirrorConfigurator />
      </main>

      <Footer />
    </>
  );
}
