import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number | null): string {
  if (price === null) return "по запросу";
  return `от ${price.toLocaleString("ru-RU")} ₽`;
}

export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export const CONTACT = {
  telegram: "https://t.me/toli_mirrors",
  whatsapp: "https://wa.me/79001234567",
  email: "mailto:hello@toli-mirrors.ru",
  emailAddress: "hello@toli-mirrors.ru",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
