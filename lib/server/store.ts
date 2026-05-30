import { promises as fs } from "fs";
import path from "path";
import { products as seedProducts } from "@/data/products";
import { buildSeedCatalog } from "@/data/configurator/catalogSeed";
import type { AdminProduct, StoredRequest, Stats } from "@/types/admin";
import type { Catalog } from "@/types/catalog";

const DATA_DIR = path.join(process.cwd(), ".data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");
const STATS_FILE = path.join(DATA_DIR, "stats.json");
const CATALOG_FILE = path.join(DATA_DIR, "catalog.json");

async function ensureDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

// ---------- PRODUCTS ----------

function seedAdminProducts(): AdminProduct[] {
  return seedProducts.map((p, i) => ({
    ...p,
    order: i,
    visible: true,
    image: "",
  }));
}

export async function getProducts(): Promise<AdminProduct[]> {
  const stored = await readJson<AdminProduct[] | null>(PRODUCTS_FILE, null);
  if (!stored || stored.length === 0) {
    const seeded = seedAdminProducts();
    await writeJson(PRODUCTS_FILE, seeded);
    return seeded;
  }
  return stored.sort((a, b) => a.order - b.order);
}

export async function getVisibleProducts(): Promise<AdminProduct[]> {
  const all = await getProducts();
  return all.filter((p) => p.visible).sort((a, b) => a.order - b.order);
}

export async function saveProducts(list: AdminProduct[]): Promise<AdminProduct[]> {
  const normalized = list
    .map((p, i) => ({ ...p, order: i }))
    .sort((a, b) => a.order - b.order);
  await writeJson(PRODUCTS_FILE, normalized);
  return normalized;
}

// ---------- REQUESTS ----------

export async function getRequests(): Promise<StoredRequest[]> {
  const list = await readJson<StoredRequest[]>(REQUESTS_FILE, []);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addRequest(
  req: Omit<StoredRequest, "id" | "createdAt" | "status">
): Promise<StoredRequest> {
  const list = await readJson<StoredRequest[]>(REQUESTS_FILE, []);
  const record: StoredRequest = {
    ...req,
    id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  list.push(record);
  await writeJson(REQUESTS_FILE, list);
  await bumpStat("requests");
  return record;
}

export async function updateRequest(
  id: string,
  patch: Partial<Pick<StoredRequest, "status">>
): Promise<StoredRequest | null> {
  const list = await readJson<StoredRequest[]>(REQUESTS_FILE, []);
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  await writeJson(REQUESTS_FILE, list);
  return list[idx];
}

export async function deleteRequest(id: string): Promise<boolean> {
  const list = await readJson<StoredRequest[]>(REQUESTS_FILE, []);
  const next = list.filter((r) => r.id !== id);
  if (next.length === list.length) return false;
  await writeJson(REQUESTS_FILE, next);
  return true;
}

// ---------- CATALOG (themes + motif/glyph merchandising) ----------

export async function getCatalog(): Promise<Catalog> {
  const stored = await readJson<Catalog | null>(CATALOG_FILE, null);
  if (!stored || !stored.items || stored.items.length === 0) {
    const seeded = buildSeedCatalog();
    await writeJson(CATALOG_FILE, seeded);
    return seeded;
  }
  return stored;
}

export async function saveCatalog(catalog: Catalog): Promise<Catalog> {
  // Normalise ordering per zone for both themes and items.
  const themes = [...catalog.themes].sort(
    (a, b) => a.zone.localeCompare(b.zone) || a.order - b.order
  );
  const items = [...catalog.items].sort(
    (a, b) => a.zone.localeCompare(b.zone) || a.order - b.order
  );
  const normalized: Catalog = { themes, items };
  await writeJson(CATALOG_FILE, normalized);
  return normalized;
}

// ---------- STATS ----------

const EMPTY_STATS: Stats = {
  pageViews: 0,
  constructorViews: 0,
  requests: 0,
  productViews: {},
  daily: {},
};

export async function getStats(): Promise<Stats> {
  return readJson<Stats>(STATS_FILE, EMPTY_STATS);
}

type Counter = "pageViews" | "constructorViews" | "requests";

export async function bumpStat(counter: Counter): Promise<void> {
  const stats = await getStats();
  stats[counter] = (stats[counter] ?? 0) + 1;
  if (counter === "pageViews") {
    const today = new Date().toISOString().slice(0, 10);
    stats.daily[today] = (stats.daily[today] ?? 0) + 1;
  }
  await writeJson(STATS_FILE, stats);
}

export async function bumpProductView(productId: string): Promise<void> {
  const stats = await getStats();
  stats.productViews[productId] = (stats.productViews[productId] ?? 0) + 1;
  await writeJson(STATS_FILE, stats);
}
