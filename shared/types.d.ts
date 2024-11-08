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

// export type GameCompany = {
//   companyId: number;
//   id: number;
//   companyName: string;
//   roleName: string;
//   roleDescription: string;
// };

export type GameCompanyQueryParams = {
  id: string;
  companyName?: string;
  roleName?: string;
};


export type SignUpBody = {
  username: string;
  password: string;
  email: string
}

export type ConfirmSignUpBody = {
  username: string;
  code: string;
}

export type SignInBody = {
  username: string;
  password: string;
}