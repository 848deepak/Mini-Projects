import { modeOptions, seedPosts, users } from './data.js';

const STORAGE_KEY = 'social_media_feed_state';
const state = loadState();

const authorSelect = document.querySelector('[data-author-select]');
const modeSwitch = document.querySelector('[data-mode-switch]');
const feedList = document.querySelector('[data-feed-list]');
const moderationList = document.querySelector('[data-moderation-list]');
const stats = {
  posts: document.querySelector('[data-stat-posts]'),
  followers: document.querySelector('[data-stat-followers]'),
  queue: document.querySelector('[data-stat-queue]'),
  mode: document.querySelector('[data-stat-mode]'),
};
const composerForm = document.querySelector('[data-composer-form]');

initialize();

function initialize() {
  authorSelect.innerHTML = users.map((user) => `<option value="${user.id}">${user.name} (${user.handle})</option>`).join('');
  authorSelect.value = state.activeUserId;
  renderModeSwitch();
  render();

  authorSelect.addEventListener('change', () => {
    state.activeUserId = authorSelect.value;
    persist();
    render();
  });

  composerForm.addEventListener('submit', handleCompose);
}

function render() {
  renderStats();
  renderFeed();
  renderModerationQueue();
}

function renderStats() {
  const visiblePosts = getVisiblePosts().length;
  stats.posts.textContent = String(state.posts.length);
  stats.followers.textContent = String(users.find((user) => user.id === state.activeUserId)?.followers ?? 0);
  stats.queue.textContent = String(state.posts.filter((post) => post.flagged).length + state.moderationQueue.length);
  stats.mode.textContent = modeOptions.find((mode) => mode.id === state.mode)?.label ?? 'For you';
}

function renderModeSwitch() {
  modeSwitch.innerHTML = modeOptions
    .map(
      (mode) => `
        <button type="button" class="mode-button ${mode.id === state.mode ? 'mode-button--active' : ''}" data-mode="${mode.id}">${mode.label}</button>
      `,
    )
    .join('');

  modeSwitch.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      persist();
      renderModeSwitch();
      render();
    });
  });
}

function renderFeed() {
  const posts = getVisiblePosts();
  feedList.innerHTML = posts
    .map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      return `
        <article class="post-card ${post.flagged ? 'post-card--flagged' : ''}">
          <div class="post-card__header">
            <div>
              <strong>${author?.name ?? 'Unknown'}</strong>
              <p>${author?.handle ?? ''} • ${formatRelative(post.createdAt)} • ${post.audience}</p>
            </div>
            <span class="pill">${scorePost(post).toFixed(0)} rank</span>
          </div>
          <p class="post-card__caption">${post.caption}</p>
          <div class="post-card__media">${post.media || 'Text only post'}</div>
          <div class="post-card__actions">
            <button type="button" class="chip" data-like="${post.id}">♥ ${post.likes}</button>
            <button type="button" class="chip" data-comment="${post.id}">💬 ${post.comments}</button>
            <button type="button" class="chip" data-share="${post.id}">↗ ${post.shares}</button>
            <button type="button" class="chip chip--danger" data-flag="${post.id}">${post.flagged ? 'Flagged' : 'Flag'}</button>
          </div>
        </article>
      `;
    })
    .join('');

  feedList.querySelectorAll('[data-like]').forEach((button) => button.addEventListener('click', () => engage(button.dataset.like, 'likes')));
  feedList.querySelectorAll('[data-comment]').forEach((button) => button.addEventListener('click', () => engage(button.dataset.comment, 'comments')));
  feedList.querySelectorAll('[data-share]').forEach((button) => button.addEventListener('click', () => engage(button.dataset.share, 'shares')));
  feedList.querySelectorAll('[data-flag]').forEach((button) => button.addEventListener('click', () => flagPost(button.dataset.flag)));
}

function renderModerationQueue() {
  const queue = [...state.moderationQueue, ...state.posts.filter((post) => post.flagged)].slice(0, 8);

  if (queue.length === 0) {
    moderationList.innerHTML = '<p class="empty-state">No content waiting for review.</p>';
    return;
  }

  moderationList.innerHTML = queue
    .map(
      (post) => `
        <article class="queue-card">
          <div>
            <strong>${users.find((user) => user.id === post.authorId)?.name ?? 'Unknown'}</strong>
            <p>${post.caption}</p>
          </div>
          <div class="queue-card__actions">
            <button type="button" class="chip" data-approve="${post.id}">Approve</button>
            <button type="button" class="chip chip--danger" data-remove="${post.id}">Remove</button>
          </div>
        </article>
      `,
    )
    .join('');

  moderationList.querySelectorAll('[data-approve]').forEach((button) => button.addEventListener('click', () => approvePost(button.dataset.approve)));
  moderationList.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => removePost(button.dataset.remove)));
}

function getVisiblePosts() {
  const posts = [...state.posts];

  if (state.mode === 'following') {
    return posts.filter((post) => post.following).sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }

  if (state.mode === 'moderation') {
    return posts.filter((post) => post.flagged).sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }

  return posts.sort((left, right) => scorePost(right) - scorePost(left));
}

function scorePost(post) {
  const ageMinutes = (Date.now() - new Date(post.createdAt).getTime()) / 60000;
  const recency = Math.max(0, 100 - ageMinutes);
  const engagement = post.likes * 0.45 + post.comments * 0.65 + post.shares * 0.8;
  const followerBoost = (users.find((user) => user.id === post.authorId)?.followers ?? 0) / 1000;
  const moderationPenalty = post.flagged ? -120 : 0;
  return recency + engagement + followerBoost + moderationPenalty;
}

function formatRelative(isoString) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(isoString).getTime()) / 60000));
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

function handleCompose(event) {
  event.preventDefault();
  const formData = new FormData(composerForm);
  const post = {
    id: `p-${Math.random().toString(36).slice(2, 8)}`,
    authorId: formData.get('author').toString(),
    caption: formData.get('caption').toString(),
    media: formData.get('media').toString(),
    audience: formData.get('audience').toString(),
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0,
    shares: 0,
    flagged: false,
    following: true,
  };

  state.posts.unshift(post);
  if (post.caption.toLowerCase().includes('spam') || post.caption.toLowerCase().includes('buy now')) {
    post.flagged = true;
    state.moderationQueue.unshift(post.id);
  }

  composerForm.reset();
  composerForm.querySelector('[name="author"]').value = state.activeUserId;
  persist();
  render();
}

function engage(postId, field) {
  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) {
    return;
  }

  post[field] += 1;
  persist();
  renderFeed();
  renderStats();
}

function flagPost(postId) {
  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) {
    return;
  }

  post.flagged = true;
  if (!state.moderationQueue.includes(postId)) {
    state.moderationQueue.unshift(postId);
  }
  persist();
  render();
}

function approvePost(postId) {
  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) {
    return;
  }

  post.flagged = false;
  state.moderationQueue = state.moderationQueue.filter((id) => id !== postId);
  persist();
  render();
}

function removePost(postId) {
  state.posts = state.posts.filter((post) => post.id !== postId);
  state.moderationQueue = state.moderationQueue.filter((id) => id !== postId);
  persist();
  render();
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        mode: 'for-you',
        activeUserId: users[0].id,
        posts: structuredClone(seedPosts),
        moderationQueue: [],
      };
    }

    const parsed = JSON.parse(stored);
    return {
      mode: parsed.mode ?? 'for-you',
      activeUserId: parsed.activeUserId ?? users[0].id,
      posts: parsed.posts ?? structuredClone(seedPosts),
      moderationQueue: parsed.moderationQueue ?? [],
    };
  } catch {
    return {
      mode: 'for-you',
      activeUserId: users[0].id,
      posts: structuredClone(seedPosts),
      moderationQueue: [],
    };
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
