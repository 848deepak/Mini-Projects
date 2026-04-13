export const movies = [
  {
    id: 'ember-night',
    title: 'Ember Night',
    genre: 'Action Thriller',
    rating: 'PG-13',
    duration: '2h 18m',
    language: 'English',
    price: 12.5,
    poster: 'https://picsum.photos/seed/ember-night/640/960',
    synopsis: 'A former intelligence officer races to stop a city-wide blackout conspiracy before the evening premiere.',
    showtimes: [
      { id: 'ember-night-1015', label: '10:15 AM', screen: 'Screen 1', format: '2D' },
      { id: 'ember-night-1430', label: '2:30 PM', screen: 'Screen 4', format: 'IMAX' },
      { id: 'ember-night-1945', label: '7:45 PM', screen: 'Screen 2', format: 'Dolby' },
    ],
  },
  {
    id: 'moonlit-threads',
    title: 'Moonlit Threads',
    genre: 'Romance Drama',
    rating: 'U',
    duration: '2h 05m',
    language: 'English',
    price: 10.25,
    poster: 'https://picsum.photos/seed/moonlit-threads/640/960',
    synopsis: 'Two strangers keep meeting on the last train home and slowly stitch together a life-changing friendship.',
    showtimes: [
      { id: 'moonlit-threads-0945', label: '9:45 AM', screen: 'Screen 5', format: '2D' },
      { id: 'moonlit-threads-1400', label: '2:00 PM', screen: 'Screen 6', format: '2D' },
      { id: 'moonlit-threads-2035', label: '8:35 PM', screen: 'Screen 3', format: 'Dolby' },
    ],
  },
  {
    id: 'orbit-rescue',
    title: 'Orbit Rescue',
    genre: 'Sci-Fi Adventure',
    rating: 'PG',
    duration: '2h 24m',
    language: 'English',
    price: 13.75,
    poster: 'https://picsum.photos/seed/orbit-rescue/640/960',
    synopsis: 'A stranded crew turns a broken research satellite into their only hope of escaping a solar storm.',
    showtimes: [
      { id: 'orbit-rescue-1100', label: '11:00 AM', screen: 'Screen 2', format: 'IMAX' },
      { id: 'orbit-rescue-1545', label: '3:45 PM', screen: 'Screen 1', format: '2D' },
      { id: 'orbit-rescue-2130', label: '9:30 PM', screen: 'Screen 7', format: '4DX' },
    ],
  },
  {
    id: 'velvet-circuit',
    title: 'Velvet Circuit',
    genre: 'Cyberpunk Mystery',
    rating: 'PG-13',
    duration: '1h 58m',
    language: 'English',
    price: 11.5,
    poster: 'https://picsum.photos/seed/velvet-circuit/640/960',
    synopsis: 'An underground hacker follows a glowing trail through a neon city to expose a memory-harvesting network.',
    showtimes: [
      { id: 'velvet-circuit-0930', label: '9:30 AM', screen: 'Screen 3', format: '2D' },
      { id: 'velvet-circuit-1600', label: '4:00 PM', screen: 'Screen 8', format: 'IMAX' },
      { id: 'velvet-circuit-2210', label: '10:10 PM', screen: 'Screen 4', format: 'Dolby' },
    ],
  },
  {
    id: 'last-train-home',
    title: 'Last Train Home',
    genre: 'Suspense Crime',
    rating: 'R',
    duration: '2h 11m',
    language: 'Hindi',
    price: 9.75,
    poster: 'https://picsum.photos/seed/last-train-home/640/960',
    synopsis: 'When a midnight commuter train disappears, a detective uncovers a syndicate hiding in plain sight.',
    showtimes: [
      { id: 'last-train-home-1040', label: '10:40 AM', screen: 'Screen 6', format: '2D' },
      { id: 'last-train-home-1515', label: '3:15 PM', screen: 'Screen 5', format: '2D' },
      { id: 'last-train-home-2005', label: '8:05 PM', screen: 'Screen 2', format: 'Dolby' },
    ],
  },
];

export function findMovie(movieId) {
  return movies.find((movie) => movie.id === movieId) ?? null;
}

export function findShowtime(movie, showtimeId) {
  return movie?.showtimes.find((showtime) => showtime.id === showtimeId) ?? null;
}

export function currency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}
