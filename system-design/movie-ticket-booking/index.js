import { currency, movies } from './movies.js';

const grid = document.querySelector('[data-movie-grid]');
const searchInput = document.querySelector('[data-search]');
const filterSelect = document.querySelector('[data-filter]');
const stats = document.querySelector('[data-stats]');
const emptyState = document.querySelector('[data-empty]');

function renderMovies(list) {
  if (!grid) {
    return;
  }

  grid.innerHTML = list
    .map((movie) => {
      const primaryShowtime = movie.showtimes[0];
      const showtimeMarkup = movie.showtimes
        .map(
          (showtime) => `
            <a class="showtime-chip" href="./seats.html?movie=${encodeURIComponent(movie.id)}&showtime=${encodeURIComponent(showtime.id)}">
              ${showtime.label}
            </a>
          `,
        )
        .join('');

      return `
        <article class="movie-card">
          <div class="movie-card__poster-wrap">
            <img class="movie-card__poster" src="${movie.poster}" alt="${movie.title} poster" loading="lazy" />
            <span class="movie-card__rating">${movie.rating}</span>
          </div>
          <div class="movie-card__body">
            <div class="movie-card__meta">
              <span>${movie.genre}</span>
              <span>${movie.duration}</span>
            </div>
            <h3>${movie.title}</h3>
            <p>${movie.synopsis}</p>
            <div class="movie-card__price-row">
              <strong>${currency(movie.price)}</strong>
              <span>per ticket</span>
            </div>
            <div class="movie-card__showtimes">${showtimeMarkup}</div>
            <a class="button button--block" href="./seats.html?movie=${encodeURIComponent(movie.id)}&showtime=${encodeURIComponent(primaryShowtime.id)}">
              Book seats
            </a>
          </div>
        </article>
      `;
    })
    .join('');

  if (emptyState) {
    emptyState.hidden = list.length > 0;
  }

  if (stats) {
    const showtimeCount = list.reduce((total, movie) => total + movie.showtimes.length, 0);
    stats.textContent = `${list.length} movies • ${showtimeCount} showtimes`;
  }
}

function applyFilters() {
  const searchTerm = searchInput?.value.trim().toLowerCase() ?? '';
  const genreFilter = filterSelect?.value ?? 'all';

  const filtered = movies.filter((movie) => {
    const matchesSearch = [movie.title, movie.genre, movie.synopsis]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);

    const matchesGenre = genreFilter === 'all' || movie.genre.toLowerCase().includes(genreFilter.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  renderMovies(filtered);
}

searchInput?.addEventListener('input', applyFilters);
filterSelect?.addEventListener('change', applyFilters);

renderMovies(movies);
