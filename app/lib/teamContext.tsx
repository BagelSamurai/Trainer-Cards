"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CardConfig, Pokemon } from "../types/index";
import { DEFAULT_CARD_CONFIG } from "../types/index";

interface TeamContextValue {
  pokemon: Pokemon[];
  pokemonLoading: boolean;
  team: Pokemon[];
  cardConfig: CardConfig;
  toggleTeam: (p: Pokemon) => void;
  removeFromTeam: (id: number) => void;
  reorderTeam: (fromId: number, toId: number) => void;
  clearTeam: () => void;
  setCardConfig: (
    updater: CardConfig | ((prev: CardConfig) => CardConfig),
  ) => void;
}

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [pokemonLoading, setPokemonLoading] = useState(true);
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [cardConfig, setCardConfigState] =
    useState<CardConfig>(DEFAULT_CARD_CONFIG);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/pokemon");
        const data: Pokemon[] = await res.json();
        if (!cancelled) setPokemon(data);
      } catch (err) {
        console.error("Failed to load Pokémon", err);
      } finally {
        if (!cancelled) setPokemonLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTeam = useCallback((p: Pokemon) => {
    setTeam((prev) => {
      if (prev.some((t) => t.id === p.id)) {
        return prev.filter((t) => t.id !== p.id);
      }
      if (prev.length >= 6) return prev;
      return [...prev, p];
    });
  }, []);

  const removeFromTeam = useCallback((id: number) => {
    setTeam((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const reorderTeam = useCallback((fromId: number, toId: number) => {
    setTeam((prev) => {
      const fromIdx = prev.findIndex((p) => p.id === fromId);
      const toIdx = prev.findIndex((p) => p.id === toId);
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;
      const next = prev.slice();
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  const clearTeam = useCallback(() => setTeam([]), []);

  const setCardConfig = useCallback<TeamContextValue["setCardConfig"]>(
    (updater) => {
      setCardConfigState((prev) =>
        typeof updater === "function" ? updater(prev) : updater,
      );
    },
    [],
  );

  const value = useMemo<TeamContextValue>(
    () => ({
      pokemon,
      pokemonLoading,
      team,
      cardConfig,
      toggleTeam,
      removeFromTeam,
      reorderTeam,
      clearTeam,
      setCardConfig,
    }),
    [
      pokemon,
      pokemonLoading,
      team,
      cardConfig,
      toggleTeam,
      removeFromTeam,
      reorderTeam,
      clearTeam,
      setCardConfig,
    ],
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam(): TeamContextValue {
  const ctx = useContext(TeamContext);
  if (!ctx) {
    throw new Error("useTeam must be used inside <TeamProvider>");
  }
  return ctx;
}
