# Adicionar páginas

Guia passo a passo para criar uma nova página no GreenRoute.

## 1. Criar o ficheiro HTML

Na raiz do projecto (não dentro de `docs/`):

```bash
touch nome-da-pagina.html
```

## 2. Estrutura base

```html
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GreenRoute — Nome da Página</title>
  <link rel="stylesheet" href="assets/css/main.css" />
  <!-- estilos específicos desta página aqui, não no main.css -->
</head>
<body>

  <!-- Chrome — copiar igual de qualquer página existente -->
  <div class="logo">…</div>
  <div class="site-nav">…</div>
  <div class="top-social">…</div>
  <div class="minimap" id="minimap"></div>
  <div class="panel-counter" id="pcounter"></div>
  <button class="edge-nav up hidden" id="navUp">…</button>
  <button class="edge-nav down" id="navDown">…</button>

  <!-- Canvas -->
  <div id="canvas2d">
    <section class="panel active" data-label="Label">
      <div class="panel-inner">
        <!-- conteúdo do painel -->
      </div>
    </section>
    <!-- mais painéis... -->
  </div>

  <!-- Chat — copiar igual de qualquer página existente -->
  <button class="chat-btn" id="chatBtn">…</button>
  <div class="chat-panel" id="chatPanel" aria-hidden="true">…</div>

  <!-- Scripts — nav-mobile SEMPRE antes do motor -->
  <script src="assets/js/nav-mobile.js"></script>
  <script src="assets/js/canvas-vertical.js"></script>
</body>
</html>
```

## 3. Adicionar o link de navegação em todas as páginas

Edita o `.site-nav` em **todos** os ficheiros HTML existentes:

```html
<div class="site-nav">
  <a href="index.html"         class="site-nav-link">Início</a>
  <a href="news.html"          class="site-nav-link">Notícias</a>
  <a href="about.html"         class="site-nav-link">Sobre</a>
  <a href="nome-da-pagina.html" class="site-nav-link">Nova Página</a>
</div>
```

O drawer mobile actualiza-se automaticamente — não requer mais alterações no `nav-mobile.js`.

## 4. Estruturar os painéis

Cada painel é uma `<section class="panel">` com um `<div class="panel-inner">` dentro. Ver `COMPONENTS.md` para os componentes disponíveis (tiles, cards, grids, etc.).

Boas práticas:
- Primeiro painel: hero com título + CTA "ver mais ↓"
- Último painel: CTA final com link de volta ao início
- `data-label` em cada painel — aparece no counter do canto superior

## 5. Testar

```bash
python3 -m http.server 8080
```

Verificar:
- Navegação ↑↓ funciona
- Minimap reflecte o número correcto de painéis
- Em mobile (≤ 760px) o hambúrguer aparece com o novo link
- Sem scroll vertical na página (cada painel é fullscreen)
