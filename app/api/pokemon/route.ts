import { fetchAllPokemon } from "../../lib/pokemon";

export async function GET() {
  const pokemon = await fetchAllPokemon();
  return Response.json(pokemon);
}
