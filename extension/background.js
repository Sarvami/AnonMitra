/* ── AnonMitra — background.js (Enhanced & Fixed) ── */

const API = 'http://localhost:8000';

// Store website-specific identities
let websiteIdentities = {};

// Load saved identities on startup
chrome.storage.local.get('websiteIdentities', (data) => {
  websiteIdentities = data.websiteIdentities || {};
});

// Save identities
function saveIdentities() {
  chrome.storage.local.set({ websiteIdentities });
}

// ── Create context menu on install ──
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'anonmitra-detect',
    title: '🔮 Analyze with AnonMitra',
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    id: 'anonmitra-identity',
    title: '🪪 Generate Identity for this site',
    contexts: ['page']
  });
});

// ── Handle messages from content script ──
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DETECT_TEXT') {
    handleTextDetection(message.text, sendResponse);
    return true;
  }
  
  if (message.type === 'GENERATE_IDENTITY') {
    handleIdentityGeneration(message.text, message.domain, sendResponse);
    return true;
  }
  
  if (message.type === 'GET_SITE_IDENTITY') {
    const identity = websiteIdentities[message.domain];
    sendResponse({ identity: identity || null });
    return true;
  }
  
  if (message.type === 'GET_ALL_IDENTITIES') {
    sendResponse({ identities: websiteIdentities });
    return true;
  }
  
  if (message.type === 'DOMAIN_CHANGED') {
    console.log('Domain changed to:', message.domain);
    sendResponse({ success: true });
    return true;
  }
});

async function handleTextDetection(text, sendResponse) {
  try {
    const result = await chrome.storage.local.get('token');
    const token = result.token;
    
    const res = await fetch(API + '/api/detector/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ text })
    });
    
    const data = await res.json();
    sendResponse({ result: data });
  } catch (error) {
    console.error('Detection error:', error);
    sendResponse({ error: error.message });
  }
}

async function handleIdentityGeneration(text, domain, sendResponse) {
  try {
    const result = await chrome.storage.local.get('token');
    const token = result.token;
    
    // Check if we already have an identity for this domain
    if (websiteIdentities[domain]) {
      sendResponse({ 
        identity: websiteIdentities[domain],
        cached: true 
      });
      return;
    }
    
    // Generate new identity
    const platforms = ['Twitter', 'Reddit', 'Discord', 'GitHub', 'LinkedIn', 'Instagram', 'Telegram'];
    let platform = 'Social Media';
    
    if (domain.includes('twitter') || domain.includes('x.com')) platform = 'Twitter';
    else if (domain.includes('reddit')) platform = 'Reddit';
    else if (domain.includes('github')) platform = 'GitHub';
    else if (domain.includes('linkedin')) platform = 'LinkedIn';
    else if (domain.includes('instagram')) platform = 'Instagram';
    else if (domain.includes('discord')) platform = 'Discord';
    else platform = platforms[Math.floor(Math.random() * platforms.length)];
    
    let identity;
    
    try {
      const res = await fetch(API + '/api/identities/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ platform, context: text ? text.substring(0, 200) : '' })
      });
      
      identity = await res.json();
    } catch (apiError) {
      // Fallback: generate mock identity
      identity = {
        platform: platform,
        username: `anon_${Math.random().toString(36).substring(2, 12)}`,
        alias_email: `anon_${Math.random().toString(36).substring(2, 8)}@anonmitra.com`,
        risk_badge: 'low'
      };
    }
    
    // Store identity for this domain
    websiteIdentities[domain] = {
      ...identity,
      created_at: new Date().toISOString(),
      domain: domain
    };
    saveIdentities();
    
    sendResponse({ identity: websiteIdentities[domain] });
  } catch (error) {
    console.error('Identity generation error:', error);
    sendResponse({ error: error.message });
  }
}

// ── Handle right-click menu ──
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'anonmitra-detect') {
    const text = info.selectionText?.trim();
    if (!text) return;
    
    if (text.length < 20) {
      showOverlayInTab(tab.id, { error: 'Select at least 20 characters to analyze.' });
      return;
    }
    
    showOverlayInTab(tab.id, { loading: true });
    
    try {
      const result = await chrome.storage.local.get('token');
      const token = result.token;
      
      const res = await fetch(API + '/api/detector/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text })
      });
      
      const data = await res.json();
      showOverlayInTab(tab.id, { result: data.result, confidence: data.confidence, explanation: data.explanation });
    } catch (e) {
      showOverlayInTab(tab.id, { error: 'Backend not reachable. Make sure it\'s running on port 8000.' });
    }
  }
  
  if (info.menuItemId === 'anonmitra-identity') {
    const domain = new URL(tab.url).hostname;
    
    showOverlayInTab(tab.id, { loading: true, identityLoading: true });
    
    try {
      const result = await chrome.storage.local.get('token');
      const token = result.token;
      
      let identity = websiteIdentities[domain];
      
      if (!identity) {
        let platform = 'Social Media';
        if (domain.includes('twitter')) platform = 'Twitter';
        else if (domain.includes('reddit')) platform = 'Reddit';
        else if (domain.includes('github')) platform = 'GitHub';
        
        try {
          const res = await fetch(API + '/api/identities/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ platform })
          });
          
          identity = await res.json();
        } catch (apiError) {
          identity = {
            platform: platform,
            username: `anon_${Math.random().toString(36).substring(2, 10)}`,
            alias_email: `anon_${Math.random().toString(36).substring(2, 8)}@anonmitra.com`
          };
        }
        
        websiteIdentities[domain] = identity;
        saveIdentities();
      }
      
      showOverlayInTab(tab.id, { identity, domain });
    } catch (e) {
      showOverlayInTab(tab.id, { error: 'Failed to generate identity.' });
    }
  }
});

function showOverlayInTab(tabId, data) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: showOverlay,
    args: [data]
  }).catch(err => console.error('Failed to inject overlay:', err));
}

// Overlay function injected into page
function showOverlay(data) {
  const existing = document.getElementById('anonmitra-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'anonmitra-overlay';
  
  const styleId = 'anonmitra-overlay-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes amSlideIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes amSpin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  if (data.loading) {
    overlay.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:12px;">
        <div style="width:14px;height:14px;border:2px solid rgba(139,92,246,0.2);border-top-color:#8b5cf6;border-radius:50%;animation:amSpin 0.7s linear infinite;"></div>
        <span style="color:#c4b5fd">${data.identityLoading ? 'Generating identity...' : 'Analyzing text...'}</span>
      </div>
    `;
  } else if (data.identity) {
    const username = data.identity.username || data.identity.alias_email?.split('@')[0] || 'anonymous';
    const email = data.identity.alias_email || data.identity.email || `${username}@anonmitra.com`;
    
    overlay.innerHTML = `
      <div style="padding:12px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span>🪪</span>
          <strong style="color:#2dd4bf">Identity for ${data.domain}</strong>
        </div>
        <div style="font-size:11px;margin-top:8px;">
          <div style="margin-bottom:6px"><span style="color:#8b5cf6">Username:</span> <strong>${escapeHtml(username)}</strong></div>
          <div><span style="color:#8b5cf6">Email:</span> ${escapeHtml(email)}</div>
        </div>
        <button id="am-copy-identity" style="margin-top:10px;width:100%;background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.4);border-radius:6px;padding:6px;color:#ede9fe;cursor:pointer;font-family:monospace;font-size:11px;">📋 Copy Username</button>
      </div>
    `;
    setTimeout(() => {
      const copyBtn = document.getElementById('am-copy-identity');
      if (copyBtn) {
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(username);
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => { copyBtn.textContent = '📋 Copy Username'; }, 2000);
        };
      }
    }, 100);
  } else if (data.result) {
    const isAI = data.result === 'ai';
    const isMixed = data.result === 'mixed';
    const accentColor = isAI ? '#f43f5e' : isMixed ? '#f59e0b' : '#2dd4bf';
    const label = isAI ? 'AI-GENERATED' : isMixed ? 'MIXED' : 'HUMAN-WRITTEN';
    const emoji = isAI ? '🤖' : isMixed ? '⚠️' : '✍️';
    const pct = data.confidence ? Math.round(data.confidence * 100) + '%' : '';
    
    overlay.innerHTML = `
      <div style="padding:12px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <strong style="color:${accentColor}">${emoji} ${label}</strong>
          <span style="font-size:10px;color:#8b5cf6">${pct}</span>
        </div>
        <div style="font-size:11px;color:#c4b5fd;line-height:1.4">${escapeHtml(data.explanation || 'Analysis complete.')}</div>
        <div style="margin-top:8px;font-size:9px;color:rgba(139,92,246,0.5);text-align:right">AnonMitra</div>
      </div>
    `;
  } else if (data.error) {
    overlay.innerHTML = `
      <div style="padding:12px;color:#f43f5e">
        ⚠️ ${escapeHtml(data.error)}
      </div>
    `;
  }
  
  overlay.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    background: #0d0a1a;
    border: 1px solid rgba(139,92,246,0.4);
    border-radius: 12px;
    min-width: 240px;
    max-width: 320px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    font-size: 12px;
    color: #ede9fe;
    animation: amSlideIn 0.2s ease;
    backdrop-filter: blur(4px);
  `;
  
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    const el = document.getElementById('anonmitra-overlay');
    if (el) el.remove();
  }, 8000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}