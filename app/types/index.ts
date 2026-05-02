export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

export interface PokeAPIListResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokeAPIPokemonResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

export interface PokeAPITypeResponse {
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

export type ThemeKey =
  | "midnight-navy"
  | "tcg-gold"
  | "brutalist"
  | "game-boy"
  | "glass-holo";

export type BorderStyle = "solid" | "double" | "holo";

export type BackgroundPattern =
  | "solid"
  | "gradient"
  | "grid"
  | "dots"
  | "rays"
  | "type-fire"
  | "type-water"
  | "type-grass";

export interface CardConfig {
  theme: ThemeKey;
  name: string;
  trainerImage?: string;
  borderColor: string;
  borderStyle: BorderStyle;
  background: BackgroundPattern;
}

export const DEFAULT_CARD_CONFIG: CardConfig = {
  theme: "midnight-navy",
  name: "Ash's Best Bois",
  trainerImage: undefined,
  borderColor: "#ee1515",
  borderStyle: "solid",
  background: "solid",
};
