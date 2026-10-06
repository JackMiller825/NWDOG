import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import { tokenConfig } from './src/config/token.ts';

function httpsHref(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username !== '' || url.password !== '') return null;
    return url.href;
  } catch {
    return null;
  }
}

function siteMetadata(): Plugin {
  const canonical = httpsHref(tokenConfig.siteUrl);
  const image = canonical ? new URL('/assets/og.jpg', canonical).href : '/assets/og.jpg';
  return {
    name: 'nwdog-site-metadata',
    transformIndexHtml(html) {
      return html
        .replaceAll('__OG_IMAGE__', image)
        .replaceAll('<!--canonical-->', canonical ? `<link rel="canonical" href="${canonical}" />` : '');
    },
    generateBundle() {
      if (!canonical) return;
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${canonical}</loc></url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMetadata()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
});
