// FS-04: Charts module — Chart.js donut + line chart

let donutChart = null;
let lineChart = null;

function renderCharts() {
  renderDonutChart();
  renderLineChart();
}

function renderDonutChart() {
  const txs = getTransactions();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthExpenses = txs.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));

  const byCategory = {};
  monthExpenses.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });

  const labels = Object.keys(byCategory);
  const data = Object.values(byCategory);
  const colors = labels.map(l => getCategoryInfo(l).color);

  const ctx = document.getElementById('donutChart').getContext('2d');
  if (donutChart) donutChart.destroy();
  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Inter', size: 11 }, padding: 12, usePointStyle: true, pointStyleWidth: 8 }
        }
      }
    }
  });
}

function renderLineChart() {
  const txs = getTransactions();
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    });
  }

  const expenseData = months.map(m =>
    txs.filter(t => t.type === 'expense' && t.date.startsWith(m.key)).reduce((s, t) => s + t.amount, 0)
  );
  const incomeData = months.map(m =>
    txs.filter(t => t.type === 'income' && t.date.startsWith(m.key)).reduce((s, t) => s + t.amount, 0)
  );

  const ctx = document.getElementById('lineChart').getContext('2d');
  if (lineChart) lineChart.destroy();
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months.map(m => m.label),
      datasets: [
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#ef4444'
        },
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22,163,106,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#16a34a'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f3f4f6' },
          ticks: { font: { family: 'Inter', size: 11 }, callback: v => `₹${(v/1000).toFixed(0)}k` }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 } }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Inter', size: 11 }, padding: 12, usePointStyle: true, pointStyleWidth: 8 }
        }
      }
    }
  });
}
