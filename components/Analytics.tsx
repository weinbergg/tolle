"use client";

import { useEffect } from "react";

type TrackEvent = "pageview" | "constructor";

/** Fires a single tracking beacon on mount (deduped per page load). */
export default function Analytics({ event }: { event: TrackEvent }) {
  useEffect(() => {
    const key = `toli-tracked-${event}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => {
      /* analytics is best-effort */
    });
  }, [event]);

  return null;
}

/** Records interest in a specific product (best-effort). */
export function trackProduct(productId: string): void {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "product", productId }),
    keepalive: true,
  }).catch(() => {
    /* best-effort */
  });
}
