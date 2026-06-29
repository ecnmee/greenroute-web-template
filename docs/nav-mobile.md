# Nav Mobile

`assets/js/nav-mobile.js` gere a navegação em dispositivos móveis (≤ 760px).

## How it works

O script é autónomo — não requer alterações ao HTML além de incluí-lo. No arranque:

1. Verifica `window.innerWidth ≤ 760`
2. Lê todos os `.site-nav-link` do `.site-nav` existente
3. Cria e injeta no `<body>`:
   - `.nav-topbar` — fundo unificado de 48px
   - `.nav-burger` — botão hambúrguer (canto superior direito)
   - `.nav-drawer` — menu vertical com os links clonados
   - overlay semitransparente para fechar ao clicar fora

## Including in pages

```html
<!-- Sempre antes do script principal da página -->
<script src="assets/js/nav-mobile.js"></script>
<script src="assets/js/main.js"></script>
```

## Adding nav items

Edita o `.site-nav` no HTML da página. O drawer reflecte os links automaticamente:

```html
<div class="site-nav">
  <a href="index.html"   class="site-nav-link">Início</a>
  <a href="news.html"    class="site-nav-link">Notícias</a>
  <a href="about.html"   class="site-nav-link">Sobre</a>
  <a href="contact.html" class="site-nav-link">Contacto</a>
  <!-- adicionar quantos itens forem necessários -->
</div>
```

Não existe limite de itens — o drawer faz scroll vertical se necessário.

## Behaviour

| Acção | Resultado |
|---|---|
| Toque no hambúrguer | Abre drawer, anima para × |
| Toque fora do drawer | Fecha |
| Toque num link | Navega e fecha o drawer |
| Tecla `Escape` | Fecha o drawer |
| Resize > 760px | Remove todos os elementos mobile |
| Resize ≤ 760px | Reinjecta se não existir |

## Accessibility

- `aria-expanded` no botão hambúrguer
- `aria-hidden` no drawer
- `aria-label` actualiza entre "Abrir menu" e "Fechar menu"
- Foco no input de chat após abertura (gerido pelo motor de canvas)
