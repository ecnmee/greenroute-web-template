/* GreenRoute — nav-mobile.js
   Hambúrguer + drawer para mobile (≤ 760px).
   Lê os links do .site-nav e constrói o drawer dinamicamente.
   Compatible com i18n.js — traduz os links do drawer quando o idioma muda. */

(function () {
  const BREAKPOINT = 760;

  function init() {
    if (window.innerWidth > BREAKPOINT) return;
    if (document.querySelector('.nav-burger')) return;

    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    /* ── Topbar background ──────────────────────────────────────────────────── */
    const topbar = document.createElement('div');
    topbar.className = 'nav-topbar';
    document.body.appendChild(topbar);

    /* ── Drawer ─────────────────────────────────────────────────────────────── */
    const drawer = document.createElement('nav');
    drawer.className = 'nav-drawer';
    drawer.id = 'nav-drawer';
    drawer.setAttribute('aria-label', 'Main menu');
    drawer.setAttribute('aria-hidden', 'true');

    nav.querySelectorAll('.site-nav-link').forEach(link => {
      const a = document.createElement('a');
      /* Preserve href exactly as written in HTML — relative paths work correctly */
      a.href = link.getAttribute('href');
      a.className = 'site-nav-link';
      /* Copy i18n attributes so language switcher works on drawer too */
      if (link.dataset.en) a.dataset.en = link.dataset.en;
      if (link.dataset.pt) a.dataset.pt = link.dataset.pt;
      if (link.hasAttribute('aria-current')) a.setAttribute('aria-current', link.getAttribute('aria-current'));
      /* Text content: use current language from localStorage or data-en */
      const lang = localStorage.getItem('gr_lang') || 'en';
      a.textContent = link.getAttribute('data-' + lang) || link.textContent.trim();
      a.addEventListener('click', close);
      drawer.appendChild(a);
    });

    document.body.appendChild(drawer);

    /* ── Hamburger button ───────────────────────────────────────────────────── */
    const burger = document.createElement('button');
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', 'Open menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'nav-drawer');
    burger.setAttribute('type', 'button');
    burger.innerHTML = '<span></span><span></span><span></span>';
    document.body.appendChild(burger);

    /* ── Overlay ────────────────────────────────────────────────────────────── */
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:296;display:none;background:rgba(0,0,0,.3)';
    document.body.appendChild(overlay);

    let isOpen = false;

    function open() {
      isOpen = true;
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function close() {
      isOpen = false;
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => isOpen ? close() : open());
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });

    /* ── Sync drawer links when i18n switches language ──────────────────────── */
    document.addEventListener('gr:langChange', e => {
      const lang = e.detail.lang;
      drawer.querySelectorAll('.site-nav-link').forEach(a => {
        if (a.dataset[lang]) a.textContent = a.dataset[lang];
      });
    });
  }

  /* Resize handling */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > BREAKPOINT) {
        document.querySelector('.nav-burger')?.remove();
        document.querySelector('.nav-drawer')?.remove();
        document.querySelector('.nav-topbar')?.remove();
        document.body.style.overflow = '';
      } else if (!document.querySelector('.nav-burger')) {
        init();
      }
    }, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
