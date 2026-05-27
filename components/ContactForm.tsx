"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  contact: string;
  product: string;
  comment: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contact: "",
    product: products[0].id,
    comment: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Укажите имя";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Укажите контакт для связи";
    } else if (
      !/^[\w.-]+@[\w.-]+\.\w+|^\+?[\d\s()-]{7,}$/.test(formData.contact.trim())
    ) {
      newErrors.contact = "Укажите email или телефон";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      setFormData({
        name: "",
        contact: "",
        product: products[0].id,
        comment: "",
      });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  };

  return (
    <section
      id="contact"
      className="section-padding relative bg-graphite/20"
      aria-labelledby="contact-heading"
    >
      <div className="section-container">
        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-label mb-4">Контакты</p>
            <h2 id="contact-heading" className="heading-section mb-6 text-warm">
              Оставить заявку
            </h2>
            <p className="text-body">
              Расскажите, какое изделие вас интересует — мы свяжемся для
              уточнения деталей, сроков и стоимости.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card space-y-6 p-8 md:p-10"
              noValidate
              aria-label="Форма заявки"
            >
              <div>
                <label htmlFor="name" className="text-label mb-2 block">
                  Имя
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={cn(
                    "w-full rounded-sm border bg-void/50 px-4 py-3 text-warm transition-colors duration-300 placeholder:text-warm/20 focus:border-bronze/40 focus:outline-none",
                    errors.name ? "border-burgundy/60" : "border-warm/10"
                  )}
                  placeholder="Ваше имя"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-burgundy/80" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact" className="text-label mb-2 block">
                  Контакт
                </label>
                <input
                  id="contact"
                  type="text"
                  value={formData.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                  className={cn(
                    "w-full rounded-sm border bg-void/50 px-4 py-3 text-warm transition-colors duration-300 placeholder:text-warm/20 focus:border-bronze/40 focus:outline-none",
                    errors.contact ? "border-burgundy/60" : "border-warm/10"
                  )}
                  placeholder="Email или телефон"
                  aria-invalid={!!errors.contact}
                  aria-describedby={errors.contact ? "contact-error" : undefined}
                />
                {errors.contact && (
                  <p id="contact-error" className="mt-2 text-sm text-burgundy/80" role="alert">
                    {errors.contact}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="product-select" className="text-label mb-2 block">
                  Интересующее изделие
                </label>
                <select
                  id="product-select"
                  value={formData.product}
                  onChange={(e) => handleChange("product", e.target.value)}
                  className="w-full rounded-sm border border-warm/10 bg-void/50 px-4 py-3 text-warm transition-colors duration-300 focus:border-bronze/40 focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="text-label mb-2 block">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-sm border border-warm/10 bg-void/50 px-4 py-3 text-warm transition-colors duration-300 placeholder:text-warm/20 focus:border-bronze/40 focus:outline-none"
                  placeholder="Пожелания, вопросы, детали заказа"
                />
              </div>

              {status === "success" && (
                <p className="rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-bronze-light" role="status">
                  Заявка отправлена. Мы свяжемся с вами в ближайшее время.
                </p>
              )}

              {status === "error" && (
                <p className="rounded-sm border border-burgundy/30 bg-burgundy/10 px-4 py-3 text-sm text-warm/80" role="alert">
                  Не удалось отправить заявку. Попробуйте связаться через Telegram или email.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Отправить заявку"
              >
                {status === "loading" ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
