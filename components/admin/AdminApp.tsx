"use client";

import { useEffect, useState } from "react";
import { clearKey, getKey, login } from "@/lib/admin/client";
import RequestsTab from "./RequestsTab";
import ProductsTab from "./ProductsTab";
import CatalogTab from "./CatalogTab";
import StatsTab from "./StatsTab";

type Tab = "requests" | "products" | "catalog" | "stats";

const TABS: { id: Tab; label: string }[] = [
  { id: "requests", label: "Заявки" },
  { id: "products", label: "Товары" },
  { id: "catalog", label: "Каталог" },
  { id: "stats", label: "Статистика" },
];

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const ok = await login(password);
    setLoading(false);
    if (ok) onSuccess();
    else setError(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <p className="font-serif text-3xl tracking-[0.3em] text-bronze-light">ТОЛЕ</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-warm/40">Админ-панель</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          autoFocus
          className="w-full rounded-sm border border-warm/15 bg-graphite/50 px-4 py-3 text-warm focus:border-bronze/40 focus:outline-none"
        />
        {error && <p className="text-sm text-burgundy/80">Неверный пароль</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? "Проверка…" : "Войти"}
        </button>
        <p className="text-center text-[11px] text-warm/30">
          Пароль по умолчанию: toli-admin (задаётся через ADMIN_PASSWORD)
        </p>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("requests");

  useEffect(() => {
    setAuthed(!!getKey());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-warm/10 pb-6">
        <div className="flex items-center gap-4">
          <span className="font-serif text-2xl tracking-[0.3em] text-bronze-light">ТОЛЕ</span>
          <span className="text-xs uppercase tracking-wider text-warm/40">Админ</span>
        </div>
        <nav className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-wider ${
                tab === t.id
                  ? "border-bronze bg-bronze/15 text-bronze-light"
                  : "border-warm/15 text-warm/55 hover:border-warm/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            clearKey();
            setAuthed(false);
          }}
          className="rounded-full border border-warm/15 px-4 py-2 text-xs text-warm/50 hover:border-warm/30"
        >
          Выйти
        </button>
      </header>

      {tab === "requests" && <RequestsTab />}
      {tab === "products" && <ProductsTab />}
      {tab === "catalog" && <CatalogTab />}
      {tab === "stats" && <StatsTab />}
    </div>
  );
}
