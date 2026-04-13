import { seedEvents, sensorSources, zones } from './data.js';

const STORAGE_KEY = 'traffic_monitoring_state';
const state = loadState();

const zoneGrid = document.querySelector('[data-zone-grid]');
const streamList = document.querySelector('[data-stream-list]');
const incidentList = document.querySelector('[data-incident-list]');
const simulateButton = document.querySelector('[data-simulate-event]');
const toggleStreamButton = document.querySelector('[data-toggle-stream]');
const stats = {
  speed: document.querySelector('[data-stat-speed]'),
  incidents: document.querySelector('[data-stat-incidents]'),
  alerts: document.querySelector('[data-stat-alerts]'),
  zone: document.querySelector('[data-stat-zone]'),
};

initialize();

function initialize() {
  render();
  simulateButton.addEventListener('click', simulateEvent);
  toggleStreamButton.addEventListener('click', toggleStream);

  window.setInterval(() => {
    if (state.streaming) {
      simulateEvent(true);
    }
  }, 6000);
}

function render() {
  renderStats();
  renderZones();
  renderStream();
  renderIncidents();
}

function renderStats() {
  const incidents = state.events.filter((event) => !event.acknowledged);
  const averageSpeed = Math.round(state.events.reduce((sum, event) => sum + event.speed, 0) / Math.max(1, state.events.length));
  stats.speed.textContent = `${averageSpeed} km/h`;
  stats.incidents.textContent = String(incidents.length);
  stats.alerts.textContent = String(state.alertsSent);
  stats.zone.textContent = zones.find((zone) => zone.id === state.selectedZoneId)?.name ?? 'Central';
}

function renderZones() {
  zoneGrid.innerHTML = zones
    .map((zone) => {
      const selected = zone.id === state.selectedZoneId;
      const zoneEvents = state.events.filter((event) => event.zoneId === zone.id);
      const active = zoneEvents.filter((event) => !event.acknowledged).length;
      return `
        <button type="button" class="zone-card ${selected ? 'zone-card--active' : ''}" data-zone-id="${zone.id}">
          <strong>${zone.name}</strong>
          <span>Baseline ${zone.baselineSpeed} km/h</span>
          <div class="zone-card__footer">
            <span>${Math.round(zone.congestion * 100)}% congestion</span>
            <span>${active} incidents</span>
          </div>
        </button>
      `;
    })
    .join('');

  zoneGrid.querySelectorAll('[data-zone-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedZoneId = button.dataset.zoneId;
      persist();
      render();
    });
  });
}

function renderStream() {
  const events = state.events.filter((event) => event.zoneId === state.selectedZoneId);

  streamList.innerHTML = events.length
    ? events
        .map(
          (event) => `
            <article class="stream-card ${event.severity}">
              <div class="stream-card__header">
                <div>
                  <strong>${event.source}</strong>
                  <p>${formatRelative(event.createdAt)} • ${event.zoneId.toUpperCase()}</p>
                </div>
                <span class="pill">${event.severity}</span>
              </div>
              <p>${event.message}</p>
              <div class="stream-card__footer">
                <span>Speed ${event.speed} km/h</span>
                <span>Occupancy ${Math.round(event.occupancy * 100)}%</span>
              </div>
            </article>
          `,
        )
        .join('')
    : '<p class="empty-state">No events for this zone yet.</p>';
}

function renderIncidents() {
  const incidents = state.events.filter((event) => !event.acknowledged).slice(0, 8);
  incidentList.innerHTML = incidents.length
    ? incidents
        .map(
          (incident) => `
            <article class="incident-card">
              <div>
                <strong>${incident.message}</strong>
                <p>${incident.source} • ${formatRelative(incident.createdAt)}</p>
              </div>
              <div class="incident-card__actions">
                <button type="button" class="button button--ghost" data-ack="${incident.id}">Acknowledge</button>
                <button type="button" class="button" data-resolve="${incident.id}">Resolve</button>
              </div>
            </article>
          `,
        )
        .join('')
    : '<p class="empty-state">No open incidents in the current view.</p>';

  incidentList.querySelectorAll('[data-ack]').forEach((button) => button.addEventListener('click', () => acknowledgeIncident(button.dataset.ack)));
  incidentList.querySelectorAll('[data-resolve]').forEach((button) => button.addEventListener('click', () => resolveIncident(button.dataset.resolve)));
}

function simulateEvent(manual = false) {
  const zone = zones.find((entry) => entry.id === state.selectedZoneId) ?? zones[0];
  const source = sensorSources[Math.floor(Math.random() * sensorSources.length)];
  const congestionSpike = Math.random() > 0.65;
  const speed = Math.max(12, Math.round(zone.baselineSpeed - (congestionSpike ? 16 + Math.random() * 8 : Math.random() * 10)));
  const occupancy = Math.min(0.98, zone.congestion + (congestionSpike ? 0.18 : Math.random() * 0.08));
  const severity = speed < 20 || occupancy > 0.9 ? 'critical' : speed < 28 ? 'high' : 'medium';

  state.events.unshift({
    id: `evt-${Math.random().toString(36).slice(2, 8)}`,
    zoneId: zone.id,
    source,
    speed,
    occupancy,
    severity,
    message: congestionSpike ? `Congestion spike detected in ${zone.name}.` : `Routine traffic update for ${zone.name}.`,
    createdAt: new Date().toISOString(),
    acknowledged: false,
  });

  if (severity !== 'medium') {
    state.alertsSent += 1;
  }

  state.events = state.events.slice(0, 20);
  persist();
  render();

  if (manual) {
    toggleStreamButton.textContent = state.streaming ? 'Pause stream' : 'Resume stream';
  }
}

function acknowledgeIncident(id) {
  const event = state.events.find((entry) => entry.id === id);
  if (!event) {
    return;
  }

  event.acknowledged = true;
  persist();
  render();
}

function resolveIncident(id) {
  state.events = state.events.filter((event) => event.id !== id);
  persist();
  render();
}

function toggleStream() {
  state.streaming = !state.streaming;
  toggleStreamButton.textContent = state.streaming ? 'Pause stream' : 'Resume stream';
  persist();
}

function formatRelative(isoString) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(isoString).getTime()) / 60000));
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  return `${Math.round(minutes / 60)}h ago`;
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        selectedZoneId: 'central',
        events: structuredClone(seedEvents),
        alertsSent: 3,
        streaming: true,
      };
    }

    const parsed = JSON.parse(stored);
    return {
      selectedZoneId: parsed.selectedZoneId ?? 'central',
      events: parsed.events ?? structuredClone(seedEvents),
      alertsSent: parsed.alertsSent ?? 3,
      streaming: parsed.streaming ?? true,
    };
  } catch {
    return {
      selectedZoneId: 'central',
      events: structuredClone(seedEvents),
      alertsSent: 3,
      streaming: true,
    };
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
