import type {
  Pokemon,
  PokeAPIListResponse,
  PokeAPITypeResponse,
} from "../types/index";
import { POKEMON_TYPES } from "../constants/pokemonTypes";

const POKEAPI = "https://pokeapi.co/api/v2";
const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const POKEMON_LIMIT = 1025;

function idFromUrl(url: string): number | null {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : null;
}

export async function fetchAllPokemon(): Promise<Pokemon[]> {
  try {
    // 1) List of all Pokémon (names + URLs).
    const listRes = await fetch(
      `${POKEAPI}/pokemon?limit=${POKEMON_LIMIT}&offset=0`,
      { cache: "force-cache" },
    );
    if (!listRes.ok) throw new Error(`list ${listRes.status}`);
    const listData: PokeAPIListResponse = await listRes.json();

    // 2) For each of the 18 types, fetch its members in parallel.
    const typeResults = await Promise.all(
      POKEMON_TYPES.map(async ({ name }) => {
        const r = await fetch(`${POKEAPI}/type/${name}`, {
          cache: "force-cache",
        });
        if (!r.ok) return { name, members: [] as string[] };
        const data: PokeAPITypeResponse = await r.json();
        const members = data.pokemon
          .map((p) => p.pokemon.name)
          .filter(Boolean);
        return { name, members };
      }),
    );

    // 3) Build a name -> types[] map (preserving canonical type ordering).
    const typesByName = new Map<string, string[]>();
    for (const { name, members } of typeResults) {
      for (const m of members) {
        const arr = typesByName.get(m);
        if (arr) arr.push(name);
        else typesByName.set(m, [name]);
      }
    }

    // 4) Compose final list. Skip entries without a parseable id (alt forms beyond 1025 etc.).
    const pokemon: Pokemon[] = [];
    for (const entry of listData.results) {
      const id = idFromUrl(entry.url);
      if (id == null || id > POKEMON_LIMIT) continue;
      pokemon.push({
        id,
        name: entry.name,
        image: `${SPRITE_BASE}/${id}.png`,
        types: typesByName.get(entry.name) ?? [],
      });
    }
    pokemon.sort((a, b) => a.id - b.id);
    return pokemon;
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return [];
  }
}
