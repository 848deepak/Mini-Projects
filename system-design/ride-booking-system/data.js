export const cityLocations = [
  { id: 'connaught-place', label: 'Connaught Place', city: 'Delhi', lat: 28.6315, lon: 77.2167 },
  { id: 'hauz-khas', label: 'Hauz Khas', city: 'Delhi', lat: 28.5494, lon: 77.2066 },
  { id: 'cyber-hub', label: 'Cyber Hub', city: 'Gurugram', lat: 28.4948, lon: 77.089 },
  { id: 'dwarka-sector-21', label: 'Dwarka Sector 21', city: 'Delhi', lat: 28.5558, lon: 77.0429 },
  { id: 'noida-sector-18', label: 'Noida Sector 18', city: 'Noida', lat: 28.5708, lon: 77.326 },
  { id: 'gurgaon-sector-29', label: 'Gurgaon Sector 29', city: 'Gurugram', lat: 28.4669, lon: 77.0703 },
  { id: 'saket', label: 'Saket', city: 'Delhi', lat: 28.5245, lon: 77.2066 },
  { id: 'lajpat-nagar', label: 'Lajpat Nagar', city: 'Delhi', lat: 28.5677, lon: 77.2433 },
  { id: 'rohini', label: 'Rohini', city: 'Delhi', lat: 28.7400, lon: 77.115 },
  { id: 'indirapuram', label: 'Indirapuram', city: 'Ghaziabad', lat: 28.6389, lon: 77.3579 },
];

export const rideTypes = [
  { id: 'economy', label: 'Economy', multiplier: 1, etaBoost: 0, accent: 'Budget-friendly' },
  { id: 'premium', label: 'Premium', multiplier: 1.45, etaBoost: -2, accent: 'Comfort first' },
  { id: 'xl', label: 'XL', multiplier: 1.75, etaBoost: 1, accent: 'More space' },
];

export const mockDrivers = [
  { id: 'drv-1', name: 'Aman', vehicle: 'Sedan', rating: 4.9, lat: 28.6302, lon: 77.2251 },
  { id: 'drv-2', name: 'Nisha', vehicle: 'SUV', rating: 4.8, lat: 28.5482, lon: 77.1942 },
  { id: 'drv-3', name: 'Kabir', vehicle: 'Hatchback', rating: 4.7, lat: 28.494, lon: 77.1012 },
  { id: 'drv-4', name: 'Priya', vehicle: 'Sedan', rating: 4.95, lat: 28.5663, lon: 77.3397 },
  { id: 'drv-5', name: 'Farhan', vehicle: 'SUV', rating: 4.85, lat: 28.5179, lon: 77.2061 },
  { id: 'drv-6', name: 'Meera', vehicle: 'Sedan', rating: 4.78, lat: 28.735, lon: 77.121 },
];

export const pricing = {
  baseFare: 45,
  ratePerKm: 14,
  surgeMultiplier: 1,
};
