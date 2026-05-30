"use client";

import { useEffect, useMemo, useState } from "react";
import type { Catalog, CatalogItem, CatalogTheme } from "@/types/catalog";
import type { CustomZone, PatternShape } from "@/types/configurator";
import { fetchCatalog, saveCatalog } from "@/lib/admin/client";
import { getPattern } from "@/data/configurator/patterns";
import { getPetroglyph } from "@/data/configurator/petroglyphs";

const ZONES: { id: CustomZone; label: string; hasPrice: boolean }[] = [
  { id: "center", label: "Центр", hasPrice: true },
  { id: "radial", label: "Окружность", hasPrice: true },
  { id: "border", label: "Рамка", hasPrice: true },
  { id: "petroglyph", label: "Петроглифы", hasPrice: false },
];

function Thumb({ zone, id }: { zone: CustomZone; id: string }) {
  let shapes: PatternShape[] | undefined;
  if (zone === "petroglyph") shapes = getPetroglyph(id)?.shapes;
  else shapes = getPattern(id)?.shapes;
  if (!shapes) return <div className="h-9 w-9 rounded-sm border border-dashed border-warm/15" />;
  return (
    <svg viewBox="0 0 100 100" className="h-9 w-9 shrink-0" aria-hidden="true">
      {shapes.map((s, i) =>
        s.filled ? (
          <path key={i} d={s.d} fill="#C79A60" />
        ) : (
          <path
            key={i}
            d={s.d}
            fill="none"
            stroke="#C79A60"
            strokeWidth={2.2 * (s.weight ?? 1)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      )}
    </svg>
  );
}

export default function CatalogTab() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [zone, setZone] = useState<CustomZone>("center");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setCatalog(await fetchCatalog());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const zoneThemes = useMemo<CatalogTheme[]>(
    () =>
      (catalog?.themes ?? [])
        .filter((t) => t.zone === zone)
        .sort((a, b) => a.order - b.order),
    [catalog, zone]
  );

  const zoneItems = useMemo<CatalogItem[]>(
    () =>
      (catalog?.items ?? [])
        .filter((i) => i.zone === zone)
        .sort((a, b) => a.order - b.order),
    [catalog, zone]
  );

  const updateItem = (id: string, patch: Partial<CatalogItem>) => {
    setCatalog((prev) =>
      prev
        ? { ...prev, items: prev.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }
        : prev
    );
    setDirty(true);
  };

  const updateTheme = (id: string, patch: Partial<CatalogTheme>) => {
    setCatalog((prev) =>
      prev
        ? {
            ...prev,
            themes: prev.themes.map((t) =>
              t.id === id && t.zone === zone ? { ...t, ...patch } : t
            ),
          }
        : prev
    );
    setDirty(true);
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= zoneItems.length) return;
    const reordered = [...zoneItems];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const orderById = new Map(reordered.map((it, i) => [it.id, i]));
    setCatalog((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((i) =>
              i.zone === zone ? { ...i, order: orderById.get(i.id) ?? i.order } : i
            ),
          }
        : prev
    );
    setDirty(true);
  };

  const onSave = async () => {
    if (!catalog) return;
    setSaving(true);
    try {
      const saved = await saveCatalog(catalog);
      setCatalog(saved);
      setDirty(false);
      setSavedAt(new Date().toLocaleTimeString("ru-RU"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-warm/50">Загрузка каталога…</p>;
  if (!catalog) return <p className="text-warm/50">Каталог недоступен.</p>;

  const activeZone = ZONES.find((z) => z.id === zone)!;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="btn-primary px-6 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Сохранение…" : "Сохранить изменения"}
        </button>
        {dirty && <span className="text-xs text-bronze/70">Есть несохранённые изменения</span>}
        {!dirty && savedAt && <span className="text-xs text-warm/40">Сохранено в {savedAt}</span>}
        <p className="text-xs text-warm/35">
          Рисунки символов хранятся в коде; здесь редактируются названия, темы, цены,
          порядок и видимость.
        </p>
      </div>

      {/* Zone switcher */}
      <div className="mb-8 flex flex-wrap gap-2">
        {ZONES.map((z) => (
          <button
            key={z.id}
            onClick={() => setZone(z.id)}
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-wider ${
              zone === z.id
                ? "border-bronze bg-bronze/15 text-bronze-light"
                : "border-warm/15 text-warm/55 hover:border-warm/30"
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* Themes editor */}
      <section className="mb-10">
        <h3 className="mb-3 text-xs uppercase tracking-wider text-warm/40">
          Тематические разделы
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {zoneThemes.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-sm border border-warm/10 bg-graphite/40 px-3 py-2"
            >
              <input
                value={t.name}
                onChange={(e) => updateTheme(t.id, { name: e.target.value })}
                className="w-full rounded-sm border border-warm/10 bg-void/50 px-3 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
              />
              <input
                type="number"
                value={t.order}
                onChange={(e) => updateTheme(t.id, { order: Number(e.target.value) })}
                className="w-16 rounded-sm border border-warm/10 bg-void/50 px-2 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
                title="Порядок"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Items editor */}
      <section>
        <h3 className="mb-3 text-xs uppercase tracking-wider text-warm/40">
          Элементы — {activeZone.label}
        </h3>
        <div className="space-y-3">
          {zoneItems.map((item, i) => (
            <div
              key={item.id}
              className="grid items-start gap-3 rounded-sm border border-warm/10 bg-graphite/40 p-4 md:grid-cols-[auto_auto_1fr]"
            >
              <div className="flex flex-row gap-1 md:flex-col">
                <button
                  onClick={() => moveItem(i, -1)}
                  disabled={i === 0}
                  className="rounded-sm border border-warm/15 px-2 py-1 text-warm/60 disabled:opacity-30"
                  aria-label="Выше"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(i, 1)}
                  disabled={i === zoneItems.length - 1}
                  className="rounded-sm border border-warm/15 px-2 py-1 text-warm/60 disabled:opacity-30"
                  aria-label="Ниже"
                >
                  ↓
                </button>
              </div>

              <div className="flex items-center justify-center rounded-sm border border-warm/10 bg-void/40 p-1">
                <Thumb zone={item.zone} id={item.id} />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="min-w-[10rem] flex-1 rounded-sm border border-warm/10 bg-void/50 px-3 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
                  />
                  <select
                    value={item.theme}
                    onChange={(e) => updateItem(item.id, { theme: e.target.value })}
                    className="rounded-sm border border-warm/10 bg-void/50 px-2 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
                  >
                    {zoneThemes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {activeZone.hasPrice && (
                    <input
                      type="number"
                      value={item.priceModifier}
                      onChange={(e) =>
                        updateItem(item.id, { priceModifier: Number(e.target.value) })
                      }
                      title="Наценка, ₽"
                      className="w-24 rounded-sm border border-warm/10 bg-void/50 px-2 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
                    />
                  )}
                  <label className="flex shrink-0 items-center gap-2 text-xs text-warm/55">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(e) => updateItem(item.id, { visible: e.target.checked })}
                      className="h-4 w-4 accent-bronze"
                    />
                    Виден
                  </label>
                </div>
                {activeZone.hasPrice && (
                  <input
                    value={item.description ?? ""}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="Описание"
                    className="w-full rounded-sm border border-warm/10 bg-void/50 px-3 py-2 text-xs text-warm/80 focus:border-bronze/40 focus:outline-none"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
