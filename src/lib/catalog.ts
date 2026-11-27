import { getCollection, type CollectionEntry } from 'astro:content';
import productOrder from '../data/products.json';
import recipeOrder from '../data/recipes.json';

const byJson = (ids: { id: string }[]) => (a: { id: string }, b: { id: string }) =>
  ids.findIndex((x) => x.id === a.id) - ids.findIndex((x) => x.id === b.id);

export type Product = CollectionEntry<'products'>['data'];
export type Recipe = CollectionEntry<'recipes'>['data'];
export type Article = CollectionEntry<'rehber'>;
export type Family = Product['family'];

export const FAMILIES = {
  lavas: {
    title: 'Lavaş', lead: 'Sofraların klasiği,', em: 'yeniden yorumlandı.',
    desc: 'İnce, esnek ve kolay katlanan lavaş çeşitleri. Kahvaltıdan dürüme, evden profesyonel mutfağa.',
    feats: [{ i: 'kebab_dining', t: 'Dürüm ve sarmalar' }, { i: 'breakfast_dining', t: 'Kahvaltı sofraları' }, { i: 'skillet', t: 'Isıt, katla, servis et' }],
  },
  tortilla: {
    title: 'Tortilla', lead: 'Dünyanın sarması,', em: 'bizim sofrada.',
    desc: 'Wrap, quesadilla ve pratik tabaklar için yumuşak dokulu tortilla çeşitleri.',
    feats: [{ i: 'lunch_dining', t: 'Wrap ve quesadilla' }, { i: 'tapas', t: 'Atıştırmalık tabaklar' }, { i: 'local_pizza', t: 'Pratik taban tarifleri' }],
  },
} as const;

export async function getProducts() {
  return (await getCollection('products')).map((e) => e.data).sort(byJson(productOrder));
}
export async function getProduct(id: string) {
  const p = (await getProducts()).find((x) => x.id === id);
  if (!p) throw new Error('Ürün yok: ' + id);
  return p;
}
export async function getRecipes() {
  return (await getCollection('recipes')).map((e) => e.data).sort(byJson(recipeOrder));
}
export async function getArticles() {
  return (await getCollection('rehber')).sort((a, b) => a.data.order - b.data.order);
}
export async function getLegal() {
  return (await getCollection('yasal')).sort((a, b) => a.data.order - b.data.order);
}

/** Prototipteki kural: 3'ten fazla adım "Orta", aksi "Kolay". */
export const recipeLevel = (r: Recipe) => (r.steps.length > 3 ? 'Orta' : 'Kolay');
/** Prototipteki tahmin: hazırlık = toplam/3 (en az 5 dk). Gerçek değerlerle değiştirilebilir. */
export function recipeTimes(r: Recipe) {
  const mm = r.minutes;
  const prep = Math.max(5, Math.round(mm / 3));
  return {
    prep, cook: mm - prep > 0 ? mm - prep : 0,
    prepLabel: prep + ' dk', cookLabel: mm - prep > 0 ? mm - prep + ' dk' : '—',
    diff: mm <= 15 ? 'Kolay' : mm <= 30 ? 'Orta' : 'Özenli',
  };
}

export const formatDateTR = (d: Date) =>
  d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
