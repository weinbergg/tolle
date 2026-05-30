"use client";

import type { StoredRequest } from "@/types/admin";
import { svgToDataUrl } from "./client";

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
  archived: "Архив",
};

/** A4 portrait canvas in CSS px (≈96dpi); rasterised at 2× for crisp text. */
const PAGE_W = 794;
const PAGE_H = 1123;
const RASTER_SCALE = 2;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Greedy word-wrap to a max characters-per-line for the schematic block. */
function wrap(text: string, maxChars: number): string[] {
  const out: string[] = [];
  text.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.replace(/\t/g, "  ");
    if (line.length <= maxChars) {
      out.push(line);
      return;
    }
    let current = "";
    line.split(" ").forEach((word) => {
      if ((current + " " + word).trim().length > maxChars) {
        if (current) out.push(current);
        current = word;
      } else {
        current = current ? `${current} ${word}` : word;
      }
    });
    if (current) out.push(current);
  });
  return out;
}

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

/** Builds the printable A4 sheet for a request as an SVG string. */
function buildSheetSvg(req: StoredRequest): string {
  const margin = 56;
  const colW = PAGE_W - margin * 2;
  let y = margin;

  const parts: string[] = [];
  parts.push(
    `<rect x="0" y="0" width="${PAGE_W}" height="${PAGE_H}" fill="#ffffff"/>`
  );

  // Header band
  parts.push(
    `<rect x="0" y="0" width="${PAGE_W}" height="14" fill="#B08D57"/>`
  );
  y += 8;
  parts.push(
    `<text x="${margin}" y="${y + 22}" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="#1a1410">Заявка — зеркало Толе</text>`
  );
  y += 30;
  parts.push(
    `<text x="${margin}" y="${y + 18}" font-family="Arial, sans-serif" font-size="12" fill="#8a7a5e">№ ${esc(
      req.id
    )} · ${esc(formatDate(req.createdAt))}</text>`
  );
  y += 30;
  parts.push(
    `<line x1="${margin}" y1="${y}" x2="${PAGE_W - margin}" y2="${y}" stroke="#e2d8c4" stroke-width="1"/>`
  );
  y += 24;

  // Meta block
  const meta: [string, string][] = [
    ["Имя", req.name || "—"],
    ["Контакт", req.contact || "—"],
    ["Изделие", req.product || "—"],
    ["Статус", STATUS_LABELS[req.status] ?? req.status],
  ];
  meta.forEach(([k, v]) => {
    parts.push(
      `<text x="${margin}" y="${y + 14}" font-family="Arial, sans-serif" font-size="13" fill="#9a8a6c">${esc(
        k
      )}</text>`
    );
    parts.push(
      `<text x="${margin + 110}" y="${y + 14}" font-family="Arial, sans-serif" font-size="13" fill="#231d15">${esc(
        v
      )}</text>`
    );
    y += 24;
  });
  y += 8;

  // Sketch (if present) — keep the 400:464 aspect of the front preview.
  if (req.sketchSvg) {
    const imgW = 300;
    const imgH = Math.round(imgW * (464 / 400));
    const imgX = (PAGE_W - imgW) / 2;
    const href = svgToDataUrl(req.sketchSvg);
    parts.push(
      `<rect x="${imgX - 10}" y="${y - 10}" width="${imgW + 20}" height="${
        imgH + 20
      }" rx="6" fill="#0d0d0d"/>`
    );
    parts.push(
      `<image x="${imgX}" y="${y}" width="${imgW}" height="${imgH}" href="${href}" preserveAspectRatio="xMidYMid meet"/>`
    );
    y += imgH + 28;
  }

  // Schematic text block
  const body = req.schematic || req.comment || "Без описания.";
  parts.push(
    `<text x="${margin}" y="${y + 14}" font-family="Arial, sans-serif" font-size="13" fill="#9a8a6c" letter-spacing="1">ПАРАМЕТРЫ ЭСКИЗА</text>`
  );
  y += 28;
  const lines = wrap(body, 92);
  const lineH = 18;
  lines.forEach((ln) => {
    if (y > PAGE_H - margin) return; // clip overly long sheets to one page
    parts.push(
      `<text x="${margin}" y="${y + 12}" font-family="'Courier New', monospace" font-size="12.5" fill="#231d15" xml:space="preserve">${esc(
        ln
      )}</text>`
    );
    y += lineH;
  });

  // Footer
  parts.push(
    `<text x="${margin}" y="${PAGE_H - 28}" font-family="Arial, sans-serif" font-size="11" fill="#b3a489">Толе · авторские шаманские зеркала</text>`
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PAGE_W}" height="${PAGE_H}" viewBox="0 0 ${PAGE_W} ${PAGE_H}">${parts.join(
    ""
  )}</svg>`;
}

function rasterize(svg: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = PAGE_W * RASTER_SCALE;
      canvas.height = PAGE_H * RASTER_SCALE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no 2d context"));
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("svg rasterise failed"));
    img.src = svgToDataUrl(svg);
  });
}

/** Builds and downloads an A4 PDF document for a single request. */
export async function downloadRequestPdf(req: StoredRequest): Promise<void> {
  const { default: JsPDF } = await import("jspdf");
  const png = await rasterize(buildSheetSvg(req));
  const pdf = new JsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(png, "PNG", 0, 0, w, h, undefined, "FAST");
  const safeName = (req.name || "zayavka").replace(/[^\wа-яёА-ЯЁ-]+/gi, "_").slice(0, 40);
  pdf.save(`toli-${safeName}-${req.id}.pdf`);
}
