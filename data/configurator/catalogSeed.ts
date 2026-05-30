import type { Catalog, CatalogItem, CatalogTheme } from "@/types/catalog";
import type { CustomZone } from "@/types/configurator";
import { patterns } from "./patterns";
import { petroglyphs, PETROGLYPH_GROUPS } from "./petroglyphs";
import { themesByZone } from "./themes";

/**
 * Builds the initial, admin-editable catalogue from the static motif/glyph
 * library. The store seeds itself from this on first run; afterwards the stored
 * version is authoritative for merchandising (names, themes, prices, order,
 * visibility), while the vector geometry stays in code.
 */
export function buildSeedCatalog(): Catalog {
  const themes: CatalogTheme[] = [];
  (Object.keys(themesByZone) as CustomZone[]).forEach((zone) => {
    themesByZone[zone].forEach((t) => {
      themes.push({ id: t.id, zone, name: t.name, order: t.order });
    });
  });

  const items: CatalogItem[] = [];

  // Pattern motifs (center / radial / border)
  const byCat: Record<string, number> = {};
  patterns.forEach((p) => {
    const order = byCat[p.category] ?? 0;
    byCat[p.category] = order + 1;
    items.push({
      id: p.id,
      zone: p.category,
      name: p.name,
      description: p.description,
      theme: p.theme,
      priceModifier: p.priceModifier,
      visible: p.available,
      order,
    });
  });

  // Petroglyph glyphs
  petroglyphs.forEach((g, i) => {
    items.push({
      id: g.id,
      zone: "petroglyph",
      name: g.name,
      theme: g.group,
      priceModifier: 0,
      visible: g.available ?? true,
      order: i,
    });
  });

  return { themes, items };
}

/** Stable list of petroglyph group ids used as themes for that zone. */
export const PETROGLYPH_THEME_IDS = PETROGLYPH_GROUPS.map((g) => g.id);
