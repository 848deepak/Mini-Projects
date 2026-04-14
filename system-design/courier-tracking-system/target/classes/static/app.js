const api = {
  async post(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  },

  async get(url) {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  }
};

const createForm = document.getElementById("createShipmentForm");
const eventForm = document.getElementById("eventForm");
const trackForm = document.getElementById("trackForm");

const createResult = document.getElementById("createResult");
const eventResult = document.getElementById("eventResult");
const trackingState = document.getElementById("trackingState");
const timeline = document.getElementById("timeline");

function idempotency() {
  return crypto.randomUUID();
}

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(createForm);
  const payload = Object.fromEntries(formData.entries());
  payload.idempotencyKey = idempotency();

  try {
    const data = await api.post("/api/v1/shipments", payload);
    createResult.textContent = `Created: ${data.trackingNo} (${data.initialState})`;
  } catch (err) {
    createResult.textContent = err.message;
  }
});

eventForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(eventForm);
  const payload = Object.fromEntries(formData.entries());
  payload.occurredAt = new Date().toISOString();
  payload.idempotencyKey = idempotency();

  try {
    const data = await api.post("/api/v1/tracking/events", payload);
    eventResult.textContent = `Accepted: ${data.eventId}`;
  } catch (err) {
    eventResult.textContent = err.message;
  }
});

trackForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(trackForm);
  const trackingNo = formData.get("trackingNo");

  try {
    const data = await api.get(`/api/v1/track/${trackingNo}`);
    trackingState.textContent = `State: ${data.currentState} | ETA: ${data.eta} | Last location: ${data.lastLocation}`;
    timeline.innerHTML = "";
    data.timeline.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.occurredAt} - ${item.eventType} @ ${item.location}`;
      timeline.appendChild(li);
    });
  } catch (err) {
    trackingState.textContent = err.message;
    timeline.innerHTML = "";
  }
});
