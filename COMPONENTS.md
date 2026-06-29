# Components

Quick reference for GreenRoute's reusable components.

## 2D Canvas Engine — `main.js`

Used exclusively in `index.html`. Manages a 2D grid of fullscreen panels.

```
COLS = 4   → up to 4 panels per row
ROWS       → calculated automatically from total panel count
```

### Navigation

| Method | Behaviour |
|---|---|
| `go(row, col)` | Move to a specific panel |
| ↑ / ↓ arrows | Move linearly (previous/next panel) |
| ← / → arrows | Move within the row (horizontal) |
| Vertical scroll | Move linearly |
| Horizontal scroll | Move within the row |
| Vertical swipe | Move linearly |
| Horizontal swipe | Move within the row |

### Adding a panel

1. Add a `<section class="panel">` inside `#canvas2d`
2. Set `data-label="Name"` for the counter
3. The engine recalculates `ROWS` and `TOTAL` automatically

---

## Vertical Canvas — `canvas-vertical.js`

Used in `about.html`, `news.html` and `post.html`. Vertical-only navigation, single column.

### Minimum HTML structure

```html
<div id="canvas2d">
  <section class="panel active" data-label="Label">
    <div class="panel-inner">
      <!-- content -->
    </div>
  </section>
  <!-- more panels... -->
</div>

<button class="edge-nav up hidden" id="navUp">…</button>
<button class="edge-nav down" id="navDown">…</button>
<div class="minimap" id="minimap"></div>
<div class="panel-counter" id="pcounter"></div>
```

### Adding panels

Simply add `<section class="panel" data-label="…">` inside `#canvas2d`. The engine detects the total automatically via `document.querySelectorAll('.panel')`.

---

## Nav Mobile — `nav-mobile.js`

Self-contained script. Include in all pages **before** the main script:

```html
<script src="assets/js/nav-mobile.js"></script>
<script src="assets/js/main.js"></script>  <!-- or canvas-vertical.js -->
```

### How it works

1. Detects `window.innerWidth ≤ 760px`
2. Reads existing `.site-nav-link` elements from `<nav class="site-nav">`
3. Dynamically injects: background topbar, hamburger button, drawer with cloned links

### Adding nav items

Just add an `<a class="site-nav-link" href="…">` inside `.site-nav` in the HTML. The drawer updates automatically — no changes needed in `nav-mobile.js`. Works with any number of items.

---

## Language Switcher — `i18n.js`

Bilingual EN/PT support. Include before other scripts:

```html
<script src="assets/js/i18n.js"></script>
```

Add `data-en` and `data-pt` attributes to any translatable element:

```html
<h1 data-en="Hello world" data-pt="Olá mundo">Hello world</h1>
<input data-en="Your name" data-pt="O seu nome" placeholder="Your name" />
```

The switcher is injected automatically next to `.top-social`. Language preference persists via `localStorage`.

---

## Chat

Included in `canvas-vertical.js` and `main.js`. Requires in HTML:

```html
<button class="chat-btn" id="chatBtn">…</button>
<div class="chat-panel" id="chatPanel" aria-hidden="true">
  <div class="chat-panel-header">
    <span>Title</span>
    <button class="chat-panel-close" id="chatClose">×</button>
  </div>
  <div class="chat-messages" id="chatMessages">
    <div class="chat-msg bot">Initial message</div>
  </div>
  <div class="chat-input-row">
    <input type="text" id="chatInput" />
    <button class="chat-send" id="chatSend">→</button>
  </div>
</div>
```

---

## CSS utility classes

| Class | Usage |
|---|---|
| `.panel-inner` | Centred container inside each panel |
| `.panel-title` | Main panel heading |
| `.panel-eyebrow` | Uppercase label above the title |
| `.panel-sub` | Subtitle / description |
| `.hl` | Highlighted colour in text |
| `.tile-grid` | Tile grid (default 4 columns) |
| `.tiles-two` `.tiles-three` `.tiles-four` | Column variants |
| `.tile` | Individual tile with `--tile-color` |
| `.news-card` | News article card |
| `.about-card` | About page card |
| `.btn` | Base button |
| `.btn-primary` `.btn-outline` `.btn-light` | Button variants |
