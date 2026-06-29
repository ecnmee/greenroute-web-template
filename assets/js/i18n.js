/* GreenRoute — i18n.js
   Bilingual EN / PT switcher.
   Add data-en="..." data-pt="..." to any element to make it translatable.
   The language toggle button is injected automatically next to .top-social.
   Default language: EN. Persists via localStorage. */

(function () {
  const LANGS    = ['en', 'pt'];
  const STORAGE  = 'gr_lang';
  let   current  = localStorage.getItem(STORAGE) || 'en';

  /* ── Translate all data-{lang} elements ──────────────────────────────────── */
  function applyLang(lang) {
    current = lang;
    localStorage.setItem(STORAGE, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-en]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val === null) return;
      /* inputs/textareas: placeholder */
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', val);
      } else {
        el.innerHTML = val;
      }
    });

    /* Update toggle buttons */
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
    });
  }

  /* ── Inject toggle UI ────────────────────────────────────────────────────── */
  function injectToggle() {
    if (document.querySelector('.lang-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Language selector');

    LANGS.forEach(lang => {
      const btn = document.createElement('button');
      btn.className   = 'lang-btn';
      btn.dataset.lang = lang;
      btn.textContent  = lang.toUpperCase();
      btn.setAttribute('aria-pressed', lang === current);
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', () => applyLang(lang));
      switcher.appendChild(btn);
    });

    /* Insert before .top-social or at end of body */
    const anchor = document.querySelector('.top-social') || document.body;
    anchor.parentNode
      ? anchor.parentNode.insertBefore(switcher, anchor)
      : document.body.appendChild(switcher);
  }

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  function boot() {
    injectToggle();
    applyLang(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
