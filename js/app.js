/* ============================================================
   AOCA — Plataforma (app.html)
   Fase 2: guardia de sesión, saludo y navegación de materias.
   Fase 3: chat, transición de estado, Modo Demo y barra de acciones.
   Fase 4: interruptor de modo + IA en vivo (proxy /api/chat).
   La accesibilidad (voz, lectura, lectura fácil) llega en la Fase 5.
   ============================================================ */
(function () {
  'use strict';

  var DEMO = window.AOCA_DEMO || { SCRIPTS: {}, CLOSING: '', EXHAUSTED: '', ERROR_MSG: '', GENERIC: [] };
  var HINT_TOTAL = 3;
  var TYPING_MS = 900;   // ~900 ms de "escritura" para que se sienta real
  var HINT_MS = 700;

  // ---- Catálogo de materias y temas (mismo orden que references/) ----
  var META = {
    mate: [
      { id: 'lineales',    label: 'Ecuaciones de primer grado' },
      { id: 'cuadraticas', label: 'Ecuaciones de segundo grado' },
      { id: 'pitagoras',   label: 'Teorema de Pitágoras' },
      { id: 'fracciones',  label: 'Fracciones' }
    ],
    historia: [
      { id: 'caral',         label: 'Caral' },
      { id: 'chavin',        label: 'Chavín de Huántar' },
      { id: 'mita',          label: 'La mita colonial' },
      { id: 'independencia', label: 'La Independencia' }
    ],
    ciencia: [
      { id: 'fotosintesis', label: 'Fotosíntesis' },
      { id: 'celula',       label: 'La célula' },
      { id: 'digestivo',    label: 'Sistema digestivo' },
      { id: 'cadenas',      label: 'Cadenas alimenticias' }
    ],
    comunicacion: [
      { id: 'sujeto',     label: 'Sujeto y predicado' },
      { id: 'tildacion',  label: 'Tildación' },
      { id: 'conectores', label: 'Conectores lógicos' },
      { id: 'clases',     label: 'Clases de palabras' }
    ]
  };
  var SUBJECT_NAMES = { mate: 'Matemáticas', historia: 'Historia del Perú', ciencia: 'Ciencia y Tecnología', comunicacion: 'Comunicación' };
  var TOPIC_SUBJECT = {};
  Object.keys(META).forEach(function (k) { META[k].forEach(function (t) { TOPIC_SUBJECT[t.id] = k; }); });
  function topicLabelOf(id) {
    var k = TOPIC_SUBJECT[id]; if (!k) return '';
    var t = META[k].filter(function (x) { return x.id === id; })[0];
    return t ? t.label : '';
  }

  // ---- Guardia de sesión (menores de edad: solo el nombre, solo en sessionStorage) ----
  var nombreCompleto = '';
  try { nombreCompleto = (sessionStorage.getItem('aoca_nombre') || '').trim(); } catch (e) {}
  if (!nombreCompleto) { window.location.replace('login.html'); return; }
  var primerNombre = nombreCompleto.split(/\s+/)[0];

  // ---- Estado ----
  var state = {
    modo: 'demo',            // 'demo' | 'live'
    subjectKey: 'mate',
    started: false,
    topicId: null,
    topicLabel: '',
    messages: [],            // { from:'aoca'|'student', text, eq, isError? }
    typing: false,
    studentSentOnce: false,
    hintsLeft: HINT_TOTAL,
    stepIndex: 0,
    answeredCorrect: false,
    genericIndex: 0,
    progress: 0,
    // Accesibilidad
    a11yOpen: false,
    readAloud: false,
    voiceInput: false,   // se ajusta a sttSupported en el arranque
    easyRead: false,
    reduceMotion: false,
    listening: false
  };

  // ---- Referencias al DOM ----
  var $ = function (id) { return document.getElementById(id); };
  var els = {
    userName:    $('user-name'),
    welcomeName: $('welcome-name'),
    subjectName: $('subject-name'),
    chips:       $('chips'),
    subjectNav:  $('subject-nav'),
    btnSalir:    $('btn-salir'),

    menuBtn:     $('menu-btn'),
    sidebar:     $('sidebar'),
    sidebarScrim:$('sidebar-scrim'),

    welcome:     $('welcome'),
    thread:      $('thread'),
    threadMsgs:  $('thread-messages'),
    topicLabel:  $('topic-label'),
    topicSubject:$('topic-subject'),

    actionButtons: $('action-buttons'),
    btnAnswer:   $('btn-answer'),
    btnHint:     $('btn-hint'),
    hintCount:   $('hint-count'),
    btnNoEntendi:$('btn-noentendi'),
    btnReset:    $('btn-reset'),

    input:       $('composer-input'),
    sendBtn:     $('send-btn'),

    modeSwitch:  $('mode-switch'),
    progressFill:$('progress-fill'),
    progressValue:$('progress-value'),

    a11yBtn:     $('a11y-btn'),
    a11yPanel:   $('a11y-panel'),
    a11yToggles: $('a11y-toggles'),
    micBtn:      $('mic-btn'),
    listeningNote: $('listening-note')
  };
  var progressBar = els.progressFill ? els.progressFill.parentElement : null;
  var typingEl = null;

  // ---- Detección de soporte de voz ----
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var sttSupported = !!SR;
  var ttsSupported = ('speechSynthesis' in window);
  var recog = null;
  var speaking = { btn: null };

  // ---- Saludo ----
  if (els.userName)    els.userName.textContent = nombreCompleto;
  if (els.welcomeName) els.welcomeName.textContent = primerNombre;

  // ============================================================
  //  Utilidades de render
  // ============================================================
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function scrollThread() {
    if (els.thread) els.thread.scrollTop = els.thread.scrollHeight;
  }

  function buildBubble(m) {
    var cls = 'bubble ' + (m.from === 'aoca' ? 'bubble--aoca' : 'bubble--student');
    if (m.isError) cls += ' bubble--error';
    var bubble = el('div', cls);
    var span = el('span', 'aoca-readable aoca-bubbletext', m.text);
    bubble.appendChild(span);
    if (m.eq) bubble.appendChild(el('span', 'eq', m.eq));
    return bubble;
  }

  function renderMessage(m) {
    var row = el('div', 'msg-row');
    if (m.from === 'aoca') {
      var avatar = el('span', 'avatar');
      var img = document.createElement('img');
      img.src = 'assets/02-isotipo-bicolor.svg';
      img.alt = ''; img.setAttribute('aria-hidden', 'true');
      avatar.appendChild(img);
      row.appendChild(avatar);
      var wrap = el('div'); wrap.style.flex = '1'; wrap.style.minWidth = '0';
      wrap.appendChild(buildBubble(m));
      row.appendChild(wrap);
      // Botón "leer en voz alta" — uno por burbuja de AOCA.
      if (ttsSupported) {
        var sbtn = el('button', 'speak-btn'); sbtn.type = 'button';
        sbtn.setAttribute('aria-label', 'Leer en voz alta');
        sbtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M18.5 6a9 9 0 0 1 0 12"></path></svg>';
        (function (msg, button) { button.addEventListener('click', function () { speak(button, msg); }); })(m, sbtn);
        row.appendChild(sbtn);
      }
    } else {
      var w = el('div'); w.style.flex = '1'; w.style.minWidth = '0';
      w.appendChild(buildBubble(m));
      row.appendChild(w);
    }
    els.threadMsgs.appendChild(row);
    scrollThread();
  }

  function setTyping(on) {
    state.typing = on;
    if (on) {
      if (typingEl) return;
      typingEl = el('div', 'msg-row');
      var avatar = el('span', 'avatar');
      var img = document.createElement('img');
      img.src = 'assets/02-isotipo-bicolor.svg'; img.alt = ''; img.setAttribute('aria-hidden', 'true');
      avatar.appendChild(img);
      var t = el('div', 'typing');
      t.setAttribute('aria-label', 'AOCA está escribiendo');
      t.appendChild(el('span')); t.appendChild(el('span')); t.appendChild(el('span'));
      typingEl.appendChild(avatar); typingEl.appendChild(t);
      els.threadMsgs.appendChild(typingEl);
      scrollThread();
    } else if (typingEl) {
      typingEl.parentNode && typingEl.parentNode.removeChild(typingEl);
      typingEl = null;
    }
  }

  // ---- Mensajes al hilo ----
  function pushMsg(m) { state.messages.push(m); renderMessage(m); }
  function pushStudent(text) { pushMsg({ from: 'student', text: text, eq: '' }); }
  function pushAoca(text, eq) { pushMsg({ from: 'aoca', text: text, eq: eq || '' }); }

  // ============================================================
  //  Estado inicial vs. conversación
  // ============================================================
  function updateStartedUI() {
    if (els.welcome) els.welcome.hidden = state.started;
    if (els.thread) els.thread.hidden = !state.started;
    if (els.actionButtons) els.actionButtons.hidden = !state.started;
    if (state.started) {
      if (els.topicLabel) els.topicLabel.textContent = state.topicLabel;
      if (els.topicSubject) els.topicSubject.textContent = SUBJECT_NAMES[state.subjectKey] || '';
    }
  }

  function clearThread() {
    if (els.threadMsgs) els.threadMsgs.innerHTML = '';
    typingEl = null;
  }

  // ---- Barra de acciones ----
  function updateActionBar() {
    if (els.hintCount) els.hintCount.textContent = state.hintsLeft + ' de ' + HINT_TOTAL;
    if (els.btnHint) {
      var blocked = !state.studentSentOnce || state.hintsLeft <= 0;
      els.btnHint.disabled = blocked;
      els.btnHint.title = !state.studentSentOnce
        ? 'Escribe primero lo que se te ocurra, aunque no estés seguro.'
        : 'Una pista te acerca un paso, no te da la respuesta.';
    }
    var empty = !((els.input && els.input.value || '').trim());
    if (els.btnAnswer) els.btnAnswer.disabled = empty;
    if (els.sendBtn) els.sendBtn.disabled = empty;
  }

  // ---- Progreso: SOLO sube cuando el alumno llega solo a lo correcto ----
  function updateProgress() {
    var p = Math.round(state.progress);
    if (els.progressFill) els.progressFill.style.width = p + '%';
    if (els.progressValue) els.progressValue.textContent = p + '%';
    if (progressBar) progressBar.setAttribute('aria-valuenow', String(p));
  }
  function bumpProgress() {
    state.answeredCorrect = true;
    state.progress = Math.min(100, state.progress + 14);
    updateProgress();
  }

  // ============================================================
  //  Chips y materias (estado inicial)
  // ============================================================
  function renderChips() {
    var temas = META[state.subjectKey] || [];
    if (els.subjectName) els.subjectName.textContent = SUBJECT_NAMES[state.subjectKey] || '';
    if (!els.chips) return;
    els.chips.innerHTML = '';
    temas.forEach(function (t) {
      var btn = el('button', 'chip'); btn.type = 'button';
      btn.setAttribute('data-topic', t.id);
      btn.appendChild(el('span', 'aoca-readable', t.label));
      els.chips.appendChild(btn);
    });
  }

  function selectSubject(key) {
    if (!META[key]) return;
    state.subjectKey = key;
    if (els.subjectNav) {
      Array.prototype.forEach.call(els.subjectNav.querySelectorAll('.subject-row'), function (row) {
        row.classList.toggle('is-selected', row.getAttribute('data-subject') === key);
      });
    }
    renderChips();
  }

  // ============================================================
  //  Arranque / fin de conversación
  // ============================================================
  function startTopic(topicId) {
    var subjectKey = TOPIC_SUBJECT[topicId] || state.subjectKey;
    selectSubject(subjectKey);
    var sc = DEMO.SCRIPTS[topicId];
    state.topicId = topicId;
    state.topicLabel = topicLabelOf(topicId);
    state.started = true;
    state.messages = [];
    state.studentSentOnce = false;
    state.hintsLeft = HINT_TOTAL;
    state.stepIndex = 0;
    state.answeredCorrect = false;
    state.genericIndex = 0;
    clearThread();
    updateStartedUI();
    updateActionBar();
    setTyping(false);
    // AOCA abre con el contexto del tema (en Modo Demo). En IA en vivo,
    // el guion también sirve como apertura consistente.
    if (sc) pushAoca(sc.text, sc.eq || '');
  }

  // Consulta libre: el alumno escribe sin elegir un tema con guion.
  function beginFree() {
    state.topicId = null;
    state.topicLabel = 'Consulta libre';
    state.started = true;
    state.messages = [];
    state.studentSentOnce = false;
    state.hintsLeft = HINT_TOTAL;
    state.stepIndex = 0;
    state.answeredCorrect = false;
    state.genericIndex = 0;
    clearThread();
    updateStartedUI();
    updateActionBar();
  }

  function exitToWelcome() {
    state.started = false;
    state.topicId = null;
    state.topicLabel = '';
    state.messages = [];
    setTyping(false);
    clearThread();
    updateStartedUI();
  }

  // "Salir": cierra sesión (borra el nombre) y vuelve al login.
  function salir() {
    try { if (ttsSupported) window.speechSynthesis.cancel(); } catch (e) {}
    try { if (recog) recog.stop(); } catch (e) {}
    try { sessionStorage.removeItem('aoca_nombre'); } catch (e) {}
    window.location.href = 'login.html';
  }

  // "Empecemos de nuevo": reinicia la conversación (pistas y turnos).
  // El progreso acumulado del alumno NO se borra (mide lo que ya construyó).
  function resetConversation() {
    if (state.topicId) startTopic(state.topicId);
    else beginFree();
  }

  // ============================================================
  //  Enviar / responder
  // ============================================================
  function doSend() {
    var text = (els.input && els.input.value || '').trim();
    if (!text) return;
    if (!state.started) beginFree();
    pushStudent(text);
    els.input.value = '';
    state.studentSentOnce = true;
    updateActionBar();
    setTyping(true);
    if (state.modo === 'live') { later(function () { callLive(null, false); }, 260); }
    else { later(demoReply, TYPING_MS); }
  }

  function demoReply() {
    setTyping(false);
    var sc = DEMO.SCRIPTS[state.topicId];
    if (!sc) {
      var g = DEMO.GENERIC[Math.min(state.genericIndex, DEMO.GENERIC.length - 1)];
      state.genericIndex++;
      pushAoca(g, '');
      return;
    }
    var idx = state.stepIndex, reply, isCorrect = false;
    if (idx < sc.replies.length) {
      reply = sc.replies[idx];
      if (idx === sc.replies.length - 1 && !state.answeredCorrect) isCorrect = true;
      state.stepIndex++;
    } else {
      reply = DEMO.CLOSING;
    }
    pushAoca(reply, '');
    if (isCorrect) bumpProgress();
  }

  // ---- Pistas: 3 por conversación, se habilitan tras el 1er mensaje ----
  function hint() {
    if (!state.studentSentOnce || state.hintsLeft <= 0) return;
    var used = HINT_TOTAL - state.hintsLeft;
    state.hintsLeft -= 1;
    updateActionBar();
    if (state.modo === 'live') {
      setTyping(true);
      later(function () {
        callLive('El alumno te pide una pista. Dale UNA sola pista pequeña que lo acerque un paso, sin resolver ni revelar la respuesta.', true);
      }, 260);
      return;
    }
    setTyping(true);
    later(function () {
      setTyping(false);
      var sc = DEMO.SCRIPTS[state.topicId];
      var h = sc ? sc.hints[Math.min(used, sc.hints.length - 1)] : DEMO.GENERIC[0];
      pushAoca(h, '');
      // Al llegar a cero, el botón queda deshabilitado y AOCA lo dice.
      if (state.hintsLeft === 0) {
        later(function () {
          setTyping(true);
          later(function () { setTyping(false); pushAoca(DEMO.EXHAUSTED, ''); }, 500);
        }, 450);
      }
    }, HINT_MS);
  }

  // "No entendí la pregunta": reformula SIN acercar a la respuesta.
  function noEntendi() {
    if (!state.started) return;
    if (state.modo === 'live') {
      setTyping(true);
      later(function () {
        callLive('El alumno no entendió la pregunta. Reformula el planteamiento con otras palabras para que se entienda mejor, sin acercarlo a la respuesta ni resolver.', false);
      }, 260);
      return;
    }
    var sc = DEMO.SCRIPTS[state.topicId];
    if (!sc) return;
    setTyping(true);
    later(function () { setTyping(false); pushAoca(sc.reformulate, ''); }, HINT_MS);
  }

  // ============================================================
  //  IA en vivo — proxy a /api/chat (el endpoint se crea en la Fase 4).
  //  Hasta entonces, sin servidor la llamada falla con gracia:
  //  muestra el aviso en el chat y la plataforma sigue usable.
  // ============================================================
  function callLive(metaUser, restoreHintOnError) {
    var convo = state.messages
      .filter(function (m) { return !m.isError; })
      .map(function (m) { return { role: m.from === 'student' ? 'user' : 'assistant', content: m.eq ? (m.text + ' ' + m.eq) : m.text }; });
    if (metaUser) convo.push({ role: 'user', content: metaUser });

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: convo, materia: SUBJECT_NAMES[state.subjectKey] || '', tema: state.topicLabel })
    }).then(function (r) {
      if (!r.ok) throw new Error('http');
      return r.json();
    }).then(function (data) {
      var text = (data && data.texto || '').trim();
      var correct = false;
      if (text.indexOf('[[OK]]') !== -1) { correct = true; text = text.replace(/\[\[OK\]\]/g, '').trim(); }
      if (!text) text = 'Cuéntame un poco más de lo que estás pensando para poder ayudarte a seguir.';
      setTyping(false);
      pushAoca(text, '');
      if (correct) bumpProgress();
    }).catch(function () {
      setTyping(false);
      if (restoreHintOnError) { state.hintsLeft += 1; updateActionBar(); }
      pushMsg({ from: 'aoca', text: DEMO.ERROR_MSG, eq: '', isError: true });
    });
  }

  // ---- Interruptor de modo (sin recargar) ----
  function setMode(m) {
    if (m !== 'demo' && m !== 'live') return;
    state.modo = m;
    if (els.modeSwitch) {
      Array.prototype.forEach.call(els.modeSwitch.querySelectorAll('button'), function (b) {
        var on = b.getAttribute('data-mode') === m;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
  }

  // ---- pequeño helper de temporización ----
  var _timers = [];
  function later(fn, ms) { _timers.push(setTimeout(fn, ms)); }

  // ============================================================
  //  Accesibilidad
  // ============================================================

  // ---- Lectura en voz alta (una burbuja a la vez) ----
  function normalizeProse(s) {
    return (s || '')
      .replace(/²/g, ' al cuadrado').replace(/³/g, ' al cubo')
      .replace(/\s=\s/g, ' igual a ').replace(/\s\+\s/g, ' más ').replace(/−/g, ' menos ');
  }
  // Las matemáticas se leen en palabras: "3x + 5 = 20" → "tres equis más cinco igual a veinte"
  function eqToWords(eq) {
    var s = eq || '';
    s = s.replace(/²/g, ' al cuadrado ').replace(/³/g, ' al cubo ').replace(/\^2/g, ' al cuadrado ').replace(/\^3/g, ' al cubo ');
    s = s.replace(/[xX]/g, ' equis ').replace(/\+/g, ' más ').replace(/[−-]/g, ' menos ')
         .replace(/[*·×]/g, ' por ').replace(/\//g, ' entre ').replace(/=/g, ' igual a ').replace(/[()]/g, ' ');
    return s.replace(/\s+/g, ' ').trim();
  }
  function spokenText(m) { var t = normalizeProse(m.text); if (m.eq) t += '. ' + eqToWords(m.eq); return t; }

  function clearSpeaking() {
    if (speaking.btn) { speaking.btn.classList.remove('is-speaking'); speaking.btn.setAttribute('aria-label', 'Leer en voz alta'); }
    speaking.btn = null;
  }
  function speak(btn, m) {
    if (!ttsSupported) return;
    var synth = window.speechSynthesis;
    if (speaking.btn === btn) { try { synth.cancel(); } catch (e) {} clearSpeaking(); return; }
    try { synth.cancel(); } catch (e) {}
    clearSpeaking();
    var u = new SpeechSynthesisUtterance(spokenText(m));
    u.lang = 'es-ES'; u.rate = 0.98;
    try { var v = synth.getVoices().filter(function (x) { return /^es/i.test(x.lang); })[0]; if (v) u.voice = v; } catch (e) {}
    u.onend = function () { if (speaking.btn === btn) clearSpeaking(); };
    u.onerror = function () { if (speaking.btn === btn) clearSpeaking(); };
    speaking.btn = btn; btn.classList.add('is-speaking'); btn.setAttribute('aria-label', 'Detener lectura');
    try { synth.speak(u); } catch (e) { clearSpeaking(); }
  }

  // ---- Responder hablando (dictado editable, nunca autoenvío) ----
  function stopMicUI() {
    state.listening = false;
    if (els.micBtn) { els.micBtn.classList.remove('is-listening'); els.micBtn.setAttribute('aria-label', 'Responder hablando'); }
    if (els.listeningNote) els.listeningNote.hidden = true;
  }
  function toggleMic() {
    if (!sttSupported) return;
    if (state.listening) { try { if (recog) recog.stop(); } catch (e) {} return; }
    recog = new SR();
    recog.lang = 'es-ES'; recog.interimResults = true; recog.continuous = false; recog.maxAlternatives = 1;
    recog.onresult = function (e) {
      var t = ''; for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      if (els.input) { els.input.value = t; }   // el alumno lo revisa y decide enviarlo
      updateActionBar();
    };
    recog.onend = stopMicUI;
    recog.onerror = stopMicUI;
    state.listening = true;
    if (els.micBtn) { els.micBtn.classList.add('is-listening'); els.micBtn.setAttribute('aria-label', 'Detener dictado'); }
    if (els.listeningNote) els.listeningNote.hidden = false;
    try { recog.start(); } catch (e) { stopMicUI(); }
  }
  function updateMicVisibility() {
    if (els.micBtn) els.micBtn.hidden = !(sttSupported && state.voiceInput);
  }

  // ---- Interruptores del panel ----
  function setToggle(key, on) {
    state[key] = on;
    var btn = els.a11yToggles && els.a11yToggles.querySelector('[data-toggle="' + key + '"]');
    if (btn) btn.setAttribute('aria-checked', on ? 'true' : 'false');
    if (key === 'easyRead') {
      document.documentElement.setAttribute('data-easyread', on ? 'true' : 'false');
    } else if (key === 'reduceMotion') {
      document.documentElement.setAttribute('data-reduce-motion', on ? 'true' : 'false');
    } else if (key === 'readAloud') {
      document.documentElement.setAttribute('data-readaloud', on ? 'true' : 'false');
      if (!on && ttsSupported) { try { window.speechSynthesis.cancel(); } catch (e) {} clearSpeaking(); }
    } else if (key === 'voiceInput') {
      updateMicVisibility();
      if (!on && state.listening) { try { if (recog) recog.stop(); } catch (e) {} }
    }
  }

  function setA11yOpen(open) {
    state.a11yOpen = open;
    if (els.a11yPanel) els.a11yPanel.hidden = !open;
    if (els.a11yBtn) els.a11yBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // ============================================================
  //  Eventos
  // ============================================================
  // ---- Menú lateral en mobile (drawer) ----
  function setMenuOpen(open) {
    if (!els.sidebar) return;
    els.sidebar.classList.toggle('is-open', open);
    if (els.sidebarScrim) els.sidebarScrim.classList.toggle('is-open', open);
    if (els.menuBtn) els.menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (els.menuBtn) els.menuBtn.addEventListener('click', function () {
    setMenuOpen(!els.sidebar.classList.contains('is-open'));
  });
  if (els.sidebarScrim) els.sidebarScrim.addEventListener('click', function () { setMenuOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && els.sidebar && els.sidebar.classList.contains('is-open')) setMenuOpen(false);
  });

  if (els.subjectNav) {
    els.subjectNav.addEventListener('click', function (e) {
      var row = e.target.closest('.subject-row');
      if (!row || row.disabled) return;
      var key = row.getAttribute('data-subject');
      // Elegir una materia regresa al panel de temas con los chips de esa materia.
      if (key) { selectSubject(key); exitToWelcome(); setMenuOpen(false); }
    });
  }
  if (els.chips) {
    els.chips.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      var topic = btn.getAttribute('data-topic');
      if (topic) startTopic(topic);
    });
  }
  if (els.input) {
    els.input.addEventListener('input', updateActionBar);
    els.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
    });
  }
  if (els.sendBtn)   els.sendBtn.addEventListener('click', doSend);
  if (els.btnAnswer) els.btnAnswer.addEventListener('click', doSend);
  if (els.btnHint)   els.btnHint.addEventListener('click', hint);
  if (els.btnNoEntendi) els.btnNoEntendi.addEventListener('click', noEntendi);
  if (els.btnReset)  els.btnReset.addEventListener('click', resetConversation);
  if (els.btnSalir)  els.btnSalir.addEventListener('click', salir);
  if (els.modeSwitch) {
    els.modeSwitch.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-mode]');
      if (b) setMode(b.getAttribute('data-mode'));
    });
  }

  // ---- Accesibilidad ----
  if (els.a11yBtn) els.a11yBtn.addEventListener('click', function () { setA11yOpen(!state.a11yOpen); });
  if (els.a11yToggles) {
    els.a11yToggles.addEventListener('click', function (e) {
      var b = e.target.closest('[data-toggle]');
      if (!b) return;
      var key = b.getAttribute('data-toggle');
      setToggle(key, b.getAttribute('aria-checked') !== 'true');
    });
  }
  if (els.micBtn) els.micBtn.addEventListener('click', toggleMic);
  // Cerrar el panel con Escape o clic fuera
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.a11yOpen) setA11yOpen(false); });
  document.addEventListener('click', function (e) {
    if (!state.a11yOpen) return;
    if (els.a11yPanel && els.a11yPanel.contains(e.target)) return;
    if (els.a11yBtn && els.a11yBtn.contains(e.target)) return;
    setA11yOpen(false);
  });

  // ---- Arranque ----
  renderChips();
  updateStartedUI();
  updateActionBar();
  updateProgress();

  // Estado inicial de accesibilidad: dictado disponible por defecto si el navegador lo soporta.
  state.voiceInput = sttSupported;
  setToggle('voiceInput', state.voiceInput);
  updateMicVisibility();
  // Respeta la preferencia del sistema de reducir movimiento como estado inicial del interruptor.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setToggle('reduceMotion', true);
  }
  // Pre-carga de voces para TTS (algunos navegadores las cargan de forma diferida).
  if (ttsSupported) { try { window.speechSynthesis.getVoices(); } catch (e) {} }
})();
