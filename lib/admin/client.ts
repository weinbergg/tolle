"use client";

import type { AdminProduct, StoredRequest, Stats } from "@/types/admin";
import type { Catalog } from "@/types/catalog";

const KEY_STORAGE = "toli-admin-key";

export function getKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(KEY_STORAGE) ?? "";
}

export function setKey(key: string): void {
  sessionStorage.setItem(KEY_STORAGE, key);
}

export function clearKey(): void {
  sessionStorage.removeItem(KEY_STORAGE);
}

async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      "Content-Type": "application/json",
      "x-admin-key": getKey(),
    },
  });
}

export async function login(password: string): Promise<boolean> {
  const res = await fetch("/api/admin/stats", {
    headers: { "x-admin-key": password },
  });
  if (res.ok) {
    setKey(password);
    return true;
  }
  return false;
}

export async function fetchRequests(): Promise<StoredRequest[]> {
  const res = await authFetch("/api/admin/requests");
  if (!res.ok) throw new Error("unauthorized");
  const data = await res.json();
  return data.requests as StoredRequest[];
}

export async function patchRequest(id: string, status: StoredRequest["status"]) {
  await authFetch("/api/admin/requests", {
    method: "PATCH",
    body: JSON.stringify({ id, status }),
  });
}

export async function removeRequest(id: string) {
  await authFetch("/api/admin/requests", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export async function fetchProducts(): Promise<AdminProduct[]> {
  const res = await authFetch("/api/admin/products");
  if (!res.ok) throw new Error("unauthorized");
  const data = await res.json();
  return data.products as AdminProduct[];
}

export async function saveProducts(products: AdminProduct[]): Promise<AdminProduct[]> {
  const res = await authFetch("/api/admin/products", {
    method: "PUT",
    body: JSON.stringify({ products }),
  });
  const data = await res.json();
  return data.products as AdminProduct[];
}

export async function fetchStats(): Promise<Stats> {
  const res = await authFetch("/api/admin/stats");
  if (!res.ok) throw new Error("unauthorized");
  const data = await res.json();
  return data.stats as Stats;
}

export async function fetchCatalog(): Promise<Catalog> {
  const res = await authFetch("/api/admin/catalog");
  if (!res.ok) throw new Error("unauthorized");
  const data = await res.json();
  return data.catalog as Catalog;
}

export async function saveCatalog(catalog: Catalog): Promise<Catalog> {
  const res = await authFetch("/api/admin/catalog", {
    method: "PUT",
    body: JSON.stringify({ catalog }),
  });
  const data = await res.json();
  return data.catalog as Catalog;
}

export function svgToDataUrl(svg: string): string {
  if (typeof window === "undefined") return "";
  try {
    return "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(svg)));
  } catch {
    return "";
  }
}

/** Reads a File (image) into a base64 data URL for inline storage. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
