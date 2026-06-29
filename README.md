# GreenRoute

Site institucional da GreenRoute — infraestrutura de internet verde.

## Estrutura de ficheiros

```
/
├── index.html              Página principal (canvas 2D grid)
├── about.html              Sobre a GreenRoute (canvas vertical)
├── news.html               Notícias (canvas vertical)
├── post.html               Artigo individual (canvas vertical)
├── README.md
├── COMPONENTS.md
├── CONTRIBUTING.md
├── assets/
│   ├── css/
│   │   └── main.css        Estilos globais + responsivo
│   └── js/
│       ├── main.js         Motor canvas 2D (index)
│       ├── canvas-vertical.js  Motor canvas vertical (subpages)
│       └── nav-mobile.js   Hambúrguer + drawer mobile
└── docs/
    ├── canvas-engine.md
    ├── nav-mobile.md
    ├── css-tokens.md
    └── adding-pages.md
```

## Correr localmente

Qualquer servidor estático serve. Exemplos:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# Instala a extensão "Live Server" e clica em "Go Live"
```

Abre `http://localhost:8080` no browser.

## Navegação

| Dispositivo | Acção |
|---|---|
| Desktop | Scroll, setas ↑↓←→, botões no ecrã |
| Tátil | Swipe vertical/horizontal |
| Mobile | Swipe vertical, hambúrguer para nav |

## Dependências

Nenhuma. HTML + CSS + JS vanilla.
