import { initialDevices, initialHome, initialRules, rooms, scenes } from './data.js';

const STORAGE_KEY = 'smart_home_automation_state';

const state = loadState();

const roleSelect = document.querySelector('[data-role-select]');
const deviceGrid = document.querySelector('[data-device-grid]');
const ruleList = document.querySelector('[data-rule-list]');
const activityList = document.querySelector('[data-activity-list]');
const sceneGrid = document.querySelector('[data-scene-grid]');
const ruleForm = document.querySelector('[data-rule-form]');
const dashboardStats = document.querySelectorAll('[data-stat]');
const statusBanner = document.querySelector('[data-status-banner]');
const eventButtons = document.querySelectorAll('[data-event-button]');

initialize();

function initialize() {
  roleSelect.value = state.home.role;
  bindRoleChange();
  renderScenes();
  renderDashboard();
  renderDevices();
  renderRules();
  renderActivity();
  bindRuleForm();
  bindEventButtons();
  evaluateScheduledRules();
  window.setInterval(evaluateScheduledRules, 60_000);
}

function bindRoleChange() {
  roleSelect.addEventListener('change', () => {
    state.home.role = roleSelect.value;
    logEvent(`Role switched to ${state.home.role}.`, 'info');
    persist();
    renderDashboard();
    renderDevices();
    renderRules();
  });
}

function renderDashboard() {
  const onlineCount = state.devices.filter((device) => device.online).length;
  const activeRules = state.rules.filter((rule) => rule.enabled).length;
  const recentEvents = state.activityLog.slice(0, 5).length;
  const roles = { owner: 'Owner', family: 'Family', guest: 'Guest' };

  dashboardStats.forEach((element) => {
    const stat = element.dataset.stat;
    if (stat === 'devices') {
      element.textContent = `${onlineCount}/${state.devices.length}`;
    } else if (stat === 'rules') {
      element.textContent = `${activeRules}`;
    } else if (stat === 'events') {
      element.textContent = `${recentEvents}`;
    } else if (stat === 'role') {
      element.textContent = roles[state.home.role] ?? state.home.role;
    }
  });

  statusBanner.textContent = `${state.home.name} is online. ${onlineCount} devices connected.`;
}

function renderScenes() {
  sceneGrid.innerHTML = scenes
    .map(
      (scene) => `
        <button type="button" class="scene-card" data-scene-id="${scene.id}">
          <strong>${scene.name}</strong>
          <span>${scene.description}</span>
        </button>
      `,
    )
    .join('');

  sceneGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-scene-id]');
    if (!button) {
      return;
    }

    const scene = scenes.find((entry) => entry.id === button.dataset.sceneId);
    if (!scene) {
      return;
    }

    applyScene(scene);
  });
}

function renderDevices() {
  deviceGrid.innerHTML = state.devices
    .map((device) => {
      const controlMarkup = buildControlMarkup(device);
      return `
        <article class="device-card">
          <div class="device-card__header">
            <div>
              <p class="device-type">${device.type.replace('-', ' ')}</p>
              <h3>${device.name}</h3>
            </div>
            <span class="device-badge ${device.online ? 'device-badge--online' : 'device-badge--offline'}">
              ${device.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <p class="device-room">${device.room}</p>
          <div class="device-state-row">
            <span>State</span>
            <strong>${describeDeviceState(device)}</strong>
          </div>
          <div class="device-card__controls">${controlMarkup}</div>
        </article>
      `;
    })
    .join('');

  deviceGrid.querySelectorAll('[data-device-action]').forEach((button) => {
    button.addEventListener('click', () => handleDeviceAction(button));
  });
}

function buildControlMarkup(device) {
  if (!canControl(device)) {
    return `<span class="control-hint">View only for ${state.home.role} role</span>`;
  }

  if (device.type === 'thermostat') {
    return `
      <button type="button" class="button button--small" data-device-action="cool-down" data-device-id="${device.id}">-</button>
      <span class="device-value">${device.value}°C</span>
      <button type="button" class="button button--small" data-device-action="warm-up" data-device-id="${device.id}">+</button>
    `;
  }

  if (device.type === 'light' || device.type === 'camera') {
    return `
      <button type="button" class="button button--small" data-device-action="toggle" data-device-id="${device.id}">
        ${device.status === 'on' ? 'Turn off' : 'Turn on'}
      </button>
    `;
  }

  if (device.type === 'lock') {
    return `
      <button type="button" class="button button--small" data-device-action="toggle-lock" data-device-id="${device.id}">
        ${device.status === 'locked' ? 'Unlock' : 'Lock'}
      </button>
    `;
  }

  return `<span class="control-hint">${describeDeviceState(device)}</span>`;
}

function handleDeviceAction(button) {
  const device = state.devices.find((entry) => entry.id === button.dataset.deviceId);
  if (!device || !canControl(device)) {
    logEvent(`Access denied for ${state.home.role} on ${device?.name ?? 'device'}.`, 'warning');
    persist();
    return;
  }

  const action = button.dataset.deviceAction;

  if (action === 'toggle' && (device.type === 'light' || device.type === 'camera')) {
    device.status = device.status === 'on' ? 'off' : 'on';
    device.value = device.type === 'light' && device.status === 'on' ? 70 : 0;
    logEvent(`${device.name} turned ${device.status}.`, 'device');
  }

  if (action === 'cool-down' && device.type === 'thermostat') {
    device.value = Math.max(16, device.value - 1);
    device.status = 'on';
    logEvent(`${device.name} set to ${device.value}°C.`, 'device');
  }

  if (action === 'warm-up' && device.type === 'thermostat') {
    device.value = Math.min(28, device.value + 1);
    device.status = 'on';
    logEvent(`${device.name} set to ${device.value}°C.`, 'device');
  }

  if (action === 'toggle-lock' && device.type === 'lock') {
    device.status = device.status === 'locked' ? 'unlocked' : 'locked';
    logEvent(`${device.name} ${device.status}.`, 'device');
  }

  persist();
  renderDashboard();
  renderDevices();
}

function renderRules() {
  ruleList.innerHTML = state.rules
    .map(
      (rule) => `
        <article class="rule-card ${rule.enabled ? '' : 'rule-card--disabled'}">
          <div>
            <h3>${rule.name}</h3>
            <p>${describeRule(rule)}</p>
          </div>
          <div class="rule-card__actions">
            <button type="button" class="button button--small" data-rule-toggle="${rule.id}">
              ${rule.enabled ? 'Disable' : 'Enable'}
            </button>
            <button type="button" class="button button--small button--ghost" data-rule-delete="${rule.id}">Delete</button>
          </div>
        </article>
      `,
    )
    .join('');

  ruleList.querySelectorAll('[data-rule-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const rule = state.rules.find((entry) => entry.id === button.dataset.ruleToggle);
      if (!rule) {
        return;
      }

      rule.enabled = !rule.enabled;
      logEvent(`${rule.name} ${rule.enabled ? 'enabled' : 'disabled'}.`, 'rule');
      persist();
      renderDashboard();
      renderRules();
    });
  });

  ruleList.querySelectorAll('[data-rule-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      state.rules = state.rules.filter((entry) => entry.id !== button.dataset.ruleDelete);
      logEvent(`Rule deleted.`, 'rule');
      persist();
      renderDashboard();
      renderRules();
    });
  });
}

function bindRuleForm() {
  const roomSelect = ruleForm.querySelector('[name="room"]');
  roomSelect.innerHTML = [`All`, ...rooms]
    .map((room) => `<option value="${room}">${room}</option>`)
    .join('');

  ruleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(ruleForm);

    const rule = {
      id: `rule-${Math.random().toString(36).slice(2, 8)}`,
      name: formData.get('name').toString(),
      triggerType: formData.get('trigger').toString(),
      scope: formData.get('room').toString(),
      actionType: formData.get('action').toString(),
      actionScope: formData.get('actionRoom').toString(),
      actionValue: formData.get('value').toString() || 'on',
      enabled: true,
      lastFiredKey: '',
      timeAfter: formData.get('timeAfter').toString() || '',
    };

    state.rules.unshift(rule);
    logEvent(`Rule created: ${rule.name}.`, 'rule');
    ruleForm.reset();
    ruleForm.querySelector('[name="room"]').value = 'All';
    ruleForm.querySelector('[name="actionRoom"]').value = 'All';
    persist();
    renderDashboard();
    renderRules();
  });
}

function bindEventButtons() {
  eventButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const eventType = button.dataset.eventButton;
      emitEvent(createEventFromButton(eventType));
    });
  });
}

function createEventFromButton(eventType) {
  switch (eventType) {
    case 'motion':
      return { eventId: crypto.randomUUID(), type: 'motion', room: 'Hallway', description: 'Motion detected in the hallway.' };
    case 'door':
      return { eventId: crypto.randomUUID(), type: 'door', room: 'Porch', description: 'Front door opened.' };
    case 'temperature':
      return { eventId: crypto.randomUUID(), type: 'temperature', room: 'Living Room', value: 29, description: 'Living room temperature spiked to 29°C.' };
    case 'smoke':
      return { eventId: crypto.randomUUID(), type: 'smoke', room: 'Kitchen', description: 'Kitchen smoke alert detected.' };
    default:
      return { eventId: crypto.randomUUID(), type: eventType, description: 'Generic event.' };
  }
}

function emitEvent(event) {
  state.activityLog.unshift({ id: event.eventId, timestamp: new Date().toISOString(), message: event.description, type: 'event' });
  evaluateRules(event);
  persist();
  renderDashboard();
  renderActivity();
  renderDevices();
}

function evaluateRules(event) {
  state.rules.forEach((rule) => {
    if (!rule.enabled) {
      return;
    }

    if (rule.triggerType === 'time') {
      return;
    }

    if (rule.triggerType !== event.type) {
      return;
    }

    if (rule.scope !== 'All' && rule.scope !== event.room) {
      return;
    }

    applyRuleAction(rule, event);
  });
}

function evaluateScheduledRules() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 5);

  state.rules.forEach((rule) => {
    if (!rule.enabled || rule.triggerType !== 'time' || !rule.timeAfter) {
      return;
    }

    const triggerKey = `${today} ${rule.timeAfter}`;

    if (currentTime < rule.timeAfter) {
      return;
    }

    if (rule.lastFiredKey === triggerKey) {
      return;
    }

    rule.lastFiredKey = triggerKey;
    applyRuleAction(rule, { type: 'time', room: rule.scope === 'All' ? 'Living Room' : rule.scope, description: 'Scheduled rule triggered.' });
  });

  persist();
}

function applyRuleAction(rule, event) {
  const affectedDevices = state.devices.filter((device) => {
    const roomMatch = rule.actionScope === 'All' || rule.actionScope === device.room;
    return roomMatch && device.type === rule.actionType;
  });

  affectedDevices.forEach((device) => {
    if (device.type === 'light' && rule.actionValue === 'on') {
      device.status = 'on';
      device.value = 75;
    }

    if (device.type === 'light' && rule.actionValue === 'off') {
      device.status = 'off';
      device.value = 0;
    }

    if (device.type === 'lock' && rule.actionValue === 'locked') {
      device.status = 'locked';
    }

    if (device.type === 'lock' && rule.actionValue === 'unlocked') {
      device.status = 'unlocked';
    }

    if (device.type === 'thermostat') {
      const nextValue = Number.parseInt(rule.actionValue, 10);
      if (!Number.isNaN(nextValue)) {
        device.value = nextValue;
        device.status = 'on';
      }
    }

    if (device.type === 'camera' && rule.actionValue === 'on') {
      device.status = 'on';
    }
  });

  logEvent(`Rule fired: ${rule.name} (${event.description ?? event.type}).`, 'rule');
  renderDevices();
  renderRules();
}

function applyScene(scene) {
  scene.actions.forEach((action) => {
    state.devices.forEach((device) => {
      const deviceTypeMatch = device.type === action.deviceType;
      const roomMatch = !action.room || action.room === device.room;

      if (!deviceTypeMatch || !roomMatch) {
        return;
      }

      if (action.command === 'off') {
        device.status = 'off';
        device.value = 0;
      }

      if (action.command === 'on') {
        device.status = 'on';
        if (device.type === 'light') {
          device.value = 70;
        }
      }

      if (action.command === 'set' && device.type === 'thermostat') {
        device.status = 'on';
        device.value = action.value;
      }

      if (action.command === 'lock' && device.type === 'lock') {
        device.status = 'locked';
      }

      if (action.command === 'unlock' && device.type === 'lock') {
        device.status = 'unlocked';
      }
    });
  });

  logEvent(`Scene applied: ${scene.name}.`, 'scene');
  persist();
  renderDashboard();
  renderDevices();
}

function renderActivity() {
  activityList.innerHTML = state.activityLog.length
    ? state.activityLog
        .slice(0, 10)
        .map(
          (entry) => `
            <li class="activity-item activity-item--${entry.type}">
              <span>${entry.message}</span>
              <time>${new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
            </li>
          `,
        )
        .join('')
    : '<li class="activity-item activity-item--empty">No activity yet.</li>';
}

function logEvent(message, type) {
  state.activityLog.unshift({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), message, type });
  state.activityLog = state.activityLog.slice(0, 40);
}

function describeDeviceState(device) {
  if (device.type === 'thermostat') {
    return `${device.value}°C`;
  }

  if (device.type === 'light' || device.type === 'camera') {
    return device.status;
  }

  if (device.type === 'lock') {
    return device.status;
  }

  return device.status;
}

function describeRule(rule) {
  const triggerLabel = rule.triggerType === 'time' ? `after ${rule.timeAfter}` : `${rule.triggerType} in ${rule.scope}`;
  return `${triggerLabel} -> ${rule.actionType} ${rule.actionValue} in ${rule.actionScope}.`;
}

function canControl(device) {
  if (state.home.role === 'owner') {
    return true;
  }

  if (state.home.role === 'family') {
    return device.type !== 'camera';
  }

  return device.type === 'light';
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        home: initialHome,
        devices: structuredClone(initialDevices),
        rules: structuredClone(initialRules),
        activityLog: [
          { id: crypto.randomUUID(), timestamp: new Date().toISOString(), message: 'Smart home dashboard initialized.', type: 'info' },
        ],
      };
    }

    const parsed = JSON.parse(stored);
    return {
      home: parsed.home ?? initialHome,
      devices: parsed.devices ?? structuredClone(initialDevices),
      rules: parsed.rules ?? structuredClone(initialRules),
      activityLog: parsed.activityLog ?? [],
    };
  } catch {
    return {
      home: initialHome,
      devices: structuredClone(initialDevices),
      rules: structuredClone(initialRules),
      activityLog: [
        { id: crypto.randomUUID(), timestamp: new Date().toISOString(), message: 'Smart home dashboard initialized.', type: 'info' },
      ],
    };
  }
}
