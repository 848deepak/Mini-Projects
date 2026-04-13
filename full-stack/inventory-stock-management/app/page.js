"use client";
import { useState, useEffect, useCallback } from "react";

// ─── Seed Data ───
const CATEGORIES = ["Electronics", "Clothing", "Groceries", "Furniture", "Sports"];

const SEED_PRODUCTS = [
  { id: 1, sku: "ELC-001", name: "Wireless Mouse", category: "Electronics", price: 899, cost: 500, stock: 45, reorder_level: 10, supplier: "TechSupply Co" },
  { id: 2, sku: "ELC-002", name: "USB-C Hub", category: "Electronics", price: 1499, cost: 900, stock: 8, reorder_level: 15, supplier: "TechSupply Co" },
  { id: 3, sku: "ELC-003", name: 'Monitor 24"', category: "Electronics", price: 12999, cost: 9000, stock: 3, reorder_level: 5, supplier: "DisplayTech" },
  { id: 4, sku: "CLT-001", name: "Cotton T-Shirt", category: "Clothing", price: 499, cost: 200, stock: 120, reorder_level: 30, supplier: "FabricWorld" },
  { id: 5, sku: "CLT-002", name: "Denim Jeans", category: "Clothing", price: 1299, cost: 600, stock: 55, reorder_level: 20, supplier: "FabricWorld" },
  { id: 6, sku: "CLT-003", name: "Running Shoes", category: "Clothing", price: 2499, cost: 1400, stock: 0, reorder_level: 10, supplier: "ShoeMart" },
  { id: 7, sku: "GRC-001", name: "Basmati Rice 5kg", category: "Groceries", price: 399, cost: 280, stock: 200, reorder_level: 50, supplier: "FreshFarm" },
  { id: 8, sku: "GRC-002", name: "Olive Oil 1L", category: "Groceries", price: 699, cost: 450, stock: 35, reorder_level: 20, supplier: "FreshFarm" },
  { id: 9, sku: "FRN-001", name: "Office Chair", category: "Furniture", price: 8999, cost: 5500, stock: 12, reorder_level: 5, supplier: "HomeFurnish" },
  { id: 10, sku: "FRN-002", name: "Standing Desk", category: "Furniture", price: 15999, cost: 10000, stock: 4, reorder_level: 3, supplier: "HomeFurnish" },
  { id: 11, sku: "SPT-001", name: "Yoga Mat", category: "Sports", price: 799, cost: 350, stock: 60, reorder_level: 15, supplier: "FitGear" },
  { id: 12, sku: "SPT-002", name: "Resistance Bands Set", category: "Sports", price: 599, cost: 200, stock: 2, reorder_level: 10, supplier: "FitGear" },
  { id: 13, sku: "ELC-004", name: "Bluetooth Earbuds", category: "Electronics", price: 1999, cost: 1100, stock: 25, reorder_level: 10, supplier: "AudioTech" },
  { id: 14, sku: "GRC-003", name: "Green Tea Pack", category: "Groceries", price: 249, cost: 120, stock: 80, reorder_level: 25, supplier: "TeaHouse" },
  { id: 15, sku: "FRN-003", name: "Bookshelf", category: "Furniture", price: 4999, cost: 2800, stock: 7, reorder_level: 3, supplier: "HomeFurnish" },
];

const SEED_MOVEMENTS = [
  { id: 1, sku: "ELC-001", type: "in", qty: 20, date: "2026-04-01", note: "Restock" },
  { id: 2, sku: "CLT-001", type: "out", qty: 15, date: "2026-04-02", note: "Online orders" },
  { id: 3, sku: "GRC-001", type: "in", qty: 100, date: "2026-04-03", note: "Monthly restock" },
  { id: 4, sku: "ELC-002", type: "out", qty: 12, date: "2026-04-04", note: "Bulk order" },
  { id: 5, sku: "SPT-002", type: "out", qty: 8, date: "2026-04-05", note: "Retail" },
  { id: 6, sku: "CLT-003", type: "out", qty: 10, date: "2026-04-06", note: "Clearance" },
  { id: 7, sku: "FRN-001", type: "in", qty: 5, date: "2026-04-07", note: "New batch" },
  { id: 8, sku: "ELC-003", type: "out", qty: 7, date: "2026-04-08", note: "Corporate order" },
  { id: 9, sku: "GRC-002", type: "in", qty: 30, date: "2026-04-09", note: "Restock" },
  { id: 10, sku: "ELC-004", type: "out", qty: 5, date: "2026-04-10", note: "Walk-in" }
];

// ─── localStorage helpers ───
function getLS(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : fallback;
}
function setLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function initData() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("inv_init")) {
    setLS("inv_products", SEED_PRODUCTS);
    setLS("inv_movements", SEED_MOVEMENTS);
    localStorage.setItem("inv_init", "true");
  }
}

// ─── Main App ───
export default function InventoryApp() {
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [mvModalOpen, setMvModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => { initData(); reload(); }, []);

  function reload() { setProducts(getLS("inv_products", [])); setMovements(getLS("inv_movements", [])); }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  // ─── Product CRUD ───
  function saveProduct(data) {
    const all = getLS("inv_products", []);
    if (editProduct) {
      const idx = all.findIndex(p => p.id === editProduct.id);
      if (idx >= 0) all[idx] = { ...all[idx], ...data };
      showToast("Product updated!");
    } else {
      all.push({ id: Date.now(), ...data });
      showToast("Product added!");
    }
    setLS("inv_products", all);
    setEditProduct(null); setModalOpen(false); reload();
  }

  function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    const all = getLS("inv_products", []).filter(p => p.id !== id);
    setLS("inv_products", all);
    showToast("Product deleted."); reload();
  }

  function addMovement(mv) {
    const prods = getLS("inv_products", []);
    const p = prods.find(pp => pp.sku === mv.sku);
    if (!p) { showToast("SKU not found!"); return; }
    if (mv.type === "out" && p.stock < mv.qty) { showToast("Insufficient stock!"); return; }
    p.stock += mv.type === "in" ? mv.qty : -mv.qty;
    setLS("inv_products", prods);
    const mvs = getLS("inv_movements", []);
    mvs.unshift({ id: Date.now(), ...mv, date: new Date().toISOString().split("T")[0] });
    setLS("inv_movements", mvs);
    setMvModalOpen(false);
    showToast(`Stock ${mv.type === "in" ? "added" : "removed"}!`); reload();
  }

  // ─── Filtering ───
  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && p.category !== catFilter) return false;
    return true;
  });

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.reorder_level).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const NAV = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "products", icon: "📦", label: "Products" },
    { id: "movements", icon: "🔄", label: "Stock Movements" },
    { id: "alerts", icon: "🚨", label: "Low Stock Alerts" },
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">📦 Inventory<span>Pro</span></div>
        {NAV.map(n => (
          <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
            <span className="icon">{n.icon}</span> {n.label}
          </button>
        ))}
      </aside>

      <main className="main">
        {page === "dashboard" && <Dashboard products={products} movements={movements} totalStock={totalStock} totalValue={totalValue} lowStockCount={lowStockCount} outOfStockCount={outOfStockCount} />}
        {page === "products" && (
          <>
            <div className="page-header">
              <h1>Products</h1>
              <button className="btn btn-primary" onClick={() => { setEditProduct(null); setModalOpen(true); }}>+ Add Product</button>
            </div>
            <div className="card">
              <div className="search-bar">
                <input className="input" placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="input" value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{minWidth:150}}>
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <table>
                <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className={p.stock === 0 ? "out-of-stock" : p.stock <= p.reorder_level ? "low-stock" : ""}>
                      <td><code>{p.sku}</code></td>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.category}</td>
                      <td>₹{p.price.toLocaleString()}</td>
                      <td><strong>{p.stock}</strong></td>
                      <td>
                        {p.stock === 0 ? <span className="badge badge-danger">Out of Stock</span>
                          : p.stock <= p.reorder_level ? <span className="badge badge-warning">Low Stock</span>
                          : <span className="badge badge-success">In Stock</span>}
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => { setEditProduct(p); setModalOpen(true); }}>Edit</button>{" "}
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {page === "movements" && (
          <>
            <div className="page-header">
              <h1>Stock Movements</h1>
              <button className="btn btn-primary" onClick={() => setMvModalOpen(true)}>+ New Movement</button>
            </div>
            <div className="card">
              <table>
                <thead><tr><th>Date</th><th>SKU</th><th>Product</th><th>Type</th><th>Qty</th><th>Note</th></tr></thead>
                <tbody>
                  {movements.map(m => {
                    const p = products.find(pp => pp.sku === m.sku);
                    return (
                      <tr key={m.id}>
                        <td>{m.date}</td>
                        <td><code>{m.sku}</code></td>
                        <td>{p ? p.name : m.sku}</td>
                        <td><span className={`badge ${m.type === "in" ? "badge-success" : "badge-danger"}`}>{m.type === "in" ? "↓ Stock In" : "↑ Stock Out"}</span></td>
                        <td><strong>{m.qty}</strong></td>
                        <td>{m.note || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
        {page === "alerts" && (
          <>
            <div className="page-header"><h1>🚨 Low Stock Alerts</h1></div>
            <div className="card">
              {products.filter(p => p.stock <= p.reorder_level).length === 0
                ? <div className="empty-state">All products are well-stocked! ✅</div>
                : <table>
                    <thead><tr><th>SKU</th><th>Product</th><th>Current Stock</th><th>Reorder Level</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {products.filter(p => p.stock <= p.reorder_level).sort((a, b) => a.stock - b.stock).map(p => (
                        <tr key={p.id} className={p.stock === 0 ? "out-of-stock" : "low-stock"}>
                          <td><code>{p.sku}</code></td>
                          <td><strong>{p.name}</strong></td>
                          <td><strong>{p.stock}</strong></td>
                          <td>{p.reorder_level}</td>
                          <td>{p.stock === 0 ? <span className="badge badge-danger">OUT OF STOCK</span> : <span className="badge badge-warning">LOW</span>}</td>
                          <td><button className="btn btn-primary btn-sm" onClick={() => setMvModalOpen(true)}>Restock</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>}
            </div>
          </>
        )}
      </main>

      {/* Product Modal */}
      {modalOpen && <ProductModal product={editProduct} onSave={saveProduct} onClose={() => { setModalOpen(false); setEditProduct(null); }} />}
      {/* Movement Modal */}
      {mvModalOpen && <MovementModal products={products} onSave={addMovement} onClose={() => setMvModalOpen(false)} />}
      {/* Toast */}
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}

// ─── Dashboard with Charts ───
function Dashboard({ products, movements, totalStock, totalValue, lowStockCount, outOfStockCount }) {
  useEffect(() => {
    if (typeof Chart === "undefined") return;
    // Category distribution donut
    const catData = {};
    products.forEach(p => { catData[p.category] = (catData[p.category] || 0) + p.stock; });
    const ctx1 = document.getElementById("catChart");
    if (ctx1) {
      if (ctx1._chart) ctx1._chart.destroy();
      ctx1._chart = new Chart(ctx1, {
        type: "doughnut",
        data: { labels: Object.keys(catData), datasets: [{ data: Object.values(catData), backgroundColor: ["#0f766e","#7c3aed","#ea580c","#0284c7","#dc2626"], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } } }
      });
    }
    // Value by category bar chart
    const valData = {};
    products.forEach(p => { valData[p.category] = (valData[p.category] || 0) + p.stock * p.cost; });
    const ctx2 = document.getElementById("valChart");
    if (ctx2) {
      if (ctx2._chart) ctx2._chart.destroy();
      ctx2._chart = new Chart(ctx2, {
        type: "bar",
        data: { labels: Object.keys(valData), datasets: [{ label: "Inventory Value (₹)", data: Object.values(valData), backgroundColor: "#0f766e", borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: v => `₹${(v/1000).toFixed(0)}k` } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
      });
    }
  }, [products]);

  return (
    <>
      <div className="page-header"><h1>Dashboard</h1></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-icon teal">📦</div><div><div className="stat-value">{totalStock}</div><div className="stat-label">Total Units</div></div></div>
        <div className="stat-card"><div className="stat-icon green">💰</div><div><div className="stat-value">₹{(totalValue/1000).toFixed(0)}k</div><div className="stat-label">Inventory Value</div></div></div>
        <div className="stat-card"><div className="stat-icon amber">⚠️</div><div><div className="stat-value">{lowStockCount}</div><div className="stat-label">Low Stock</div></div></div>
        <div className="stat-card"><div className="stat-icon red">🚫</div><div><div className="stat-value">{outOfStockCount}</div><div className="stat-label">Out of Stock</div></div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card"><div className="card-header"><h2>Stock by Category</h2></div><div className="chart-wrap"><canvas id="catChart"></canvas></div></div>
        <div className="card"><div className="card-header"><h2>Inventory Value</h2></div><div className="chart-wrap"><canvas id="valChart"></canvas></div></div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><h2>Recent Movements</h2></div>
        <table>
          <thead><tr><th>Date</th><th>SKU</th><th>Type</th><th>Qty</th><th>Note</th></tr></thead>
          <tbody>
            {movements.slice(0, 5).map(m => (
              <tr key={m.id}>
                <td>{m.date}</td><td><code>{m.sku}</code></td>
                <td><span className={`badge ${m.type === "in" ? "badge-success" : "badge-danger"}`}>{m.type === "in" ? "↓ In" : "↑ Out"}</span></td>
                <td>{m.qty}</td><td>{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Product Modal ───
function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || { sku: "", name: "", category: CATEGORIES[0], price: "", cost: "", stock: "", reorder_level: "", supplier: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3>{product ? "Edit Product" : "Add Product"}</h3>
        <div className="form-row">
          <div className="form-group"><label>SKU</label><input className="input" value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="ELC-005" /></div>
          <div className="form-group"><label>Name</label><input className="input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Product name" /></div>
        </div>
        <div className="form-group"><label>Category</label>
          <select className="input" value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Price (₹)</label><input className="input" type="number" value={form.price} onChange={e => set("price", +e.target.value)} /></div>
          <div className="form-group"><label>Cost (₹)</label><input className="input" type="number" value={form.cost} onChange={e => set("cost", +e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Stock</label><input className="input" type="number" value={form.stock} onChange={e => set("stock", +e.target.value)} /></div>
          <div className="form-group"><label>Reorder Level</label><input className="input" type="number" value={form.reorder_level} onChange={e => set("reorder_level", +e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Supplier</label><input className="input" value={form.supplier} onChange={e => set("supplier", e.target.value)} /></div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { if (!form.sku || !form.name) return; onSave(form); }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Movement Modal ───
function MovementModal({ products, onSave, onClose }) {
  const [form, setForm] = useState({ sku: products[0]?.sku || "", type: "in", qty: "", note: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3>New Stock Movement</h3>
        <div className="form-group"><label>Product</label>
          <select className="input" value={form.sku} onChange={e => set("sku", e.target.value)}>
            {products.map(p => <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Type</label>
            <select className="input" value={form.type} onChange={e => set("type", e.target.value)}>
              <option value="in">Stock In (Restock)</option>
              <option value="out">Stock Out (Sale)</option>
            </select>
          </div>
          <div className="form-group"><label>Quantity</label><input className="input" type="number" min="1" value={form.qty} onChange={e => set("qty", +e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Note</label><input className="input" value={form.note} onChange={e => set("note", e.target.value)} placeholder="Reason" /></div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { if (!form.qty || form.qty <= 0) return; onSave(form); }}>Add Movement</button>
        </div>
      </div>
    </div>
  );
}
