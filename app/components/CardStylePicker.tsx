"use client";

import { useTeam } from "../lib/teamContext";
import { THEMES, THEME_ORDER } from "../lib/cardThemes";
import type { ThemeKey } from "../types/index";

export default function CardStylePicker() {
  const { cardConfig, setCardConfig } = useTeam();

  return (
    <section
      className="rounded-[var(--radius-pane)] hairline bg-[var(--color-surface)] p-[18px]"
    >
      <div
        className="text-[10px] tracking-[0.2em] uppercase mb-3"
        style={{
          color: "var(--color-ink-3)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Card style
      </div>

      <div className="grid grid-cols-2 gap-2">
        {THEME_ORDER.map((key) => {
          const theme = THEMES[key];
          const isActive = cardConfig.theme === key;
          return (
            <button
              key={key}
              onClick={() =>
                setCardConfig((prev) => ({ ...prev, theme: key as ThemeKey }))
              }
              className={`flex items-center gap-3 p-2.5 rounded-xl transition text-left bg-[var(--color-subtle)] hover:bg-white ${
                isActive ? "" : "border border-transparent"
              }`}
              style={
                isActive
                  ? {
                      boxShadow: "0 0 0 2px var(--color-accent) inset",
                      background: "white",
                    }
                  : undefined
              }
              aria-pressed={isActive}
            >
              <div
                className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                style={{
                  background: theme.swatch.background,
                  boxShadow: `inset 0 0 0 1.5px ${theme.swatch.accent}`,
                }}
              >
                <span
                  className="block w-2 h-2 rounded-full"
                  style={{ background: theme.swatch.accent }}
                />
              </div>
              <div className="min-w-0">
                <div
                  className="text-[13px] font-semibold truncate"
                  style={{ color: "var(--color-ink-1)" }}
                >
                  {theme.label}
                </div>
                <div
                  className="text-[11px] truncate"
                  style={{ color: "var(--color-ink-2)" }}
                >
                  {theme.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
