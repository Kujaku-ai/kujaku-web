# kujaku-web

Layer 3 of the Kujaku platform. Public-facing frontend at kujaku.ai.

See `SITE.md` for the spec. See `SETUP.md` for the Cycle 1 setup that produced this scaffold.

Sibling repos:
- `kujaku-meta` — design system (brand/) + platform docs (SYSTEM.md)
- `kujaku-data-btc` — Layer 1 BTC collector
- `kujaku-bot-kalshi15min-btc` — Layer 2b Kalshi BTC bot
- `charting-calculations` — Layer 2a ICT indicators

## Dev

Run submodule init first, then install and dev:

- nvm use 20
- git submodule update --init --recursive
- npm install
- npm run dev

Served at http://localhost:4321
