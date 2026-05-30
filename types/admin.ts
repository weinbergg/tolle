import type { Product } from "@/data/products";

/** Product as stored/edited in the admin (adds ordering, visibility, image). */
export interface AdminProduct extends Product {
  order: number;
  visible: boolean;
  image: string; // URL or data URL; empty = use generated placeholder
}

export type RequestStatus = "new" | "in_progress" | "done" | "archived";

export interface StoredRequest {
  id: string;
  createdAt: string;
  status: RequestStatus;
  name: string;
  contact: string;
  product: string;
  comment: string;
  /** Raw configurator configuration, if the request came from the constructor. */
  configuration?: unknown;
  /** Rendered sketch as an inline SVG string (the "image" of the эскиз). */
  sketchSvg?: string;
  /** Human-readable schematic text with all chosen parameters. */
  schematic?: string;
}

export interface Stats {
  pageViews: number;
  constructorViews: number;
  requests: number;
  /** productId -> number of card views/clicks */
  productViews: Record<string, number>;
  /** ISO date (YYYY-MM-DD) -> visits, for a simple trend */
  daily: Record<string, number>;
}
