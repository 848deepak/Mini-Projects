export const channels = ['inApp', 'push', 'email', 'sms', 'webhook'];

export const templates = [
  {
    id: 'order-shipped',
    name: 'Order shipped',
    subject: 'Your order {reference} is on the way',
    body: 'Hi {name}, your order {reference} has been shipped and will arrive soon.',
  },
  {
    id: 'payment-failed',
    name: 'Payment failed',
    subject: 'Payment failed for {reference}',
    body: 'Hi {name}, we could not process your payment for {reference}. Please retry.',
  },
  {
    id: 'security-alert',
    name: 'Security alert',
    subject: 'Security alert for your account',
    body: 'Hi {name}, we detected an unusual sign-in. Please review your account immediately.',
  },
  {
    id: 'campaign-offer',
    name: 'Campaign offer',
    subject: 'Limited time offer for {name}',
    body: 'Hi {name}, unlock our latest offer using code {reference}.',
  },
];

export const users = [
  {
    id: 'u-1',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 98765 43210',
    locale: 'en-IN',
    role: 'owner',
    quietHours: { start: '22:00', end: '07:00' },
    preferences: { inApp: true, push: true, email: true, sms: false, webhook: false },
  },
  {
    id: 'u-2',
    name: 'Meera Iyer',
    email: 'meera@example.com',
    phone: '+91 99887 77665',
    locale: 'en-IN',
    role: 'family',
    quietHours: { start: '23:00', end: '07:30' },
    preferences: { inApp: true, push: true, email: false, sms: true, webhook: false },
  },
  {
    id: 'u-3',
    name: 'Guest User',
    email: 'guest@example.com',
    phone: '+91 90000 11111',
    locale: 'en-IN',
    role: 'guest',
    quietHours: { start: '21:30', end: '08:00' },
    preferences: { inApp: true, push: false, email: false, sms: false, webhook: false },
  },
];
