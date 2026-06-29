# Componentes

Referência rápida dos componentes reutilizáveis do GreenRoute.

## Canvas 2D — `main.js`

Usado exclusivamente no `index.html`. Gere uma grelha 2D de painéis fullscreen.

```
COLS = 4   → até 4 painéis por linha
ROWS       → calculado automaticamente a partir do total de painéis
```

### Navegação

| Método | Comportamento |
|---|---|
| `go(row, col)` | Move para painel específico |
| Setas ↑↓ | Move linearmente (painel anterior/seguinte) |
| Setas ←→ | Move na coluna (horizontal) |
| Scroll vertical | Move linearmente |
| Scroll horizontal | Move coluna |
| Swipe vertical | Move linearmente |
| Swipe horizontal | Move coluna |

### Adicionar um painel

1. Adiciona uma `<section class="panel">` dentro de `#canvas2d`
2. Define `data-label="Nome"` para o counter
3. O motor recalcula `ROWS` e `TOTAL` automaticamente

---

## Canvas Vertical — `canvas-vertical.js`

Usado em `about.html`, `news.html` e `post.html`. Navegação apenas vertical, coluna única.

### Estrutura HTML mínima

```html
<div id="canvas2d">
  <section class="panel active" data-label="Label">
    <div class="panel-inner">
      <!-- conteúdo -->
    </div>
  </section>
  <!-- mais painéis... -->
</div>

<button class="edge-nav up hidden" id="navUp">…</button>
<button class="edge-nav down" id="navDown">…</button>
<div class="minimap" id="minimap"></div>
<div class="panel-counter" id="pcounter"></div>
```

### Adicionar painéis

Basta adicionar `<section class="panel" data-label="…">` dentro de `#canvas2d`. O motor detecta o total automaticamente via `document.querySelectorAll('.panel')`.

---

## Nav Mobile — `nav-mobile.js`

Script autónomo. Incluir em todas as páginas **antes** do script principal:

```html
<script src="assets/js/nav-mobile.js"></script>
<script src="assets/js/main.js"></script>  <!-- ou canvas-vertical.js -->
```

### Como funciona

1. Detecta `window.innerWidth ≤ 760px`
2. Lê os `.site-nav-link` existentes no `<div class="site-nav">`
3. Constrói dinamicamente: topbar de fundo, botão hambúrguer, drawer com os mesmos links

### Adicionar itens de nav

Basta adicionar um `<a class="site-nav-link" href="…">` dentro de `.site-nav` no HTML. O drawer reflecte os links automaticamente sem tocar no `nav-mobile.js`.

---

## Chat

Incluído no `canvas-vertical.js` e `main.js`. Requer no HTML:

```html
<button class="chat-btn" id="chatBtn">…</button>
<div class="chat-panel" id="chatPanel" aria-hidden="true">
  <div class="chat-panel-header">
    <span>Título</span>
    <button class="chat-panel-close" id="chatClose">×</button>
  </div>
  <div class="chat-messages" id="chatMessages">
    <div class="chat-msg bot">Mensagem inicial</div>
  </div>
  <div class="chat-input-row">
    <input type="text" id="chatInput" />
    <button class="chat-send" id="chatSend">→</button>
  </div>
</div>
```

---

## Classes CSS utilitárias

| Classe | Uso |
|---|---|
| `.panel-inner` | Container centrado dentro de cada painel |
| `.panel-title` | Título principal do painel |
| `.panel-eyebrow` | Label uppercase acima do título |
| `.panel-sub` | Subtítulo/descrição |
| `.hl` | Destaque de cor em texto |
| `.tile-grid` | Grid de tiles (default 4 colunas) |
| `.tiles-two` `.tiles-three` `.tiles-four` | Variantes de colunas |
| `.tile` | Tile individual com `--tile-color` |
| `.news-card` | Card de artigo de notícia |
| `.about-card` | Card da página Sobre |
| `.btn` | Botão base |
| `.btn-primary` `.btn-outline` `.btn-light` | Variantes de botão |
