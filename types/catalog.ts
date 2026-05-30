import type { CustomZone } from "@/types/configurator";

/** An editable thematic section within a zone. */
export interface CatalogTheme {
  id: string;
  zone: CustomZone;
  name: string;
  order: number;
}

/**
 * Editable metadata for a single motif/glyph. The vector geometry ("shapes")
 * always lives in code and is matched to this record by `id`; everything here
 * is merchandising that the workshop can edit in the admin panel.
 */
export interface CatalogItem {
  id: string;
  zone: CustomZone;
  name: string;
  description?: string;
  theme: string;
  /** Surcharge in ₽ (ignored for petroglyph glyphs — those use a flat price). */
  priceModifier: number;
  visible: boolean;
  order: number;
  /**
   * Admin-uploaded motif image (data URL or public path). Present only on
   * `custom` items, whose geometry does not exist in code.
   */
  image?: string;
  /** True for items created in the admin (no matching vector geometry in code). */
  custom?: boolean;
}

export interface Catalog {
  themes: CatalogTheme[];
  items: CatalogItem[];
}
