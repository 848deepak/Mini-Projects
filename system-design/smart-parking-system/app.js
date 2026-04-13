import { parkingLots, vehicleTypes } from './data.js';

const STORAGE_KEY = 'smart_parking_sessions';
const state = {
  vehicleType: vehicleTypes[0],
  selectedLotId: parkingLots[0].id,
  selectedSlotId: null,
  durationHours: 2,
  sessions: loadSessions(),
};

const lotGrid = document.querySelector('[data-lot-grid]');
const slotGrid = document.querySelector('[data-slot-grid]');
const sessionList = document.querySelector('[data-session-list]');
const vehicleFilter = document.querySelector('[data-vehicle-filter]');
const totalSlots = document.querySelector('[data-total-slots]');
const reservedSlots = document.querySelector('[data-reserved-slots]');
const averagePrice = document.querySelector('[data-average-price]');
const vehicleTypeLabel = document.querySelector('[data-vehicle-type]');
const selectedLotLabel = document.querySelector('[data-selected-lot]');
const durationRange = document.querySelector('[data-duration-range]');
const durationLabel = document.querySelector('[data-duration-label]');
const estimatedPrice = document.querySelector('[data-estimated-price]');
const reserveButton = document.querySelector('[data-reserve-button]');

initialize();

function initialize() {
  vehicleFilter.innerHTML = vehicleTypes.map((type) => `<option value="${type}">${type}</option>`).join('');
  vehicleFilter.value = state.vehicleType;
  durationRange.value = String(state.durationHours);

  vehicleFilter.addEventListener('change', () => {
    state.vehicleType = vehicleFilter.value;
    state.selectedSlotId = null;
    render();
  });

  durationRange.addEventListener('input', () => {
    state.durationHours = Number(durationRange.value);
    renderSummary();
  });

  reserveButton.addEventListener('click', reserveSlot);

  render();
}

function render() {
  const lot = getSelectedLot();
  renderDashboard();
  renderLots();
  renderSlots();
  renderSessions();
  renderSummary();
  selectedLotLabel.textContent = `${lot.name} • ${lot.location}`;
}

function renderDashboard() {
  const allSlots = parkingLots.flatMap((lot) => lot.slots);
  totalSlots.textContent = String(allSlots.length);
  reservedSlots.textContent = String(allSlots.filter((slot) => slot.status === 'reserved').length);
  averagePrice.textContent = `$${averageLotPrice().toFixed(0)}`;
  vehicleTypeLabel.textContent = state.vehicleType;
}

function renderLots() {
  lotGrid.innerHTML = parkingLots
    .map((lot) => {
      const matchedSlots = lot.slots.filter((slot) => slot.type === state.vehicleType && slot.status === 'available').length;
      const active = lot.id === state.selectedLotId;
      return `
        <button type="button" class="lot-card ${active ? 'lot-card--active' : ''}" data-lot-id="${lot.id}">
          <span class="lot-card__tag">${matchedSlots} available</span>
          <strong>${lot.name}</strong>
          <span>${lot.location} • ${lot.distance}</span>
          <div class="lot-card__footer">
            <span>${lot.capacity} spaces</span>
            <span>$${estimateLotPrice(lot).toFixed(0)}/hr</span>
          </div>
        </button>
      `;
    })
    .join('');

  lotGrid.querySelectorAll('[data-lot-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedLotId = button.dataset.lotId;
      state.selectedSlotId = null;
      render();
    });
  });
}

function renderSlots() {
  const lot = getSelectedLot();
  const slots = lot.slots.filter((slot) => slot.type === state.vehicleType || state.vehicleType === 'Car' && slot.type === 'EV');

  slotGrid.innerHTML = slots
    .map((slot) => {
      const active = state.selectedSlotId === slot.id;
      return `
        <button type="button" class="slot-card slot-card--${slot.status} ${active ? 'slot-card--active' : ''}" data-slot-id="${slot.id}" ${slot.status !== 'available' ? 'disabled' : ''}>
          <strong>${slot.id}</strong>
          <span>${slot.type}</span>
          <em>${slot.status}</em>
        </button>
      `;
    })
    .join('');

  slotGrid.querySelectorAll('[data-slot-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedSlotId = button.dataset.slotId;
      renderSlots();
      renderSummary();
    });
  });
}

function renderSessions() {
  if (state.sessions.length === 0) {
    sessionList.innerHTML = '<p class="empty-state">No active sessions yet.</p>';
    return;
  }

  sessionList.innerHTML = state.sessions
    .map(
      (session) => `
        <article class="session-card">
          <div>
            <strong>${session.slotId}</strong>
            <p>${session.lotName} • ${session.vehicleType}</p>
          </div>
          <div class="session-card__meta">
            <span>${session.durationHours}h</span>
            <strong>$${session.total.toFixed(2)}</strong>
          </div>
          <button type="button" class="button button--ghost" data-close-session="${session.id}">Close session</button>
        </article>
      `,
    )
    .join('');

  sessionList.querySelectorAll('[data-close-session]').forEach((button) => {
    button.addEventListener('click', () => {
      state.sessions = state.sessions.filter((session) => session.id !== button.dataset.closeSession);
      persistSessions();
      renderSessions();
      renderDashboard();
    });
  });
}

function renderSummary() {
  const lot = getSelectedLot();
  const slot = lot.slots.find((entry) => entry.id === state.selectedSlotId);
  const total = slot ? calculatePrice(lot, slot, state.durationHours) : 0;
  estimatedPrice.textContent = `$${total.toFixed(2)}`;
  durationLabel.textContent = `${state.durationHours} hour${state.durationHours > 1 ? 's' : ''}`;
  reserveButton.disabled = !slot;
}

function reserveSlot() {
  const lot = getSelectedLot();
  const slot = lot.slots.find((entry) => entry.id === state.selectedSlotId && entry.status === 'available');
  if (!slot) {
    return;
  }

  slot.status = 'reserved';
  const total = calculatePrice(lot, slot, state.durationHours);
  state.sessions.unshift({
    id: `sess-${Math.random().toString(36).slice(2, 8)}`,
    lotName: lot.name,
    slotId: slot.id,
    vehicleType: state.vehicleType,
    durationHours: state.durationHours,
    total,
    createdAt: new Date().toISOString(),
  });

  persistSessions();
  state.selectedSlotId = null;
  render();
}

function calculatePrice(lot, slot, durationHours) {
  const typeMultiplier = slot.type === 'SUV' ? 1.45 : slot.type === 'EV' ? 1.3 : slot.type === 'Bike' ? 0.7 : 1;
  return lot.baseRate * lot.surgeFactor * typeMultiplier * durationHours;
}

function estimateLotPrice(lot) {
  const baseSlot = lot.slots.find((slot) => slot.type === state.vehicleType) ?? lot.slots[0];
  return calculatePrice(lot, baseSlot, 1);
}

function averageLotPrice() {
  const values = parkingLots.map((lot) => estimateLotPrice(lot));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getSelectedLot() {
  return parkingLots.find((lot) => lot.id === state.selectedLotId) ?? parkingLots[0];
}

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function persistSessions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sessions));
}
