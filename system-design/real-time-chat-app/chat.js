import { autoReplies, seedContacts } from './contacts.js';
import {
  renderChatHeader,
  renderMessages,
  renderSidebar,
  scrollMessagesToBottom,
  toggleTypingIndicator,
} from './ui.js';

const STORAGE_KEY = 'rt_chat_state_v1';
const CHANNEL_NAME = 'rt_chat_broadcast';
const tabId = self.crypto?.randomUUID?.() ?? `tab-${Math.random().toString(36).slice(2)}`;
const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

const contactsContainer = document.querySelector('[data-contacts]');
const chatHeader = document.querySelector('[data-chat-header]');
const messagesContainer = document.querySelector('[data-messages]');
const typingIndicator = document.querySelector('[data-typing]');
const messageInput = document.querySelector('[data-message-input]');
const sendButton = document.querySelector('[data-send-button]');

const state = loadState();
let typingForContactId = null;

ensureActiveContact();
persistStateOnly();

renderAll();
attachEvents();

function attachEvents() {
  sendButton.addEventListener('click', () => submitMessage());

  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitMessage();
    }
  });

  channel?.addEventListener('message', (event) => {
    const payload = event.data;
    if (!payload || payload.sourceId === tabId || payload.type !== 'state-sync') {
      return;
    }

    hydrateState(payload.state);
    renderAll();
  });
}

function submitMessage() {
  const text = messageInput.value.trim();
  if (!text) {
    return;
  }

  const contact = getActiveContact();
  if (!contact) {
    return;
  }

  contact.messages.push({
    id: messageId(),
    sender: 'me',
    text,
    timestamp: Date.now(),
    receipt: 'sent',
  });

  messageInput.value = '';
  persistAndBroadcast();
  renderAll();
  scheduleAutoReply(contact.id);
}

function scheduleAutoReply(contactId) {
  window.setTimeout(() => {
    if (getContactById(contactId)) {
      typingForContactId = contactId;
      renderTyping();
    }
  }, 800);

  window.setTimeout(() => {
    const contact = getContactById(contactId);
    if (!contact) {
      return;
    }

    const text = randomReply(contact.id);
    const incomingMessage = {
      id: messageId(),
      sender: 'them',
      text,
      timestamp: Date.now(),
    };

    contact.messages.push(incomingMessage);
    markLatestOutgoingAsRead(contact);

    if (contact.id !== state.activeContactId) {
      contact.unreadCount += 1;
    }

    typingForContactId = null;
    persistAndBroadcast();
    renderAll();
  }, 2300);
}

function markLatestOutgoingAsRead(contact) {
  for (let index = contact.messages.length - 1; index >= 0; index -= 1) {
    const message = contact.messages[index];
    if (message.sender === 'me') {
      message.receipt = 'read';
      break;
    }
  }
}

function renderAll() {
  renderSidebar(contactsContainer, state.contacts, state.activeContactId, (contactId) => {
    state.activeContactId = contactId;

    const contact = getContactById(contactId);
    if (contact) {
      contact.unreadCount = 0;
    }

    persistAndBroadcast();
    renderAll();
  });

  const activeContact = getActiveContact();
  if (!activeContact) {
    return;
  }

  renderChatHeader(chatHeader, activeContact);
  renderMessages(messagesContainer, activeContact.messages);
  renderTyping();
  scrollMessagesToBottom(messagesContainer);
}

function renderTyping() {
  const shouldShow = Boolean(typingForContactId && typingForContactId === state.activeContactId);
  toggleTypingIndicator(typingIndicator, shouldShow);
}

function persistAndBroadcast() {
  persistStateOnly();

  channel?.postMessage({
    type: 'state-sync',
    sourceId: tabId,
    state,
  });
}

function persistStateOnly() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (saved && Array.isArray(saved.contacts) && typeof saved.activeContactId === 'string') {
      return normalizeState(saved);
    }
  } catch {
    // fall through to seed initialization
  }

  return {
    activeContactId: seedContacts[0].id,
    contacts: seedContacts.map((contact) => ({
      ...contact,
      unreadCount: 0,
    })),
  };
}

function normalizeState(rawState) {
  return {
    activeContactId: rawState.activeContactId,
    contacts: rawState.contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      isGroup: Boolean(contact.isGroup),
      unreadCount: Number(contact.unreadCount ?? 0),
      messages: Array.isArray(contact.messages)
        ? contact.messages.map((message) => ({
            id: String(message.id),
            sender: message.sender === 'me' ? 'me' : 'them',
            text: String(message.text ?? ''),
            timestamp: Number(message.timestamp ?? Date.now()),
            receipt: message.receipt === 'read' ? 'read' : 'sent',
          }))
        : [],
    })),
  };
}

function hydrateState(nextState) {
  const normalized = normalizeState(nextState);
  state.activeContactId = normalized.activeContactId;
  state.contacts = normalized.contacts;
  ensureActiveContact();
}

function ensureActiveContact() {
  const activeExists = state.contacts.some((contact) => contact.id === state.activeContactId);
  if (!activeExists && state.contacts.length) {
    state.activeContactId = state.contacts[0].id;
  }
}

function getContactById(contactId) {
  return state.contacts.find((contact) => contact.id === contactId) ?? null;
}

function getActiveContact() {
  return getContactById(state.activeContactId);
}

function randomReply(contactId) {
  const replies = autoReplies[contactId] ?? ['Noted.'];
  return replies[Math.floor(Math.random() * replies.length)];
}

function messageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
