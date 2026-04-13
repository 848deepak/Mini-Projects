import { currency, findMovie, findShowtime } from './movies.js';
import {
  clearDraftSeats,
  openConfirmationModal,
  persistBooking,
  readBookedSeats,
  readDraftSeats,
  seatStorageKey,
  writeDraftSeats,
} from './booking.js';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 8;

const seatGrid = document.querySelector('[data-seat-grid]');
const selectedCount = document.querySelector('[data-selected-count]');
const totalPrice = document.querySelector('[data-total-price]');
const movieTitle = document.querySelector('[data-movie-title]');
const movieInfo = document.querySelector('[data-movie-info]');
const showtimeInfo = document.querySelector('[data-showtime-info]');
const summaryList = document.querySelector('[data-summary-list]');
const confirmButton = document.querySelector('[data-confirm-booking]');
const resetButton = document.querySelector('[data-reset-selection]');
const backButton = document.querySelector('[data-back-button]');
const modal = document.querySelector('[data-booking-modal]');

const params = new URLSearchParams(window.location.search);
const movieId = params.get('movie');
const showtimeId = params.get('showtime');

const movie = findMovie(movieId);
const showtime = movie ? findShowtime(movie, showtimeId) : null;

if (!movie || !showtime) {
  renderNotFound();
} else {
  initSeatPage();
}

function initSeatPage() {
  const bookedSeats = new Set(readBookedSeats(movie.id, showtime.id));
  const draftSeats = new Set(readDraftSeats(movie.id, showtime.id));

  movieTitle.textContent = movie.title;
  movieInfo.textContent = `${movie.genre} • ${movie.rating} • ${movie.duration}`;
  showtimeInfo.textContent = `${showtime.label} • ${showtime.screen} • ${showtime.format}`;

  renderSeatGrid(bookedSeats, draftSeats);
  updateSummary(draftSeats);

  confirmButton.addEventListener('click', () => {
    const selectedSeats = getSelectedSeats();
    if (!selectedSeats.length) {
      return;
    }

    const booking = persistBooking({
      movie,
      showtime,
      seats: selectedSeats,
      total: selectedSeats.length * movie.price,
    });

    openConfirmationModal(modal, {
      booking,
      movie,
      showtime,
      onPrint: () => {
        document.body.classList.add('is-printing');
      },
    });

    const refreshedBookedSeats = new Set(readBookedSeats(movie.id, showtime.id));
    renderSeatGrid(refreshedBookedSeats, new Set());
    updateSummary(new Set());
  });

  resetButton.addEventListener('click', () => {
    writeDraftSeats(movie.id, showtime.id, []);
    renderSeatGrid(new Set(readBookedSeats(movie.id, showtime.id)), new Set());
    updateSummary(new Set());
  });

  backButton.addEventListener('click', () => {
    window.location.href = './index.html';
  });

  modal.addEventListener('click', (event) => {
    if (event.target?.hasAttribute('data-close-modal')) {
      modal.hidden = true;
      modal.innerHTML = '';
      document.body.classList.remove('is-printing');
    }
  });
}

function renderSeatGrid(bookedSeats, draftSeats) {
  seatGrid.innerHTML = '';

  ROWS.forEach((row) => {
    for (let seatNumber = 1; seatNumber <= SEATS_PER_ROW; seatNumber += 1) {
      const seatId = `${row}${seatNumber}`;
      const seatButton = document.createElement('button');
      seatButton.type = 'button';
      seatButton.className = 'seat';
      seatButton.textContent = seatId;
      seatButton.dataset.seat = seatId;

      if (bookedSeats.has(seatId)) {
        seatButton.classList.add('seat--booked');
        seatButton.disabled = true;
        seatButton.setAttribute('aria-label', `${seatId} booked`);
      } else if (draftSeats.has(seatId)) {
        seatButton.classList.add('seat--selected');
        seatButton.setAttribute('aria-label', `${seatId} selected`);
      } else {
        seatButton.classList.add('seat--available');
        seatButton.setAttribute('aria-label', `${seatId} available`);
      }

      seatButton.addEventListener('click', () => toggleSeat(seatId));
      seatGrid.appendChild(seatButton);
    }
  });
}

function toggleSeat(seatId) {
  const bookedSeats = new Set(readBookedSeats(movie.id, showtime.id));
  const currentSelected = new Set(readDraftSeats(movie.id, showtime.id));

  if (bookedSeats.has(seatId)) {
    return;
  }

  if (currentSelected.has(seatId)) {
    currentSelected.delete(seatId);
  } else {
    currentSelected.add(seatId);
  }

  const selectedSeats = [...currentSelected].sort(seatSorter);
  writeDraftSeats(movie.id, showtime.id, selectedSeats);
  renderSeatGrid(bookedSeats, new Set(selectedSeats));
  updateSummary(new Set(selectedSeats));
}

function updateSummary(selectedSeats) {
  const seats = [...selectedSeats].sort(seatSorter);
  selectedCount.textContent = String(seats.length);
  totalPrice.textContent = currency(seats.length * movie.price);
  confirmButton.disabled = seats.length === 0;

  summaryList.innerHTML = seats.length
    ? seats.map((seat) => `<li>${seat}</li>`).join('')
    : '<li class="summary__empty">No seats selected yet</li>';
}

function getSelectedSeats() {
  return [...readDraftSeats(movie.id, showtime.id)].sort(seatSorter);
}

function seatSorter(a, b) {
  const rowDelta = a.charCodeAt(0) - b.charCodeAt(0);
  if (rowDelta !== 0) {
    return rowDelta;
  }
  return Number.parseInt(a.slice(1), 10) - Number.parseInt(b.slice(1), 10);
}

function renderNotFound() {
  document.body.innerHTML = `
    <main class="page page--empty">
      <section class="empty-state">
        <p class="eyebrow">Something went wrong</p>
        <h1>Movie or showtime not found.</h1>
        <p>Go back to the movie list and choose a valid showtime.</p>
        <a class="button" href="./index.html">Back to movies</a>
      </section>
    </main>
  `;
}
