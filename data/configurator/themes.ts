import type { CustomZone } from "@/types/configurator";

/**
 * Thematic sections ("темы") for every customizable zone. Each motif/glyph is
 * assigned to one theme, and the configurator groups the choices by theme so
 * the catalogue can grow without overwhelming the UI. These section ids/names
 * are the seed for the admin-editable catalogue.
 */

export type { CustomZone };

export interface Theme {
  id: string;
  name: string;
  /** Display order within its zone. */
  order: number;
}

export const themesByZone: Record<CustomZone, Theme[]> = {
  center: [
    { id: "solar", name: "Солярные", order: 0 },
    { id: "lunar", name: "Лунные", order: 1 },
    { id: "nature", name: "Природа", order: 2 },
    { id: "geometry", name: "Геометрия", order: 3 },
    { id: "shamanic", name: "Шаманские", order: 4 },
  ],
  radial: [
    { id: "solar", name: "Солярные", order: 0 },
    { id: "lunar", name: "Лунные", order: 1 },
    { id: "nature", name: "Природа", order: 2 },
    { id: "geometry", name: "Геометрия", order: 3 },
  ],
  border: [
    { id: "geometry", name: "Геометрия", order: 0 },
    { id: "nature", name: "Природа", order: 1 },
    { id: "solar", name: "Солярные", order: 2 },
  ],
  petroglyph: [
    { id: "animals", name: "Звери", order: 0 },
    { id: "figures", name: "Фигуры", order: 1 },
    { id: "symbols", name: "Символы", order: 2 },
  ],
};

export function getThemes(zone: CustomZone): Theme[] {
  return [...(themesByZone[zone] ?? [])].sort((a, b) => a.order - b.order);
}

export function getThemeName(zone: CustomZone, themeId: string | undefined): string {
  if (!themeId) return "";
  return themesByZone[zone]?.find((t) => t.id === themeId)?.name ?? themeId;
}
