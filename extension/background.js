/* ── AnonMitra — background.js ── */

const API = 'http://localhost:8000';

// ── Create context menu on install ──
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'anonmitra-detect',
    title: '🤖 Analyze with AnonMitra',
    contexts: ['selection']
  });
});

// ── Handle right-click ──
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'anonmitra-detect') return;

  const text = info.selectionText?.trim();
  if (!text) return;

  if (text.length < 50) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showOverlay,
      args: [{ error: 'Select at least 50 characters to analyze.' }]
    });
    return;
  }

  // Show loading overlay immediately
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: showOverlay,
    args: [{ loading: true }]
  });

  // Get token from storage
  const { token } = await chrome.storage.local.get('token');

  try {
    const res = await fetch(API + '/api/detector/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showOverlay,
      args: [{ result: data.result, confidence: data.confidence, explanation: data.explanation }]
    });
  } catch (e) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showOverlay,
      args: [{ error: 'Backend not reachable. Is it running?' }]
    });
  }
});

// ── Overlay injected into the page ──
// This function runs IN the webpage context (not extension context)
function showOverlay(data) {
  // Remove existing overlay
  const existing = document.getElementById('anonmitra-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'anonmitra-overlay';

  const isAI = (data.result || '').toLowerCase() === 'ai';
  const isMixed = (data.result || '').toLowerCase() === 'mixed';
  const isHuman = (data.result || '').toLowerCase() === 'human';

  const accentColor = isAI ? '#ff5c6e' : isMixed ? '#f5a623' : '#3dd68c';
  const emoji = isAI ? '🤖' : isMixed ? '⚠️' : '✍️';
  const label = isAI ? 'AI-Generated' : isMixed ? 'Mixed' : 'Human-Written';
  const pct = data.confidence != null ? Math.round(data.confidence * 100) + '%' : '';

  overlay.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    background: #181c27;
    border: 1px solid #2a2f42;
    border-left: 3px solid ${data.loading ? '#4f9eff' : data.error ? '#ff5c6e' : accentColor};
    border-radius: 12px;
    padding: 14px 16px;
    max-width: 300px;
    min-width: 220px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13px;
    color: #e8eaf2;
    animation: amSlideIn 0.2s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes amSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    #anonmitra-overlay .am-close {
      position: absolute;
      top: 8px; right: 10px;
      background: none; border: none;
      color: #555b72; cursor: pointer;
      font-size: 15px; line-height: 1;
      padding: 2px 4px;
    }
    #anonmitra-overlay .am-close:hover { color: #e8eaf2; }
  `;
  document.head.appendChild(style);

  if (data.loading) {
    overlay.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:14px;height:14px;border:2px solid #2a2f42;border-top-color:#4f9eff;border-radius:50%;animation:amSpin 0.7s linear infinite;flex-shrink:0"></div>
        <span style="color:#8b90a8">Analyzing text…</span>
      </div>
      <style>@keyframes amSpin{to{transform:rotate(360deg)}}</style>
    `;
  } else if (data.error) {
    overlay.innerHTML = `
      <button class="am-close" onclick="this.parentElement.remove()">✕</button>
      <div style="display:flex;align-items:center;gap:8px;">
        <span>⚠️</span>
        <span style="color:#ff5c6e">${data.error}</span>
      </div>
    `;
  } else {
    overlay.innerHTML = `
      <button class="am-close" onclick="this.parentElement.remove()">✕</button>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span style="font-weight:700;font-size:14px;color:${accentColor}">${emoji} ${label}</span>
        <span style="font-size:11px;color:#8b90a8;font-family:monospace">${pct}</span>
      </div>
      <div style="font-size:12px;color:#8b90a8;line-height:1.5">${data.explanation || ''}</div>
      <div style="margin-top:8px;font-size:10px;color:#555b72;text-align:right">AnonMitra</div>
    `;
  }

  document.body.appendChild(overlay);

  // Auto-dismiss after 6 seconds (unless loading)
  if (!data.loading) {
    setTimeout(() => overlay.remove(), 6000);
  }
}