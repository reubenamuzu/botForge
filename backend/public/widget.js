(function () {
  'use strict';

  var script = document.currentScript;
  var botId = script ? script.getAttribute('data-bot-id') : null;
  var apiBase = script ? script.src.replace(/\/widget\.js(\?.*)?$/, '') : '';

  if (!botId) {
    console.warn('[BotForge] Missing data-bot-id attribute on the widget script tag.');
    return;
  }

  // ── Session ──────────────────────────────────────────────────────────────
  var SESSION_KEY = 'bf_session_' + botId;
  var sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '.bf-bubble{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;',
    'background:#4f46e5;border:none;cursor:pointer;z-index:9999;display:flex;align-items:center;',
    'justify-content:center;box-shadow:0 4px 16px rgba(79,70,229,.4);',
    'transition:transform .2s,box-shadow .2s;}',
    '.bf-bubble:hover{transform:scale(1.08);box-shadow:0 6px 20px rgba(79,70,229,.5);}',
    '.bf-bubble svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:2;',
    'stroke-linecap:round;stroke-linejoin:round;}',

    '.bf-panel{position:fixed;bottom:92px;right:24px;width:360px;height:520px;',
    'background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);',
    'z-index:9999;display:flex;flex-direction:column;overflow:hidden;',
    'transition:opacity .2s,transform .2s;transform-origin:bottom right;}',
    '.bf-panel.bf-hidden{opacity:0;transform:scale(.92);pointer-events:none;}',

    '.bf-header{background:#4f46e5;color:#fff;padding:14px 16px;display:flex;',
    'align-items:center;gap:10px;flex-shrink:0;}',
    '.bf-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;flex-shrink:0;}',
    '.bf-bot-name{flex:1;font-size:15px;font-weight:600;',
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}",
    '.bf-close-btn{background:none;border:none;color:rgba(255,255,255,.75);cursor:pointer;',
    'padding:4px;display:flex;align-items:center;border-radius:4px;}',
    '.bf-close-btn:hover{color:#fff;}',
    '.bf-close-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;',
    'stroke-width:2;stroke-linecap:round;}',

    '.bf-messages{flex:1;overflow-y:auto;padding:16px;display:flex;',
    'flex-direction:column;gap:10px;}',
    '.bf-msg{max-width:80%;padding:10px 14px;border-radius:16px;font-size:14px;',
    "line-height:1.5;word-break:break-word;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}",
    '.bf-msg-bot{align-self:flex-start;background:#f3f4f6;color:#111827;border-bottom-left-radius:4px;}',
    '.bf-msg-user{align-self:flex-end;background:#4f46e5;color:#fff;border-bottom-right-radius:4px;}',

    '.bf-typing{align-self:flex-start;background:#f3f4f6;border-radius:16px;',
    'border-bottom-left-radius:4px;padding:12px 14px;display:flex;gap:4px;align-items:center;}',
    '.bf-typing span{width:7px;height:7px;background:#9ca3af;border-radius:50%;',
    'display:inline-block;animation:bf-bounce 1.1s infinite;}',
    '.bf-typing span:nth-child(2){animation-delay:.2s;}',
    '.bf-typing span:nth-child(3){animation-delay:.4s;}',
    '@keyframes bf-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}',

    '.bf-footer{border-top:1px solid #e5e7eb;padding:12px;display:flex;gap:8px;flex-shrink:0;}',
    '.bf-input{flex:1;border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;',
    "font-size:14px;outline:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;",
    'color:#111827;background:#fff;}',
    '.bf-input:focus{border-color:#4f46e5;box-shadow:0 0 0 2px rgba(79,70,229,.15);}',
    '.bf-send{width:36px;height:36px;background:#4f46e5;border:none;border-radius:8px;',
    'cursor:pointer;display:flex;align-items:center;justify-content:center;',
    'flex-shrink:0;transition:background .15s;}',
    '.bf-send:hover{background:#4338ca;}',
    '.bf-send:disabled{background:#c7d2fe;cursor:default;}',
    '.bf-send svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;',
    'stroke-linecap:round;stroke-linejoin:round;}',
    '.bf-offline{padding:14px 16px;font-size:13px;color:#6b7280;text-align:center;',
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;",
    'border-top:1px solid #e5e7eb;flex-shrink:0;}',
  ].join('');
  document.head.appendChild(styleEl);

  // ── Icons ─────────────────────────────────────────────────────────────────
  var ICON_CHAT = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  // ── DOM ───────────────────────────────────────────────────────────────────
  var bubble = document.createElement('button');
  bubble.className = 'bf-bubble';
  bubble.setAttribute('aria-label', 'Open chat');
  bubble.innerHTML = ICON_CHAT;

  var panel = document.createElement('div');
  panel.className = 'bf-panel bf-hidden';
  panel.innerHTML =
    '<div class="bf-header">' +
      '<span class="bf-dot"></span>' +
      '<span class="bf-bot-name">Loading\u2026</span>' +
      '<button class="bf-close-btn" aria-label="Close">' + ICON_CLOSE + '</button>' +
    '</div>' +
    '<div class="bf-messages"></div>';

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  var nameEl = panel.querySelector('.bf-bot-name');
  var msgsEl = panel.querySelector('.bf-messages');
  var closeBtn = panel.querySelector('.bf-close-btn');

  // ── Open / Close ──────────────────────────────────────────────────────────
  var isOpen = false;

  function openPanel() {
    isOpen = true;
    panel.classList.remove('bf-hidden');
    bubble.innerHTML = ICON_CLOSE;
  }

  function closePanel() {
    isOpen = false;
    panel.classList.add('bf-hidden');
    bubble.innerHTML = ICON_CHAT;
  }

  bubble.addEventListener('click', function () { isOpen ? closePanel() : openPanel(); });
  closeBtn.addEventListener('click', closePanel);

  // ── Messages ──────────────────────────────────────────────────────────────
  function appendMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'bf-msg ' + (role === 'bot' ? 'bf-msg-bot' : 'bf-msg-user');
    div.textContent = text;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'bf-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }

  // ── Footer (built after bot info loads) ───────────────────────────────────
  function buildFooter(isActive) {
    var existing = panel.querySelector('.bf-footer, .bf-offline');
    if (existing) existing.parentNode.removeChild(existing);

    if (!isActive) {
      var offline = document.createElement('div');
      offline.className = 'bf-offline';
      offline.textContent = 'This assistant is currently offline.';
      panel.appendChild(offline);
      return;
    }

    var footer = document.createElement('div');
    footer.className = 'bf-footer';
    footer.innerHTML =
      '<input class="bf-input" type="text" placeholder="Type a message\u2026" />' +
      '<button class="bf-send" aria-label="Send">' + ICON_SEND + '</button>';
    panel.appendChild(footer);

    var input = footer.querySelector('.bf-input');
    var sendBtn = footer.querySelector('.bf-send');
    var busy = false;

    function setLoading(v) {
      busy = v;
      input.disabled = v;
      sendBtn.disabled = v;
    }

    async function send() {
      var text = input.value.trim();
      if (!text || busy) return;
      input.value = '';
      appendMsg('user', text);
      setLoading(true);
      var typingEl = showTyping();
      try {
        var res = await fetch(apiBase + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botId: botId, sessionId: sessionId, message: text }),
        });
        var data = await res.json();
        typingEl.parentNode.removeChild(typingEl);
        appendMsg('bot', data.reply || 'Sorry, something went wrong.');
      } catch (_) {
        typingEl.parentNode.removeChild(typingEl);
        appendMsg('bot', 'Connection error. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  fetch(apiBase + '/api/bots/' + botId + '/public')
    .then(function (r) { return r.json(); })
    .then(function (bot) {
      nameEl.textContent = bot.name;
      buildFooter(bot.isActive);
      appendMsg('bot', bot.greeting);
    })
    .catch(function () {
      nameEl.textContent = 'Chat';
      buildFooter(false);
    });
})();
