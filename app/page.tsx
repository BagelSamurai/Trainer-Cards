"use client";

import { TopBar } from "./components/TopBar";
import TrainerCard from "./components/TrainerCard";
import CardStylePicker from "./components/CardStylePicker";
import Customize from "./components/Customize";
import PokemonList from "./components/PokemonList";
import Team from "./components/Team";
import { useTeam } from "./lib/teamContext";

export default function Home() {
  const { team, cardConfig } = useTeam();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <main className="flex-1 min-h-0 max-w-[1500px] mx-auto w-full px-6 py-5">
        <div
          className="grid gap-5 h-full"
          style={{ gridTemplateColumns: "480px 1fr" }}
        >
          {/* LEFT — card always visible, customize panels scroll if needed */}
          <div className="flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
            <div className="rounded-[var(--radius-pane)] hairline bg-[var(--color-surface)] p-[18px] flex items-center justify-center shrink-0">
              <TrainerCard team={team} cardConfig={cardConfig} width={300} />
            </div>
            <CardStylePicker />
            <Customize />
          </div>

          {/* RIGHT — Pokémon list scrolls internally; team row pinned at bottom */}
          <div className="flex flex-col gap-4 min-h-0">
            <PokemonList />
            <Team />
          </div>
        </div>
      </main>
    </div>
  );
}
