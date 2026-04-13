// FS-04: Dashboard module — summary calculations, budget bars

function updateSummary() {
  const txs = getTransactions();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTxs = txs.filter(t => t.date.startsWith(currentMonth));

  const income = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  document.getElementById('totalIncome').textContent = `₹${income.toLocaleString()}`;
  document.getElementById('totalExpense').textContent = `₹${expense.toLocaleString()}`;
  document.getElementById('balance').textContent = `₹${balance.toLocaleString()}`;
}

function renderBudgets() {
  const txs = getTransactions();
  const budgets = getBudgets();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthExpenses = txs.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));

  const container = document.getElementById('budgetBars');
  const items = EXPENSE_CATEGORIES.map(cat => {
    const spent = monthExpenses.filter(t => t.category === cat.name).reduce((s, t) => s + t.amount, 0);
    const limit = budgets[cat.name] || 0;
    const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    const status = pct > 90 ? 'over' : pct > 70 ? 'warn' : 'safe';
    return `
      <div class="budget-item">
        <div class="cat-emoji">${cat.emoji}</div>
        <div class="info">
          <div class="label">${cat.name} <span>₹${spent.toLocaleString()} / ₹${limit.toLocaleString()}</span></div>
          <div class="budget-bar-bg"><div class="budget-bar-fill ${status}" style="width:${pct}%"></div></div>
        </div>
      </div>
    `;
  });
  container.innerHTML = items.join('');
}

function showBudgetModal() {
  const budgets = getBudgets();
  document.getElementById('budgetForm').innerHTML = EXPENSE_CATEGORIES.map(c => `
    <div class="form-group">
      <label>${c.emoji} ${c.name}</label>
      <input type="number" id="budget-${c.name}" value="${budgets[c.name] || 0}" min="0" placeholder="Monthly limit">
    </div>
  `).join('');
  document.getElementById('budgetModal').classList.add('active');
}

function closeBudgetModal() {
  document.getElementById('budgetModal').classList.remove('active');
}

function saveBudgets() {
  const budgets = {};
  EXPENSE_CATEGORIES.forEach(c => {
    budgets[c.name] = parseInt(document.getElementById(`budget-${c.name}`).value) || 0;
  });
  setBudgets(budgets);
  closeBudgetModal();
  renderBudgets();
  showToast('Budgets updated!');
}

function populateFilterCategories() {
  const select = document.getElementById('filterCategory');
  select.innerHTML = '<option value="all">All Categories</option>';
  ALL_CATEGORIES.forEach(c => {
    select.innerHTML += `<option value="${c.name}">${c.emoji} ${c.name}</option>`;
  });
}

function refreshAll() {
  updateSummary();
  renderBudgets();
  renderTransactions();
  renderCharts();
}

document.addEventListener('DOMContentLoaded', () => {
  initExpenseData();
  populateFilterCategories();
  const now = new Date();
  document.getElementById('filterMonth').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  refreshAll();
});
