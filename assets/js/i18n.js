/* GreenRoute — i18n.js
   Bilingual EN / PT switcher.
   Add data-en="..." data-pt="..." to any element to make it translatable.
   Fires CustomEvent 'gr:langChange' so other modules (nav-mobile, form) can sync. */

(function () {
  const LANGS   = ['en', 'pt'];
  const STORAGE = 'gr_lang';
  let   current = localStorage.getItem(STORAGE) || 'en';

  /* ── Validation messages per language ──────────────────────────────────────── */
  const VALIDATION = {
    en: {
      required:  'This field is required.',
      minName:   'Please enter at least 2 characters.',
      minSubject:'Please enter at least 3 characters.',
      minMsg:    'Please enter at least 20 characters.',
      email:     'Please enter a valid email address.',
      success:   'Message sent successfully! We\'ll be in touch soon.',
      error:     'Something went wrong. Please try again.'
    },
    pt: {
      required:  'Este campo é obrigatório.',
      minName:   'Por favor insira pelo menos 2 caracteres.',
      minSubject:'Por favor insira pelo menos 3 caracteres.',
      minMsg:    'Por favor insira pelo menos 20 caracteres.',
      email:     'Por favor insira um endereço de email válido.',
      success:   'Mensagem enviada com sucesso! Entraremos em contacto.',
      error:     'Ocorreu um erro. Por favor tente novamente.'
    }
  };

  /* ── Translate all data-{lang} elements ────────────────────────────────────── */
  function applyLang(lang) {
    current = lang;
    localStorage.setItem(STORAGE, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-en]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val === null) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.hasAttribute('aria-label') && !el.children.length) {
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

    /* Notify other modules */
    document.dispatchEvent(new CustomEvent('gr:langChange', { detail: { lang } }));
  }

  /* ── Expose validation messages globally ───────────────────────────────────── */
  window.grValidation = () => VALIDATION[current] || VALIDATION.en;

  /* ── Inject toggle UI ──────────────────────────────────────────────────────── */
  function injectToggle() {
    if (document.querySelector('.lang-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Language selector');

    LANGS.forEach(lang => {
      const btn = document.createElement('button');
      btn.className    = 'lang-btn';
      btn.dataset.lang = lang;
      btn.textContent  = lang.toUpperCase();
      btn.setAttribute('aria-pressed', lang === current);
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', () => applyLang(lang));
      switcher.appendChild(btn);
    });

    const anchor = document.querySelector('.top-social');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(switcher, anchor);
    } else {
      document.body.appendChild(switcher);
    }
  }

  /* ── Boot ──────────────────────────────────────────────────────────────────── */
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
