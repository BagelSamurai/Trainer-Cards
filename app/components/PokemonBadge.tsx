"use client";

import Image from "next/image";
import { memo } from "react";
import type { KeyboardEvent } from "react";
import { POKEMON_TYPES } from "../constants/pokemonTypes";

const TYPE_COLOR = Object.fromEntries(
  POKEMON_TYPES.map((t) => [t.name, t.color]),
) as Record<string, string>;

interface PokemonBadgeProps {
  id: number;
  name: string;
  src: string;
  types: string[];
  isSelected?: boolean;
  onToggle?: () => void;
}

function pad3(n: number): string {
  return n.toString().padStart(3, "0");
}

function PokemonBadge({
  id,
  name,
  src,
  types,
  isSelected = false,
  onToggle,
}: PokemonBadgeProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle?.();
    }
  };

  return (
    <li
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition cursor-pointer select-none ${
        isSelected ? "bg-white" : "bg-[var(--color-subtle)] hover:-translate-y-0.5"
      }`}
      style={
        isSelected
          ? {
              boxShadow: "inset 0 0 0 2px var(--color-accent)",
            }
          : undefined
      }
    >
      {/* Dex number */}
      <span
        className="absolute top-1.5 left-2 text-[9px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-ink-3)",
        }}
      >
        #{pad3(id)}
      </span>

      {/* In-team checkmark */}
      {isSelected && (
        <span
          aria-hidden
          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: "var(--color-accent)" }}
        >
          ✓
        </span>
      )}

      {/* Sprite */}
      <div className="relative w-14 h-14 mt-2">
        <Image
          src={src}
          alt={name}
          fill
          sizes="56px"
          loading="lazy"
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Name */}
      <span
        className="text-[12px] font-semibold capitalize text-center leading-tight"
        style={{ color: "var(--color-ink-1)" }}
      >
        {name}
      </span>

      {/* Type pills */}
      <div className="flex gap-1 flex-wrap justify-center">
        {types.slice(0, 2).map((t) => {
          const color = TYPE_COLOR[t] ?? "#888";
          return (
            <span
              key={t}
              className="text-[9px] uppercase tracking-wider px-1.5 py-px rounded-full font-semibold"
              style={{
                background: `${color}33`,
                color: color,
                fontFamily: "var(--font-mono)",
              }}
            >
              {t}
            </span>
          );
        })}
      </div>
    </li>
  );
}

export default memo(PokemonBadge);
