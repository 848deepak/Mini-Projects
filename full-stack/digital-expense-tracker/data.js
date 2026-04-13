// FS-04: Digital Expense Tracker — Seed Data

const EXPENSE_CATEGORIES = [
  { name: 'Food', emoji: '🍔', color: '#ef4444' },
  { name: 'Transport', emoji: '🚗', color: '#f97316' },
  { name: 'Shopping', emoji: '🛍️', color: '#a855f7' },
  { name: 'Bills', emoji: '🧾', color: '#3b82f6' },
  { name: 'Health', emoji: '💊', color: '#10b981' },
  { name: 'Entertainment', emoji: '🎬', color: '#ec4899' }
];

const INCOME_CATEGORIES = [
  { name: 'Salary', emoji: '💼', color: '#16a34a' },
  { name: 'Freelance', emoji: '💻', color: '#0ea5e9' }
];

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

function getCategoryInfo(name) {
  return ALL_CATEGORIES.find(c => c.name === name) || { name, emoji: '📌', color: '#6b7280' };
}

const SEED_TRANSACTIONS = [
  { id: 1, type: 'income', amount: 50000, category: 'Salary', date: '2026-04-01', note: 'April salary' },
  { id: 2, type: 'expense', amount: 1200, category: 'Food', date: '2026-04-02', note: 'Groceries' },
  { id: 3, type: 'expense', amount: 500, category: 'Transport', date: '2026-04-03', note: 'Uber rides' },
  { id: 4, type: 'expense', amount: 2500, category: 'Shopping', date: '2026-04-04', note: 'New shoes' },
  { id: 5, type: 'expense', amount: 800, category: 'Food', date: '2026-04-05', note: 'Restaurant dinner' },
  { id: 6, type: 'expense', amount: 3000, category: 'Bills', date: '2026-04-06', note: 'Electricity bill' },
  { id: 7, type: 'expense', amount: 600, category: 'Entertainment', date: '2026-04-07', note: 'Movie tickets' },
  { id: 8, type: 'income', amount: 15000, category: 'Freelance', date: '2026-04-08', note: 'Client project' },
  { id: 9, type: 'expense', amount: 1500, category: 'Health', date: '2026-04-09', note: 'Doctor visit' },
  { id: 10, type: 'expense', amount: 400, category: 'Transport', date: '2026-04-10', note: 'Metro pass' },
  { id: 11, type: 'expense', amount: 1800, category: 'Food', date: '2026-04-11', note: 'Weekly groceries' },
  { id: 12, type: 'expense', amount: 3500, category: 'Shopping', date: '2026-04-12', note: 'Tech accessories' },
  // Past months for trend chart
  { id: 101, type: 'income', amount: 50000, category: 'Salary', date: '2026-03-01', note: 'March salary' },
  { id: 102, type: 'expense', amount: 12000, category: 'Food', date: '2026-03-15', note: 'March food' },
  { id: 103, type: 'expense', amount: 5000, category: 'Shopping', date: '2026-03-20', note: 'Clothes' },
  { id: 104, type: 'expense', amount: 3000, category: 'Bills', date: '2026-03-10', note: 'Internet' },
  { id: 105, type: 'income', amount: 48000, category: 'Salary', date: '2026-02-01', note: 'Feb salary' },
  { id: 106, type: 'expense', amount: 10000, category: 'Food', date: '2026-02-14', note: 'Feb food' },
  { id: 107, type: 'expense', amount: 8000, category: 'Health', date: '2026-02-20', note: 'Health checkup' },
  { id: 108, type: 'income', amount: 48000, category: 'Salary', date: '2026-01-01', note: 'Jan salary' },
  { id: 109, type: 'expense', amount: 15000, category: 'Shopping', date: '2026-01-10', note: 'Jan sale' },
  { id: 110, type: 'expense', amount: 9000, category: 'Bills', date: '2026-01-15', note: 'Quarterly bills' },
  { id: 111, type: 'income', amount: 45000, category: 'Salary', date: '2025-12-01', note: 'Dec salary' },
  { id: 112, type: 'expense', amount: 20000, category: 'Shopping', date: '2025-12-25', note: 'Christmas gifts' },
  { id: 113, type: 'income', amount: 45000, category: 'Salary', date: '2025-11-01', note: 'Nov salary' },
  { id: 114, type: 'expense', amount: 11000, category: 'Food', date: '2025-11-15', note: 'Nov food' }
];

const DEFAULT_BUDGETS = {
  'Food': 8000,
  'Transport': 3000,
  'Shopping': 10000,
  'Bills': 5000,
  'Health': 5000,
  'Entertainment': 3000
};

function initExpenseData() {
  if (!localStorage.getItem('et_initialized')) {
    localStorage.setItem('et_transactions', JSON.stringify(SEED_TRANSACTIONS));
    localStorage.setItem('et_budgets', JSON.stringify(DEFAULT_BUDGETS));
    localStorage.setItem('et_initialized', 'true');
  }
}

function getTransactions() {
  return JSON.parse(localStorage.getItem('et_transactions') || '[]');
}

function setTransactions(data) {
  localStorage.setItem('et_transactions', JSON.stringify(data));
}

function getBudgets() {
  return JSON.parse(localStorage.getItem('et_budgets') || '{}');
}

function setBudgets(data) {
  localStorage.setItem('et_budgets', JSON.stringify(data));
}
