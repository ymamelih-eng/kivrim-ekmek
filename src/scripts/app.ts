/* ==========================================================================
   KIVRIM — istemci tarafı: header, sayfa geçişi, sepet, toast, arama, menü, formlar
   ========================================================================== */
import { initForms } from './forms';
import { initSlider } from './slider';

type P = { id: string; name: string; price: number; tint: string; d: string; img: string };
type R = { id: string; t: string; c: string; m: string; p: string; img: string };
type A = { id: string; t: string; c: string };
export type KvData = {
  shop: boolean; demo: boolean;
  form: { endpoint: string; key: string; newsletter: string; email: string };
  shipping: { freeMin: number; fee: number };
  products: P[]; recipes: R[]; articles: A[];
};

export const DATA: KvData = JSON.parse(document.getElementById('kv-data')!.textContent || '{}');
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
export const fmt = (n: number) => '₺' + n.toFixed(2).replace('.', ',');
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const icon = (n: string, size = 22, color = '') => `<span class="icon" aria-hidden="true" style="font-size:${size}px;${color ? 'color:' + color : ''}">${n}</span>`;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* özel mod */ } },
};
export { store };

/* ---------- Header: kaydırınca küçülme ---------- */
const onScroll = () => document.body.classList.toggle('is-scrolled', (document.scrollingElement?.scrollTop || 0) > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Sayfa geçiş perdesi (≈0.5 sn, yeni sayfa 220 ms sonra) ---------- */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element).closest('a');
  if (!a || a.target === '_blank' || a.hasAttribute('download') || a.dataset.noWipe !== undefined) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || /^(mailto|tel):/.test(a.href)) return;
  if (url.pathname === location.pathname && url.search === location.search) return; // aynı sayfa / çapa
  if (/\.(png|jpe?g|pdf|xml|txt|webp)$/i.test(url.pathname)) return;
  if (reduced()) return;
  e.preventDefault();
  const w = $('[data-wipe]')!;
  w.classList.remove('is-out'); void w.offsetWidth; w.classList.add('is-out');
  try { sessionStorage.setItem('kv-wipe', '1'); } catch { /* yok say */ }
  setTimeout(() => { location.href = url.href; }, 220);
});
window.addEventListener('pageshow', (e) => { if (e.persisted) $('[data-wipe]')?.classList.remove('is-out'); });
setTimeout(() => document.documentElement.classList.remove('kv-wipe-in'), 600);

/* ---------- Kaplama yardımcıları ---------- */
let lastFocus: HTMLElement | null = null;
function openLayer(el: HTMLElement, focusSel?: string) {
  lastFocus = document.activeElement as HTMLElement;
  el.hidden = false; document.body.classList.add('kv-lock');
  requestAnimationFrame(() => ($(focusSel || 'button, a, input', el) as HTMLElement | null)?.focus());
}
function closeLayer(el: HTMLElement) {
  if (el.hidden) return;
  el.hidden = true;
  if (!$$('[data-drawer]:not([hidden]),[data-search]:not([hidden]),[data-menu]:not([hidden])').length) document.body.classList.remove('kv-lock');
  lastFocus?.focus?.();
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  $$('[data-drawer],[data-search],[data-menu]').forEach((el) => closeLayer(el));
});

/* ---------- Toast ---------- */
let toastT: number | undefined;
export function flash(msg: string, withCart = false) {
  const t = $('[data-toast]')!;
  $('[data-toast-msg]', t)!.textContent = msg;
  $('[data-toast-cart]', t)!.toggleAttribute('hidden', !withCart);
  t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastT); toastT = window.setTimeout(() => { t.hidden = true; }, 2600);
}

/* ---------- Sepet (localStorage; sunucu oturumu e-ticaret entegrasyonunda eklenecek) ---------- */
type Cart = Record<string, number>;
const CART_KEY = 'kv-cart';
export const cart = {
  read: (): Cart => store.get<Cart>(CART_KEY, {}),
  write(c: Cart) { store.set(CART_KEY, c); renderCart(); },
  add(id: string, n: number) {
    const c = cart.read(); c[id] = (c[id] || 0) + n; if (c[id] <= 0) delete c[id]; cart.write(c);
    if (n > 0) {
      const p = DATA.products.find((x) => x.id === id);
      if (p) flash(`${p.name} sepete eklendi`, true);
      $$('.hdr-count').forEach((el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
    }
  },
  items() {
    const c = cart.read();
    return Object.keys(c).map((id) => ({ p: DATA.products.find((x) => x.id === id)!, qty: c[id] })).filter((x) => x.p);
  },
  totals() {
    const sub = cart.items().reduce((a, x) => a + x.p.price * x.qty, 0);
    const ship = sub === 0 ? 0 : sub >= DATA.shipping.freeMin ? 0 : DATA.shipping.fee;
    return { sub, ship, total: sub + ship, count: cart.items().reduce((a, x) => a + x.qty, 0) };
  },
  clear() { cart.write({}); },
};

export function renderCart() {
  const items = cart.items(); const t = cart.totals();
  $$('[data-cart-count]').forEach((el) => (el.textContent = String(t.count)));
  $$('[data-cart-subtotal]').forEach((el) => (el.textContent = fmt(t.sub)));
  const box = $('[data-cart-items]');
  if (box) {
    box.innerHTML = items.map(({ p, qty }) => `
      <div class="ci">
        <div class="ci-thumb" style="background:${p.tint}"><img src="${p.img}" alt="${esc(p.name)} ambalajı" loading="lazy"></div>
        <div class="ci-body">
          <div class="ci-row"><a class="ci-name" href="/urunler/${p.id}">${esc(p.name)}</a><button type="button" class="ci-del" aria-label="${esc(p.name)} ürününü kaldır" data-cart-set="${p.id}" data-n="0">${icon('delete')}</button></div>
          <div class="ci-row"><div class="qty-s"><button type="button" aria-label="Azalt" data-cart-add="${p.id}" data-n="-1">${icon('remove', 18)}</button><span>${qty}</span><button type="button" aria-label="Artır" data-cart-add="${p.id}" data-n="1">${icon('add', 18)}</button></div><b class="ci-line">${fmt(p.price * qty)}</b></div>
        </div>
      </div>`).join('');
  }
  $('[data-cart-empty]')?.toggleAttribute('hidden', items.length > 0);
  $('[data-checkout-link]')?.setAttribute('aria-disabled', String(items.length === 0));
  document.dispatchEvent(new CustomEvent('kv:cart'));
}

document.addEventListener('click', (e) => {
  const el = e.target as Element;
  const add = el.closest<HTMLElement>('[data-cart-add]');
  if (add) {
    e.preventDefault(); e.stopPropagation();
    const qtyFrom = add.dataset.qtyFrom ? Number($(add.dataset.qtyFrom)?.textContent || 1) : Number(add.dataset.n || 1);
    cart.add(add.dataset.cartAdd!, qtyFrom);
    if (add.dataset.openAfter !== undefined) { $('[data-toast]')!.hidden = true; openLayer($('[data-drawer]')!, '.drawer-x'); }
    return;
  }
  const set = el.closest<HTMLElement>('[data-cart-set]');
  if (set) { const c = cart.read(); delete c[set.dataset.cartSet!]; cart.write(c); return; }
  if (el.closest('[data-open-cart]') || el.closest('[data-toast-cart]')) {
    $('[data-toast]')!.hidden = true; $$('[data-menu]').forEach(closeLayer); openLayer($('[data-drawer]')!, '.drawer-x'); return;
  }
  if (el.closest('[data-close-cart]')) { closeLayer($('[data-drawer]')!); return; }
  if (el.closest('[data-open-search]')) { closeLayer($('[data-menu]')!); openSearch(); return; }
  if (el.closest('[data-close-search]') || el.matches('[data-search]')) { closeLayer($('[data-search]')!); return; }
  if (el.closest('[data-open-menu]')) { openLayer($('[data-menu]')!, '.mmenu-x'); return; }
  if (el.closest('[data-close-menu]')) { closeLayer($('[data-menu]')!); return; }
});
window.addEventListener('storage', (e) => { if (e.key === CART_KEY) renderCart(); });

/* ---------- Arama ---------- */
const lower = (s: string) => s.toLocaleLowerCase('tr-TR');
function openSearch() {
  const s = $('[data-search]')!; openLayer(s, '[data-search-input]'); runSearch();
}
function runSearch() {
  const input = $<HTMLInputElement>('[data-search-input]')!;
  const ql = lower(input.value.trim());
  const hit = (t: string) => !!ql && lower(t).includes(ql);
  const prods = ql ? DATA.products.filter((p) => hit(p.name) || hit(p.d)) : [];
  const recs = ql ? DATA.recipes.filter((r) => hit(r.t) || hit(r.p) || hit(r.c)).slice(0, 5) : [];
  const arts = ql ? DATA.articles.filter((a) => hit(a.t) || hit(a.c)).slice(0, 4) : [];
  $('[data-search-popular]')!.hidden = !!ql;
  const sec = (sel: string, html: string, has: boolean) => { const el = $(sel)!; el.hidden = !has; $('[data-list]', el)!.innerHTML = html; };
  sec('[data-search-products]', prods.map((p) => `<a class="sp-card" href="/urunler/${p.id}" style="background:${p.tint}"><img src="${p.img}" alt="" loading="lazy"><b>${esc(p.name)}</b><span data-shop>${fmt(p.price)}</span></a>`).join(''), prods.length > 0);
  sec('[data-search-recipes]', recs.map((r) => `<a class="sr-row" href="/tarifler/${r.id}"><img src="${r.img}" alt="" loading="lazy"><b>${esc(r.t)}</b><span>${r.c} · ${r.m}</span></a>`).join(''), recs.length > 0);
  sec('[data-search-articles]', arts.map((a) => `<a class="sa-row" href="/rehber/${a.id}">${icon('menu_book', 22, '#A8401C')}${esc(a.t)}</a>`).join(''), arts.length > 0);
  const none = $('[data-search-none]')!;
  none.hidden = !(ql && !prods.length && !recs.length && !arts.length);
  none.textContent = `“${input.value.trim()}” için sonuç bulunamadı. Farklı bir kelime deneyin.`;
}
$('[data-search-input]')?.addEventListener('input', runSearch);
$$<HTMLButtonElement>('[data-q]').forEach((b) => b.addEventListener('click', () => {
  const i = $<HTMLInputElement>('[data-search-input]')!; i.value = b.dataset.q!; runSearch(); i.focus();
}));
document.addEventListener('keydown', (e) => {
  if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !(e.target as Element).closest('input,textarea')) { e.preventDefault(); openSearch(); }
});

/* ---------- Ürün detay: adet seçici ---------- */
$$('[data-qty]').forEach((box) => {
  const out = $('[data-qty-val]', box)!;
  box.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-qty-step]'); if (!b) return;
    out.textContent = String(Math.max(1, Number(out.textContent) + Number(b.dataset.qtyStep)));
  });
});

/* ---------- Sekme/çip filtreleri (ana sayfa ürün aileleri, tarif kategorileri, B2B ilgi alanı) ---------- */
$$('[data-tabs]').forEach((group) => {
  const target = group.dataset.tabs!;
  group.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-tab]'); if (!b) return;
    $$('[data-tab]', group).forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    const v = b.dataset.tab!;
    $$(`[data-tab-panel="${target}"]`).forEach((el) => {
      const keys = (el.dataset.tabKey || '').split(' ');
      el.hidden = !(v === '*' || keys.includes(v));
    });
    const input = group.dataset.tabInput ? $<HTMLInputElement>(group.dataset.tabInput) : null;
    if (input) input.value = v;
  });
});

/* ---------- Tarif: yazdır / paylaş ---------- */
$$('[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));
$$('[data-share]').forEach((b) => b.addEventListener('click', () => {
  const d = { title: document.title, url: location.href };
  if (navigator.share) navigator.share(d).catch(() => {});
  else navigator.clipboard?.writeText(d.url).then(() => flash('Tarif bağlantısı kopyalandı'));
}));

renderCart();
initForms();
initSlider();
