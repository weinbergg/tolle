export type PatternCategory = "center" | "radial" | "border";

/** Every customizable zone, including the petroglyph free-scatter board. */
export type CustomZone = PatternCategory | "petroglyph";

export type MirrorSize = "40" | "55" | "70";
export type MirrorFinish = "matte" | "polished" | "aged";
export type MirrorPendant = "ring" | "leather-cord" | "chain";
export type MirrorPackaging = "standard" | "gift";

/**
 * A drawable motif. Geometry is authored in a normalised 100x100 box whose
 * local centre is (50, 50). The same geometry is reused for the live preview,
 * the thumbnails and (optionally) the standalone files under
 * /public/configurator. `paths` is the source of truth for rendering so motifs
 * can be tinted as engraving; `file` points to the matching public asset for
 * future replacement without touching component logic.
 */
export interface PatternShape {
  /** SVG path "d" string in a 100x100 viewBox, centred at (50,50). */
  d: string;
  /** Render filled instead of stroked (engraving line by default). */
  filled?: boolean;
  /** Stroke width multiplier relative to the base engraving stroke. */
  weight?: number;
}

export interface Pattern {
  id: string;
  name: string;
  category: PatternCategory;
  /** Thematic section id this motif belongs to (see data/configurator/themes). */
  theme: string;
  /** Path to the standalone asset for future replacement. */
  file: string;
  description?: string;
  priceModifier: number;
  /** Template ids this pattern may be combined with. Empty = any. */
  allowedTemplates: string[];
  available: boolean;
  /** Display order within its zone (lower = first). Set from the catalogue. */
  order?: number;
  /** Vector geometry used by the live SVG renderer. */
  shapes: PatternShape[];
  /**
   * Optional raster/SVG image (data URL or public path) for admin-uploaded
   * motifs. When set it is rendered instead of the vector `shapes`.
   */
  image?: string;
  /**
   * For border patterns: number of concentric ring radii (as fraction of the
   * inner field radius) drawn in addition to the repeated tile.
   */
  rings?: number[];
  /** For border patterns: how many times the tile repeats around the rim. */
  tileRepeat?: number;
}

export interface MirrorMaterial {
  id: string;
  name: string;
  description: string;
  texture?: string;
  /** Base metal colour. */
  baseColor: string;
  /** Lighter edge / specular colour. */
  highlightColor: string;
  /** Darker shadow colour for depth. */
  shadowColor: string;
  /** Colour used for engraved patterns on this metal. */
  engravingColor: string;
  priceModifier: number;
}

export interface CompositionTemplate {
  id: string;
  name: string;
  description: string;
  supportsCenter: boolean;
  supportsRadial: boolean;
  supportsBorder: boolean;
  /** Free placement of petroglyphs onto interactive anchor points. */
  supportsPetroglyphs?: boolean;
  /** Allow an explicit "no centre symbol" choice. */
  centerOptional?: boolean;
  radialCount?: number;
  priceModifier: number;
}

/**
 * A single placed motif on the free-scatter (petroglyph) composition. A point
 * holds either a library glyph or a user-uploaded image.
 */
export interface PetroglyphPlacement {
  /** Id of the anchor point on the disc. */
  pointId: string;
  /** Library glyph id (mutually exclusive with customImage). */
  glyphId?: string;
  /** User-uploaded image as a data URL. */
  customImage?: string;
  /** Size multiplier relative to the point's default footprint (0.6–1.5). */
  scale?: number;
}

/** A gemstone that can be set into the concave back of the mirror. */
export interface MirrorStone {
  id: string;
  name: string;
  description: string;
  /** Main facet colour. */
  color: string;
  /** Bright facet / sparkle colour. */
  highlight: string;
  /** Deep shadow colour for the lower facets. */
  shadow: string;
  priceModifier: number;
  available?: boolean;
  order?: number;
}

/** Active placement tool shared between the panel palette and the live preview. */
export type PetroglyphTool =
  | { kind: "glyph"; glyphId: string }
  | { kind: "image"; dataUrl: string }
  | { kind: "eraser" }
  | null;

export interface MirrorConfiguration {
  size: MirrorSize;
  materialId: string;
  finish: MirrorFinish;
  templateId: string;
  centerPatternId?: string;
  radialPatternId?: string;
  borderPatternId?: string;
  /** Placed petroglyphs for the free-scatter composition. */
  petroglyphs?: PetroglyphPlacement[];
  /** Gemstone set into the back of the mirror ("none" = no stone). */
  stoneId?: string;
  pendant: MirrorPendant;
  engravingText?: string;
  packaging: MirrorPackaging;
  comment?: string;
}

export interface PriceLine {
  label: string;
  amount: number;
}

export interface PriceBreakdown {
  lines: PriceLine[];
  total: number;
}

export interface ConfiguratorContact {
  name: string;
  contact: string;
  message: string;
  consent: boolean;
}
