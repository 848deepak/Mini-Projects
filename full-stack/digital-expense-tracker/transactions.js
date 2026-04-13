// FS-04: Transactions module — add, filter, delete, export

let currentType = 'expense';

function setType(type) {
  currentType = type;
  document.querySelectorAll('.type-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.type === type);
  });
  populateCategoryDropdown();
}

function populateCategoryDropdown() {
  const select = document.getElementById('txCategory');
  const cats = currentType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  select.innerHTML = cats.map(c => `<option value="${c.name}">${c.emoji} ${c.name}</option>`).join('');
}

function toggleAddPanel() {
  const panel = document.getElementById('addPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
    populateCategoryDropdown();
  }
}

function addTransaction(e) {
  e.preventDefault();
  const txs = getTransactions();
  const tx = {
    id: Date.now(),
    type: currentType,
    amount: parseFloat(document.getElementById('txAmount').value),
    category: document.getElementById('txCategory').value,
    date: document.getElementById('txDate').value,
    note: document.getElementById('txNote').value.trim()
  };
  txs.unshift(tx);
  setTransactions(txs);
  document.getElementById('txForm').reset();
  toggleAddPanel();
  refreshAll();
  showToast('Transaction added!');
}

function deleteTransaction(id) {
  let txs = getTransactions();
  txs = txs.filter(t => t.id !== id);
  setTransactions(txs);
  refreshAll();
}

function renderTransactions() {
  const txs = getTransactions();
  const filterCat = document.getElementById('filterCategory').value;
  const filterMonth = document.getElementById('filterMonth').value;

  let filtered = txs;
  if (filterCat !== 'all') filtered = filtered.filter(t => t.category === filterCat);
  if (filterMonth) filtered = filtered.filter(t => t.date.startsWith(filterMonth));

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.getElementById('transactionList');
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">No transactions found</div>';
    return;
  }
  container.innerHTML = filtered.map(t => {
    const cat = getCategoryInfo(t.category);
    return `
      <div class="tx-item">
        <div class="tx-emoji">${cat.emoji}</div>
        <div class="tx-details">
          <div class="tx-cat">${t.category}</div>
          <div class="tx-note">${t.note || '—'}</div>
        </div>
        <div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString()}</div>
        <div class="tx-date">${formatDate(t.date)}</div>
        <button class="tx-delete" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>
      </div>
    `;
  }).join('');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function exportCSV() {
  const txs = getTransactions();
  const filterMonth = document.getElementById('filterMonth').value;
  let filtered = txs;
  if (filterMonth) filtered = filtered.filter(t => t.date.startsWith(filterMonth));

  const header = 'Date,Type,Category,Amount,Note\n';
  const rows = filtered.map(t => `${t.date},${t.type},${t.category},${t.amount},"${t.note || ''}"`).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported!');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
