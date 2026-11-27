import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{png,jpg,jpeg}', { eager: true });

function find(folder: string, key: string): ImageMetadata {
  const hit = Object.entries(all).find(([p]) => p.startsWith(`/src/assets/${folder}/${key}.`));
  if (!hit) throw new Error(`Görsel bulunamadı: ${folder}/${key}`);
  return hit[1].default;
}

export const photo = (key: string) => find('foto', key);
export const pack = (key: string) => find('paket', key);
export const logo = (key: 'renkli' | 'beyaz') => find('logo', key);
