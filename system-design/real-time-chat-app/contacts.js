export const seedContacts = [
  {
    id: 'ava',
    name: 'Ava Johnson',
    isGroup: false,
    messages: [
      { id: 'ava-1', sender: 'them', text: 'Hey! Are we still meeting today?', timestamp: Date.now() - 1000 * 60 * 26 },
      { id: 'ava-2', sender: 'me', text: 'Yes, I will be there by 6 PM.', timestamp: Date.now() - 1000 * 60 * 24, receipt: 'read' },
    ],
  },
  {
    id: 'noah',
    name: 'Noah Patel',
    isGroup: false,
    messages: [
      { id: 'noah-1', sender: 'them', text: 'Can you send the design draft?', timestamp: Date.now() - 1000 * 60 * 90 },
    ],
  },
  {
    id: 'olivia',
    name: 'Olivia Chen',
    isGroup: false,
    messages: [
      { id: 'olivia-1', sender: 'them', text: 'Thanks for helping out yesterday.', timestamp: Date.now() - 1000 * 60 * 60 * 8 },
    ],
  },
  {
    id: 'liam',
    name: 'Liam Roy',
    isGroup: false,
    messages: [
      { id: 'liam-1', sender: 'me', text: 'Done. Pushed the changes to main.', timestamp: Date.now() - 1000 * 60 * 60 * 20, receipt: 'read' },
    ],
  },
  {
    id: 'mia',
    name: 'Mia Verma',
    isGroup: false,
    messages: [
      { id: 'mia-1', sender: 'them', text: 'Movie tonight?', timestamp: Date.now() - 1000 * 60 * 60 * 28 },
    ],
  },
  {
    id: 'group-dev',
    name: 'Frontend Squad',
    isGroup: true,
    messages: [
      { id: 'group-1', sender: 'them', text: 'Standup in 10 mins. Join the huddle!', timestamp: Date.now() - 1000 * 60 * 12 },
    ],
  },
];

export const autoReplies = {
  ava: ['Perfect, see you soon.', 'Great, ping me when you arrive.', 'Sounds good.'],
  noah: ['Sending in a minute.', 'On it. I will share it shortly.', 'Yes, I am finalizing it now.'],
  olivia: ['Anytime!', 'Happy to help.', 'That was a fun one.'],
  liam: ['Awesome, I will review it now.', 'Nice work.', 'Let us discuss in the next sync.'],
  mia: ['Absolutely, count me in.', 'Yes! Which show?', 'Done, book the tickets.'],
  'group-dev': [
    'Got it, joining now.',
    'I will share updates in the thread.',
    'Noted, see you all there.',
  ],
};
