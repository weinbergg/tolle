"use client";

import { CONTACT } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-bronze/10 bg-void" role="contentinfo">
      <div className="section-container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <span className="mb-4 block font-serif text-2xl tracking-[0.2em] text-bronze-light">
              ТОЛЕ
            </span>
            <p className="text-sm leading-relaxed text-warm/40">
              Авторские шаманские зеркала ручной работы. Символические
              артефакты, украшения и декоративные предметы.
            </p>
          </div>

          <div>
            <h2 className="text-label mb-4">Связь</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={CONTACT.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm/50 transition-colors duration-300 hover:text-bronze-light"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm/50 transition-colors duration-300 hover:text-bronze-light"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.email}
                  className="text-warm/50 transition-colors duration-300 hover:text-bronze-light"
                >
                  {CONTACT.emailAddress}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-label mb-4">Документы</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-warm/50 transition-colors duration-300 hover:text-bronze-light"
                  aria-label="Политика конфиденциальности"
                >
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-warm/50 transition-colors duration-300 hover:text-bronze-light"
                  aria-label="Публичная оферта"
                >
                  Публичная оферта
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-bronze/10 pt-8">
          <p className="mb-4 text-xs leading-relaxed text-warm/25">
            Изделия не являются медицинскими, финансовыми или магическими
            услугами. Описания символики носят культурный, художественный и
            информационный характер.
          </p>
          <p className="text-xs text-warm/20">
            © {currentYear} Толе. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
