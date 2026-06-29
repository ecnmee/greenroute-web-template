# Contributing

## Before you start

Read `README.md` to understand the structure and `COMPONENTS.md` for the available components. Check `docs/` for detailed technical guides.

## General rules

- No frameworks — the project is plain HTML + CSS + vanilla JS
- No CSS comments
- No unnecessary wrapper divs
- No hardcoded dimensional values that depend on element count
- Asset paths always relative to root: `assets/css/` and `assets/js/`

## Adding a new page

See `docs/adding-pages.md` for the full guide. Summary:

1. Create the HTML file at the root
2. Use `canvas-vertical.js` as the engine
3. Include `nav-mobile.js` and `i18n.js` before the main script
4. Add the link to `.site-nav` in **all** existing pages
5. Add `data-en` and `data-pt` attributes to all text content
6. The mobile drawer and language switcher update automatically

## Adding styles

- Edit `assets/css/main.css`
- Page-specific styles go in a `<style>` block in the page `<head>`, not in `main.css`
- Mobile breakpoint: `760px`, tablet: `961px`
- Always use existing CSS variables (`--c-hero`, `--c-problem`, etc.) — see `docs/css-tokens.md`

## Adding JS

- Logic reusable across pages → `assets/js/`
- Page-specific logic → inline `<script>` at the end of `<body>`
- Do not modify `main.js` or `canvas-vertical.js` without understanding the canvas engine

## Adding translations

Add `data-en="..."` and `data-pt="..."` to every new text element. The `i18n.js` switcher picks them up automatically. To add a third language, edit the `LANGS` array at the top of `i18n.js`.

## Testing

No build step. Run a local server (see `README.md`) and test on:

- Desktop (Chrome/Firefox/Safari) — scroll, arrow keys, buttons
- Touch desktop — swipe, buttons
- Mobile or DevTools ≤ 760px — swipe, hamburger, language switcher
- Tablet (761–960px) — confirm tiles collapse to 2 columns
