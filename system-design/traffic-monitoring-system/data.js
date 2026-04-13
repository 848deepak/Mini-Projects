export const zones = [
  { id: 'central', name: 'Central Business District', baselineSpeed: 42, congestion: 0.28 },
  { id: 'north', name: 'North Corridor', baselineSpeed: 54, congestion: 0.18 },
  { id: 'west', name: 'West Junction', baselineSpeed: 36, congestion: 0.41 },
  { id: 'south', name: 'Airport Ring Road', baselineSpeed: 48, congestion: 0.22 },
];

export const sensorSources = [
  'Loop Detector',
  'Camera Feed',
  'Radar Unit',
  'GPS Probe',
];

export const seedEvents = [
  { id: 'e1', zoneId: 'central', source: 'Camera Feed', speed: 22, occupancy: 0.84, severity: 'high', message: 'Congestion building near Central Avenue.', createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), acknowledged: false },
  { id: 'e2', zoneId: 'west', source: 'GPS Probe', speed: 18, occupancy: 0.91, severity: 'critical', message: 'Possible lane blockage detected on West Junction.', createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(), acknowledged: true },
  { id: 'e3', zoneId: 'south', source: 'Radar Unit', speed: 39, occupancy: 0.62, severity: 'medium', message: 'Traffic slowing near airport access road.', createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(), acknowledged: false },
];
