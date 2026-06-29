/* TerraNet — canvas-vertical.js
   Motor de canvas vertical (COLS=1) para páginas internas.
   Navegação: ↑↓, teclado, scroll wheel, swipe, botões edge-nav.
   Chrome: logo, nav, social, minimap, counter, chat — idênticos ao index. */

const panels       = document.querySelectorAll('.panel');
const TOTAL        = panels.length;
const wrap         = document.getElementById('canvas2d');
const navUp        = document.getElementById('navUp');
const navDown      = document.getElementById('navDown');
const minimap      = document.getElementById('minimap');
const pcounter     = document.getElementById('pcounter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MOBILE_BP = 760;
const isMobile  = () => window.innerWidth <= MOBILE_BP;

let cur = 0, busy = false, wLock = false;

// ── Layout ────────────────────────────────────────────────────────────────────
function applyLayout() {
  const W = window.innerWidth;
  const H = window.innerHeight;

  wrap.style.display    = 'block';
  wrap.style.width      = W + 'px';
  wrap.style.height     = (H * TOTAL) + 'px';
  wrap.style.transition = 'transform .85s cubic-bezier(.77,0,.175,1)';
  wrap.style.willChange = 'transform';

  panels.forEach((p, i) => {
    p.style.width    = W + 'px';
    p.style.height   = H + 'px';
    p.style.position = 'absolute';
    p.style.top      = (i * H) + 'px';
    p.style.left     = '0';
  });

  wrap.style.transform = `translateY(-${cur * H}px)`;
}

// ── Minimap ───────────────────────────────────────────────────────────────────
if (minimap) {
  minimap.style.gridTemplateColumns = '10px';
  minimap.style.gridTemplateRows    = `repeat(${TOTAL}, 10px)`;
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.onclick = () => go(i);
    minimap.appendChild(d);
  }
}

// ── updateUI ──────────────────────────────────────────────────────────────────
function updateUI() {
  if (minimap) {
    minimap.querySelectorAll('div').forEach((d, i) => d.classList.toggle('active', i === cur));
  }
  if (pcounter) {
    const label = panels[cur].getAttribute('data-label');
    if (label) pcounter.textContent = label;
  }
  if (navUp)   navUp.classList.toggle('hidden',   cur === 0);
  if (navDown) navDown.classList.toggle('hidden',  cur >= TOTAL - 1);
}

// ── go() ──────────────────────────────────────────────────────────────────────
function go(next) {
  next = Math.max(0, Math.min(TOTAL - 1, next));
  if (next === cur || busy) return;
  busy = true;
  panels[cur].classList.remove('active');
  cur = next;
  const H = window.innerHeight;
  wrap.style.transform = `translateY(-${cur * H}px)`;
  setTimeout(() => { panels[cur].classList.add('active'); busy = false; }, 460);
  updateUI();
}

// ── Botões ────────────────────────────────────────────────────────────────────
if (navUp)   navUp.onclick   = () => go(cur - 1);
if (navDown) navDown.onclick = () => go(cur + 1);

// ── Teclado ───────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(cur + 1);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  go(cur - 1);
});

// ── Wheel ─────────────────────────────────────────────────────────────────────
document.addEventListener('wheel', e => {
  if (wLock) return;
  wLock = true;
  go(e.deltaY > 0 ? cur + 1 : cur - 1);
  setTimeout(() => wLock = false, 1000);
}, { passive: true });

// ── Swipe ─────────────────────────────────────────────────────────────────────
let tsy = 0, touchActive = false;
document.addEventListener('touchstart', e => { tsy = e.touches[0].clientY; touchActive = true; }, { passive: true });
document.addEventListener('touchmove',  e => { if (touchActive) e.preventDefault(); }, { passive: false });
document.addEventListener('touchend', e => {
  if (!touchActive) return;
  touchActive = false;
  const dy = tsy - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 45) go(dy > 0 ? cur + 1 : cur - 1);
});

// ── Resize ────────────────────────────────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { applyLayout(); updateUI(); }, 120);
});

// ── Flip periódico ────────────────────────────────────────────────────────────
if (!reduceMotion) {
  setInterval(() => {
    document.querySelectorAll('.panel.active .tile.flip').forEach(t => {
      setTimeout(() => t.classList.toggle('flipped'), Math.random() * 500);
    });
  }, 3600);
}

// ── Chat toggle ───────────────────────────────────────────────────────────────
const chatBtn   = document.getElementById('chatBtn');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend  = document.getElementById('chatSend');
const chatMsgs  = document.getElementById('chatMessages');

function openChat()  { chatPanel.classList.add('open');    chatPanel.setAttribute('aria-hidden','false'); chatBtn.style.opacity='0'; chatBtn.style.pointerEvents='none'; setTimeout(()=>chatInput.focus(),350); }
function closeChat() { chatPanel.classList.remove('open'); chatPanel.setAttribute('aria-hidden','true');  chatBtn.style.opacity='';  chatBtn.style.pointerEvents=''; }

if (chatBtn)   chatBtn.onclick   = openChat;
if (chatClose) chatClose.onclick = closeChat;

const botReplies = [
  'Obrigado pela mensagem! A nossa equipa responderá em breve.',
  'Boa pergunta! Estamos aqui para ajudar.',
  'Recebemos a tua mensagem. Entraremos em contacto.',
  'Podes também enviar-nos um email para info@terranet.ao.'
];
let replyIdx = 0;

function addMsg(text, type) {
  const m = document.createElement('div');
  m.className = 'chat-msg ' + type;
  m.textContent = text;
  chatMsgs.appendChild(m);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function sendMessage() {
  const txt = chatInput.value.trim();
  if (!txt) return;
  addMsg(txt, 'user');
  chatInput.value = '';
  setTimeout(() => addMsg(botReplies[replyIdx++ % botReplies.length], 'bot'), 600);
}

if (chatSend)  chatSend.onclick = sendMessage;
if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

// ── Arranque ──────────────────────────────────────────────────────────────────
applyLayout();
panels[0].classList.add('active');
updateUI();
