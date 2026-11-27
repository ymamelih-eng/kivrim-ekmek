// Kullanılan Material Symbols ikonlarını toplar ve src/lib/icons.ts dosyasını günceller.
// Google Fonts yalnızca bu ikonları içeren küçük bir font dosyası sunar (icon_names parametresi).
// Kullanım: npm run icons  (önce derler, sonra dist/ ve src/scripts içini tarar)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const names = new Set();
for (const f of walk('dist').filter((f) => f.endsWith('.html'))) {
  for (const m of readFileSync(f, 'utf8').matchAll(/class="icon[^"]*"[^>]*>([a-z0-9_]+)</g)) names.add(m[1]);
}
for (const f of walk('src/scripts')) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/icon\('([a-z0-9_]+)'/g)) names.add(m[1]);
}
// Hesabım (demo) ve ödeme gibi istemcide üretilen ikonlar
for (const n of ['favorite', 'logout', 'receipt_long', 'home_pin', 'person', 'home', 'work', 'add_location_alt', 'check', 'lock', 'local_shipping']) names.add(n);
const list = [...names].sort();
writeFileSync('src/lib/icons.ts', `// Material Symbols alt kümesi (Google Fonts \`icon_names\`). \`npm run icons\` ile yeniden üretilir.\nexport const ICON_NAMES: string[] = ${JSON.stringify(list, null, 0).replace(/,/g, ', ')};\n`);
console.log(list.length + ' ikon:', list.join(' '));
