export const initialHome = {
  homeId: 'home-pandey-01',
  name: 'Pandey Residence',
  timezone: 'Asia/Kolkata',
  role: 'owner',
};

export const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Hallway', 'Porch'];

export const initialDevices = [
  { id: 'light-living', name: 'Living Room Light', type: 'light', room: 'Living Room', status: 'on', value: 80, online: true },
  { id: 'light-bedroom', name: 'Bedroom Light', type: 'light', room: 'Bedroom', status: 'off', value: 0, online: true },
  { id: 'thermostat-main', name: 'Main Thermostat', type: 'thermostat', room: 'Hallway', status: 'on', value: 22, online: true },
  { id: 'lock-front', name: 'Front Door Lock', type: 'lock', room: 'Porch', status: 'locked', value: null, online: true },
  { id: 'camera-porch', name: 'Porch Camera', type: 'camera', room: 'Porch', status: 'on', value: null, online: true },
  { id: 'motion-hall', name: 'Hall Motion Sensor', type: 'motion-sensor', room: 'Hallway', status: 'idle', value: null, online: true },
  { id: 'door-front', name: 'Front Door Sensor', type: 'door-sensor', room: 'Porch', status: 'closed', value: null, online: true },
  { id: 'smoke-kitchen', name: 'Kitchen Smoke Sensor', type: 'smoke-sensor', room: 'Kitchen', status: 'clear', value: null, online: true },
];

export const scenes = [
  {
    id: 'away',
    name: 'Away Mode',
    description: 'Secure the house, save energy, and keep watch.',
    actions: [
      { deviceType: 'light', command: 'off' },
      { deviceType: 'lock', command: 'lock' },
      { deviceType: 'thermostat', command: 'set', value: 18 },
      { deviceType: 'camera', command: 'on' },
    ],
  },
  {
    id: 'sleep',
    name: 'Sleep Mode',
    description: 'Dim the lights and lock everything for the night.',
    actions: [
      { deviceType: 'light', room: 'Living Room', command: 'off' },
      { deviceType: 'light', room: 'Hallway', command: 'off' },
      { deviceType: 'lock', command: 'lock' },
      { deviceType: 'thermostat', command: 'set', value: 20 },
      { deviceType: 'camera', command: 'on' },
    ],
  },
  {
    id: 'movie',
    name: 'Movie Mode',
    description: 'Set the living room up for a relaxed evening.',
    actions: [
      { deviceType: 'light', room: 'Living Room', command: 'set', value: 15 },
      { deviceType: 'light', room: 'Hallway', command: 'off' },
      { deviceType: 'thermostat', command: 'set', value: 22 },
    ],
  },
];

export const initialRules = [
  {
    id: 'rule-1',
    name: 'Turn on hallway light when motion is detected',
    triggerType: 'motion',
    scope: 'Hallway',
    actionType: 'light',
    actionScope: 'Hallway',
    actionValue: 'on',
    enabled: true,
    lastFiredKey: '',
  },
  {
    id: 'rule-2',
    name: 'Lock doors when front door opens after 9 PM',
    triggerType: 'door',
    scope: 'Porch',
    actionType: 'lock',
    actionScope: 'Porch',
    actionValue: 'locked',
    enabled: true,
    timeAfter: '21:00',
    lastFiredKey: '',
  },
];
