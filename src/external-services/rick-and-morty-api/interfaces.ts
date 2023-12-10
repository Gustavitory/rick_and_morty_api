export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Partial<Location>;
  location: Partial<Location>;
  image: string;
  episode: string[];
  url: string;
  created: Date;
}

export interface info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface perPageApiResponse {
  info: info;
  results: Character[] | Episode[];
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: Date;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: Date;
}
