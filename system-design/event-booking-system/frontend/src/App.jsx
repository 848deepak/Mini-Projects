import { useEffect, useMemo, useState } from 'react';
import { api } from './api';

const tabs = [
  { key: 'events', label: 'Event Catalog' },
  { key: 'bookings', label: 'My Bookings' },
  { key: 'checkin', label: 'Gate Check-in' }
];

function randomId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function formatDate(input) {
  return new Date(input).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem('ebs-auth');
    return raw ? JSON.parse(raw) : null;
  });
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState({});
  const [filters, setFilters] = useState({ city: '', q: '' });
  const [formState, setFormState] = useState({ eventId: '', tierId: '', quantity: 1 });
  const [checkinToken, setCheckinToken] = useState('');
  const [checkinResult, setCheckinResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionState, setActionState] = useState({ message: '', error: '' });

  useEffect(() => {
    if (auth) {
      localStorage.setItem('ebs-auth', JSON.stringify(auth));
      refreshEvents();
      refreshBookings(auth.userId);
    }
  }, [auth]);

  async function refreshEvents() {
    setLoading(true);
    setActionState({ message: '', error: '' });
    try {
      const data = await api.listEvents(filters.city, filters.q);
      setEvents(data);
      const pairs = await Promise.all(data.map(async (event) => [event.eventId, await api.getAvailability(event.eventId)]));
      setAvailability(Object.fromEntries(pairs));
    } catch (error) {
      setActionState({ message: '', error: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function refreshBookings(userId = auth?.userId) {
    if (!userId) return;
    try {
      const data = await api.getBookingsByUser(userId);
      setBookings(data);
    } catch (error) {
      setActionState({ message: '', error: error.message });
    }
  }

  async function createHoldAndBooking() {
    if (!formState.eventId || !formState.tierId) {
      setActionState({ message: '', error: 'Select an event and ticket tier before booking.' });
      return;
    }

    setLoading(true);
    setActionState({ message: '', error: '' });
    try {
      const hold = await api.createHold({
        eventId: formState.eventId,
        tierId: formState.tierId,
        quantity: Number(formState.quantity),
        userId: auth.userId,
        idempotencyKey: randomId('hold')
      });

      const booking = await api.createBooking({
        holdId: hold.holdId,
        userId: auth.userId,
        paymentMethod: 'mock-card',
        idempotencyKey: randomId('book')
      });

      setActionState({ message: `Booking ${booking.bookingId} confirmed with ${booking.tickets.length} ticket(s).`, error: '' });
      await refreshEvents();
      await refreshBookings();
      setActiveTab('bookings');
    } catch (error) {
      setActionState({ message: '', error: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function joinWaitlist() {
    if (!formState.eventId || !formState.tierId) {
      setActionState({ message: '', error: 'Choose event and tier first.' });
      return;
    }

    setLoading(true);
    setActionState({ message: '', error: '' });
    try {
      const entry = await api.addWaitlist({
        eventId: formState.eventId,
        tierId: formState.tierId,
        quantity: Number(formState.quantity),
        userId: auth.userId
      });
      setActionState({ message: `Added to waitlist with rank #${entry.rank}.`, error: '' });
    } catch (error) {
      setActionState({ message: '', error: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    setLoading(true);
    setActionState({ message: '', error: '' });
    try {
      await api.cancelBooking(bookingId);
      setActionState({ message: `Booking ${bookingId} cancelled and waitlist promotion evaluated.`, error: '' });
      await refreshEvents();
      await refreshBookings();
    } catch (error) {
      setActionState({ message: '', error: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function validateTicket() {
    if (!checkinToken.trim()) {
      setActionState({ message: '', error: 'Enter a QR token to validate.' });
      return;
    }

    setLoading(true);
    setActionState({ message: '', error: '' });
    try {
      const result = await api.validateCheckin({
        qrToken: checkinToken.trim(),
        gateId: 'gate-a',
        deviceId: 'scanner-web-01',
        idempotencyKey: randomId('chk')
      });
      setCheckinResult(result);
      setActionState({ message: result.reason, error: '' });
    } catch (error) {
      setActionState({ message: '', error: error.message });
    } finally {
      setLoading(false);
    }
  }

  const selectedEvent = useMemo(
    () => events.find((event) => event.eventId === formState.eventId) || null,
    [events, formState.eventId]
  );

  if (!auth) {
    return (
      <div className="login-shell">
        <div className="login-art" />
        <form
          className="login-card"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get('name') || '').trim();
            const role = String(fd.get('role') || 'buyer');
            if (!name) return;
            setAuth({ name, role, userId: `usr_${name.toLowerCase().replace(/\s+/g, '_')}` });
          }}
        >
          <h1>Event Booking Console</h1>
          <p>Operations-grade ticketing workspace for bookings, inventory and venue check-ins.</p>
          <label>
            Full Name
            <input name="name" placeholder="Aarav Singh" required />
          </label>
          <label>
            Role
            <select name="role" defaultValue="buyer">
              <option value="buyer">Buyer</option>
              <option value="organizer">Organizer</option>
              <option value="gate">Gate Staff</option>
            </select>
          </label>
          <button type="submit">Enter Workspace</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>EBS</span>
          <div>
            <h2>Control Plane</h2>
            <p>Real-time ticket operations</p>
          </div>
        </div>

        <nav>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="user-block">
          <p>{auth.name}</p>
          <span>{auth.userId}</span>
          <small>{auth.role}</small>
          <button
            className="ghost"
            onClick={() => {
              localStorage.removeItem('ebs-auth');
              setAuth(null);
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <h1>Event Booking System</h1>
          <div className="stats">
            <Stat label="Events" value={events.length} />
            <Stat label="Bookings" value={bookings.length} />
            <Stat label="Tickets" value={bookings.reduce((sum, b) => sum + b.tickets.length, 0)} />
          </div>
        </header>

        {actionState.error && <div className="toast error">{actionState.error}</div>}
        {actionState.message && <div className="toast success">{actionState.message}</div>}

        {activeTab === 'events' && (
          <section className="panel">
            <div className="panel-header">
              <h3>Live Event Inventory</h3>
              <div className="filters">
                <input
                  placeholder="Search event"
                  value={filters.q}
                  onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
                />
                <input
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) => setFilters((s) => ({ ...s, city: e.target.value }))}
                />
                <button onClick={refreshEvents} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
              </div>
            </div>

            <div className="grid two">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Venue</th>
                      <th>Start</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr
                        key={event.eventId}
                        className={formState.eventId === event.eventId ? 'selected' : ''}
                        onClick={() => setFormState((s) => ({ ...s, eventId: event.eventId, tierId: '' }))}
                      >
                        <td>
                          <strong>{event.title}</strong>
                          <p>{event.eventId}</p>
                        </td>
                        <td>{event.venue}, {event.city}</td>
                        <td>{formatDate(event.startAt)}</td>
                        <td>{event.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="booking-card">
                <h4>Create Hold and Book</h4>
                {!selectedEvent && <p>Select an event from the table to continue.</p>}
                {selectedEvent && (
                  <>
                    <label>
                      Ticket Tier
                      <select
                        value={formState.tierId}
                        onChange={(e) => setFormState((s) => ({ ...s, tierId: e.target.value }))}
                      >
                        <option value="">Choose tier</option>
                        {selectedEvent.tiers.map((tier) => (
                          <option key={tier.tierId} value={tier.tierId}>
                            {tier.name} - INR {tier.price}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Quantity
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formState.quantity}
                        onChange={(e) => setFormState((s) => ({ ...s, quantity: e.target.value }))}
                      />
                    </label>
                    <div className="actions">
                      <button onClick={createHoldAndBooking} disabled={loading}>Confirm Booking</button>
                      <button className="ghost" onClick={joinWaitlist} disabled={loading}>Join Waitlist</button>
                    </div>
                  </>
                )}

                <h5>Tier Availability</h5>
                <ul className="compact-list">
                  {(availability[formState.eventId] || []).map((item) => (
                    <li key={item.tierId}>
                      <span>{item.tierId}</span>
                      <b>{item.remaining} left</b>
                      <small>{item.sold} sold / {item.capacity} cap</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="panel">
            <div className="panel-header">
              <h3>Booking Ledger</h3>
              <button onClick={() => refreshBookings()} disabled={loading}>Refresh</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Event ID</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Tickets</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.bookingId}</td>
                      <td>{booking.eventId}</td>
                      <td>{booking.status}</td>
                      <td>INR {booking.totalAmount}</td>
                      <td>
                        {booking.tickets.map((ticket) => (
                          <p key={ticket.ticketId}>{ticket.ticketId} | {ticket.qrToken.slice(0, 14)}...</p>
                        ))}
                      </td>
                      <td>{formatDate(booking.createdAt)}</td>
                      <td>
                        <button
                          className="ghost"
                          onClick={() => handleCancel(booking.bookingId)}
                          disabled={booking.status === 'CANCELLED' || loading}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'checkin' && (
          <section className="panel narrow">
            <h3>Gate Validation</h3>
            <p>Use a QR token from booked tickets to validate entry and prevent duplicate scans.</p>
            <div className="checkin-box">
              <input
                value={checkinToken}
                onChange={(e) => setCheckinToken(e.target.value)}
                placeholder="qr_xxxxx"
              />
              <button onClick={validateTicket} disabled={loading}>Validate</button>
            </div>
            {checkinResult && (
              <div className={checkinResult.valid ? 'checkin-result pass' : 'checkin-result fail'}>
                <p><b>Result:</b> {checkinResult.valid ? 'VALID' : 'REJECTED'}</p>
                <p><b>Status:</b> {checkinResult.ticketStatus}</p>
                <p><b>Ticket ID:</b> {checkinResult.ticketId || '-'}</p>
                <p><b>Attendee:</b> {checkinResult.attendeeName || '-'}</p>
                <p><b>Reason:</b> {checkinResult.reason}</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
