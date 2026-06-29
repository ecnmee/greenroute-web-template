# Guia de contribuição

## Antes de começar

Lê o `README.md` para perceber a estrutura e o `COMPONENTS.md` para perceber os componentes disponíveis. Consulta `docs/` para guias técnicos detalhados.

## Regras gerais

- Sem frameworks — o projecto é HTML + CSS + JS vanilla
- Sem comentários no CSS
- Sem `div` wrappers desnecessários
- Sem valores dimensionais hardcoded dependentes do número de elementos
- Caminhos de assets sempre relativos à raiz: `assets/css/` e `assets/js/`

## Adicionar uma nova página

Ver `docs/adding-pages.md` para o guia completo. Resumo:

1. Cria o ficheiro HTML na raiz
2. Usa `canvas-vertical.js` como motor
3. Inclui `nav-mobile.js` antes do script principal
4. Adiciona o link em `.site-nav` em **todas** as páginas existentes
5. O drawer mobile actualiza-se automaticamente

## Adicionar estilos

- Edita `assets/css/main.css`
- Estilos específicos de página vão num `<style>` no `<head>` da própria página, não no `main.css`
- O breakpoint mobile é `760px`, tablet `961px`
- Usa sempre variáveis CSS existentes (`--c-hero`, `--c-problem`, etc.) — ver `docs/css-tokens.md`

## Adicionar JS

- Lógica reutilizável entre páginas → `assets/js/`
- Lógica específica de uma página → `<script>` inline no final do `<body>`
- Não modificar `main.js` nem `canvas-vertical.js` sem perceber o motor de canvas

## Testar

Sem build step. Corre um servidor local (ver `README.md`) e testa em:

- Desktop (Chrome/Firefox/Safari) — scroll, setas, botões
- Desktop tátil — swipe, botões
- Mobile real ou DevTools ≤ 760px — swipe, hambúrguer
- Tablet (761–960px) — confirmar que tiles colapsam para 2 colunas
