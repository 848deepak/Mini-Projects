import { pricing } from './data.js';

const HISTORY_KEY = 'ride_booking_history';

export function currency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function haversineDistanceKm(pointA, pointB) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const deltaLat = toRadians(pointB.lat - pointA.lat);
  const deltaLon = toRadians(pointB.lon - pointA.lon);
  const lat1 = toRadians(pointA.lat);
  const lat2 = toRadians(pointB.lat);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.sin(deltaLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function estimateFare(distanceKm, multiplier) {
  const rawFare = (pricing.baseFare + distanceKm * pricing.ratePerKm) * multiplier * pricing.surgeMultiplier;
  return Math.max(70, Math.round(rawFare));
}

export function estimateEtaMinutes(distanceKm, rideType) {
  const base = Math.max(6, Math.round(distanceKm * 3.5));
  return Math.max(4, base + rideType.etaBoost);
}

export function createRideRecord({ pickup, drop, driver, rideType, fare, etaMinutes, distanceKm }) {
  const record = {
    rideId: `RID-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    pickup,
    drop,
    driver,
    rideType: rideType.label,
    fare,
    etaMinutes,
    distanceKm,
    completedAt: new Date().toISOString(),
  };

  const history = getRideHistory();
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 5)));

  return record;
}

export function getRideHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}
