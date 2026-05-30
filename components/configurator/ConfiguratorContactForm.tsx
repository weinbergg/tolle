"use client";

import { useState, FormEvent } from "react";
import type { MirrorConfiguration } from "@/types/configurator";
import { buildReadableSummary } from "@/lib/configurator/serializeConfiguration";
import { CONTACT, cn } from "@/lib/utils";

interface ConfiguratorContactFormProps {
  config: MirrorConfiguration;
  getSketchSvg?: () => string | undefined;
}

type FormStatus = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  name?: string;
  contact?: string;
  consent?: string;
}

export default function ConfiguratorContactForm({
  config,
  getSketchSvg,
}: ConfiguratorContactFormProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Укажите имя";
    if (!contact.trim()) {
      next.contact = "Укажите телефон или Telegram";
    } else if (
      !/^[\w.+-]+@[\w.-]+\.\w+|^@?[\w]{3,}$|^\+?[\d\s()-]{7,}$/.test(contact.trim())
    ) {
      next.contact = "Укажите корректный контакт";
    }
    if (!consent) next.consent = "Необходимо согласие на обработку данных";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    const summary = buildReadableSummary(config);
    const fullComment = message.trim()
      ? `${summary}\n\nСообщение: ${message.trim()}`
      : summary;
    const sketchSvg = getSketchSvg?.();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          product: "Конструктор Толе — эскиз",
          comment: fullComment,
          configuration: config,
          schematic: summary,
          sketchSvg,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setName("");
      setContact("");
      setMessage("");
      setConsent(false);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-bronze/30 bg-bronze/10 p-6 text-center" role="status">
        <p className="font-serif text-xl text-bronze-light">Эскиз отправлен мастеру</p>
        <p className="mt-2 text-sm text-warm/60">
          Мы свяжемся с вами, чтобы подтвердить детали, материал и итоговую стоимость.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Форма отправки эскиза">
      <div>
        <label htmlFor="cfg-name" className="text-label mb-2 block">
          Имя
        </label>
        <input
          id="cfg-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((p) => ({ ...p, name: undefined }));
            if (status === "error") setStatus("idle");
          }}
          className={cn(
            "w-full rounded-sm border bg-void/50 px-4 py-3 text-warm placeholder:text-warm/20 focus:border-bronze/40 focus:outline-none",
            errors.name ? "border-burgundy/60" : "border-warm/10"
          )}
          placeholder="Ваше имя"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "cfg-name-error" : undefined}
        />
        {errors.name && (
          <p id="cfg-name-error" className="mt-2 text-sm text-burgundy/80" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cfg-contact" className="text-label mb-2 block">
          Телефон или Telegram
        </label>
        <input
          id="cfg-contact"
          type="text"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            setErrors((p) => ({ ...p, contact: undefined }));
            if (status === "error") setStatus("idle");
          }}
          className={cn(
            "w-full rounded-sm border bg-void/50 px-4 py-3 text-warm placeholder:text-warm/20 focus:border-bronze/40 focus:outline-none",
            errors.contact ? "border-burgundy/60" : "border-warm/10"
          )}
          placeholder="+7… или @username"
          aria-invalid={!!errors.contact}
          aria-describedby={errors.contact ? "cfg-contact-error" : undefined}
        />
        {errors.contact && (
          <p id="cfg-contact-error" className="mt-2 text-sm text-burgundy/80" role="alert">
            {errors.contact}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cfg-message" className="text-label mb-2 block">
          Комментарий
        </label>
        <textarea
          id="cfg-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-sm border border-warm/10 bg-void/50 px-4 py-3 text-warm placeholder:text-warm/20 focus:border-bronze/40 focus:outline-none"
          placeholder="Вопросы или пожелания к эскизу"
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-warm/55">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setErrors((p) => ({ ...p, consent: undefined }));
            }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-bronze"
            aria-invalid={!!errors.consent}
          />
          <span>
            Я согласен на обработку персональных данных для обработки заявки.
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-sm text-burgundy/80" role="alert">
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="rounded-sm border border-burgundy/30 bg-burgundy/10 px-4 py-3 text-sm text-warm/80" role="alert">
          Не удалось отправить эскиз. Напишите нам в{" "}
          <a href={CONTACT.telegram} className="underline" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>{" "}
          или на{" "}
          <a href={CONTACT.email} className="underline">
            {CONTACT.emailAddress}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Отправка…" : "Отправить эскиз мастеру"}
      </button>
    </form>
  );
}
