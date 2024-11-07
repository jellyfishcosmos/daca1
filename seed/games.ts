import { Game, GameCompany } from '../shared/types';

export const games: Game[] = [
  {
    adult: false,
    backdrop_path: '/sRLC052ieEzkQs9dEtPMfFxYkej.jpg',
    genre_ids: [ 1, 2 ], // Action, RPG
    gameId: 1234,
    original_language: 'en',
    original_title: 'Starfield',
    overview: 'In Starfield, players can explore a vast open universe, join factions, and shape the fate of humanity in a story of exploration and discovery. Customize your own ship and travel through hundreds of star systems in a galaxy filled with opportunities.',
    popularity: 2136.3,
    poster_path: '/6epeijccmJlnfvFitfGyfT7njav.jpg',
    release_date: '2023-09-06',
    title: 'Starfield',
    video: false,
    vote_average: 8.0,
    vote_count: 750
  },
  {
    adult: false,
    backdrop_path: '/jXJxMcVoEuXzym3vFnjqDW4ifo6.jpg',
    genre_ids: [ 1, 5 ], // Action, Fantasy
    gameId: 2345,
    original_language: 'en',
    original_title: 'The Legend of Zelda: Tears of the Kingdom',
    overview: "Link sets out on a dangerous journey to discover the truth behind mysterious forces threatening Hyrule. With new abilities and allies, players explore both the surface and the skies above in a massive, open world.",
    popularity: 1605.303,
    poster_path: '/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg',
    release_date: '2023-05-12',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    video: false,
    vote_average: 9.5,
    vote_count: 299
  },
  {
    adult: false,
    backdrop_path: '/5a4JdoFwll5DRtKMe7JLuGQ9yJm.jpg',
    genre_ids: [ 3, 1 ], // Simulation, Action
    gameId: 695721,
    original_language: 'en',
    original_title: 'Baldur\'s Gate 3',
    overview: 'A grand RPG set in the Dungeons & Dragons universe, Baldur\'s Gate 3 lets players create their own characters, navigate complex dialogue choices, and take part in epic battles. Choose between solo or co-op campaigns in a rich fantasy world.',
    popularity: 1509.974,
    poster_path: '/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg',
    release_date: '2023-08-03',
    title: 'Baldur\'s Gate 3',
    video: false,
    vote_average: 9.3,
    vote_count: 1181
  },
  {
    adult: false,
    backdrop_path: '/15Fe18IglCCP1jJoj5F529on0IA.jpg',
    genre_ids: [ 1, 4 ], // Action, Puzzle
    gameId: 1029575,
    original_language: 'en',
    original_title: 'Spider-Man 2',
    overview: "Peter Parker and Miles Morales team up in this high-octane action-adventure game. Explore a vast open-world NYC, battle iconic villains, and experience a gripping story with dynamic web-swinging mechanics.",
    popularity: 954.371,
    poster_path: '/jLLtx3nTRSLGPAKl4RoIv1FbEBr.jpg',
    release_date: '2023-10-20',
    title: 'Spider-Man 2',
    video: false,
    vote_average: 9.2,
    vote_count: 457
  },
  {
    adult: false,
    backdrop_path: '/bmlkLCjrIWnnZzdAQ4uNPG9JFdj.jpg',
    genre_ids: [ 2, 5 ], // RPG, Fantasy
    gameId: 787699,
    original_language: 'en',
    original_title: 'Diablo IV',
    overview: 'Diablo IV takes players back to the world of Sanctuary. With a darker story, players can choose between several classes to explore vast regions, battle demonic forces, and uncover the secrets of the new Diablo storyline.',
    popularity: 949.214,
    poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
    release_date: '2023-06-06',
    title: 'Diablo IV',
    video: false,
    vote_average: 8.4,
    vote_count: 703
  },
  {
    adult: false,
    backdrop_path: '/gg4zZoTggZmpAQ32qIrP5dtnkEZ.jpg',
    genre_ids: [ 1, 4 ], // Action, Shooter
    gameId: 891699,
    original_language: 'en',
    original_title: 'Call of Duty: Modern Warfare III',
    overview: "The latest installment in the Modern Warfare franchise brings players back into the action with improved graphics, new multiplayer modes, and an intense single-player campaign focused on global warfare.",
    popularity: 945.22,
    poster_path: '/tlcuhdNMKNGEVpGqBZrAaOOf1A6.jpg',
    release_date: '2023-11-10',
    title: 'Call of Duty: Modern Warfare III',
    video: false,
    vote_average: 7.8,
    vote_count: 181
  },
  {
    adult: false,
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    genre_ids: [ 3, 4 ], // Simulation, RPG
    gameId: 872585,
    original_language: 'en',
    original_title: 'Cities: Skylines II',
    overview: 'Build, manage, and grow a city from the ground up in this detailed simulation game. Players can design their city, manage resources, and balance the needs of the population while navigating urban challenges.',
    popularity: 746.349,
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    release_date: '2023-10-24',
    title: 'Cities: Skylines II',
    video: false,
    vote_average: 7.7,
    vote_count: 5713
  },
  {
    adult: false,
    backdrop_path: '/1jITxVJhkiFJuQuj8NcPLmDNtJg.jpg',
    genre_ids: [ 2, 5 ], // RPG, Fantasy
    gameId: 930564,
    original_language: 'en',
    original_title: 'Final Fantasy XVI',
    overview: "The latest entry in the iconic RPG series, Final Fantasy XVI offers an immersive world with a deep narrative, real-time combat, and a darker tone. Players take control of Clive Rosfield as he navigates a world on the brink of collapse.",
    popularity: 658.86,
    poster_path: '/qjhahNLSZ705B5JP92YMEYPocPz.jpg',
    release_date: '2023-06-22',
    title: 'Final Fantasy XVI',
    video: false,
    vote_average: 8.6,
    vote_count: 473
  },
];

export const gameCompanies: GameCompany[] = [
  {
    gameId: 1234,
    companyName: "Bethesda Game Studios",
    roleName: "Developer",
    roleDescription: "Creators of the vast open-world universe of Starfield.",
  },
  {
    gameId: 1234,
    companyName: "Microsoft Studios",
    roleName: "Publisher",
    roleDescription: "Handles the distribution and global marketing of Starfield.",
  },
  {
    gameId: 2345,
    companyName: "Nintendo EPD",
    roleName: "Developer",
    roleDescription: "The legendary developers behind the Zelda franchise.",
  },
  {
    gameId: 695721,
    companyName: "Larian Studios",
    roleName: "Developer",
    roleDescription: "Creators of the expansive RPG Baldur's Gate 3.",
  },
  {
    gameId: 1029575,
    companyName: "Insomniac Games",
    roleName: "Developer",
    roleDescription: "Creators of the Spider-Man franchise and developers of Spider-Man 2.",
  },
  {
    gameId: 787699,
    companyName: "Blizzard Entertainment",
    roleName: "Developer",
    roleDescription: "Responsible for the design and development of Diablo IV.",
  },
  {
    gameId: 891699,
    companyName: "Infinity Ward",
    roleName: "Developer",
    roleDescription: "Creators of the Call of Duty series, including Modern Warfare III.",
  },
  {
    gameId: 872585,
    companyName: "Colossal Order",
    roleName: "Developer",
    roleDescription: "Developers of the Cities: Skylines franchise.",
  }]


