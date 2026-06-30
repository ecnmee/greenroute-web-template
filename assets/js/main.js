/* ═══════════════════════════════════════════════════════════════════════════
   TerraNet — main.js
   Desktop : canvas 2D com navegação por setas, teclado, scroll e swipe
   Mobile  : canvas 2D vertical com dimensões reais (px) do dispositivo,
             swipe vertical entre painéis, sem scroll nativo do browser
   ═══════════════════════════════════════════════════════════════════════════ */

const COLS = 4;
const panels       = document.querySelectorAll('.panel');
const TOTAL        = panels.length;
const ROWS         = Math.ceil(TOTAL / COLS);
const wrap         = document.getElementById('canvas2d');
const navUp        = document.getElementById('navUp');
const navDown      = document.getElementById('navDown');
const navLeft      = document.getElementById('navLeft');
const navRight     = document.getElementById('navRight');
const minimap      = document.getElementById('minimap');
const pcounter     = document.getElementById('pcounter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Detecção de modo ────────────────────────────────────────────────────────
const MOBILE_BP = 760;
const isMobile  = () => window.innerWidth <= MOBILE_BP;

// ── Estado de navegação ─────────────────────────────────────────────────────
let row = 0, col = 0, busy = false, wLock = false;

// ── Em mobile o canvas é uma coluna única, COLS=1 efectivo ─────────────────
// Os painéis ficam em linha vertical: panel[0] topo, panel[N] fundo
// A navegação é apenas cima/baixo por índice linear

// ════════════════════════════════════════════════════════════════════════════
//  LAYOUT — aplica dimensões ao canvas e a cada painel
// ════════════════════════════════════════════════════════════════════════════
function applyLayout() {
  const W = window.innerWidth;
  const H = window.innerHeight;

  if (isMobile()) {
    // ── Mobile: coluna única, dimensões em px reais ─────────────────────────
    const mTotal = TOTAL;

    wrap.style.display               = 'block';
    wrap.style.width                 = W + 'px';
    wrap.style.height                = (H * mTotal) + 'px';
    wrap.style.gridTemplateColumns   = '';
    wrap.style.gridTemplateRows      = '';

    panels.forEach((p, i) => {
      p.style.width       = W + 'px';
      p.style.height      = H + 'px';
      p.style.position    = 'absolute';
      p.style.top         = (i * H) + 'px';
      p.style.left        = '0';
      p.style.gridColumn  = '';
      p.style.gridRow     = '';
    });

    // Traduz a posição actual para índice linear (col ignorada em mobile)
    const linearIdx = row * COLS + col;
    wrap.style.transform = `translateY(-${linearIdx * H}px)`;

  } else {
    // ── Desktop: grid 2D, unidades vw/vh ───────────────────────────────────
    wrap.style.display               = 'grid';
    wrap.style.width                 = `${COLS * 100}vw`;
    wrap.style.height                = `${ROWS * 100}vh`;
    wrap.style.gridTemplateColumns   = `repeat(${COLS}, 100vw)`;
    wrap.style.gridTemplateRows      = `repeat(${ROWS}, 100vh)`;

    panels.forEach((p, i) => {
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      p.style.width     = '100vw';
      p.style.height    = '100vh';
      p.style.position  = '';
      p.style.top       = '';
      p.style.left      = '';
      p.style.gridColumn = (c + 1);
      p.style.gridRow    = (r + 1);
    });

    wrap.style.transform = `translate(-${col * 100}vw, -${row * 100}vh)`;
  }
}

// ── Minimap (desktop only) ──────────────────────────────────────────────────
minimap.style.gridTemplateColumns = `repeat(${COLS}, 10px)`;
minimap.style.gridTemplateRows    = `repeat(${ROWS}, 10px)`;
for (let i = 0; i < ROWS * COLS; i++) {
  const d = document.createElement('div');
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  if (i >= TOTAL) d.style.opacity = '0';
  else d.onclick = () => go(r, c);
  minimap.appendChild(d);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function idx(r, c)     { return r * COLS + c; }
function linearIdx()   { return idx(row, col); }

function maxColForRow(r) {
  const last = Math.min(TOTAL - 1, idx(r, COLS - 1));
  return last - r * COLS;
}

// ── updateUI ─────────────────────────────────────────────────────────────────
function updateUI() {
  document.querySelectorAll('.minimap div')
    .forEach((d, i) => d.classList.toggle('active', i === idx(row, col)));
  const panel = panels[idx(row, col)];
  if (panel) pcounter.textContent = panel.getAttribute('data-label');

  navUp.classList.toggle('hidden',
    isMobile() ? linearIdx() === 0 : row === 0);
  navDown.classList.toggle('hidden',
    isMobile() ? linearIdx() >= TOTAL - 1 : idx(row + 1, 0) >= TOTAL);
  navLeft.classList.toggle('hidden',  isMobile() || col === 0);
  navRight.classList.toggle('hidden', isMobile() || idx(row, col + 1) >= TOTAL || col === maxColForRow(row));

  if (!isMobile() && row === 0 && col === 2) startStats();
}

// ── go() — navegação desktop (grid 2D) ──────────────────────────────────────
function go(r, c) {
  if (busy || isMobile()) return;
  r = Math.max(0, Math.min(ROWS - 1, r));
  c = Math.max(0, Math.min(COLS - 1, c));
  if (idx(r, c) >= TOTAL) return;
  if (r === row && c === col) return;
  busy = true;
  panels[idx(row, col)].classList.remove('active');
  row = r; col = c;
  wrap.style.transform = `translate(-${col * 100}vw, -${row * 100}vh)`;
  setTimeout(() => { panels[idx(row, col)].classList.add('active'); busy = false; }, 460);
  updateUI();
}

// ── goMobile() — navegação mobile (linear vertical) ─────────────────────────
function goMobile(delta) {
  if (busy) return;
  const next = linearIdx() + delta;
  if (next < 0 || next >= TOTAL) return;
  busy = true;
  panels[linearIdx()].classList.remove('active');
  // Recalcula row/col a partir do índice linear
  row = Math.floor(next / COLS);
  col = next % COLS;
  const H = window.innerHeight;
  wrap.style.transform = `translateY(-${next * H}px)`;
  setTimeout(() => { panels[linearIdx()].classList.add('active'); busy = false; }, 460);
  updateUI();
  if (next === 2) startStats();
}

// ── Botões de seta ───────────────────────────────────────────────────────────
navUp.onclick    = () => { if (isMobile()) goMobile(-1); else go(row - 1, col); };
navDown.onclick  = () => { if (isMobile()) goMobile(+1); else go(row + 1, Math.min(col, maxColForRow(row + 1))); };
navLeft.onclick  = () => go(row, col - 1);
navRight.onclick = () => go(row, col + 1);

// ── Teclado (desktop) ────────────────────────────────────────────────────────
// ↑ / ↓ movem uma linha (±COLS painéis) — cima/baixo no grid visual
// ← / → movem uma coluna (±1 painel)   — esquerda/direita no grid visual
document.addEventListener('keydown', e => {
  if (isMobile()) return;
  if (e.key === 'ArrowRight') { go(row, col + 1); return; }
  if (e.key === 'ArrowLeft')  { go(row, col - 1); return; }
  if (e.key === 'ArrowDown')  { go(row + 1, Math.min(col, maxColForRow(row + 1))); return; }
  if (e.key === 'ArrowUp')    { go(row - 1, col); return; }
});

// ── Touch / Swipe ────────────────────────────────────────────────────────────
let tsx = 0, tsy = 0, touchActive = false;

document.addEventListener('touchstart', e => {
  tsx = e.touches[0].clientX;
  tsy = e.touches[0].clientY;
  touchActive = true;
}, { passive: true });

document.addEventListener('touchmove', e => {
  // Previne scroll nativo em qualquer ecrã tátil — o canvas controla o movimento
  if (touchActive) e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', e => {
  if (!touchActive) return;
  touchActive = false;
  const dx = tsx - e.changedTouches[0].clientX;
  const dy = tsy - e.changedTouches[0].clientY;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;

  if (isMobile()) {
    // Mobile: só vertical
    if (Math.abs(dy) > Math.abs(dx)) goMobile(dy > 0 ? 1 : -1);
  } else {
    // Desktop tátil: horizontal move coluna (±1), vertical move linha (±COLS)
    if (Math.abs(dx) > Math.abs(dy)) {
      go(row, dx > 0 ? col + 1 : col - 1);
    } else {
      const nr = dy > 0 ? row + 1 : row - 1;
      go(nr, Math.min(col, maxColForRow(nr)));
    }
  }
});

// ── Wheel (desktop) ──────────────────────────────────────────────────────────
// Scroll horizontal → move coluna (±1); scroll vertical → move linha (±COLS).
document.addEventListener('wheel', e => {
  if (isMobile() || wLock) return;
  wLock = true;
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    go(row, e.deltaX > 0 ? col + 1 : col - 1);
  } else {
    const nr = e.deltaY > 0 ? row + 1 : row - 1;
    go(nr, Math.min(col, maxColForRow(nr)));
  }
  setTimeout(() => wLock = false, 1000);
});

// ── Resize — recalcula layout e reposiciona ──────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    applyLayout();
    updateUI();
  }, 120);
});

// ── Stats ────────────────────────────────────────────────────────────────────
const statVals = [
  { id: 'n1', val: 12400, suf: '' },
  { id: 'n2', val: 38000, suf: 't' },
  { id: 'n3', val: 47,    suf: '' },
  { id: 'n4', val: 2.4,   suf: 'M', dec: 1 }
];
let statsRan = false;
function startStats() {
  if (statsRan) return; statsRan = true;
  statVals.forEach(({ id, val, suf, dec }, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const dur = 1100, t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const ev = 1 - Math.pow(1 - p, 3);
      const v  = ev * val;
      el.textContent = dec ? v.toFixed(dec) + suf : Math.round(v).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    const tile = document.getElementById('statTile' + (i + 1));
    if (tile) setTimeout(() => tile.classList.add('flipped'), 300 + i * 120);
  });
}

// IntersectionObserver como fallback (mobile swipe e navegação directa)
if ('IntersectionObserver' in window && panels[2]) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { startStats(); obs.disconnect(); }
  }, { threshold: 0.35 });
  obs.observe(panels[2]);
}

// ── Flip periódico ───────────────────────────────────────────────────────────
if (!reduceMotion) {
  setInterval(() => {
    document.querySelectorAll('.panel.active .tile.flip').forEach(t => {
      setTimeout(() => t.classList.toggle('flipped'), Math.random() * 500);
    });
  }, 3600);
}

// ── Floating bits ─────────────────────────────────────────────────────────────
function seedBits(containerId, count) {
  if (isMobile() || reduceMotion) return;
  const c = document.getElementById(containerId);
  if (!c) return;
  const colors = ['rgba(255,255,255,.5)', 'rgba(255,255,255,.3)', 'rgba(255,255,255,.18)'];
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'bit';
    const s = 6 + Math.random() * 10;
    b.style.cssText = `width:${s}px;height:${s}px;background:${colors[i%colors.length]};left:${Math.random()*100}%;animation-duration:${9+Math.random()*12}s;animation-delay:${Math.random()*10}s;`;
    c.appendChild(b);
  }
}
seedBits('bits-hero', 12);
seedBits('bits-cta', 12);

// ── Portfolio modal ───────────────────────────────────────────────────────────
const modal         = document.getElementById('portfolio-modal');
const modalTitle    = document.getElementById('modal-title');
const galleryMain   = document.getElementById('gallery-main');
const galleryThumbs = document.getElementById('gallery-thumbs');

document.querySelectorAll('[data-project-name]').forEach(card => {
  card.addEventListener('click', () => {
    const name   = card.getAttribute('data-project-name');
    const images = card.getAttribute('data-project-images').split('|');
    modalTitle.textContent = name;
    galleryMain.src = images[0];
    galleryThumbs.innerHTML = '';
    images.forEach((src, index) => {
      const thumb = document.createElement('img');
      thumb.className = 'gallery-thumb';
      if (index === 0) thumb.classList.add('active');
      thumb.src = src;
      thumb.onclick = () => {
        galleryMain.src = src;
        document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      };
      galleryThumbs.appendChild(thumb);
    });
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });
});

const closeModal = () => { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); };
document.querySelector('.modal-close').onclick = closeModal;
modal.onclick = e => { if (e.target === modal) closeModal(); };
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// ── data-go buttons ───────────────────────────────────────────────────────────
document.querySelectorAll('[data-go]').forEach(btn => {
  btn.addEventListener('click', () => {
    const [r, c] = btn.getAttribute('data-go').split(',').map(Number);
    if (isMobile()) goMobile(idx(r, c) - linearIdx());
    else go(r, c);
  });
});

// ── Contact form ──────────────────────────────────────────────────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const fields = {
      name:    contactForm.querySelector('input[name="name"]'),
      email:   contactForm.querySelector('input[name="email"]'),
      subject: contactForm.querySelector('input[name="subject"]'),
      message: contactForm.querySelector('textarea[name="message"]')
    };
    let valid = true;
    Object.entries(fields).forEach(([key, input]) => {
      const errorEl = input.parentElement.querySelector('.error');
      errorEl.textContent = ''; input.classList.remove('error-input');
      if (!input.value.trim()) {
        errorEl.textContent = 'Campo obrigatório.'; input.classList.add('error-input'); valid = false; return;
      }
      if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        errorEl.textContent = 'Email inválido.'; input.classList.add('error-input'); valid = false; return;
      }
      if (key === 'message' && input.value.trim().length < 20) {
        errorEl.textContent = 'A mensagem deve ter pelo menos 20 caracteres.'; input.classList.add('error-input'); valid = false; return;
      }
      if ((key === 'name' || key === 'subject') && input.value.trim().length < 2) {
        errorEl.textContent = 'Insira pelo menos 2 caracteres.'; input.classList.add('error-input'); valid = false;
      }
    });
    const status = contactForm.querySelector('.form-status');
    if (valid) { status.textContent = 'Obrigado! A tua mensagem foi recebida.'; contactForm.reset(); }
    else        { status.textContent = 'Por favor, corrige os campos destacados.'; }
  });
}

// ── Arranque ──────────────────────────────────────────────────────────────────
applyLayout();
panels[0].classList.add('active');
updateUI();

// ── Chat toggle ───────────────────────────────────────────────────────────────
const chatBtn    = document.getElementById('chatBtn');
const chatPanel  = document.getElementById('chatPanel');
const chatClose  = document.getElementById('chatClose');
const chatInput  = document.getElementById('chatInput');
const chatSend   = document.getElementById('chatSend');
const chatMsgs   = document.getElementById('chatMessages');

function openChat()  { chatPanel.classList.add('open');    chatPanel.setAttribute('aria-hidden','false'); chatBtn.style.opacity='0'; chatBtn.style.pointerEvents='none'; setTimeout(()=>chatInput.focus(),350); }
function closeChat() { chatPanel.classList.remove('open'); chatPanel.setAttribute('aria-hidden','true');  chatBtn.style.opacity='';  chatBtn.style.pointerEvents=''; }

chatBtn.onclick   = openChat;
chatClose.onclick = closeChat;

function addMsg(text, type) {
  const m = document.createElement('div');
  m.className = 'chat-msg ' + type;
  m.textContent = text;
  chatMsgs.appendChild(m);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

const botReplies = [
  'Obrigado pela mensagem! A nossa equipa responderá em breve.',
  'Boa pergunta! Estamos aqui para ajudar.',
  'Recebemos a tua mensagem. Entraremos em contacto.',
  'Podes também enviar-nos um email para info@terranet.ao.'
];
let replyIdx = 0;

function sendMessage() {
  const txt = chatInput.value.trim();
  if (!txt) return;
  addMsg(txt, 'user');
  chatInput.value = '';
  setTimeout(() => addMsg(botReplies[replyIdx++ % botReplies.length], 'bot'), 600);
}

chatSend.onclick = sendMessage;
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
