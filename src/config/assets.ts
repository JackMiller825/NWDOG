import { assetMeta } from './assetMeta.ts';

export const logoFull = {
  png: '/assets/nwdog-logo-full.png',
  webp: '/assets/nwdog-logo-full.webp',
  avif: '/assets/nwdog-logo-full.avif',
  width: assetMeta.logo.width,
  height: assetMeta.logo.height,
  alt: 'Cartoon Shiba in a reflective safety vest and green night-vision goggles, pointing at the viewer, inside a circular Night Watch Dog badge with the name and $NWDOG.',
};

export const bannerArt = {
  jpg: '/assets/nwdog-banner.jpg',
  webp: '/assets/nwdog-banner.webp',
  avif: '/assets/nwdog-banner.avif',
  width: assetMeta.banner.width,
  height: assetMeta.banner.height,
  alt: 'Wide night-city banner showing Night Watch Dog pointing forward, with the words Night Watch Dog, $NWDOG, and Small dog. Big night shift.',
};

export const telegramBanner = {
  jpg: '/assets/nwdog-tg-banner.jpg',
  webp: '/assets/nwdog-tg-banner.webp',
  avif: '/assets/nwdog-tg-banner.avif',
  width: assetMeta.telegram.width,
  height: assetMeta.telegram.height,
  alt: 'Telegram banner of Night Watch Dog in a safety vest and night-vision goggles, pointing forward beside the project name.',
};

export const brandDownloads = [
  { href: logoFull.png, label: 'Full badge, name and ticker', filename: 'nwdog-logo-full.png' },
  { href: bannerArt.jpg, label: 'Wide banner', filename: 'nwdog-banner.jpg' },
  { href: telegramBanner.jpg, label: 'Telegram banner', filename: 'nwdog-tg-banner.jpg' },
] as const;
