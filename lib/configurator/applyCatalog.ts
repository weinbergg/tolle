import type { Catalog } from "@/types/catalog";
import type { CustomZone } from "@/types/configurator";
import { patterns } from "@/data/configurator/patterns";
import {
  petroglyphs,
  PETROGLYPH_GROUPS,
  type PetroglyphGroup,
} from "@/data/configurator/petroglyphs";
import { themesByZone, type Theme } from "@/data/configurator/themes";

/**
 * Applies an admin-edited catalogue onto the in-memory static library. The
 * vector geometry stays in code; only merchandising (names, descriptions,
 * themes, prices, visibility, ordering) is overridden. Because the static
 * arrays are shared module singletons, mutating them in place propagates the
 * overrides to every consumer (selectors, preview, price, summary) without
 * threading props. Re-render the configurator after calling this.
 */
export function applyCatalog(catalog: Catalog): void {
  // 1) Themes — rebuild each zone list in place so getThemes() sees overrides.
  const byZone = new Map<CustomZone, Theme[]>();
  catalog.themes.forEach((t) => {
    const list = byZone.get(t.zone) ?? [];
    list.push({ id: t.id, name: t.name, order: t.order });
    byZone.set(t.zone, list);
  });
  (Object.keys(themesByZone) as CustomZone[]).forEach((zone) => {
    const next = byZone.get(zone);
    if (next && next.length > 0) {
      const arr = themesByZone[zone];
      arr.length = 0;
      next
        .sort((a, b) => a.order - b.order)
        .forEach((t) => arr.push(t));
    }
  });

  // 2) Pattern motifs (center / radial / border).
  catalog.items
    .filter((it) => it.zone !== "petroglyph")
    .forEach((it) => {
      const p = patterns.find((x) => x.id === it.id);
      if (!p) return;
      p.name = it.name;
      p.description = it.description;
      p.theme = it.theme;
      p.priceModifier = it.priceModifier;
      p.available = it.visible;
      p.order = it.order;
    });

  // 3) Petroglyph glyphs.
  catalog.items
    .filter((it) => it.zone === "petroglyph")
    .forEach((it) => {
      const g = petroglyphs.find((x) => x.id === it.id);
      if (!g) return;
      g.name = it.name;
      g.group = it.theme as PetroglyphGroup;
      g.available = it.visible;
      g.order = it.order;
    });

  // Petroglyph group labels follow their theme records.
  PETROGLYPH_GROUPS.forEach((grp) => {
    const t = catalog.themes.find(
      (x) => x.zone === "petroglyph" && x.id === grp.id
    );
    if (t) grp.name = t.name;
  });
}

let applied = false;

/** Fetch the public catalogue once and apply it. Resolves true if applied. */
export async function loadAndApplyCatalog(): Promise<boolean> {
  if (applied) return true;
  try {
    const res = await fetch("/api/catalog", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { catalog: Catalog };
    if (data?.catalog?.items?.length) {
      applyCatalog(data.catalog);
      applied = true;
      return true;
    }
  } catch {
    /* offline / unavailable — keep static defaults */
  }
  return false;
}
