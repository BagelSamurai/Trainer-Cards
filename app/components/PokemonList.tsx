"use client";

import { useMemo, useState } from "react";
import PokemonBadge from "./PokemonBadge";
import { POKEMON_TYPES } from "../constants/pokemonTypes";
import { useTeam } from "../lib/teamContext";

const VISIBLE_LIMIT = 240; // initial render cap, grows on demand for perf with ~1025 entries

export default function PokemonList() {
  const { pokemon, pokemonLoading, team, toggleTeam } = useTeam();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<"all" | string>("all");
  const [visibleCount, setVisibleCount] = useState(VISIBLE_LIMIT);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pokemon.filter((p) => {
      if (activeType !== "all" && !p.types.includes(activeType)) return false;
      if (!q) return true;
      // search by name OR by dex number (with or without leading zeros)
      if (p.name.toLowerCase().includes(q)) return true;
      const idStr = p.id.toString();
      const idPad = idStr.padStart(3, "0");
      const stripped = q.replace(/^#/, "").replace(/^0+/, "");
      return idStr === stripped || idPad === q;
    });
  }, [pokemon, search, activeType]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

  return (
    <section className="flex flex-col rounded-[var(--radius-pane)] hairline bg-[var(--color-surface)] flex-1 min-h-0 overflow-hidden">
      {/* Pinned header: count, search, chips */}
      <div className="flex flex-col gap-3 p-[18px] pb-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{
              color: "var(--color-ink-3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Pokémon · {filtered.length} of {pokemon.length}
          </div>
          {pokemonLoading && (
            <div
              className="text-[11px]"
              style={{ color: "var(--color-ink-2)" }}
            >
              Loading…
            </div>
          )}
        </div>

        {/* Search pill */}
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-ink-3)" }}
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path
                d="m20 20-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(VISIBLE_LIMIT);
            }}
            placeholder="Search by name or #"
            className="w-full pl-9 pr-3 py-2.5 rounded-full text-[14px] outline-none bg-[var(--color-subtle)] border border-transparent focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30 transition"
            style={{ color: "var(--color-ink-1)" }}
          />
        </div>

        {/* Type filter chips */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <button
            onClick={() => {
              setActiveType("all");
              setVisibleCount(VISIBLE_LIMIT);
            }}
            aria-pressed={activeType === "all"}
            className="px-3 py-1 rounded-full text-[12px] font-semibold transition"
            style={{
              background:
                activeType === "all"
                  ? "var(--color-accent)"
                  : "var(--color-subtle)",
              color: activeType === "all" ? "white" : "var(--color-ink-2)",
            }}
          >
            All
          </button>
          {POKEMON_TYPES.map((t) => {
            const isActive = activeType === t.name;
            return (
              <button
                key={t.name}
                onClick={() => {
                  setActiveType(isActive ? "all" : t.name);
                  setVisibleCount(VISIBLE_LIMIT);
                }}
                aria-pressed={isActive}
                className="px-2.5 py-1 rounded-full text-[12px] font-semibold transition flex items-center gap-1.5"
                style={{
                  background: isActive
                    ? "var(--color-ink-1)"
                    : "var(--color-subtle)",
                  color: isActive ? "white" : "var(--color-ink-1)",
                }}
              >
                <span
                  aria-hidden
                  className="w-2 h-2 rounded-full"
                  style={{ background: t.color }}
                />
                <span className="capitalize">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 min-h-0 overflow-y-auto px-[18px] pb-[18px]">
        {filtered.length === 0 && !pokemonLoading ? (
          <div
            className="py-10 text-center text-[13px]"
            style={{ color: "var(--color-ink-2)" }}
          >
            No Pokémon match.
          </div>
        ) : (
          <ul
            className="grid gap-2"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            }}
          >
            {visible.map((p) => (
              <PokemonBadge
                key={p.id}
                id={p.id}
                name={p.name}
                src={p.image}
                types={p.types}
                isSelected={team.some((t) => t.id === p.id)}
                onToggle={() => toggleTeam(p)}
              />
            ))}
          </ul>
        )}

        {hasMore && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setVisibleCount((c) => c + VISIBLE_LIMIT)}
              className="px-4 py-2 rounded-full text-[13px] font-medium bg-[var(--color-subtle)] hover:bg-[var(--color-hairline)] transition"
              style={{ color: "var(--color-ink-1)" }}
            >
              Show {Math.min(VISIBLE_LIMIT, filtered.length - visible.length)}{" "}
              more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
