# Tokens CSS

Todas as cores e variáveis de design estão definidas em `:root` no `main.css`.

## Panel colours

Cada painel do canvas usa uma cor de fundo via variável CSS:

```css
--c-hero        /* verde escuro — painel principal */
--c-problem     /* quase preto — painéis de problema/contexto */
--c-solution    /* azul-verde — painéis de solução */
--c-coverage    /* teal — painéis de cobertura/expansão */
--c-roadmap     /* azul escuro — painéis de roadmap */
--c-cta         /* cor de acção — painel final */
```

### Using in a page

```html
<section class="panel" style="background: var(--c-roadmap);">
```

## Tile colours

```css
--tile-green    /* tile verde */
--tile-blue     /* tile azul */
--tile-amber    /* tile âmbar */
--tile-red      /* tile vermelho */
```

### Using in a tile

```html
<div class="tile" style="--tile-color: var(--tile-green);">
```

Ou cor directa:

```html
<div class="tile" style="--tile-color: rgba(255,255,255,.08);">
```

## Tipografia

```css
--font-main     /* família principal */
```

Tamanhos via `clamp()` no CSS — escalam com o viewport.

## Breakpoints

Definidos apenas em media queries, não como variáveis:

| Breakpoint | Valor | Uso |
|---|---|---|
| Mobile | `≤ 760px` | Hambúrguer, layout vertical, tiles 2 colunas |
| Tablet | `761px – 960px` | `tiles-four` passa a 2 colunas |
| Desktop | `> 960px` | Layout completo |

## Adding a new panel colour

1. Declara a variável em `:root` no `main.css`:
   ```css
   :root {
     --c-nova-cor: #1a2b3c;
   }
   ```
2. Usa nos painéis:
   ```html
   <section class="panel" style="background: var(--c-nova-cor);">
   ```
