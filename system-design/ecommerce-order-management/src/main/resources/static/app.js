const state = {
  customerId: "",
  operatorName: "",
  orders: []
};

const loginPanel = document.getElementById("loginPanel");
const dashboard = document.getElementById("dashboard");
const operatorLabel = document.getElementById("operatorLabel");
const ordersTableBody = document.getElementById("ordersTableBody");
const orderDetail = document.getElementById("orderDetail");
const returnResult = document.getElementById("returnResult");
const toast = document.getElementById("toast");
const kpiTotal = document.getElementById("kpiTotal");
const kpiProgress = document.getElementById("kpiProgress");
const kpiDelivered = document.getElementById("kpiDelivered");

const loginForm = document.getElementById("loginForm");
const createOrderForm = document.getElementById("createOrderForm");
const returnForm = document.getElementById("returnForm");
const refreshOrders = document.getElementById("refreshOrders");
const logoutBtn = document.getElementById("logoutBtn");

const navButtons = document.querySelectorAll(".nav-btn");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  state.operatorName = document.getElementById("operatorName").value.trim();
  state.customerId = document.getElementById("customerId").value.trim();

  if (!state.operatorName || !state.customerId) return;

  operatorLabel.textContent = `${state.operatorName} · ${state.customerId}`;
  loginPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  showToast("Session started. Loading orders...", "ok");
  await loadOrders();
});

logoutBtn.addEventListener("click", () => {
  state.customerId = "";
  state.operatorName = "";
  state.orders = [];
  ordersTableBody.innerHTML = "";
  orderDetail.textContent = "";
  returnResult.textContent = "";
  hideToast();
  dashboard.classList.add("hidden");
  loginPanel.classList.remove("hidden");
});

refreshOrders.addEventListener("click", async () => {
  await loadOrders();
});

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.tab;
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.add("hidden"));
    document.getElementById(`tab-${target}`).classList.remove("hidden");
  });
});

createOrderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    customerId: state.customerId,
    currency: "USD",
    tax: Number(document.getElementById("tax").value).toFixed(2),
    shippingFee: Number(document.getElementById("shippingFee").value).toFixed(2),
    discount: Number(document.getElementById("discount").value).toFixed(2),
    idempotencyKey: `create-${Date.now()}`,
    items: [
      {
        sku: document.getElementById("sku").value.trim(),
        name: document.getElementById("productName").value.trim(),
        quantity: Number(document.getElementById("quantity").value),
        unitPrice: Number(document.getElementById("unitPrice").value).toFixed(2)
      }
    ]
  };

  try {
    const order = await callApi("/api/v1/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    showOrderDetail(order);
    showToast(`Order ${order.orderNo} created successfully.`, "ok");
    document.querySelector('[data-tab="orders"]').click();
    await loadOrders();
  } catch (error) {
    showToast(error.message, "err");
    orderDetail.textContent = error.message;
  }
});

returnForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    orderId: document.getElementById("returnOrderId").value.trim(),
    reason: document.getElementById("returnReason").value.trim(),
    refundAmount: Number(document.getElementById("refundAmount").value).toFixed(2),
    idempotencyKey: `return-${Date.now()}`
  };

  try {
    const created = await callApi("/api/v1/returns", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const refunded = await callApi(`/api/v1/returns/${created.returnId}/refund`, {
      method: "POST"
    });

    returnResult.textContent = JSON.stringify(refunded, null, 2);
    showToast(`Return ${refunded.returnId} refunded successfully.`, "ok");
    await loadOrders();
  } catch (error) {
    showToast(error.message, "err");
    returnResult.textContent = error.message;
  }
});

async function loadOrders() {
  if (!state.customerId) return;

  try {
    const orders = await callApi(`/api/v1/orders?customerId=${encodeURIComponent(state.customerId)}`);
    state.orders = orders;
    renderOrders();
  } catch (error) {
    showToast(error.message, "err");
    ordersTableBody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
}

function renderOrders() {
  updateKpis();

  if (state.orders.length === 0) {
    ordersTableBody.innerHTML = "<tr><td colspan=\"5\">No orders yet.</td></tr>";
    return;
  }

  ordersTableBody.innerHTML = state.orders.map((order) => {
    const canPay = order.status === "PAYMENT_PENDING";
    const canShip = order.status === "PAID" || order.status === "PACKING";
    const canDeliver = order.status === "SHIPPED";

    return `
      <tr>
        <td>${order.orderNo}</td>
        <td>${statusBadge(order.status)}</td>
        <td>${order.currency} ${order.total}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td>
          <div class="action-row">
            <button class="mini-btn" onclick="viewOrder('${order.orderId}')">View</button>
            <button class="mini-btn" onclick="markPaid('${order.orderId}')" ${canPay ? "" : "disabled"}>Mark Paid</button>
            <button class="mini-btn" onclick="shipOrder('${order.orderId}')" ${canShip ? "" : "disabled"}>Ship</button>
            <button class="mini-btn" onclick="deliverOrder('${order.orderId}')" ${canDeliver ? "" : "disabled"}>Deliver</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.viewOrder = async (orderId) => {
  try {
    const order = await callApi(`/api/v1/orders/${orderId}`);
    showOrderDetail(order);
    showToast(`Viewing ${order.orderNo}.`, "ok");
  } catch (error) {
    showToast(error.message, "err");
    orderDetail.textContent = error.message;
  }
};

window.markPaid = async (orderId) => {
  try {
    await callApi(`/api/v1/orders/${orderId}/payment`, {
      method: "POST",
      body: JSON.stringify({
        paymentStatus: "PAID",
        providerRef: "manual-dashboard",
        idempotencyKey: `pay-${orderId}-${Date.now()}`
      })
    });
    showToast("Payment updated successfully.", "ok");
    await loadOrders();
  } catch (error) {
    showToast(error.message, "err");
    orderDetail.textContent = error.message;
  }
};

window.shipOrder = async (orderId) => {
  try {
    await callApi(`/api/v1/orders/${orderId}/shipments`, {
      method: "POST",
      body: JSON.stringify({
        carrier: "FedEx",
        trackingNo: `TRK-${Math.floor(Math.random() * 1000000)}`
      })
    });
    showToast("Shipment created.", "ok");
    await loadOrders();
  } catch (error) {
    showToast(error.message, "err");
    orderDetail.textContent = error.message;
  }
};

window.deliverOrder = async (orderId) => {
  try {
    await callApi(`/api/v1/orders/${orderId}/deliver`, { method: "POST" });
    showToast("Order marked as delivered.", "ok");
    await loadOrders();
  } catch (error) {
    showToast(error.message, "err");
    orderDetail.textContent = error.message;
  }
};

function updateKpis() {
  if (!kpiTotal || !kpiProgress || !kpiDelivered) return;

  const inProgress = state.orders.filter((order) =>
    ["PAYMENT_PENDING", "PAID", "PACKING", "SHIPPED", "RETURN_REQUESTED"].includes(order.status)
  ).length;
  const delivered = state.orders.filter((order) => order.status === "DELIVERED").length;

  kpiTotal.textContent = String(state.orders.length);
  kpiProgress.textContent = String(inProgress);
  kpiDelivered.textContent = String(delivered);
}

function showToast(message, type) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden", "ok", "err");
  toast.classList.add(type === "err" ? "err" : "ok");
}

function hideToast() {
  if (!toast) return;
  toast.classList.add("hidden");
}

function showOrderDetail(order) {
  orderDetail.textContent = JSON.stringify(order, null, 2);
}

function statusBadge(status) {
  const style = ["CANCELED"].includes(status)
    ? "err"
    : ["PAYMENT_PENDING", "PACKING", "SHIPPED", "RETURN_REQUESTED"].includes(status)
      ? "warn"
      : "ok";

  return `<span class="badge ${style}">${status}</span>`;
}

async function callApi(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}
