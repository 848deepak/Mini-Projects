export function renderSidebar(container, contacts, activeContactId, onSelect) {
  container.innerHTML = contacts
    .map((contact) => {
      const lastMessage = contact.messages.at(-1);
      const preview = lastMessage?.text ?? 'No messages yet';
      const previewTime = lastMessage ? relativeTimestamp(lastMessage.timestamp) : '';
      const unread = contact.unreadCount > 0 ? `<span class="contact__badge">${contact.unreadCount}</span>` : '';
      const activeClass = contact.id === activeContactId ? 'contact contact--active' : 'contact';
      const initials = initialsFromName(contact.name);
      const avatarColor = avatarBackground(contact.name);

      return `
        <button type="button" class="${activeClass}" data-contact-id="${contact.id}">
          <span class="avatar" style="background:${avatarColor}">${initials}</span>
          <span class="contact__body">
            <span class="contact__row">
              <strong>${contact.name}</strong>
              <small>${previewTime}</small>
            </span>
            <span class="contact__row contact__row--preview">
              <span>${escapeHtml(preview)}</span>
              ${unread}
            </span>
          </span>
        </button>
      `;
    })
    .join('');

  container.querySelectorAll('[data-contact-id]').forEach((button) => {
    button.addEventListener('click', () => {
      onSelect(button.dataset.contactId);
    });
  });
}

export function renderChatHeader(container, contact) {
  const initials = initialsFromName(contact.name);
  const avatarColor = avatarBackground(contact.name);
  const subtitle = contact.isGroup ? 'Group chat' : 'Online';

  container.innerHTML = `
    <span class="avatar" style="background:${avatarColor}">${initials}</span>
    <div class="chat__meta">
      <strong>${contact.name}</strong>
      <span>${subtitle}</span>
    </div>
  `;
}

export function renderMessages(container, messages) {
  const runs = groupBySender(messages);

  container.innerHTML = runs
    .map((run) => {
      const runClass = run.sender === 'me' ? 'message-run message-run--me' : 'message-run message-run--them';

      const bubbles = run.items
        .map((message) => {
          const receipt = message.sender === 'me'
            ? `<span class="message__receipt ${message.receipt === 'read' ? 'message__receipt--read' : ''}">✓✓</span>`
            : '';

          return `
            <article class="bubble" data-message-id="${message.id}">
              <p>${escapeHtml(message.text)}</p>
              <footer class="message__meta">
                <time class="message__time">${clockTime(message.timestamp)}</time>
                ${receipt}
              </footer>
            </article>
          `;
        })
        .join('');

      return `<div class="${runClass}">${bubbles}</div>`;
    })
    .join('');
}

export function scrollMessagesToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

export function toggleTypingIndicator(container, visible) {
  container.hidden = !visible;
}

function groupBySender(messages) {
  const runs = [];
  for (const message of messages) {
    const lastRun = runs.at(-1);
    if (!lastRun || lastRun.sender !== message.sender) {
      runs.push({ sender: message.sender, items: [message] });
    } else {
      lastRun.items.push(message);
    }
  }
  return runs;
}

function clockTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function relativeTimestamp(timestamp) {
  const now = Date.now();
  const diffMs = now - timestamp;
  const abs = Math.abs(diffMs);

  if (abs < 1000 * 60) {
    return 'just now';
  }

  if (abs < 1000 * 60 * 60) {
    const minutes = Math.round(diffMs / (1000 * 60));
    return `${minutes}m ago`;
  }

  if (abs < 1000 * 60 * 60 * 24) {
    const hours = Math.round(diffMs / (1000 * 60 * 60));
    return `${hours}h ago`;
  }

  if (abs < 1000 * 60 * 60 * 48) {
    return 'Yesterday';
  }

  return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function initialsFromName(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function avatarBackground(name) {
  const hue = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  return `hsl(${hue} 68% 48%)`;
}

function escapeHtml(input) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
