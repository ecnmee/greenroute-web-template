# Motor de Canvas

O GreenRoute tem dois motores de canvas conforme o tipo de página.

---

## `main.js` — Grid 2D (index)

### Concept

Os painéis são dispostos numa grelha de `COLS=4` colunas. O `#canvas2d` tem dimensões `COLS * 100vw` de largura e `ROWS * 100vh` de altura. A navegação move o wrapper com `translate(-X vw, -Y vh)`.

```
[0,0] [0,1] [0,2] [0,3]
[1,0] [1,1] [1,2] [1,3]
[2,0] ...
```

### State variables

```js
let row = 0   // linha actual
let col = 0   // coluna actual
let busy = false  // bloqueia navegação durante transição
```

### Main functions

```js
go(r, c)        // navega para painel na linha r, coluna c
goMobile(delta) // navega +1 / -1 linearmente (mobile)
linearIdx()     // idx = row * COLS + col
applyLayout()   // recalcula dimensões ao resize
updateUI()      // actualiza minimap, counter, botões
```

### Mobile vs desktop mode

`isMobile()` retorna `true` se `window.innerWidth ≤ 760`. Em mobile, o canvas muda para layout vertical (empilhado) e usa `goMobile()`. Em desktop usa `go()` com grid 2D.

### Customising column count

```js
// No topo de main.js
const COLS = 4; // alterar aqui
```

Os painéis devem ser múltiplos de `COLS` para evitar linhas incompletas, ou o motor trata automaticamente painéis a menos na última linha.

---

## `canvas-vertical.js` — Vertical (subpages)

### Concept

Coluna única. O `#canvas2d` tem altura `TOTAL * 100vh`. A navegação move com `translateY(-N * 100vh)`.

### Differences from `main.js`

| | `main.js` | `canvas-vertical.js` |
|---|---|---|
| Layout | Grid 2D | Coluna única |
| Navegação H | Setas ←→, swipe H | Não existe |
| Navegação V | Linear (↑↓) | Linear (↑↓) |
| Mobile | Layout muda para vertical | Igual ao desktop |
| Stats panel | Sim (painel [0,2]) | Não |

### Adding panels

```html
<section class="panel" data-label="Título do painel">
  <div class="panel-inner">
    <!-- conteúdo -->
  </div>
</section>
```

O script lê `document.querySelectorAll('.panel')` no arranque — o total é automático.

---

## Transitions

Ambos os motores usam:

```css
transition: transform .85s cubic-bezier(.77, 0, .175, 1)
```

O `busy` flag bloqueia nova navegação durante 460ms (antes do fim da transição) para evitar saltos duplos.

---

## Tile flip

O `main.js` tem um intervalo periódico (3600ms) que faz flip aleatório em `.tile.flip` do painel activo. Para activar numa tile:

```html
<div class="tile flip">
  <div class="tile-inner">
    <div class="tile-front">…</div>
    <div class="tile-back">…</div>
  </div>
</div>
```
