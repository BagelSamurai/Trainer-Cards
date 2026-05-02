"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { CSSProperties } from "react";
import type { CardConfig, Pokemon } from "../types/index";
import { THEMES, patternStyle } from "../lib/cardThemes";
import { POKEMON_TYPES } from "../constants/pokemonTypes";

const TYPE_COLOR = Object.fromEntries(
  POKEMON_TYPES.map((t) => [t.name, t.color]),
) as Record<string, string>;

interface TrainerCardProps {
  team: Pokemon[];
  cardConfig: CardConfig;
  /** Card width in pixels. Height auto-derives from 5:7 aspect. */
  width?: number;
}

function pad3(n: number): string {
  return n.toString().padStart(3, "0");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const TrainerCard = forwardRef<HTMLDivElement, TrainerCardProps>(function TrainerCard(
  { team, cardConfig, width = 320 },
  ref,
) {
  const theme = THEMES[cardConfig.theme];
  const borderColor = cardConfig.borderColor || theme.defaultBorderColor;
  const radius = theme.radius;

  const aspect = 7 / 5;
  const height = Math.round(width * aspect);

  // Border treatment.
  let borderCss: CSSProperties = {};
  if (cardConfig.borderStyle === "solid") {
    borderCss = {
      boxShadow: `0 0 0 4px ${borderColor}`,
    };
  } else if (cardConfig.borderStyle === "double") {
    borderCss = {
      boxShadow: `0 0 0 3px ${borderColor}, 0 0 0 5px ${theme.cardBg}, 0 0 0 8px ${borderColor}`,
    };
  }
  // holo handled below as overlay layer

  const cardStyle: CSSProperties = {
    width,
    height,
    background: theme.cardBg,
    color: theme.ink,
    borderRadius: radius,
    fontFamily: theme.bodyFont,
    position: "relative",
    overflow: "hidden",
    ...borderCss,
  };

  const patternLayer = patternStyle(cardConfig.background, theme.ink);

  const isBrutalist = theme.key === "brutalist";
  const isGameBoy = theme.key === "game-boy";
  const isTcg = theme.key === "tcg-gold";

  return (
    <div ref={ref} style={cardStyle} className="select-none">
      {/* Pattern overlay (under content) */}
      {cardConfig.background !== "solid" && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ ...patternLayer, opacity: 0.85 }}
        />
      )}

      {/* Holo border ring (rotating conic) */}
      {cardConfig.borderStyle === "holo" && (
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: -2,
            borderRadius: radius + 2,
            padding: 4,
            background:
              "conic-gradient(from 0deg, #ff5e5e, #ffd84d, #5fff7a, #5fd0ff, #c45eff, #ff5e9a, #ff5e5e)",
            filter: "blur(0.4px)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: "holo-rotate 6s linear infinite",
            zIndex: 1,
          }}
        />
      )}

      {/* Game Boy scanlines + chunky inner frame */}
      {isGameBoy && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 4px)",
              animation: "scanlines 1.6s linear infinite",
              mixBlendMode: "multiply",
              zIndex: 2,
            }}
          />
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              inset: 6,
              border: `2px solid ${borderColor}`,
              boxShadow: `0 0 0 2px ${theme.cardBg}, 0 0 0 4px ${borderColor}`,
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* Glass holo sweep */}
      {theme.glassShine && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "60%",
              height: "100%",
              background:
                "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.18) 55%, transparent 100%)",
              animation: "glass-sweep 5.5s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {/* Card content */}
      <div
        className="relative h-full w-full flex flex-col"
        style={{ zIndex: 3, padding: isGameBoy ? 18 : 16 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-full overflow-hidden flex items-center justify-center shrink-0"
            style={{
              width: 44,
              height: 44,
              background: theme.tileBg,
              boxShadow: `0 0 0 2px ${borderColor}`,
            }}
          >
            {cardConfig.trainerImage ? (
              <Image
                src={cardConfig.trainerImage}
                alt="trainer"
                width={44}
                height={44}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
                <circle cx="12" cy="9" r="3.5" stroke={theme.inkMuted} strokeWidth="1.6" />
                <path
                  d="M5 19c1.5-3.2 4-4.5 7-4.5s5.5 1.3 7 4.5"
                  stroke={theme.inkMuted}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="text-[10px] tracking-[0.18em] uppercase"
              style={{ color: theme.inkLabel, fontFamily: theme.monoFont }}
            >
              Trainer
            </div>
            <div
              className="truncate leading-tight"
              style={{
                fontFamily: theme.displayFont,
                fontSize: isTcg ? 22 : 20,
                fontWeight: isBrutalist || isGameBoy ? 400 : 700,
                letterSpacing: isBrutalist ? "0.02em" : "-0.01em",
                color: theme.ink,
              }}
            >
              {cardConfig.name || "Untitled team"}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div
              className="text-[10px] tracking-[0.18em] uppercase"
              style={{ color: theme.inkLabel, fontFamily: theme.monoFont }}
            >
              Team
            </div>
            <div
              style={{
                fontFamily: theme.monoFont,
                fontSize: 16,
                color: theme.ink,
                fontWeight: 600,
              }}
            >
              {team.length}<span style={{ color: theme.inkMuted }}>/6</span>
            </div>
          </div>
        </div>

        {/* 2x3 grid of slots */}
        <div className="mt-3 grid grid-cols-2 gap-2 flex-1">
          {Array.from({ length: 6 }).map((_, i) => {
            const p = team[i];
            const glowColor = p ? TYPE_COLOR[p.types[0]] ?? theme.inkMuted : "transparent";

            return (
              <div
                key={i}
                className="relative flex items-center"
                style={{
                  background: theme.tileBg,
                  borderRadius: isBrutalist || isGameBoy ? 0 : 10,
                  padding: 8,
                  border: isBrutalist
                    ? `1px solid ${theme.ink}`
                    : isGameBoy
                      ? `1px solid ${borderColor}`
                      : "1px solid rgba(255,255,255,0.06)",
                  minHeight: 0,
                }}
              >
                {p ? (
                  <>
                    {/* Type-color glow behind sprite */}
                    <div
                      aria-hidden
                      className="absolute"
                      style={{
                        left: 8,
                        top: 8,
                        width: 44,
                        height: 44,
                        background: glowColor,
                        filter: "blur(12px)",
                        opacity: 0.55,
                        borderRadius: "50%",
                        pointerEvents: "none",
                      }}
                    />
                    <div className="relative w-11 h-11 shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="44px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="ml-2 flex-1 min-w-0">
                      <div
                        className="text-[9px] leading-none tracking-[0.1em]"
                        style={{
                          color: theme.inkLabel,
                          fontFamily: theme.monoFont,
                        }}
                      >
                        #{pad3(p.id)}
                      </div>
                      <div
                        className="truncate text-[12px] font-semibold leading-tight mt-0.5"
                        style={{ color: theme.ink, fontFamily: theme.bodyFont }}
                      >
                        {capitalize(p.name)}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.types.slice(0, 2).map((t) => {
                          const c = TYPE_COLOR[t] ?? "#888";
                          return (
                            <span
                              key={t}
                              className="text-[8px] uppercase tracking-wider px-1.5 py-px rounded-full"
                              style={{
                                background: `${c}33`,
                                color: c,
                                border: `1px solid ${c}55`,
                                fontFamily: theme.monoFont,
                                fontWeight: 600,
                              }}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full text-center text-[10px] tracking-[0.15em] uppercase"
                    style={{
                      color: theme.inkLabel,
                      fontFamily: theme.monoFont,
                    }}
                  >
                    Empty
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="mt-3 pt-2 flex items-center justify-between text-[9px] tracking-[0.2em] uppercase"
          style={{
            borderTop: `1px solid ${theme.inkLabel}33`,
            color: theme.inkLabel,
            fontFamily: theme.monoFont,
          }}
        >
          <span>★ Pokémon · Team Card</span>
          <span>v1.0 · 2026</span>
        </div>
      </div>
    </div>
  );
});

export default TrainerCard;
