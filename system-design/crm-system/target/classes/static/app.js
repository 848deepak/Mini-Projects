const api = {
  async post(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  },
  async get(url) {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  }
};

const leadForm = document.getElementById("leadForm");
const qualifyForm = document.getElementById("qualifyForm");
const forecastForm = document.getElementById("forecastForm");

const leadResult = document.getElementById("leadResult");
const qualifyResult = document.getElementById("qualifyResult");
const forecastResult = document.getElementById("forecastResult");

function key() {
  return crypto.randomUUID();
}

leadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(leadForm).entries());
  payload.idempotencyKey = key();
  try {
    const data = await api.post("/api/v1/leads", payload);
    leadResult.textContent = `Lead: ${data.leadId} | status=${data.status} | score=${data.score}`;
    qualifyForm.elements.leadId.value = data.leadId;
  } catch (err) {
    leadResult.textContent = err.message;
  }
});

qualifyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(qualifyForm);
  const leadId = fd.get("leadId");
  const payload = {
    decision: fd.get("decision"),
    qualificationNotes: fd.get("qualificationNotes")
  };
  try {
    const data = await api.post(`/api/v1/leads/${leadId}/qualify`, payload);
    qualifyResult.textContent = `Lead ${data.id} updated to ${data.status}`;
  } catch (err) {
    qualifyResult.textContent = err.message;
  }
});

forecastForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const quarter = new FormData(forecastForm).get("quarter");
  try {
    const data = await api.get(`/api/v1/reports/forecast?quarter=${encodeURIComponent(quarter)}`);
    forecastResult.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    forecastResult.textContent = err.message;
  }
});
