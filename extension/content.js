/* ── AnonMitra Content Script ── */

let floatingBubble = null;
let selectionTimeout = null;
let currentDomain = window.location.hostname;

document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', handleTextSelection);

function handleTextSelection() {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectionTimeout) clearTimeout(selectionTimeout);
  removeFloatingBubble();
  
  if (selectedText.length > 10) {
    selectionTimeout = setTimeout(() => {
      showFloatingBubble(selectedText);
    }, 300);
  }
}

function showFloatingBubble(text) {
  removeFloatingBubble();
  
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  floatingBubble = document.createElement('div');
  floatingBubble.id = 'anonmitra-bubble';
  floatingBubble.innerHTML = `
    <div class="am-bubble-header">
      <span class="am-bubble-logo">🛡️</span>
      <span class="am-bubble-title">AnonMitra</span>
      <button class="am-bubble-close">✕</button>
    </div>
    <div class="am-bubble-content">
      <div class="am-bubble-text-preview">"${escapeHtml(text.substring(0, 80))}${text.length > 80 ? '...' : ''}"</div>
      <div class="am-bubble-actions">
        <button class="am-btn am-btn-detect">🤖 Detect AI</button>
        <button class="am-btn am-btn-identity">🪪 Quick Identity</button>
      </div>
      <div class="am-bubble-result hidden"></div>
    </div>
  `;
  
  floatingBubble.style.cssText = `
    position: fixed;
    top: ${Math.max(10, rect.bottom + window.scrollY + 8)}px;
    left: ${Math.min(window.innerWidth - 280, rect.left + window.scrollX)}px;
    z-index: 2147483647;
    background: #0d0a1a;
    border: 1px solid rgba(139, 92, 246, 0.4);
    border-radius: 12px;
    width: 280px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    backdrop-filter: blur(8px);
  `;
  
  if (!document.getElementById('anonmitra-styles')) {
    const style = document.createElement('style');
    style.id = 'anonmitra-styles';
    style.textContent = `
      @keyframes amFadeInUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes amSpin {
        to { transform: rotate(360deg); }
      }
      #anonmitra-bubble { animation: amFadeInUp 0.2s ease; }
      .am-bubble-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        background: rgba(139, 92, 246, 0.05);
        border-radius: 12px 12px 0 0;
      }
      .am-bubble-logo { font-size: 14px; }
      .am-bubble-title {
        flex: 1;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
        color: #2dd4bf;
      }
      .am-bubble-close {
        background: none;
        border: none;
        color: rgba(139, 92, 246, 0.5);
        cursor: pointer;
        font-size: 14px;
        padding: 2px 6px;
      }
      .am-bubble-close:hover { color: #f43f5e; }
      .am-bubble-content { padding: 12px; }
      .am-bubble-text-preview {
        font-size: 11px;
        color: #c4b5fd;
        background: rgba(139, 92, 246, 0.08);
        padding: 8px;
        border-radius: 6px;
        margin-bottom: 12px;
        border-left: 2px solid #8b5cf6;
      }
      .am-bubble-actions { display: flex; gap: 8px; margin-bottom: 12px; }
      .am-btn {
        flex: 1;
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 6px;
        padding: 8px;
        color: #ede9fe;
        font-family: monospace;
        font-size: 10px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .am-btn:hover {
        background: rgba(139, 92, 246, 0.25);
        border-color: #8b5cf6;
      }
      .am-bubble-result {
        margin-top: 10px;
        padding: 8px;
        border-radius: 6px;
        font-size: 10px;
        background: rgba(0,0,0,0.3);
      }
      .am-bubble-result.ai { border-left: 2px solid #f43f5e; color: #f43f5e; }
      .am-bubble-result.human { border-left: 2px solid #2dd4bf; color: #2dd4bf; }
      .am-bubble-result.error { border-left: 2px solid #f43f5e; color: #f43f5e; }
      .am-bubble-loading {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
      }
      .am-spinner {
        width: 12px;
        height: 12px;
        border: 2px solid rgba(139,92,246,0.2);
        border-top-color: #8b5cf6;
        border-radius: 50%;
        animation: amSpin 0.7s linear infinite;
      }
      .hidden { display: none !important; }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(floatingBubble);
  
  const closeBtn = floatingBubble.querySelector('.am-bubble-close');
  closeBtn.addEventListener('click', removeFloatingBubble);
  
  const detectBtn = floatingBubble.querySelector('.am-btn-detect');
  detectBtn.addEventListener('click', () => handleDetection(text, floatingBubble));
  
  const identityBtn = floatingBubble.querySelector('.am-btn-identity');
  identityBtn.addEventListener('click', () => handleQuickIdentity(text, floatingBubble));
  
  setTimeout(() => {
    document.addEventListener('click', function onClickOutside(e) {
      if (floatingBubble && !floatingBubble.contains(e.target)) {
        removeFloatingBubble();
        document.removeEventListener('click', onClickOutside);
      }
    });
  }, 100);
}

async function handleDetection(text, bubble) {
  const resultDiv = bubble.querySelector('.am-bubble-result');
  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = `<div class="am-bubble-loading"><div class="am-spinner"></div><span>Analyzing...</span></div>`;
  
  try {
    const response = await chrome.runtime.sendMessage({ type: 'DETECT_TEXT', text });
    
    if (response.error) throw new Error(response.error);
    
    const result = response.result || {};
    const isAI = (result.result || '').toLowerCase() === 'ai';
    const isMixed = (result.result || '').toLowerCase() === 'mixed';
    const confidence = result.confidence ? Math.round(result.confidence * 100) + '%' : '';
    
    resultDiv.className = `am-bubble-result ${result.result || 'mixed'}`;
    resultDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <strong>${isAI ? '🤖 AI' : isMixed ? '⚠️ Mixed' : '✍️ Human'}</strong>
        <span>${confidence}</span>
      </div>
      <div>${escapeHtml(result.explanation || 'Complete.')}</div>
    `;
  } catch (error) {
    resultDiv.className = 'am-bubble-result error';
    resultDiv.innerHTML = `⚠️ ${escapeHtml(error.message)}`;
  }
}

async function handleQuickIdentity(text, bubble) {
  const resultDiv = bubble.querySelector('.am-bubble-result');
  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = `<div class="am-bubble-loading"><div class="am-spinner"></div><span>Generating...</span></div>`;
  
  try {
    const response = await chrome.runtime.sendMessage({ 
      type: 'GENERATE_IDENTITY', 
      text,
      domain: currentDomain 
    });
    
    if (response.error) throw new Error(response.error);
    
    resultDiv.className = 'am-bubble-result human';
    resultDiv.innerHTML = `
      <div><strong style="color:#2dd4bf">✓ New Identity</strong></div>
      <div style="margin-top:6px"><span style="color:#8b5cf6">Username:</span> ${escapeHtml(response.identity.username)}</div>
      <div><span style="color:#8b5cf6">Email:</span> ${escapeHtml(response.identity.alias_email || response.identity.email)}</div>
      <button id="am-copy-result" style="margin-top:8px;width:100%;background:rgba(139,92,246,0.2);border:none;border-radius:4px;padding:4px;color:#2dd4bf;cursor:pointer;">📋 Copy</button>
    `;
    
    const copyBtn = resultDiv.querySelector('#am-copy-result');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(response.identity.username);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      };
    }
  } catch (error) {
    resultDiv.className = 'am-bubble-result error';
    resultDiv.innerHTML = `⚠️ ${escapeHtml(error.message)}`;
  }
}

function removeFloatingBubble() {
  if (floatingBubble) {
    floatingBubble.remove();
    floatingBubble = null;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}