# Rijksdriehoeksmeting

Interactive map: https://bertspaan.nl/rijksdriehoeksmeting/.

Data: https://github.com/bertspaan/rijksdriehoeksmeting-data

## Development

The website uses Vue 3, TypeScript, Vite, and [MapLibre GL JS](https://maplibre.org/) with [OpenFreeMap’s Positron style](https://openfreemap.org/quick_start/).

Use Node.js 24 (or Node.js 22.12+) and the pnpm version pinned in `package.json`:

```sh
pnpm install
pnpm dev
```

Open http://localhost:5173/rijksdriehoeksmeting/. The exhibition controller and display are at `tentoonstelling/` and `tentoonstelling/display/` under the same base path.

```sh
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm preview
```

`pnpm serve` is also available as an alias for the development server.

## Deployment

[Deploy website](.github/workflows/deploy.yml) checks, builds, and deploys GitHub Pages on every push to `main`. Pull requests run lint, TypeScript checks, layout tests, and a production build. A deployment can also be started manually from the Actions tab.

GitHub Pages must use **GitHub Actions** as its source in the repository’s Pages settings. The workflow uploads `dist` directly; no deployment branch is needed.

The default base path is `/rijksdriehoeksmeting/`. For another location, set `PUBLIC_PATH`, for example:

```sh
PUBLIC_PATH=/ pnpm build
```

## Exhibition connection

The exhibition pages require a separate WebSocket server. The original Glitch host currently returns HTTP 410, so synchronization needs a replacement server. Set `VITE_WS_URL` in `.env.local` or as a GitHub repository variable for deployment:

```sh
VITE_WS_URL=wss://example.org/ws
```

The main interactive map works independently of the exhibition server.

## IIIF

The website uses [IIIF](https://iiif.io/) and `srcset` to fetch and show responsive images. See [IIIFImage.vue](src/components/IIIFImage.vue) for details.
