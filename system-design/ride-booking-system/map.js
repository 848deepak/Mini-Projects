import { cityLocations, mockDrivers, rideTypes } from './data.js';
import { createRideRecord, currency, estimateEtaMinutes, estimateFare, getRideHistory } from './booking.js';

const pickupInput = document.querySelector('[data-pickup-input]');
const dropInput = document.querySelector('[data-drop-input]');
const pickupDropdown = document.querySelector('[data-pickup-dropdown]');
const dropDropdown = document.querySelector('[data-drop-dropdown]');
const rideTypeGroup = document.querySelector('[data-ride-types]');
const statusText = document.querySelector('[data-status-text]');
const statusSteps = [...document.querySelectorAll('[data-status-step]')];
const farePreview = document.querySelector('[data-fare-preview]');
const etaPreview = document.querySelector('[data-eta-preview]');
const bookButton = document.querySelector('[data-book-ride]');
const resetButton = document.querySelector('[data-reset-ride]');
const historyList = document.querySelector('[data-history-list]');
const historySummary = document.querySelector('[data-history-summary]');
const activeRideCard = document.querySelector('[data-active-ride]');

const defaultCenter = [28.6139, 77.209];
const state = {
  pickup: null,
  drop: null,
  rideType: rideTypes[0],
  matching: false,
  driverMarker: null,
  pickupMarker: null,
  dropMarker: null,
  routeLine: null,
  map: null,
  estimatedDistanceKm: null,
  animationTimer: null,
};

initializeApp();

function initializeApp() {
  setupMap();
  setupRideTypes();
  setupAutocomplete(pickupInput, pickupDropdown, 'pickup');
  setupAutocomplete(dropInput, dropDropdown, 'drop');
  renderRideHistory();
  updatePricingPreview();

  bookButton.addEventListener('click', beginRideFlow);
  resetButton.addEventListener('click', resetRideForm);
}

function setupMap() {
  state.map = L.map('rideMap', {
    zoomControl: false,
    preferCanvas: true,
  }).setView(defaultCenter, 12);

  L.control.zoom({ position: 'bottomright' }).addTo(state.map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(state.map);

  state.routeLine = L.polyline([], {
    color: '#38bdf8',
    weight: 5,
    opacity: 0.85,
    dashArray: '8 10',
  }).addTo(state.map);
}

function setupRideTypes() {
  rideTypeGroup.innerHTML = rideTypes
    .map(
      (rideType, index) => `
        <button
          type="button"
          class="ride-type ${index === 0 ? 'ride-type--active' : ''}"
          data-ride-type="${rideType.id}"
          aria-pressed="${index === 0 ? 'true' : 'false'}"
        >
          <span class="ride-type__label">${rideType.label}</span>
          <span class="ride-type__accent">${rideType.accent}</span>
        </button>
      `,
    )
    .join('');

  rideTypeGroup.addEventListener('click', (event) => {
    const button = event.target.closest('[data-ride-type]');
    if (!button) {
      return;
    }

    const nextRideType = rideTypes.find((rideType) => rideType.id === button.dataset.rideType);
    if (!nextRideType) {
      return;
    }

    state.rideType = nextRideType;

    rideTypeGroup.querySelectorAll('.ride-type').forEach((node) => {
      const selected = node === button;
      node.classList.toggle('ride-type--active', selected);
      node.setAttribute('aria-pressed', String(selected));
    });

    updatePricingPreview();
  });
}

function setupAutocomplete(input, dropdown, fieldName) {
  const closeDropdown = () => {
    dropdown.hidden = true;
    dropdown.innerHTML = '';
  };

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const matches = cityLocations.filter((location) => location.label.toLowerCase().includes(query));

    if (!query || matches.length === 0) {
      closeDropdown();
      state[fieldName] = null;
      state.estimatedDistanceKm = null;
      updateMapMarkers();
      updatePricingPreview();
      return;
    }

    dropdown.innerHTML = matches
      .slice(0, 6)
      .map(
        (location) => `
          <button type="button" class="suggestion" data-location-id="${location.id}">
            <strong>${location.label}</strong>
            <span>${location.city}</span>
          </button>
        `,
      )
      .join('');
    dropdown.hidden = false;
  });

  dropdown.addEventListener('click', (event) => {
    const suggestion = event.target.closest('[data-location-id]');
    if (!suggestion) {
      return;
    }

    const location = cityLocations.find((entry) => entry.id === suggestion.dataset.locationId);
    if (!location) {
      return;
    }

    state[fieldName] = location;
    state.estimatedDistanceKm = null;
    input.value = `${location.label}, ${location.city}`;
    closeDropdown();
    updateMapMarkers();
    updatePricingPreview();
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      input.dispatchEvent(new Event('input'));
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(closeDropdown, 120);
  });
}

function updateMapMarkers() {
  if (state.pickupMarker) {
    state.map.removeLayer(state.pickupMarker);
  }

  if (state.dropMarker) {
    state.map.removeLayer(state.dropMarker);
  }

  const points = [];

  if (state.pickup) {
    state.pickupMarker = L.circleMarker([state.pickup.lat, state.pickup.lon], {
      radius: 10,
      color: '#38bdf8',
      fillColor: '#38bdf8',
      fillOpacity: 0.95,
      weight: 3,
    }).addTo(state.map).bindPopup(`<strong>Pickup</strong><br>${state.pickup.label}`);
    points.push([state.pickup.lat, state.pickup.lon]);
  }

  if (state.drop) {
    state.dropMarker = L.circleMarker([state.drop.lat, state.drop.lon], {
      radius: 10,
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.95,
      weight: 3,
    }).addTo(state.map).bindPopup(`<strong>Drop</strong><br>${state.drop.label}`);
    points.push([state.drop.lat, state.drop.lon]);
  }

  if (points.length === 1) {
    state.map.setView(points[0], 13, { animate: true });
  }

  if (points.length > 1) {
    state.map.fitBounds(points, { padding: [60, 60] });
    state.routeLine.setLatLngs(points);
  }
}

function updatePricingPreview() {
  if (!state.pickup || !state.drop) {
    farePreview.textContent = 'Select pickup and drop to estimate fare';
    etaPreview.textContent = 'ETA will update after you choose locations';
    bookButton.disabled = true;
    return;
  }

  if (state.estimatedDistanceKm === null) {
    state.estimatedDistanceKm = randomDistanceKm(3, 15);
  }

  const distanceKm = state.estimatedDistanceKm;
  const fare = estimateFare(distanceKm, state.rideType.multiplier);
  const eta = estimateEtaMinutes(distanceKm, state.rideType);

  farePreview.textContent = `${currency(fare)} • ${distanceKm.toFixed(1)} km`;
  etaPreview.textContent = `${eta} min arrival for ${state.rideType.label}`;
  bookButton.disabled = state.matching;
}

async function beginRideFlow() {
  if (!state.pickup || !state.drop || state.matching) {
    return;
  }

  state.matching = true;
  bookButton.disabled = true;
  resetButton.disabled = true;
  activeRideCard.hidden = false;

  const distanceKm = state.estimatedDistanceKm ?? randomDistanceKm(3, 15);
  state.estimatedDistanceKm = distanceKm;
  const fare = estimateFare(distanceKm, state.rideType.multiplier);
  const etaMinutes = estimateEtaMinutes(distanceKm, state.rideType);
  const driver = chooseDriver(state.pickup);
  const driverStart = jitterPoint(state.pickup.lat, state.pickup.lon, 0.03);

  setStatus('searching', `Searching for ${state.rideType.label.toLowerCase()} drivers nearby...`);
  await sleep(2000);

  setStatus('driver found', `${driver.name} matched in a ${driver.vehicle}.`);
  renderDriverMarker(driverStart);
  await sleep(1000);

  setStatus('en route', `${driver.name} is heading to pickup, then your destination.`);
  await animateDriverTo(state.pickup, 500, 10);

  renderRoute([state.pickup, state.drop]);
  await animateDriverTo(state.drop, 500, 16);

  setStatus('arrived', `${driver.name} has arrived at your destination.`);
  createRideRecord({
    pickup: state.pickup,
    drop: state.drop,
    driver,
    rideType: state.rideType,
    fare,
    etaMinutes,
    distanceKm,
  });

  renderRideHistory();
  state.matching = false;
  resetButton.disabled = false;
  bookButton.disabled = false;
}

function renderDriverMarker(location) {
  if (state.driverMarker) {
    state.map.removeLayer(state.driverMarker);
  }

  state.driverMarker = L.marker([location.lat, location.lon], {
    icon: L.divIcon({
      className: 'driver-pin',
      html: '<span></span>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    }),
  }).addTo(state.map).bindPopup('Driver');
}

function renderRoute(points) {
  state.routeLine.setLatLngs(points.map((point) => [point.lat, point.lon]));
}

async function animateDriverTo(target, intervalMs, maxSteps) {
  if (!state.driverMarker) {
    return;
  }

  if (state.animationTimer) {
    window.clearInterval(state.animationTimer);
    state.animationTimer = null;
  }

  await new Promise((resolve) => {
    let ticks = 0;
    state.animationTimer = window.setInterval(() => {
      if (!state.driverMarker) {
        window.clearInterval(state.animationTimer);
        state.animationTimer = null;
        resolve();
        return;
      }

      const current = state.driverMarker.getLatLng();
      const lat = current.lat + (target.lat - current.lat) * 0.24;
      const lon = current.lng + (target.lon - current.lng) * 0.24;
      state.driverMarker.setLatLng([lat, lon]);
      ticks += 1;

      const reached = Math.hypot(target.lat - lat, target.lon - lon) < 0.0007;
      if (reached || ticks >= maxSteps) {
        state.driverMarker.setLatLng([target.lat, target.lon]);
        window.clearInterval(state.animationTimer);
        state.animationTimer = null;
        resolve();
      }
    }, intervalMs);
  });
}

function chooseDriver(pickup) {
  return [...mockDrivers]
    .sort((left, right) => distanceTo(pickup, left) - distanceTo(pickup, right))[0];
}

function distanceTo(point, driver) {
  return Math.hypot(point.lat - driver.lat, point.lon - driver.lon);
}

function jitterPoint(lat, lon, spread) {
  return {
    lat: lat + (Math.random() - 0.5) * spread,
    lon: lon + (Math.random() - 0.5) * spread,
  };
}

function setStatus(label, message) {
  statusText.textContent = message;
  statusSteps.forEach((step) => {
    const stepName = step.dataset.statusStep;
    const order = ['searching', 'driver found', 'en route', 'arrived'];
    step.classList.toggle('status-step--active', stepName === label);
    step.classList.toggle('status-step--done', order.indexOf(stepName) < order.indexOf(label));
  });
}

function randomDistanceKm(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(1));
}

function renderRideHistory() {
  const rides = getRideHistory();
  historySummary.textContent = `${rides.length} recent rides saved locally`;
  historyList.innerHTML = rides.length
    ? rides
        .map(
          (ride) => `
            <li class="history-item">
              <div>
                <strong>${ride.pickup.label} to ${ride.drop.label}</strong>
                <p>${ride.driver.name} • ${ride.rideType}</p>
              </div>
              <span>${currency(ride.fare)}</span>
            </li>
          `,
        )
        .join('')
    : '<li class="history-item history-item--empty">No completed rides yet.</li>';
}

function resetRideForm() {
  state.pickup = null;
  state.drop = null;
  state.matching = false;
  state.estimatedDistanceKm = null;
  pickupInput.value = '';
  dropInput.value = '';
  activeRideCard.hidden = true;

  if (state.animationTimer) {
    window.clearInterval(state.animationTimer);
    state.animationTimer = null;
  }

  if (state.pickupMarker) {
    state.map.removeLayer(state.pickupMarker);
    state.pickupMarker = null;
  }

  if (state.dropMarker) {
    state.map.removeLayer(state.dropMarker);
    state.dropMarker = null;
  }

  if (state.driverMarker) {
    state.map.removeLayer(state.driverMarker);
    state.driverMarker = null;
  }

  state.routeLine.setLatLngs([]);
  state.map.setView(defaultCenter, 12, { animate: true });
  setStatus('searching', 'Enter pickup and destination to start matching.');
  updatePricingPreview();
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
