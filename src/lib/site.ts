import { siFacebook, siInstagram, siTiktok, siX } from 'simple-icons';

const env = import.meta.env;
const flag = (v: unknown, fallback: boolean) =>
  v === undefined || v === '' ? fallback : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());

/** E-ticaret anahtarı: false iken sepet/adet butonları gizlenir, "Toptan bilgi al" / "Nereden alırım?" görünür. */
export const SHOP_ENABLED = flag(env.PUBLIC_SHOP_ENABLED, false);
/** Tasarım önizlemesi: üyelik ve sipariş akışını backend olmadan (tarayıcıda) simüle eder. Canlıda kapalı tutun. */
export const DEMO_MODE = flag(env.PUBLIC_DEMO_MODE, false);
/** Form servisi (Web3Forms / Formspree / Getform …). Boşsa formlar e-posta istemcisine (mailto) düşer. */
export const FORM_ENDPOINT: string = env.PUBLIC_FORM_ENDPOINT || '';
export const FORM_ACCESS_KEY: string = env.PUBLIC_FORM_ACCESS_KEY || '';
/** Bülten için ayrı bir uç nokta (ör. Mailchimp/Brevo form action). Boşsa FORM_ENDPOINT kullanılır. */
export const NEWSLETTER_ENDPOINT: string = env.PUBLIC_NEWSLETTER_ENDPOINT || '';

export const SITE_URL = 'https://www.kivrimekmek.com';
export const EMAIL = 'info@kivrimekmek.com';
export const ADDRESS = { street: 'Alemdağ Cad. No:89 Daire:16', district: 'Ümraniye', city: 'İstanbul' };
export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.district} / ${ADDRESS.city}`;
export const HOURS = 'Hafta içi 09:00–18:00';

export const FREE_SHIPPING_MIN = 300; // örnek kural — gerçek değerle değiştirin
export const SHIPPING_FEE = 49.9; // örnek değer

export const NAV = [
  { href: '/urunler', label: 'Ürünler' },
  { href: '/tarifler', label: 'Tarifler' },
  { href: '/kivrim-dunyasi', label: 'KIVRIM Dünyası' },
  { href: '/isletmeler', label: 'İşletmeler İçin' },
  { href: '/iletisim', label: 'İletişim' },
];

export const MENU = [
  ...NAV,
  { href: '/rehber', label: 'Lavaş Rehberi' },
  { href: '/sss', label: 'Sıkça Sorulan Sorular' },
  { href: '/hesabim', label: 'Hesabım' },
];

// Bağlantılar henüz belirlenmedi — hesaplar açıldığında doldurun.
export const SOCIALS = [
  { name: 'Instagram', href: '#', path: siInstagram.path },
  { name: 'Facebook', href: '#', path: siFacebook.path },
  { name: 'X', href: '#', path: siX.path },
  { name: 'TikTok', href: '#', path: siTiktok.path },
];

export const CATALOG_URL = '/katalog/kivrim-urun-katalogu.png';

export const fmt = (n: number) => '₺' + n.toFixed(2).replace('.', ',');
export const upperTR = (s: string) => s.toLocaleUpperCase('tr-TR');
