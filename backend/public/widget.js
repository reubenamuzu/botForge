(function () {
  'use strict';

  var script = document.currentScript;
  var botId = script ? script.getAttribute('data-bot-id') : null;
  var apiBase = script ? script.src.replace(/\/widget\.js(\?.*)?$/, '') : '';

  if (!botId) {
    console.warn('[BotForge] Missing data-bot-id on the widget script tag.');
    return;
  }

  // ── Session ───────────────────────────────────────────────────────────────
  var SESSION_KEY = 'bf_session_' + botId;
  var LEAD_KEY    = 'bf_lead_'    + botId;

  var sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  // ── Colour helpers ────────────────────────────────────────────────────────
  function hexToRgb(hex) {
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  }
  function darken(hex, amt) {
    return 'rgb('+hexToRgb(hex).map(function(v){return Math.max(0,v-amt);}).join(',')+')';
  }
  function rgba(hex, a) {
    var c = hexToRgb(hex); return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';
  }

  // ── Icons ─────────────────────────────────────────────────────────────────
  var ICON_CHAT  = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var ICON_SEND  = '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  fetch(apiBase + '/api/bots/' + botId + '/public')
    .then(function(r){ return r.json(); })
    .then(function(bot){ init(bot); })
    .catch(function(){
      init({ name:'Chat', greeting:'', isActive:false,
             widgetColor:'#4f46e5', widgetPosition:'bottom-right', leadCapture:false });
    });

  function init(bot) {
    var color = (/^#[0-9a-fA-F]{6}$/.test(bot.widgetColor||'')) ? bot.widgetColor : '#4f46e5';
    var pos   = bot.widgetPosition === 'bottom-left' ? 'left' : 'right';
    var cd    = darken(color, 20);
    var cs    = rgba(color, 0.4);
    var csh   = rgba(color, 0.5);
    var cf    = rgba(color, 0.15);

    // ── Styles ────────────────────────────────────────────────────────────────
    var styleEl = document.createElement('style');
    styleEl.textContent = [
      '.bf-bubble{position:fixed;bottom:24px;'+pos+':24px;width:56px;height:56px;border-radius:50%;',
      'background:'+color+';border:none;cursor:pointer;z-index:9999;display:flex;align-items:center;',
      'justify-content:center;box-shadow:0 4px 16px '+cs+';transition:transform .2s,box-shadow .2s;}',
      '.bf-bubble:hover{transform:scale(1.08);box-shadow:0 6px 20px '+csh+';}',
      '.bf-bubble svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',

      '.bf-panel{position:fixed;bottom:92px;'+pos+':24px;width:360px;height:min(520px,calc(100vh - 120px));',
      'background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);',
      'z-index:9999;display:flex;flex-direction:column;overflow:hidden;',
      'transition:opacity .2s,transform .2s;transform-origin:bottom '+pos+';}',
      '.bf-panel.bf-hidden{opacity:0;transform:scale(.92);pointer-events:none;}',

      '.bf-header{background:'+color+';color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}',
      '.bf-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;flex-shrink:0;}',
      '.bf-bot-name{flex:1;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
      '.bf-close-btn{background:none;border:none;color:rgba(255,255,255,.75);cursor:pointer;padding:4px;display:flex;align-items:center;border-radius:4px;}',
      '.bf-close-btn:hover{color:#fff;}',
      '.bf-close-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;}',

      '.bf-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}',
      '.bf-msg{max-width:80%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;word-break:break-word;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
      '.bf-msg-bot{align-self:flex-start;background:#f3f4f6;color:#111827;border-bottom-left-radius:4px;}',
      '.bf-msg-user{align-self:flex-end;background:'+color+';color:#fff;border-bottom-right-radius:4px;}',

      '.bf-typing{align-self:flex-start;background:#f3f4f6;border-radius:16px;border-bottom-left-radius:4px;padding:12px 14px;display:flex;gap:4px;align-items:center;}',
      '.bf-typing span{width:7px;height:7px;background:#9ca3af;border-radius:50%;display:inline-block;animation:bf-bounce 1.1s infinite;}',
      '.bf-typing span:nth-child(2){animation-delay:.2s;}.bf-typing span:nth-child(3){animation-delay:.4s;}',
      '@keyframes bf-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}',

      '.bf-footer{border-top:1px solid #e5e7eb;padding:12px;display:flex;gap:8px;flex-shrink:0;}',
      '.bf-input{flex:1;border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;font-size:14px;outline:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111827;background:#fff;}',
      '.bf-input:focus{border-color:'+color+';box-shadow:0 0 0 2px '+cf+';}',
      '.bf-send{width:36px;height:36px;background:'+color+';border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s;}',
      '.bf-send:hover{background:'+cd+';}',
      '.bf-send:disabled{opacity:.5;cursor:default;}',
      '.bf-send svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
      '.bf-offline{padding:14px 16px;font-size:13px;color:#6b7280;text-align:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;border-top:1px solid #e5e7eb;flex-shrink:0;}',

      // Lead capture
      '.bf-lead{flex:1;display:flex;flex-direction:column;justify-content:center;padding:24px 20px;}',
      '.bf-lead-title{font-size:15px;font-weight:600;color:#111827;margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
      '.bf-lead-sub{font-size:13px;color:#6b7280;margin:0 0 18px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
      '.bf-lead-field{border:1px solid #d1d5db;border-radius:8px;padding:9px 12px;font-size:14px;outline:none;',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111827;width:100%;',
      'box-sizing:border-box;margin-bottom:10px;}',
      '.bf-lead-field:focus{border-color:'+color+';box-shadow:0 0 0 2px '+cf+';}',
      '.bf-lead-field.bf-err{border-color:#ef4444;}',
      '.bf-lead-submit{width:100%;padding:10px;background:'+color+';color:#fff;border:none;border-radius:8px;',
      'font-size:14px;font-weight:600;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transition:background .15s;}',
      '.bf-lead-submit:hover{background:'+cd+';}',
      '.bf-lead-submit:disabled{opacity:.6;cursor:default;}',
      '.bf-lead-skip{background:none;border:none;color:#9ca3af;font-size:12px;cursor:pointer;',
      'margin-top:10px;text-align:center;width:100%;padding:4px;display:block;',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}',
      '.bf-lead-skip:hover{color:#6b7280;}',
    ].join('');
    document.head.appendChild(styleEl);

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
        '<span class="bf-bot-name">'+escHtml(bot.name||'Chat')+'</span>' +
        '<button class="bf-close-btn" aria-label="Close">'+ICON_CLOSE+'</button>' +
      '</div>';
    document.body.appendChild(bubble);
    document.body.appendChild(panel);

    var closeBtn = panel.querySelector('.bf-close-btn');
    var isOpen = false;

    function openPanel()  { isOpen=true;  panel.classList.remove('bf-hidden'); bubble.innerHTML=ICON_CLOSE; }
    function closePanelFn() { isOpen=false; panel.classList.add('bf-hidden');    bubble.innerHTML=ICON_CHAT; }

    bubble.addEventListener('click', function(){ isOpen ? closePanelFn() : openPanel(); });
    closeBtn.addEventListener('click', closePanelFn);

    // ── Lead capture decision ─────────────────────────────────────────────────
    var storedLead = null;
    try { storedLead = JSON.parse(sessionStorage.getItem(LEAD_KEY)||'null'); } catch(_){}

    if (bot.leadCapture && storedLead === null) {
      buildLeadForm();
    } else {
      buildChat(storedLead || {});
    }

    // ── Powered-by footer ─────────────────────────────────────────────────────
    if (!bot.whiteLabel) {
      var poweredBy = document.createElement('div');
      poweredBy.style.cssText = 'padding:6px 16px;font-size:11px;color:#9ca3af;text-align:center;' +
        'border-top:1px solid #e5e7eb;flex-shrink:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;';
      poweredBy.textContent = 'Powered by BotForge';
      panel.appendChild(poweredBy);
    }

    // ── Lead form ─────────────────────────────────────────────────────────────
    function buildLeadForm() {
      var form = document.createElement('div');
      form.className = 'bf-lead';
      form.innerHTML =
        '<p class="bf-lead-title">Before we start\u2026</p>' +
        '<p class="bf-lead-sub">Please introduce yourself so we can help you better.</p>' +
        '<input class="bf-lead-field" type="text"  placeholder="Your name (optional)" />' +
        '<input class="bf-lead-field" type="email" placeholder="Your email address *" />' +
        '<button class="bf-lead-submit">Start chatting</button>' +
        '<button class="bf-lead-skip">Skip</button>';
      panel.appendChild(form);

      var nameField  = form.querySelectorAll('.bf-lead-field')[0];
      var emailField = form.querySelectorAll('.bf-lead-field')[1];
      var submitBtn  = form.querySelector('.bf-lead-submit');
      var skipBtn    = form.querySelector('.bf-lead-skip');

      submitBtn.addEventListener('click', function() {
        var n = nameField.value.trim();
        var e = emailField.value.trim();
        emailField.classList.remove('bf-err');
        if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
          emailField.classList.add('bf-err');
          emailField.focus();
          return;
        }
        var lead = { leadName: n||null, leadEmail: e };
        try { sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead)); } catch(_){}
        panel.removeChild(form);
        buildChat(lead);
      });

      skipBtn.addEventListener('click', function() {
        try { sessionStorage.setItem(LEAD_KEY, JSON.stringify({})); } catch(_){}
        panel.removeChild(form);
        buildChat({});
      });
    }

    // ── Chat view ─────────────────────────────────────────────────────────────
    function buildChat(lead) {
      var msgsDiv = document.createElement('div');
      msgsDiv.className = 'bf-messages';
      panel.appendChild(msgsDiv);

      function appendMsg(role, text) {
        var div = document.createElement('div');
        div.className = 'bf-msg '+(role==='bot'?'bf-msg-bot':'bf-msg-user');
        div.textContent = text;
        msgsDiv.appendChild(div);
        msgsDiv.scrollTop = msgsDiv.scrollHeight;
      }

      function showTyping() {
        var el = document.createElement('div');
        el.className = 'bf-typing';
        el.innerHTML = '<span></span><span></span><span></span>'; // static only — never inject dynamic data here
        msgsDiv.appendChild(el);
        msgsDiv.scrollTop = msgsDiv.scrollHeight;
        return el;
      }

      if (bot.greeting) appendMsg('bot', bot.greeting);

      if (!bot.isActive) {
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
        '<button class="bf-send" aria-label="Send">'+ICON_SEND+'</button>';
      panel.appendChild(footer);

      var input   = footer.querySelector('.bf-input');
      var sendBtn = footer.querySelector('.bf-send');
      var busy    = false;
      var firstMsg = true;

      function setLoading(v){ busy=v; input.disabled=v; sendBtn.disabled=v; }

      async function send() {
        var text = input.value.trim();
        if (!text||busy) return;
        input.value = '';
        appendMsg('user', text);
        setLoading(true);
        var typingEl = showTyping();
        try {
          var payload = { botId:botId, sessionId:sessionId, message:text };
          if (firstMsg) {
            if (lead.leadName)  payload.leadName  = lead.leadName;
            if (lead.leadEmail) payload.leadEmail = lead.leadEmail;
            firstMsg = false;
          }
          var res  = await fetch(apiBase+'/api/chat', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify(payload),
          });
          var data = await res.json();
          typingEl.parentNode.removeChild(typingEl);
          appendMsg('bot', data.reply||'Sorry, something went wrong.');
        } catch(_) {
          typingEl.parentNode.removeChild(typingEl);
          appendMsg('bot', 'Connection error. Please try again.');
        } finally { setLoading(false); }
      }

      sendBtn.addEventListener('click', send);
      input.addEventListener('keydown', function(e){
        if (e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); }
      });
      setTimeout(function(){ input.focus(); }, 120);
    }
  }
})();
