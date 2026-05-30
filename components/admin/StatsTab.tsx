"use client";

import { useEffect, useState } from "react";
import type { AdminProduct, Stats } from "@/types/admin";
import { fetchProducts, fetchStats } from "@/lib/admin/client";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-warm/10 bg-graphite/40 p-6">
      <p className="font-serif text-4xl text-bronze-light">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-warm/45">{label}</p>
    </div>
  );
}

export default function StatsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s, p] = await Promise.all([fetchStats(), fetchProducts()]);
        setStats(s);
        setProducts(p);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !stats) return <p className="text-warm/50">Загрузка статистики…</p>;

  const productRows = products
    .map((p) => ({ name: p.name, views: stats.productViews[p.id] ?? 0 }))
    .sort((a, b) => b.views - a.views);
  const maxViews = Math.max(1, ...productRows.map((r) => r.views));

  const dailyEntries = Object.entries(stats.daily).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  const maxDaily = Math.max(1, ...dailyEntries.map(([, v]) => v));

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Просмотры сайта" value={stats.pageViews} />
        <StatCard label="Открытий конструктора" value={stats.constructorViews} />
        <StatCard label="Заявок всего" value={stats.requests} />
        <StatCard
          label="Просмотров товаров"
          value={Object.values(stats.productViews).reduce((a, b) => a + b, 0)}
        />
      </div>

      <div>
        <h3 className="mb-4 text-label">Просмотры по товарам</h3>
        <div className="space-y-3">
          {productRows.map((r) => (
            <div key={r.name} className="flex items-center gap-4">
              <span className="w-56 shrink-0 truncate text-sm text-warm/70">{r.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-warm/5">
                <div
                  className="h-full rounded-full bg-bronze"
                  style={{ width: `${(r.views / maxViews) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm text-warm/60">{r.views}</span>
            </div>
          ))}
        </div>
      </div>

      {dailyEntries.length > 0 && (
        <div>
          <h3 className="mb-4 text-label">Посещения по дням</h3>
          <div className="flex items-end gap-2" style={{ height: 120 }}>
            {dailyEntries.map(([day, v]) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-bronze/70"
                    style={{ height: `${(v / maxDaily) * 100}%` }}
                    title={`${v}`}
                  />
                </div>
                <span className="text-[10px] text-warm/40">{day.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
