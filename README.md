# Night Watch Dog

Prelaunch website for Night Watch Dog ($NWDOG), an independent Ethereum meme project. The dog is a fictional character. This site explains the idea, shows only published token facts, and sends people to Uniswap only when trading is explicitly configured.

Night Watch Dog is an independent meme project. It is not affiliated with or endorsed by Elon Musk, Tesla, or SpaceX.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm test
```

`npm run assets` rebuilds WebP, AVIF, PNG, favicon, and social-preview files from `public/assets/originals`.

## Go live

Buy buttons stay off until all three of these are true in `src/config/token.ts`:

1. `launchStatus` is `"live"`.
2. `contractAddress` is a real Ethereum address. Mixed-case addresses must match their EIP-55 checksum. All-lowercase and all-uppercase hex are accepted because they do not carry a checksum. A valid address is not proof the token is authentic.
3. `swapUrl` is an `https://app.uniswap.org` swap link whose `chain` is `ethereum` and whose `outputCurrency` is that same address.

Use one of these shapes, from Uniswap's custom-linking and embed docs (reviewed October 5, 2026):

```text
https://app.uniswap.org/swap?chain=ethereum&inputCurrency=ETH&outputCurrency=0xYourAddress
https://app.uniswap.org/#/swap?chain=ethereum&inputCurrency=ETH&outputCurrency=0xYourAddress
```

`chainId` must stay `1`. A wrong chain, a different output token, a non-HTTPS link, or any host other than `app.uniswap.org` keeps the buy buttons off. The site will not invent a Uniswap link from an address, and it will not show a sample `0x` address.

Leave unknown supply, tax, allocation, liquidity, ownership, admin, audit, chart, and social fields as `null`. Unknown tax is not zero. `siteUrl` is `https://nwdog.world`, which adds the canonical URL and `sitemap.xml`.

## Deploy

This is a static site. No wallet, API key, or server is required.

Pushes to `main` run `.github/workflows/pages.yml`, build `dist`, and publish it with GitHub Pages. The custom domain is `nwdog.world` (`public/CNAME`). The live site is [https://nwdog.world/](https://nwdog.world/).

```bash
npm ci
npm run build
```

`npm run preview` serves the same `dist` folder locally. Anchors stay on one page, so a single-page fallback is unnecessary.

## Art

Supplied and used:

- Full badge (name and ticker) → `public/assets/nwdog-logo-full.png`
- Wide banner → `public/assets/nwdog-banner.jpg`
- Telegram banner → `public/assets/nwdog-tg-banner.jpg`

Originals are in `public/assets/originals`. The hero uses the full badge inside a comic frame. A separate character cutout was not supplied.

Still missing. Drop these in without renaming if you want the header and story to use them:

- `public/assets/nwdog-logo-name.png` (name only)
- `public/assets/nwdog-logo-mark.png` (no text, for the header and favicon)

Until the no-text mark exists, the header and favicon use the full badge scaled down. Those files are not placeholders drawn to look like finished art.

## Tests

`npm test` covers purchase gating (prelaunch, missing address, invalid address, bad checksum, wrong token, wrong chain, unsafe URL, valid live state), exact-address copy, mobile menu escape and focus return, night-vision storage failure, and fan-badge PNG export.

## Owner inputs still open

- Final contract address
- Confirmed Ethereum Uniswap swap URL
- Circulating supply and allocations
- Liquidity, lock, burn, ownership, admin, and audit evidence URLs
- `launchStatus: "live"` when trading should actually be offered
- The two missing badge files above, if you want them
