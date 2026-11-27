# KIVRIM — Lavaş & Tortilla web sitesi

`design-reference/` klasöründeki yüksek sadakatli HTML prototipinin (**KIVRIM Site.dc.html**) **Astro 7** ile çok sayfalı, statik üretilen (SSG) Türkçe siteye dönüştürülmüş hâli.

- Her sayfanın kendi URL'i, sayfaya özel `title` / `description` / canonical / `hreflang=tr` / Open Graph
- JSON-LD: Organization, WebSite, BreadcrumbList, FAQPage, Product, Recipe, Article, Blog, ItemList
- Otomatik `sitemap-index.xml` + `robots.txt`
- Görseller derleme sırasında WebP'ye çevrilir, `srcset` + lazy-loading ile sunulur
- Material Symbols yalnızca kullanılan ikonlarla (alt küme) yüklenir
- `PUBLIC_SHOP_ENABLED` ile e-ticaret açılıp kapanır

## Hızlı başlangıç

```bash
npm install
cp .env.example .env     # değişkenleri düzenleyin
npm run dev              # http://localhost:4321
npm run build            # dist/ klasörüne statik çıktı
npm run preview
```

Node 22.23+ gerekir (`.nvmrc`).

## Sayfalar

| URL | Dosya |
|---|---|
| `/` | `src/pages/index.astro` |
| `/urunler`, `/urunler/lavas`, `/urunler/tortilla` | `src/pages/urunler/*.astro` |
| `/urunler/{klasik-lavas…protein-tortilla}` | `src/pages/urunler/[slug].astro` |
| `/tarifler`, `/tarifler/{slug}` | `src/pages/tarifler/` |
| `/rehber`, `/rehber/{slug}` | `src/pages/rehber/` |
| `/kivrim-dunyasi`, `/isletmeler`, `/iletisim`, `/sss` | `src/pages/` |
| `/kvkk`, `/cerez-politikasi`, `/mesafeli-satis-sozlesmesi` | `src/pages/` + `src/content/yasal/*.md` |
| `/hesabim`, `/odeme`, `/siparis-onayi` (noindex) | `src/pages/` |

## İçerik nereden düzenlenir?

| İçerik | Dosya |
|---|---|
| Ürünler (ad, fiyat, açıklama, ambalaj görseli) | `src/data/products.json` |
| Tarifler (malzeme, adım, süre, ürün) | `src/data/recipes.json` |
| SSS | `src/data/faq.json` |
| Rehber yazıları | `src/content/rehber/*.md` (ön bilgi + `##` başlıklı gövde) |
| Yasal metinler | `src/content/yasal/*.md` — **hukuk onayı gerekir** |
| İletişim, menü, sosyal bağlantılar, kargo kuralı | `src/lib/site.ts` |
| Renk / tipografi token'ları | `src/styles/base.css` (`:root`) |
| Görseller | `src/assets/foto`, `src/assets/paket`, `src/assets/logo` |

Yeni ikon kullandıysanız `npm run icons` çalıştırın (Google Fonts alt küme listesini günceller).

## Ortam değişkenleri

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `PUBLIC_SHOP_ENABLED` | `false` | `true`: sepet, fiyat, adet, ödeme görünür. `false`: yerine "Toptan bilgi al" / "Nereden alırım?" |
| `PUBLIC_FORM_ENDPOINT` | — | Form servisi (Web3Forms, Formspree, Getform…). Boşsa formlar `mailto:` ile e-posta uygulamasını açar |
| `PUBLIC_FORM_ACCESS_KEY` | — | Web3Forms erişim anahtarı (herkese açık anahtar, gizli değildir) |
| `PUBLIC_NEWSLETTER_ENDPOINT` | — | Bülten için ayrı uç nokta (boşsa form uç noktası) |
| `PUBLIC_DEMO_MODE` | `false` | Tasarım önizlemesi: üyelik/ödeme tarayıcıda simüle edilir. **Canlıda kapalı tutun** |

Değişkenler derleme anında okunur; değiştirince yeniden deploy edin.

### Formlar
İletişim, toptan görüşme (numune / teknik föy / bayilik), bülten ve sipariş talebi formları tek bir form servisine JSON olarak gönderilir; e-postada alanlar Türkçe etiketleriyle görünür. Örnek (Web3Forms, ücretsiz): web3forms.com'da `info@kivrimekmek.com` için anahtar alın →
`PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit`, `PUBLIC_FORM_ACCESS_KEY=<anahtar>`.

### E-ticaret durumu
Ödeme altyapısı henüz bağlı değildir. `PUBLIC_SHOP_ENABLED=true` iken sepet tarayıcıda (`localStorage`) tutulur ve "Ödeme" adımı **kart bilgisi almadan** bir *sipariş talebi* olarak form servisine iletilir. Üyelik/giriş için backend yoktur (yalnızca demo modunda simüle edilir). Gerçek altyapı (Shopify / ikas / iyzico / PayTR / Stripe) seçildiğinde `src/pages/odeme.astro`, `src/pages/hesabim.astro` ve `src/scripts/app.ts` içindeki `cart` nesnesi entegre edilecektir.

## Yayına alma

### Vercel
1. vercel.com → **Add New → Project** → GitHub'dan `kivrim-ekmek` deposunu içe aktarın.
2. Framework otomatik **Astro** algılanır (`vercel.json` hazır: `cleanUrls`, sonda `/` yok, önbellek başlıkları).
3. **Settings → Environment Variables**'a `.env.example` içindekileri girin → **Deploy**.
4. **Settings → Domains** → `www.kivrimekmek.com` ekleyin, DNS'te gösterilen CNAME kaydını tanımlayın; çıplak alan adını `www`'ye yönlendirin.

### Cloudflare Pages
1. dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → depoyu seçin.
2. Framework preset: **Astro**, build komutu `npm run build`, çıktı klasörü `dist`.
3. **Environment variables**: `NODE_VERSION=22`, ayrıca `.env.example` içindekiler.
4. **Custom domains** → `www.kivrimekmek.com`.

Her iki platform da `main` dalına her push'ta otomatik yeniden derler; diğer dallar için önizleme URL'i üretir.

### Yayın öncesi kontrol listesi
- [ ] Gerçek fiyatlar, kargo kuralı (`src/lib/site.ts`: `FREE_SHIPPING_MIN`, `SHIPPING_FEE`)
- [ ] Besin değerleri, içindekiler, alerjen, gramaj (ürün sayfasındaki `[…]` yer tutucular)
- [ ] Yasal metinlerin hukuk onayı
- [ ] Sosyal medya bağlantıları (`SOCIALS`)
- [ ] Lisanslı/gerçek ürün ve tarif fotoğrafları (şu an temsili görseller)
- [ ] Katalog PDF'i (`public/katalog/` — şu an PNG)
- [ ] Google Search Console'a `https://www.kivrimekmek.com/sitemap-index.xml` gönderimi

## Tasarımdan bilinçli sapmalar
- Prototipte bulunmayan iki tarif görseli (`25-5`, `26-6`) yerine kesit ürün görselleri kullanıldı.
- Slider süresi prototip koduyla aynı (6,5 sn; README'de 5 sn yazıyordu) — `src/scripts/slider.ts` → `SLIDE_MS`.
- Ödeme sayfasında, altyapı bağlanana kadar kart alanları ve "3D Secure" ibaresi gösterilmez (demo modu hariç).
- Mağaza kapalıyken "online sipariş" ifadeleri metinlerden ve meta açıklamalardan çıkarılır.
