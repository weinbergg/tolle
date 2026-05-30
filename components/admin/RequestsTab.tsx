"use client";

import { useEffect, useState } from "react";
import type { RequestStatus, StoredRequest } from "@/types/admin";
import {
  fetchRequests,
  patchRequest,
  removeRequest,
  svgToDataUrl,
} from "@/lib/admin/client";
import { downloadRequestPdf } from "@/lib/admin/pdf";

const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
  archived: "Архив",
};

const STATUS_ORDER: RequestStatus[] = ["new", "in_progress", "done", "archived"];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function RequestsTab() {
  const [requests, setRequests] = useState<StoredRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const [pdfId, setPdfId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setRequests(await fetchRequests());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onStatus = async (id: string, status: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await patchRequest(id, status);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Удалить заявку безвозвратно?")) return;
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await removeRequest(id);
  };

  const onPdf = async (r: StoredRequest) => {
    setPdfId(r.id);
    try {
      await downloadRequestPdf(r);
    } catch {
      alert("Не удалось сформировать PDF.");
    } finally {
      setPdfId(null);
    }
  };

  const visible =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  if (loading) return <p className="text-warm/50">Загрузка заявок…</p>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full border px-4 py-1.5 text-xs ${
            filter === "all" ? "border-bronze bg-bronze/15 text-bronze-light" : "border-warm/15 text-warm/60"
          }`}
        >
          Все ({requests.length})
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-xs ${
              filter === s ? "border-bronze bg-bronze/15 text-bronze-light" : "border-warm/15 text-warm/60"
            }`}
          >
            {STATUS_LABELS[s]} ({requests.filter((r) => r.status === s).length})
          </button>
        ))}
        <button
          onClick={load}
          className="ml-auto rounded-full border border-warm/15 px-4 py-1.5 text-xs text-warm/60"
        >
          Обновить
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-warm/40">Заявок нет.</p>
      ) : (
        <div className="space-y-5">
          {visible.map((r) => (
            <article
              key={r.id}
              className="grid gap-5 rounded-sm border border-warm/10 bg-graphite/40 p-5 md:grid-cols-[180px_1fr]"
            >
              {/* Sketch image */}
              <div>
                {r.sketchSvg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={svgToDataUrl(r.sketchSvg)}
                    alt="Эскиз"
                    className="w-full rounded-sm border border-warm/10 bg-void"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-sm border border-dashed border-warm/15 text-xs text-warm/30">
                    Без эскиза
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg text-warm">{r.name}</p>
                    <p className="text-sm text-warm/50">{r.contact}</p>
                  </div>
                  <time className="text-xs text-warm/40">{formatDate(r.createdAt)}</time>
                </div>

                <p className="mb-2 text-xs uppercase tracking-wider text-bronze/70">{r.product}</p>

                {r.schematic ? (
                  <pre className="mb-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-sm border border-warm/10 bg-void/60 p-3 text-xs leading-relaxed text-warm/75">
                    {r.schematic}
                  </pre>
                ) : (
                  r.comment && (
                    <pre className="mb-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-sm border border-warm/10 bg-void/60 p-3 text-xs leading-relaxed text-warm/75">
                      {r.comment}
                    </pre>
                  )
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {STATUS_ORDER.map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatus(r.id, s)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        r.status === s
                          ? "border-bronze bg-bronze/20 text-bronze-light"
                          : "border-warm/15 text-warm/50 hover:border-warm/30"
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                  <button
                    onClick={() => onPdf(r)}
                    disabled={pdfId === r.id}
                    className="ml-auto rounded-full border border-bronze/40 px-3 py-1 text-xs text-bronze-light hover:bg-bronze/10 disabled:opacity-50"
                  >
                    {pdfId === r.id ? "Формирую…" : "Скачать PDF"}
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="rounded-full border border-burgundy/40 px-3 py-1 text-xs text-burgundy/80 hover:bg-burgundy/10"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
