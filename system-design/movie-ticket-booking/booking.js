import { currency } from './movies.js';

const BOOKING_HISTORY_KEY = 'movie_ticket_bookings';

export function seatStorageKey(movieId, showtimeId) {
  return `booked_${movieId}_${showtimeId}`;
}

export function draftStorageKey(movieId, showtimeId) {
  return `draft_${movieId}_${showtimeId}`;
}

export function readBookedSeats(movieId, showtimeId) {
  return readLocalJson(seatStorageKey(movieId, showtimeId), []);
}

export function writeBookedSeats(movieId, showtimeId, seats) {
  localStorage.setItem(seatStorageKey(movieId, showtimeId), JSON.stringify([...new Set(seats)]));
}

export function readDraftSeats(movieId, showtimeId) {
  const key = draftStorageKey(movieId, showtimeId);
  const localDraft = readLocalJson(key, null);

  if (Array.isArray(localDraft)) {
    return localDraft;
  }

  const legacyDraft = readSessionJson(key, []);
  if (legacyDraft.length) {
    writeDraftSeats(movieId, showtimeId, legacyDraft);
    sessionStorage.removeItem(key);
  }

  return legacyDraft;
}

export function writeDraftSeats(movieId, showtimeId, seats) {
  localStorage.setItem(draftStorageKey(movieId, showtimeId), JSON.stringify([...new Set(seats)]));
}

export function clearDraftSeats(movieId, showtimeId) {
  const key = draftStorageKey(movieId, showtimeId);
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

export function createBookingReference() {
  return `MTB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function persistBooking({ movie, showtime, seats, total }) {
  const booking = {
    bookingCode: createBookingReference(),
    movieId: movie.id,
    showtimeId: showtime.id,
    movieTitle: movie.title,
    showtimeLabel: showtime.label,
    screen: showtime.screen,
    format: showtime.format,
    seats,
    total,
    createdAt: new Date().toISOString(),
  };

  const history = readLocalJson(BOOKING_HISTORY_KEY, []);
  history.unshift(booking);
  localStorage.setItem(BOOKING_HISTORY_KEY, JSON.stringify(history.slice(0, 25)));

  const bookedSeats = readBookedSeats(movie.id, showtime.id);
  writeBookedSeats(movie.id, showtime.id, [...bookedSeats, ...seats]);
  clearDraftSeats(movie.id, showtime.id);

  return booking;
}

export function openConfirmationModal(modalElement, { booking, movie, showtime, onPrint }) {
    const closeModal = () => {
      modalElement.hidden = true;
      modalElement.innerHTML = '';
      document.body.classList.remove('is-printing');
    };

  if (!modalElement) {
    return;
  }

  modalElement.hidden = false;
  modalElement.innerHTML = `
    <div class="modal__backdrop" data-close-modal></div>
    <section class="modal__card ticket" id="printableTicket" role="dialog" aria-modal="true" aria-labelledby="ticketTitle">
      <div class="ticket__header">
        <div>
          <p class="eyebrow">Booking confirmed</p>
          <h2 id="ticketTitle">${movie.title}</h2>
        </div>
        <span class="ticket__code">${booking.bookingCode}</span>
      </div>
      <div class="ticket__grid">
        <div>
          <span class="label">Showtime</span>
          <strong>${showtime.label}</strong>
        </div>
        <div>
          <span class="label">Screen</span>
          <strong>${showtime.screen}</strong>
        </div>
        <div>
          <span class="label">Format</span>
          <strong>${showtime.format}</strong>
        </div>
        <div>
          <span class="label">Seats</span>
          <strong>${booking.seats.join(', ')}</strong>
        </div>
      </div>
      <div class="ticket__footer">
        <div>
          <span class="label">Total paid</span>
          <strong>${currency(booking.total)}</strong>
        </div>
        <div>
          <span class="label">Booked at</span>
          <strong>${new Date(booking.createdAt).toLocaleString()}</strong>
        </div>
      </div>
      <div class="modal__actions">
        <button type="button" class="button button--ghost" data-close-modal>Close</button>
        <button type="button" class="button" data-print-ticket>Download Ticket</button>
      </div>
    </section>
  `;

  modalElement.querySelectorAll('[data-close-modal]').forEach((element) => {
    element.addEventListener('click', closeModal);
  });

  modalElement.querySelector('[data-print-ticket]')?.addEventListener('click', () => {
    onPrint?.();
    window.addEventListener(
      'afterprint',
      () => {
        document.body.classList.remove('is-printing');
      },
      { once: true },
    );
    window.print();
  });
}

function readLocalJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readSessionJson(key, fallback) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
