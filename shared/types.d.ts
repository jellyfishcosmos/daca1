// export type Language = 'English' | 'Frenc

export type Game = {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  adult: boolean;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type GameCompany = {
  gameId: number;
  companyName: string;
  roleName: string;
  roleDescription: string;
};

export type GameCompanyQueryParams = {
  gameId: string;
  companyName?: string;
  roleName?: string;
};