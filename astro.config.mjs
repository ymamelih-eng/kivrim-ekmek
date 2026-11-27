// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_');
const SHOP = ['1', 'true', 'yes', 'on'].includes(String(process.env.PUBLIC_SHOP_ENABLED ?? env.PUBLIC_SHOP_ENABLED ?? '').toLowerCase());
// Arama motorlarına kapalı sayfalar; mağaza kapalıyken mesafeli satış sözleşmesi de (yönlendirme sayfası)
const NOINDEX = ['/hesabim', '/odeme', '/siparis-onayi', '/404', ...(SHOP ? [] : ['/mesafeli-satis-sozlesmesi'])];

export default defineConfig({
  site: 'https://www.kivrimekmek.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  image: { responsiveStyles: false },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => new URL(page).pathname.startsWith(p)),
      changefreq: 'weekly',
      i18n: { defaultLocale: 'tr', locales: { tr: 'tr-TR' } },
    }),
  ],
});
