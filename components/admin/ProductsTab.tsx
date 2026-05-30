"use client";

import { useEffect, useState } from "react";
import type { AdminProduct } from "@/types/admin";
import { fetchProducts, saveProducts } from "@/lib/admin/client";

export default function ProductsTab() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setProducts(await fetchProducts());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (id: string, patch: Partial<AdminProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setDirty(true);
  };

  const move = (index: number, dir: -1 | 1) => {
    setProducts((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((p, i) => ({ ...p, order: i }));
    });
    setDirty(true);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const saved = await saveProducts(products);
      setProducts(saved);
      setDirty(false);
      setSavedAt(new Date().toLocaleTimeString("ru-RU"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-warm/50">Загрузка товаров…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="btn-primary px-6 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Сохранение…" : "Сохранить изменения"}
        </button>
        {dirty && <span className="text-xs text-bronze/70">Есть несохранённые изменения</span>}
        {!dirty && savedAt && <span className="text-xs text-warm/40">Сохранено в {savedAt}</span>}
      </div>

      <div className="space-y-4">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="grid gap-4 rounded-sm border border-warm/10 bg-graphite/40 p-5 md:grid-cols-[auto_120px_1fr]"
          >
            {/* reorder */}
            <div className="flex flex-row gap-2 md:flex-col">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded-sm border border-warm/15 px-3 py-1 text-warm/60 disabled:opacity-30"
                aria-label="Выше"
              >
                ↑
              </button>
              <span className="self-center text-xs text-warm/40">#{i + 1}</span>
              <button
                onClick={() => move(i, 1)}
                disabled={i === products.length - 1}
                className="rounded-sm border border-warm/15 px-3 py-1 text-warm/60 disabled:opacity-30"
                aria-label="Ниже"
              >
                ↓
              </button>
            </div>

            {/* image preview */}
            <div>
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.name} className="aspect-square w-full rounded-sm border border-warm/10 object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-sm border border-dashed border-warm/15 text-[10px] text-warm/30">
                  нет фото
                </div>
              )}
            </div>

            {/* fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  value={p.name}
                  onChange={(e) => update(p.id, { name: e.target.value })}
                  className="w-full rounded-sm border border-warm/10 bg-void/50 px-3 py-2 font-serif text-warm focus:border-bronze/40 focus:outline-none"
                />
                <label className="flex shrink-0 items-center gap-2 text-xs text-warm/55">
                  <input
                    type="checkbox"
                    checked={p.visible}
                    onChange={(e) => update(p.id, { visible: e.target.checked })}
                    className="h-4 w-4 accent-bronze"
                  />
                  Виден
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  value={p.material}
                  onChange={(e) => update(p.id, { material: e.target.value })}
                  placeholder="Материал"
                  className="rounded-sm border border-warm/10 bg-void/50 px-3 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
                />
                <input
                  value={p.size}
                  onChange={(e) => update(p.id, { size: e.target.value })}
                  placeholder="Размер"
                  className="rounded-sm border border-warm/10 bg-void/50 px-3 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
                />
                <input
                  type="number"
                  value={p.price ?? ""}
                  onChange={(e) =>
                    update(p.id, { price: e.target.value === "" ? null : Number(e.target.value) })
                  }
                  placeholder="Цена ₽"
                  className="rounded-sm border border-warm/10 bg-void/50 px-3 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
                />
              </div>

              <input
                value={p.image}
                onChange={(e) => update(p.id, { image: e.target.value })}
                placeholder="URL изображения (https://… или /…)"
                className="w-full rounded-sm border border-warm/10 bg-void/50 px-3 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
              />

              <textarea
                value={p.description}
                onChange={(e) => update(p.id, { description: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-sm border border-warm/10 bg-void/50 px-3 py-2 text-sm text-warm focus:border-bronze/40 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
