/* TerraNet — nav-mobile.js
   Hambúrguer + drawer para mobile (≤ 760px).
   Inclui este script em todas as páginas logo após o <body>.
   Não precisa de alterar o HTML de navegação existente —
   o script lê os links do .site-nav e constrói o drawer dinamicamente.
   Para adicionar/remover itens de nav basta editar .site-nav no HTML. */

(function () {
  const BREAKPOINT = 760;

  function init() {
    if (window.innerWidth > BREAKPOINT) return;

    const nav = document.querySelector('.site-nav');
    if (!nav || document.querySelector('.nav-burger')) return;

    /* ── Fundo unificado da topbar ─────────────────────────────────────────── */
    const topbar = document.createElement('div');
    topbar.className = 'nav-topbar';
    document.body.appendChild(topbar);

    /* ── Drawer — clona os links da nav existente ──────────────────────────── */
    const drawer = document.createElement('nav');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('aria-label', 'Menu principal');
    drawer.setAttribute('aria-hidden', 'true');

    nav.querySelectorAll('.site-nav-link').forEach(link => {
      const a = link.cloneNode(true);
      a.addEventListener('click', close);
      drawer.appendChild(a);
    });

    document.body.appendChild(drawer);

    /* ── Botão hambúrguer ──────────────────────────────────────────────────── */
    const burger = document.createElement('button');
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', 'Abrir menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'nav-drawer');
    burger.innerHTML = '<span></span><span></span><span></span>';
    document.body.appendChild(burger);

    drawer.id = 'nav-drawer';

    /* ── Overlay para fechar ao clicar fora ────────────────────────────────── */
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:48px 0 0 0', 'z-index:297',
      'display:none', 'background:rgba(0,0,0,.4)'
    ].join(';');
    document.body.appendChild(overlay);

    let isOpen = false;

    function open() {
      isOpen = true;
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fechar menu');
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.style.display = 'block';
    }

    function close() {
      isOpen = false;
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menu');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.style.display = 'none';
    }

    burger.addEventListener('click', () => isOpen ? close() : open());
    overlay.addEventListener('click', close);

    /* Fecha com tecla Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  /* Aguarda DOM pronto */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Re-avalia ao redimensionar (ex: rotação do dispositivo) */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > BREAKPOINT) {
        /* Remove elementos mobile se o ecrã crescer */
        document.querySelector('.nav-burger')?.remove();
        document.querySelector('.nav-drawer')?.remove();
        document.querySelector('.nav-topbar')?.remove();
      } else {
        if (!document.querySelector('.nav-burger')) init();
      }
    }, 150);
  });
})();
