"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useTeam } from "../lib/teamContext";
import {
  BORDER_COLORS,
  BACKGROUND_PATTERN_ORDER,
  BACKGROUND_PATTERN_LABELS,
  patternStyle,
  THEMES,
} from "../lib/cardThemes";
import type { BorderStyle, BackgroundPattern } from "../types/index";

const BORDER_STYLES: { key: BorderStyle; label: string }[] = [
  { key: "solid", label: "Solid" },
  { key: "double", label: "Double" },
  { key: "holo", label: "Holo ✨" },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] tracking-[0.2em] uppercase mb-2"
      style={{ color: "var(--color-ink-3)", fontFamily: "var(--font-mono)" }}
    >
      {children}
    </div>
  );
}

export default function Customize() {
  const { cardConfig, setCardConfig } = useTeam();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = THEMES[cardConfig.theme];

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setCardConfig((prev) => ({ ...prev, trainerImage: result }));
      }
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setCardConfig((prev) => ({ ...prev, trainerImage: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <section className="rounded-[var(--radius-pane)] hairline bg-[var(--color-surface)] p-[18px] flex flex-col gap-5">
      <div
        className="text-[10px] tracking-[0.2em] uppercase"
        style={{ color: "var(--color-ink-3)", fontFamily: "var(--font-mono)" }}
      >
        Customize
      </div>

      {/* Team name */}
      <div>
        <Label>Team name</Label>
        <input
          type="text"
          value={cardConfig.name}
          onChange={(e) =>
            setCardConfig((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Untitled team"
          className="w-full px-3 py-2.5 rounded-[var(--radius-input)] text-[14px] outline-none bg-[var(--color-subtle)] border border-transparent focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30 transition"
          style={{ color: "var(--color-ink-1)" }}
        />
      </div>

      {/* Trainer image */}
      <div>
        <Label>Trainer image</Label>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-3 py-2.5 rounded-full text-[13px] font-medium bg-[var(--color-subtle)] hover:bg-[var(--color-hairline)] transition"
            style={{ color: "var(--color-ink-1)" }}
          >
            ↑ Upload image
          </button>
          {cardConfig.trainerImage && (
            <button
              type="button"
              onClick={clearImage}
              className="px-3 py-2.5 rounded-full text-[13px] font-medium hover:bg-[var(--color-subtle)] transition"
              style={{ color: "var(--color-ink-2)" }}
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Border color */}
        <div>
          <Label>Border color</Label>
          <div className="flex flex-wrap gap-2">
            {BORDER_COLORS.map((c) => {
              const isActive =
                cardConfig.borderColor.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() =>
                    setCardConfig((prev) => ({ ...prev, borderColor: c }))
                  }
                  aria-label={`border color ${c}`}
                  className="w-7 h-7 rounded-full transition"
                  style={{
                    background: c,
                    boxShadow: isActive
                      ? "0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-accent)"
                      : c === "#ffffff"
                        ? "inset 0 0 0 1px var(--color-hairline)"
                        : "none",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Border style */}
        <div>
          <Label>Border style</Label>
          <div
            className="flex p-1 rounded-full bg-[var(--color-subtle)]"
            role="radiogroup"
          >
            {BORDER_STYLES.map((s) => {
              const isActive = cardConfig.borderStyle === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() =>
                    setCardConfig((prev) => ({ ...prev, borderStyle: s.key }))
                  }
                  role="radio"
                  aria-checked={isActive}
                  className={`flex-1 px-2 py-1.5 rounded-full text-[12px] font-medium transition ${
                    isActive ? "" : "hover:text-[var(--color-ink-1)]"
                  }`}
                  style={{
                    color: isActive ? "white" : "var(--color-ink-2)",
                    background: isActive ? "var(--color-ink-1)" : "transparent",
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div>
        <Label>Background pattern</Label>
        <div className="flex flex-wrap gap-2">
          {BACKGROUND_PATTERN_ORDER.map((p) => {
            const isActive = cardConfig.background === p;
            return (
              <button
                key={p}
                onClick={() =>
                  setCardConfig((prev) => ({
                    ...prev,
                    background: p as BackgroundPattern,
                  }))
                }
                title={BACKGROUND_PATTERN_LABELS[p]}
                aria-label={BACKGROUND_PATTERN_LABELS[p]}
                className="rounded-md transition relative overflow-hidden"
                style={{
                  width: 40,
                  height: 30,
                  background: theme.cardBg,
                  boxShadow: isActive
                    ? "0 0 0 2px var(--color-accent)"
                    : "inset 0 0 0 1px var(--color-hairline)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={patternStyle(p, theme.ink)}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
