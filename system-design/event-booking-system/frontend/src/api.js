const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload.message || 'Request failed';
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  listEvents: (city, q) => {
    const search = new URLSearchParams();
    if (city) search.set('city', city);
    if (q) search.set('q', q);
    const qs = search.toString();
    return request(`/v1/events${qs ? `?${qs}` : ''}`);
  },
  getAvailability: (eventId) => request(`/v1/events/${eventId}/availability`),
  createHold: (payload) => request('/v1/holds', { method: 'POST', body: JSON.stringify(payload) }),
  createBooking: (payload) => request('/v1/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  cancelBooking: (bookingId) => request(`/v1/bookings/${bookingId}/cancel`, { method: 'POST' }),
  addWaitlist: (payload) => request('/v1/waitlist', { method: 'POST', body: JSON.stringify(payload) }),
  getBookingsByUser: (userId) => request(`/v1/bookings?userId=${encodeURIComponent(userId)}`),
  validateCheckin: (payload) => request('/v1/checkins/validate', { method: 'POST', body: JSON.stringify(payload) })
};
