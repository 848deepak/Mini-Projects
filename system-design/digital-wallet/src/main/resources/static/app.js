const API_BASE = "/v1";
const STORAGE_KEY = "digital-wallet:last-wallet-id";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const loginForm = document.getElementById("login-form");
const loginWalletInput = document.getElementById("login-wallet-id");
const loginNoteInput = document.getElementById("login-note");
const walletShell = document.getElementById("wallet-shell");
const activeWalletTitle = document.getElementById("active-wallet-title");
const overviewWalletId = document.getElementById("overview-wallet-id");
const closeWalletButton = document.getElementById("close-wallet");
const quickFillButton = document.getElementById("quick-fill");

const createWalletForm = document.getElementById("create-wallet-form");
const balanceForm = document.getElementById("balance-form");
const transferForm = document.getElementById("transfer-form");

const balanceResult = document.getElementById("balance-result");
const createWalletResult = document.getElementById("create-wallet-result");
const transferResult = document.getElementById("transfer-result");

const availableAmount = document.getElementById("available-amount");
const pendingAmount = document.getElementById("pending-amount");
const balanceCurrency = document.getElementById("balance-currency");
const balanceAsOf = document.getElementById("balance-asof");

const apiDot = document.getElementById("api-dot");
const apiStatus = document.getElementById("api-status");
const activityLog = document.getElementById("activity-log");
const toast = document.getElementById("toast");

const idempotencyInput = document.getElementById("idempotency-key");
const regenKeyBtn = document.getElementById("regen-key");
const railButtons = Array.from(document.querySelectorAll(".rail-button"));
const panels = Array.from(document.querySelectorAll(".panel-card"));

let activeWalletId = window.localStorage.getItem(STORAGE_KEY) || "";

function toJsonBlock(data) {
    return JSON.stringify(data, null, 2);
}

function makeIdempotencyKey() {
    return crypto.randomUUID();
}

function setLoading(button, loading, label) {
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? "Please wait..." : label;
}

function showToast(message, isError = false) {
    toast.textContent = message;
    toast.style.borderLeft = isError ? "4px solid #fb7185" : "4px solid #2dd4bf";
    toast.classList.add("show");
    window.clearTimeout(showToast._timeout);
    showToast._timeout = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

function logActivity(text) {
    const item = document.createElement("li");
    item.textContent = `${new Date().toISOString()}  ${text}`;
    activityLog.prepend(item);
    if (activityLog.children.length > 8) {
        activityLog.removeChild(activityLog.lastChild);
    }
}

function normalizeError(errorBody, fallbackMessage) {
    if (!errorBody) return fallbackMessage;
    if (typeof errorBody === "string") return errorBody;
    const details = errorBody.details ? ` | details: ${toJsonBlock(errorBody.details)}` : "";
    return `${errorBody.message || fallbackMessage}${details}`;
}

function isValidUuid(value) {
    return uuidPattern.test(value.trim());
}

function setActivePanel(panelId) {
    railButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.panelTarget === panelId);
    });
    panels.forEach((panel) => {
        panel.classList.toggle("active-panel", panel.id === panelId);
    });
}

function syncWalletFields(walletId) {
    document.getElementById("wallet-id-balance").value = walletId;
    document.getElementById("from-wallet-id").value = walletId;
}

function openShell(walletId, note = "") {
    activeWalletId = walletId;
    window.localStorage.setItem(STORAGE_KEY, walletId);
    walletShell.classList.remove("hidden");
    activeWalletTitle.textContent = `Wallet ${walletId.slice(0, 8)}…`;
    overviewWalletId.textContent = walletId;
    syncWalletFields(walletId);
    logActivity(note ? `Session opened: ${note}` : `Session opened for ${walletId}`);
}

function closeShell() {
    walletShell.classList.add("hidden");
    activeWalletTitle.textContent = "Wallet session not opened";
    overviewWalletId.textContent = "-";
    availableAmount.textContent = "-";
    pendingAmount.textContent = "-";
    balanceCurrency.textContent = "-";
    balanceAsOf.textContent = "-";
    balanceResult.textContent = "No wallet activity yet.";
    activeWalletId = "";
    showToast("Session locked");
    logActivity("Session locked");
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        throw new Error(normalizeError(payload, `Request failed with status ${response.status}`));
    }

    return payload;
}

async function loadBalance(walletId) {
    const result = await apiRequest(`${API_BASE}/wallets/${walletId}/balance`);
    availableAmount.textContent = result.available;
    pendingAmount.textContent = result.pending;
    balanceCurrency.textContent = result.currency;
    balanceAsOf.textContent = new Date(result.asOf).toLocaleString();
    balanceResult.textContent = toJsonBlock(result);
    showToast("Balance loaded");
    logActivity(`Balance refreshed for ${walletId}`);
    return result;
}

async function checkApiHealth() {
    try {
        await fetch("/actuator/health", { method: "GET" });
        apiDot.classList.add("ok");
        apiDot.classList.remove("err");
        apiStatus.textContent = "API reachable";
    } catch (_error) {
        apiDot.classList.add("err");
        apiDot.classList.remove("ok");
        apiStatus.textContent = "API unreachable";
    }
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = loginForm.querySelector("button[type='submit']");
    const walletId = loginWalletInput.value.trim();
    const note = loginNoteInput.value.trim();

    if (!isValidUuid(walletId)) {
        showToast("Wallet ID must be a valid UUID", true);
        return;
    }

    setLoading(submitButton, true, "Open Wallet");
    try {
        openShell(walletId, note);
        await loadBalance(walletId);
        setActivePanel("balance-panel");
    } catch (error) {
        balanceResult.textContent = error.message;
        showToast(error.message, true);
        logActivity("Wallet session failed to open");
    } finally {
        setLoading(submitButton, false, "Open Wallet");
    }
});

closeWalletButton.addEventListener("click", closeShell);

quickFillButton.addEventListener("click", () => {
    const storedWalletId = activeWalletId || window.localStorage.getItem(STORAGE_KEY);
    if (!storedWalletId) {
        showToast("No wallet saved yet", true);
        return;
    }

    loginWalletInput.value = storedWalletId;
    loginNoteInput.value = activeWalletId ? "Re-open current wallet" : "Re-opened from local storage";
    syncWalletFields(storedWalletId);
    showToast("Wallet ID restored");
});

railButtons.forEach((button) => {
    button.addEventListener("click", () => setActivePanel(button.dataset.panelTarget));
});

balanceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = balanceForm.querySelector("button[type='submit']");
    const walletId = balanceForm.walletId.value.trim();

    if (!isValidUuid(walletId)) {
        showToast("Wallet ID must be a valid UUID", true);
        return;
    }

    setLoading(submitButton, true, "Refresh balance");
    try {
        activeWalletId = walletId;
        window.localStorage.setItem(STORAGE_KEY, walletId);
        await loadBalance(walletId);
    } catch (error) {
        balanceResult.textContent = error.message;
        showToast(error.message, true);
        logActivity("Balance lookup failed");
    } finally {
        setLoading(submitButton, false, "Refresh balance");
    }
});

createWalletForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = createWalletForm.querySelector("button[type='submit']");

    const userId = createWalletForm.userId.value.trim();
    const currency = createWalletForm.currency.value.trim().toUpperCase();

    if (!isValidUuid(userId)) {
        showToast("User ID must be a valid UUID", true);
        return;
    }

    setLoading(submitButton, true, "Create wallet");
    try {
        const result = await apiRequest(`${API_BASE}/wallets`, {
            method: "POST",
            body: JSON.stringify({ userId, currency })
        });

        createWalletResult.textContent = toJsonBlock(result);
        createWalletForm.reset();
        createWalletForm.currency.value = currency;
        if (result.walletId) {
            loginWalletInput.value = result.walletId;
            syncWalletFields(result.walletId);
            window.localStorage.setItem(STORAGE_KEY, result.walletId);
        }

        showToast("Wallet created successfully");
        logActivity(`Wallet created: ${result.walletId}`);
    } catch (error) {
        createWalletResult.textContent = error.message;
        showToast(error.message, true);
        logActivity("Wallet creation failed");
    } finally {
        setLoading(submitButton, false, "Create wallet");
    }
});

transferForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = transferForm.querySelector("button[type='submit']");

    const payload = {
        fromWalletId: transferForm.fromWalletId.value.trim(),
        toWalletId: transferForm.toWalletId.value.trim(),
        amount: transferForm.amount.value.trim(),
        currency: transferForm.currency.value.trim().toUpperCase(),
        note: transferForm.note.value.trim(),
        idempotencyKey: transferForm.idempotencyKey.value.trim()
    };

    if (!isValidUuid(payload.fromWalletId) || !isValidUuid(payload.toWalletId)) {
        showToast("Both wallet IDs must be valid UUID values", true);
        return;
    }
    if (!payload.idempotencyKey) {
        showToast("Idempotency key is required", true);
        return;
    }

    setLoading(submitButton, true, "Send transfer");
    try {
        const result = await apiRequest(`${API_BASE}/transfers/p2p`, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        transferResult.textContent = toJsonBlock(result);
        transferForm.note.value = "";
        transferForm.idempotencyKey.value = makeIdempotencyKey();
        activeWalletId = payload.fromWalletId;
        window.localStorage.setItem(STORAGE_KEY, payload.fromWalletId);
        syncWalletFields(payload.fromWalletId);
        activeWalletTitle.textContent = `Wallet ${payload.fromWalletId.slice(0, 8)}…`;
        overviewWalletId.textContent = payload.fromWalletId;

        showToast("Transfer request accepted");
        logActivity(`Transfer ${result.txnId} status: ${result.status}`);
    } catch (error) {
        transferResult.textContent = error.message;
        showToast(error.message, true);
        logActivity("Transfer failed");
    } finally {
        setLoading(submitButton, false, "Send transfer");
    }
});

regenKeyBtn.addEventListener("click", () => {
    idempotencyInput.value = makeIdempotencyKey();
});

idempotencyInput.value = makeIdempotencyKey();
checkApiHealth();
window.setInterval(checkApiHealth, 20000);

if (activeWalletId) {
    loginWalletInput.value = activeWalletId;
    syncWalletFields(activeWalletId);
}