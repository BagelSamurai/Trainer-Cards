import type { CSSProperties } from "react";
import type { ThemeKey } from "../types/index";

export interface CardTheme {
  key: ThemeKey;
  label: string;
  tagline: string;
  /** Swatch shown in the picker. */
  swatch: { background: string; accent: string };
  /** Card background. Can be a color or gradient. */
  cardBg: string;
  /** Optional explicit text colors. */
  ink: string;
  inkMuted: string;
  inkLabel: string;
  /** Tile (sprite cell) background. */
  tileBg: string;
  /** CSS font-family for header / body. */
  bodyFont: string;
  /** CSS font-family for the team name. */
  displayFont: string;
  /** CSS font-family for mono labels (dex numbers, footer). */
  monoFont: string;
  /** Default border color (user can override). */
  defaultBorderColor: string;
  /** Border radius in px. Some themes (Brutalist, Game Boy) want 0. */
  radius: number;
  /** Special FX flags. */
  scanlines?: boolean;
  glassShine?: boolean;
  /** A class applied to the outer card wrapper for theme-specific extras. */
  extraClass?: string;
}

/**
 * The five themes the user can switch between.
 * Note: actual border style / background pattern overrides are applied on top
 * of these defaults by the customize panel.
 */
export const THEMES: Record<ThemeKey, CardTheme> = {
  "midnight-navy": {
    key: "midnight-navy",
    label: "Midnight Navy",
    tagline: "Modern, dark",
    swatch: { background: "#1a2240", accent: "#ee1515" },
    cardBg: "#1a2240",
    ink: "#ffffff",
    inkMuted: "#b6c2e0",
    inkLabel: "#8aa0ad",
    tileBg: "rgba(255,255,255,0.04)",
    bodyFont: "var(--font-space), var(--font-sans), sans-serif",
    displayFont: "var(--font-space), var(--font-sans), sans-serif",
    monoFont: "var(--font-mono), ui-monospace, monospace",
    defaultBorderColor: "#ee1515",
    radius: 16,
  },
  "tcg-gold": {
    key: "tcg-gold",
    label: "TCG Gold",
    tagline: "Classic, premium",
    swatch: { background: "#f4e8c4", accent: "#b08134" },
    cardBg: "#f4e8c4",
    ink: "#3a2a14",
    inkMuted: "#7a5b30",
    inkLabel: "#a08550",
    tileBg: "rgba(255,255,255,0.55)",
    bodyFont: "var(--font-sans), serif",
    displayFont: "var(--font-serif), serif",
    monoFont: "var(--font-mono), ui-monospace, monospace",
    defaultBorderColor: "#b08134",
    radius: 18,
  },
  brutalist: {
    key: "brutalist",
    label: "Brutalist",
    tagline: "Sharp, mono",
    swatch: { background: "#f4f4ef", accent: "#ff3344" },
    cardBg: "#f4f4ef",
    ink: "#0a0a0a",
    inkMuted: "#222222",
    inkLabel: "#444444",
    tileBg: "#ffffff",
    bodyFont: "var(--font-mono), ui-monospace, monospace",
    displayFont: "var(--font-mono), ui-monospace, monospace",
    monoFont: "var(--font-mono), ui-monospace, monospace",
    defaultBorderColor: "#0a0a0a",
    radius: 0,
  },
  "game-boy": {
    key: "game-boy",
    label: "Game Boy",
    tagline: "8-bit retro",
    swatch: { background: "#1a1428", accent: "#f8d030" },
    cardBg: "#1a1428",
    ink: "#f8d030",
    inkMuted: "#d4a93a",
    inkLabel: "#a07a20",
    tileBg: "rgba(248,208,48,0.08)",
    bodyFont: "var(--font-pixel), ui-monospace, monospace",
    displayFont: "var(--font-pixel), ui-monospace, monospace",
    monoFont: "var(--font-pixel), ui-monospace, monospace",
    defaultBorderColor: "#f8d030",
    radius: 0,
    scanlines: true,
  },
  "glass-holo": {
    key: "glass-holo",
    label: "Glass Holo",
    tagline: "Frosted, animated",
    swatch: { background: "#3b1466", accent: "#ff6bd6" },
    cardBg:
      "linear-gradient(160deg, #3b1466 0%, #1a0826 60%, #050208 100%)",
    ink: "#ffffff",
    inkMuted: "#d8c8ff",
    inkLabel: "#a899c8",
    tileBg: "rgba(255,255,255,0.08)",
    bodyFont: "var(--font-sans), sans-serif",
    displayFont: "var(--font-display), var(--font-sans), sans-serif",
    monoFont: "var(--font-mono), ui-monospace, monospace",
    defaultBorderColor: "#a87bff",
    radius: 16,
    glassShine: true,
  },
};

export const THEME_ORDER: ThemeKey[] = [
  "midnight-navy",
  "tcg-gold",
  "brutalist",
  "game-boy",
  "glass-holo",
];

export const BORDER_COLORS = [
  "#ee1515", // red (Pokéball)
  "#f7d02c", // yellow (Electric)
  "#6390f0", // blue (Water)
  "#7ac74c", // green (Grass)
  "#a98ff3", // purple (Flying / psychic-ish)
  "#ee8130", // orange (Fire)
  "#18242b", // ink black
  "#ffffff", // white
];

export const BACKGROUND_PATTERN_LABELS: Record<string, string> = {
  solid: "Solid",
  gradient: "Gradient",
  grid: "Grid",
  dots: "Dots",
  rays: "Rays",
  "type-fire": "Type · Fire",
  "type-water": "Type · Water",
  "type-grass": "Type · Grass",
};

export const BACKGROUND_PATTERN_ORDER = [
  "solid",
  "gradient",
  "grid",
  "dots",
  "rays",
  "type-fire",
  "type-water",
  "type-grass",
] as const;

/** Generate the CSS that paints a given pattern on top of the card bg. */
export function patternStyle(
  pattern: string,
  themeColor: string,
): CSSProperties {
  switch (pattern) {
    case "gradient":
      return {
        backgroundImage: `linear-gradient(135deg, ${themeColor}00 0%, ${themeColor}55 100%)`,
      };
    case "grid":
      return {
        backgroundImage: `linear-gradient(${themeColor}22 1px, transparent 1px), linear-gradient(90deg, ${themeColor}22 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
      };
    case "dots":
      return {
        backgroundImage: `radial-gradient(${themeColor}33 1.4px, transparent 1.4px)`,
        backgroundSize: "14px 14px",
      };
    case "rays":
      return {
        backgroundImage: `repeating-conic-gradient(from 0deg, ${themeColor}22 0deg 8deg, transparent 8deg 16deg)`,
      };
    case "type-fire":
      return {
        backgroundImage: `radial-gradient(circle at 30% 110%, #ee813055 0%, transparent 55%), radial-gradient(circle at 70% -10%, #f7822055 0%, transparent 55%)`,
      };
    case "type-water":
      return {
        backgroundImage: `radial-gradient(circle at 30% 110%, #6390f055 0%, transparent 55%), radial-gradient(circle at 80% 0%, #96d9d655 0%, transparent 55%)`,
      };
    case "type-grass":
      return {
        backgroundImage: `radial-gradient(circle at 20% 100%, #7ac74c55 0%, transparent 55%), radial-gradient(circle at 80% 0%, #a6b91a55 0%, transparent 55%)`,
      };
    case "solid":
    default:
      return {};
  }
}
