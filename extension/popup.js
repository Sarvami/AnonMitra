/* ── AnonMitra Extension — popup.js ── */

const API = 'http://localhost:8000';
const WEBAPP = 'http://localhost:5173';

// ── Helpers ──────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function showToast(msg, duration = 2400) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), duration);
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  const el = $('screen-' + name);
  el.classList.remove('hidden');
  el.classList.add('active');
}

function getToken() {
  return new Promise(resolve => {
    chrome.storage.local.get('token', d => resolve(d.token || null));
  });
}

function setToken(token) {
  return new Promise(resolve => chrome.storage.local.set({ token }, resolve));
}

function clearToken() {
  return new Promise(resolve => chrome.storage.local.remove('token', resolve));
}

async function apiFetch(path, options = {}) {
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API + path, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

function openWebApp(path = '') {
  chrome.tabs.create({ url: WEBAPP + path });
}

// ── Theme ──────────────────────────────────────────────

function loadTheme() {
  chrome.storage.local.get('theme', d => {
    const theme = d.theme || 'dark';
    applyTheme(theme);
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
    $('btn-theme').textContent = '🌙';
  } else {
    document.body.classList.remove('light');
    $('btn-theme').textContent = '☀️';
  }
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light');
  const next = isLight ? 'dark' : 'light';
  chrome.storage.local.set({ theme: next });
  applyTheme(next);
}

// ── Auth ──────────────────────────────────────────────

async function tryAutoLogin() {
  const token = await getToken();
  if (!token) { showScreen('login'); return; }
  try {
    await apiFetch('/api/auth/me');
    showScreen('main');
    initMainView();
  } catch {
    await clearToken();
    showScreen('login');
  }
}

async function handleLogin() {
  const username = $('login-username').value.trim();
  const password = $('login-password').value;
  const errEl = $('login-error');
  errEl.classList.add('hidden');

  if (!username || !password) {
    errEl.textContent = 'Please enter username and password.';
    errEl.classList.remove('hidden');
    return;
  }

  const btn = $('btn-login');
  btn.textContent = 'Signing in…';
  btn.disabled = true;

  try {
    const form = new URLSearchParams({ username, password });
    const res = await fetch(API + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });

    // ← FIX: parse body first, then check ok
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = typeof data.detail === 'string'
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map(d => d.msg).join(', ')
          : 'Login failed. Check your credentials.';
      throw new Error(msg);
    }

    await setToken(data.access_token);
    showScreen('main');
    initMainView();
  } catch (e) {
    errEl.textContent = e.message || 'Login failed. Check your credentials.';
    errEl.classList.remove('hidden');
  } finally {
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
}

async function handleLogout() {
  await clearToken();
  showScreen('login');
  showToast('Logged out');
}

// ── Tabs ──────────────────────────────────────────────

function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const name = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.remove('active');
        c.classList.add('hidden');
      });
      tab.classList.add('active');
      const content = $('tab-' + name);
      content.classList.remove('hidden');
      content.classList.add('active');

      if (name === 'inbox') loadInbox();
    });
  });
}

// ── Identity Generator ──────────────────────────────────

const PLATFORMS = ['Twitter', 'Reddit', 'Discord', 'GitHub', 'LinkedIn', 'Instagram', 'Telegram'];

async function generateIdentity() {
  const btn = $('btn-generate');
  btn.textContent = '…';
  btn.disabled = true;

  try {
    const data = await apiFetch('/api/identities/', {
      method: 'POST',
      body: JSON.stringify({ platform: PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)] })
    });

    $('id-platform').textContent = data.platform || '—';
    $('id-username').textContent = data.username || '—';
    $('id-email').textContent = data.alias_email || data.email || '—';

    const riskEl = $('id-risk');
    const risk = (data.risk_badge || data.risk_status || 'low').toLowerCase();
    riskEl.textContent = risk;
    riskEl.className = 'risk-badge ' + risk;

    $('identity-result').classList.remove('hidden');
    $('identity-empty').classList.add('hidden');
    showToast('Identity generated ✓');
  } catch (e) {
    showToast('Error: ' + e.message);
  } finally {
    btn.textContent = '＋ Generate';
    btn.disabled = false;
  }
}

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = $(btn.dataset.target);
      const text = target?.textContent?.trim();
      if (!text || text === '—') return;
      navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
    });
  });
}

// ── Inbox ──────────────────────────────────────────────

async function loadInbox() {
  const list = $('inbox-list');
  const empty = $('inbox-empty');
  const loading = $('inbox-loading');

  list.innerHTML = '';
  empty.classList.add('hidden');
  loading.classList.remove('hidden');

  try {
    const messages = await apiFetch('/api/messages/?limit=8');
    loading.classList.add('hidden');

    if (!messages || messages.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    messages.forEach(msg => {
      const item = document.createElement('div');
      const isUnread = !msg.is_read;
      item.className = 'message-item' + (isUnread ? ' unread' : '');

      const time = msg.received_at
        ? new Date(msg.received_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        : '';

      item.innerHTML = `
        <div class="msg-from">${escHtml(msg.sender || 'Unknown Sender')}</div>
        <div class="msg-subject">${escHtml(msg.subject || '(No subject)')}</div>
        <div class="msg-preview">${escHtml((msg.body || '').substring(0, 60))}…</div>
        <div class="msg-meta">
          <span class="msg-alias">${escHtml(msg.alias_email || msg.identity_username || '')}</span>
          <span class="msg-time">${time}</span>
        </div>
      `;

      item.addEventListener('click', () => openWebApp('/inbox'));
      list.appendChild(item);
    });
  } catch (e) {
    loading.classList.add('hidden');
    list.innerHTML = `<div class="empty-state" style="color:var(--danger)">${escHtml(e.message)}</div>`;
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── AI Detector ──────────────────────────────────────────

async function detectText() {
  const text = $('detector-input').value.trim();
  if (!text) { showToast('Please paste some text first.'); return; }
  if (text.length < 50) { showToast('Text too short — use at least 50 characters.'); return; }

  const btn = $('btn-detect');
  const resultEl = $('detector-result');
  const loadingEl = $('detector-loading');

  btn.disabled = true;
  btn.textContent = 'Analyzing…';
  resultEl.classList.add('hidden');
  loadingEl.classList.remove('hidden');

  try {
    const data = await apiFetch('/api/detector/text', {
      method: 'POST',
      body: JSON.stringify({ text })
    });

    loadingEl.classList.add('hidden');

    const labelEl = $('result-label');
    const confEl = $('result-confidence');
    const expEl = $('result-explanation');

    const result = (data.result || '').toLowerCase();
    const labels = { ai: '🤖 AI-Generated', human: '✍️ Human-Written', mixed: '⚠️ Mixed' };
    labelEl.textContent = labels[result] || result;
    labelEl.className = 'result-label ' + result;

    const pct = data.confidence != null
      ? Math.round(data.confidence * 100) + '% confidence'
      : '';
    confEl.textContent = pct;

    expEl.textContent = data.explanation || '';
    resultEl.classList.remove('hidden');
  } catch (e) {
    loadingEl.classList.add('hidden');
    showToast('Detection failed: ' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Analyze Text';
  }
}

// ── Init Main View ──────────────────────────────────────

function initMainView() {
  initTabs();
  initCopyButtons();
}

// ── Entrypoint ──────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  tryAutoLogin();

  // Login
  $('btn-login').addEventListener('click', handleLogin);
  $('login-username').addEventListener('keydown', e => { if (e.key === 'Enter') $('login-password').focus(); });
  $('login-password').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
  $('link-register').addEventListener('click', e => { e.preventDefault(); openWebApp('/register'); });

  // Main
  $('btn-logout').addEventListener('click', handleLogout);
  $('btn-theme').addEventListener('click', toggleTheme);

  // Identity
  $('btn-generate').addEventListener('click', generateIdentity);
  $('link-dashboard').addEventListener('click', () => openWebApp('/dashboard'));

  // Inbox
  $('btn-refresh-inbox').addEventListener('click', loadInbox);
  $('link-inbox').addEventListener('click', () => openWebApp('/inbox'));

  // Detector
  $('btn-detect').addEventListener('click', detectText);
  $('link-detector').addEventListener('click', () => openWebApp('/detector'));
});