import { channels, templates, users } from './data.js';

const STORAGE_KEY = 'smart_notification_state';

const state = loadState();

const form = document.querySelector('[data-compose-form]');
const userSelect = document.querySelector('[data-user-select]');
const templateSelect = document.querySelector('[data-template-select]');
const prioritySelect = document.querySelector('[data-priority-select]');
const referenceInput = document.querySelector('[data-reference-input]');
const idempotencyInput = document.querySelector('[data-idempotency-input]');
const channelChecks = [...document.querySelectorAll('[data-channel-check]')];
const previewSubject = document.querySelector('[data-preview-subject]');
const previewBody = document.querySelector('[data-preview-body]');
const statsNodes = document.querySelectorAll('[data-stat]');
const notificationsList = document.querySelector('[data-notifications-list]');
const attemptsList = document.querySelector('[data-attempts-list]');
const preferencesList = document.querySelector('[data-preferences-list]');
const analyticsPanel = document.querySelector('[data-analytics-panel]');
const toast = document.querySelector('[data-toast]');

initialize();

function initialize() {
  renderSelectors();
  bindEvents();
  renderAll();
}

function renderSelectors() {
  userSelect.innerHTML = state.users.map((user) => `<option value="${user.id}">${user.name}</option>`).join('');
  templateSelect.innerHTML = templates.map((template) => `<option value="${template.id}">${template.name}</option>`).join('');
  userSelect.value = state.selectedUserId;
  templateSelect.value = state.selectedTemplateId;
  prioritySelect.value = state.priority;
  idempotencyInput.value = state.idempotencyKey;
}

function bindEvents() {
  [userSelect, templateSelect, prioritySelect, referenceInput].forEach((field) => {
    field.addEventListener('input', updatePreview);
    field.addEventListener('change', updatePreview);
  });

  channelChecks.forEach((checkbox) => {
    checkbox.addEventListener('change', updatePreview);
  });

  document.querySelector('[data-refresh-idempotency]')?.addEventListener('click', () => {
    state.idempotencyKey = makeKey('notif');
    idempotencyInput.value = state.idempotencyKey;
    persist();
    updatePreview();
    showToast('Generated a new idempotency key.');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendNotification();
  });

  preferencesList.addEventListener('click', (event) => {
    const saveButton = event.target.closest('[data-save-preferences]');
    if (saveButton) {
      savePreferences(saveButton.dataset.userId);
      return;
    }

    const toggleButton = event.target.closest('[data-toggle-channel]');
    if (toggleButton) {
      const user = state.users.find((entry) => entry.id === toggleButton.dataset.userId);
      if (!user) {
        return;
      }

      const channel = toggleButton.dataset.toggleChannel;
      user.preferences[channel] = !user.preferences[channel];
      persist();
      renderPreferences();
      showToast(`${user.name}: ${channel} ${user.preferences[channel] ? 'enabled' : 'disabled'}`);
    }
  });
}

function updatePreview() {
  state.selectedUserId = userSelect.value;
  state.selectedTemplateId = templateSelect.value;
  state.priority = prioritySelect.value;
  state.idempotencyKey = idempotencyInput.value.trim() || state.idempotencyKey;

  const selectedUser = getSelectedUser();
  const template = templates.find((entry) => entry.id === state.selectedTemplateId) ?? templates[0];
  const reference = referenceInput.value.trim() || 'REF-2026';

  const subject = renderTemplate(template.subject, selectedUser, reference);
  const body = renderTemplate(template.body, selectedUser, reference);

  previewSubject.textContent = subject;
  previewBody.textContent = body;

  persist();
}

function sendNotification() {
  const selectedUser = getSelectedUser();
  const template = templates.find((entry) => entry.id === state.selectedTemplateId) ?? templates[0];
  const reference = referenceInput.value.trim() || makeReference();
  const requestedChannels = channelChecks.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
  const allowedChannels = routeChannels(selectedUser, requestedChannels, state.priority);
  const dedupeKey = idempotencyInput.value.trim();

  if (!dedupeKey) {
    showToast('Idempotency key is required.');
    return;
  }

  const dedupeHit = state.notifications.find((notification) => notification.idempotencyKey === dedupeKey);
  if (dedupeHit) {
    showToast(`Duplicate request ignored: ${dedupeHit.notificationId}`);
    return;
  }

  const notification = {
    notificationId: `NTF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    userId: selectedUser.id,
    userName: selectedUser.name,
    templateId: template.id,
    title: renderTemplate(template.subject, selectedUser, reference),
    body: renderTemplate(template.body, selectedUser, reference),
    reference,
    priority: state.priority,
    requestedChannels,
    allowedChannels,
    status: 'queued',
    idempotencyKey: dedupeKey,
    createdAt: new Date().toISOString(),
    attempts: [],
    deliveredChannel: null,
  };

  state.notifications.unshift(notification);
  state.analytics.queued += 1;
  persist();
  renderAll();
  dispatchNotification(notification.notificationId);
  state.idempotencyKey = makeKey('notif');
  idempotencyInput.value = state.idempotencyKey;
}

async function dispatchNotification(notificationId) {
  const notification = state.notifications.find((entry) => entry.notificationId === notificationId);
  if (!notification) {
    return;
  }

  notification.status = 'routing';
  persist();
  renderAll();

  const channelsToTry = notification.allowedChannels.length ? notification.allowedChannels : ['inApp'];
  let delivered = false;

  for (const channel of channelsToTry) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const attemptRecord = {
        id: crypto.randomUUID(),
        notificationId: notification.notificationId,
        channel,
        attempt,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      state.attempts.unshift(attemptRecord);
      persist();
      renderAll();

      await sleep(attempt * 220);

      const success = deliverThroughChannel(channel, notification.priority, attempt);
      attemptRecord.status = success ? 'success' : 'failed';
      attemptRecord.completedAt = new Date().toISOString();

      if (success) {
        delivered = true;
        notification.status = 'delivered';
        notification.deliveredChannel = channel;
        notification.deliveredAt = new Date().toISOString();
        state.analytics.delivered += 1;
        break;
      }

      state.analytics.retried += 1;
      persist();
      renderAll();
    }

    if (delivered) {
      break;
    }
  }

  if (!delivered) {
    notification.status = 'failed';
    state.analytics.failed += 1;
    state.analytics.bounced += 1;
  }

  persist();
  renderAll();
  showToast(delivered ? `Delivered via ${notification.deliveredChannel}.` : 'All channels failed. Notification moved to DLQ.');
}

function deliverThroughChannel(channel, priority, attempt) {
  const baseChance = {
    inApp: 0.99,
    push: 0.88,
    email: 0.9,
    sms: 0.84,
    webhook: 0.92,
  }[channel] ?? 0.85;

  const priorityBoost = priority === 'urgent' ? 0.08 : priority === 'high' ? 0.04 : 0;
  const retryBoost = Math.min(0.12, (attempt - 1) * 0.05);
  return Math.random() < Math.min(0.995, baseChance + priorityBoost + retryBoost);
}

function routeChannels(user, requestedChannels, priority) {
  const withinQuietHours = isQuietHours(user.quietHours);
  const preferenceChannels = channels.filter((channel) => user.preferences[channel]);
  const approved = requestedChannels.filter((channel) => preferenceChannels.includes(channel));

  if (withinQuietHours && priority !== 'urgent') {
    return approved.filter((channel) => channel === 'inApp' || channel === 'webhook');
  }

  return approved;
}

function savePreferences(userId) {
  const user = state.users.find((entry) => entry.id === userId);
  if (!user) {
    return;
  }

  const card = preferencesList.querySelector(`[data-user-card="${userId}"]`);
  if (!card) {
    return;
  }

  channels.forEach((channel) => {
    const checkbox = card.querySelector(`[data-pref-channel="${channel}"]`);
    if (checkbox) {
      user.preferences[channel] = checkbox.checked;
    }
  });

  const startInput = card.querySelector('[data-pref-quiet-start]');
  const endInput = card.querySelector('[data-pref-quiet-end]');
  if (startInput && endInput) {
    user.quietHours = { start: startInput.value, end: endInput.value };
  }

  persist();
  renderPreferences();
  showToast(`Saved preferences for ${user.name}.`);
}

function renderAll() {
  renderAnalytics();
  renderNotifications();
  renderAttempts();
  renderPreferences();
  updatePreview();
}

function renderAnalytics() {
  const delivered = state.analytics.delivered;
  const failed = state.analytics.failed;
  const retried = state.analytics.retried;
  const queued = state.analytics.queued;

  statsNodes.forEach((node) => {
    const stat = node.dataset.stat;
    if (stat === 'queued') {
      node.textContent = String(queued);
    } else if (stat === 'delivered') {
      node.textContent = String(delivered);
    } else if (stat === 'failed') {
      node.textContent = String(failed);
    } else if (stat === 'retried') {
      node.textContent = String(retried);
    }
  });

  analyticsPanel.innerHTML = `
    <div class="analytics-grid">
      <div class="analytics-card"><span>Queued</span><strong>${queued}</strong></div>
      <div class="analytics-card"><span>Delivered</span><strong>${delivered}</strong></div>
      <div class="analytics-card"><span>Failed</span><strong>${failed}</strong></div>
      <div class="analytics-card"><span>Retries</span><strong>${retried}</strong></div>
    </div>
  `;
}

function renderNotifications() {
  notificationsList.innerHTML = state.notifications.length
    ? state.notifications
        .slice(0, 12)
        .map(
          (notification) => `
            <article class="notification-card notification-card--${notification.status}">
              <div class="notification-card__header">
                <div>
                  <strong>${notification.title}</strong>
                  <p>${notification.userName} • ${notification.reference}</p>
                </div>
                <span class="badge">${notification.status}</span>
              </div>
              <div class="notification-card__meta">
                <span>Route: ${notification.allowedChannels.join(' -> ') || 'inApp'}</span>
                <span>Priority: ${notification.priority}</span>
              </div>
            </article>
          `,
        )
        .join('')
    : '<div class="empty-state">No notifications have been sent yet.</div>';
}

function renderAttempts() {
  attemptsList.innerHTML = state.attempts.length
    ? state.attempts
        .slice(0, 14)
        .map(
          (attempt) => `
            <li class="attempt-item attempt-item--${attempt.status}">
              <span>${attempt.channel} attempt ${attempt.attempt} • ${attempt.status}</span>
              <time>${new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
            </li>
          `,
        )
        .join('')
    : '<li class="attempt-item attempt-item--empty">No delivery attempts yet.</li>';
}

function renderPreferences() {
  preferencesList.innerHTML = state.users
    .map(
      (user) => `
        <article class="preference-card" data-user-card="${user.id}">
          <div class="preference-card__header">
            <div>
              <strong>${user.name}</strong>
              <p>${user.role} • ${user.email}</p>
            </div>
            <span class="badge badge--soft">${user.locale}</span>
          </div>
          <div class="preference-channels">
            ${channels
              .map(
                (channel) => `
                  <label class="channel-chip">
                    <input type="checkbox" data-pref-channel="${channel}" ${user.preferences[channel] ? 'checked' : ''} />
                    <span>${channel}</span>
                  </label>
                `,
              )
              .join('')}
          </div>
          <div class="preference-grid">
            <label class="field">
              <span>Quiet start</span>
              <input type="time" data-pref-quiet-start value="${user.quietHours.start}" />
            </label>
            <label class="field">
              <span>Quiet end</span>
              <input type="time" data-pref-quiet-end value="${user.quietHours.end}" />
            </label>
          </div>
          <div class="preference-card__footer">
            <button type="button" class="button button--secondary" data-save-preferences data-user-id="${user.id}">Save preferences</button>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderTemplate(templateString, user, reference) {
  return templateString
    .replaceAll('{name}', user.name)
    .replaceAll('{reference}', reference)
    .replaceAll('{email}', user.email);
}

function getSelectedUser() {
  return state.users.find((entry) => entry.id === state.selectedUserId) ?? state.users[0];
}

function isQuietHours(quietHours) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = timeToMinutes(quietHours.start);
  const endMinutes = timeToMinutes(quietHours.end);

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function makeReference() {
  return `REF-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function makeKey(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add('toast--visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('toast--visible'), 2200);
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        users: parsed.users ?? structuredClone(users),
        notifications: parsed.notifications ?? [],
        attempts: parsed.attempts ?? [],
        analytics: parsed.analytics ?? { queued: 0, delivered: 0, failed: 0, retried: 0, bounced: 0 },
        selectedUserId: parsed.selectedUserId ?? users[0].id,
        selectedTemplateId: parsed.selectedTemplateId ?? templates[0].id,
        priority: parsed.priority ?? 'high',
        idempotencyKey: parsed.idempotencyKey ?? makeKey('notif'),
      };
    }
  } catch {
    // Fall through to defaults.
  }

  return {
    users: structuredClone(users),
    notifications: [],
    attempts: [],
    analytics: { queued: 0, delivered: 0, failed: 0, retried: 0, bounced: 0 },
    selectedUserId: users[0].id,
    selectedTemplateId: templates[0].id,
    priority: 'high',
    idempotencyKey: makeKey('notif'),
  };
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
