# Handoff: KIVRIM Web Sitesi (Lavaş & Tortilla — tanıtım + e-ticaret)

## Overview
KIVRIM, 3 lavaş + 3 tortilla çeşidi olan yeni bir unlu mamuller markasıdır. Site; tanıtım, ürünler, tarifler, rehber (blog), B2B/işletmeler, SSS, yasal sayfalar, hesap, sepet/ödeme ve sipariş onayı akışını kapsar. Dil: **Türkçe**. Hedef: ulusal FMCG markası algısı (premium, ferah, editorial, iştah açıcı).

## About the Design Files
`KIVRIM Site.dc.html` bir **HTML tasarım referansıdır** (prototip). Üretim kodu değildir; doğrudan yayınlanmamalıdır. Görev: bu tasarımı hedef kod tabanında (yoksa **Next.js** veya **Astro** önerilir — SEO için sayfa başına gerçek URL + sunucu tarafı/statik render şart) yeniden oluşturmaktır. Tasarım dosyası tek bir "Design Component" olup `support.js` ile çalışır; tarayıcıda açarak davranışı inceleyin. Tüm stiller inline'dır; bunları tasarım token'larına dönüştürün.

## Fidelity
**Yüksek sadakat (hifi).** Renkler, tipografi, boşluklar, animasyonlar nihai. Piksel hassasiyetinde yeniden oluşturun.

## Sayfalar (state: `page`) → önerilen URL
| Sayfa | URL | Amaç |
|---|---|---|
| home | `/` | Slider, ürün aileleri, öne çıkanlar, protein serisi, tarifler, işletmeler teaser, rehber, SSS özeti |
| urunler | `/urunler` (+ `/urunler/lavas`, `/urunler/tortilla`) | Ürün listesi, aile filtresi |
| urun | `/urunler/{slug}` | Ürün detay: galeri, adet, sepete ekle, besin değerleri, içindekiler/alerjen, tarifler, benzer ürünler |
| tarifler | `/tarifler` | Kategori filtreli tarif listesi |
| tarif | `/tarifler/{slug}` | Tarif detay (malzeme, adımlar, ürün, yazdır/paylaş) |
| rehber | `/rehber` | Blog listesi (öne çıkan + grid) |
| yazi | `/rehber/{slug}` | Makale (6 yazı) |
| dunya | `/kivrim-dunyasi` | Marka hikâyesi/değerler |
| isletmeler | `/isletmeler` | B2B: teklif formu, katalog, föy, numune, bayilik |
| iletisim | `/iletisim` | İletişim formu + bilgiler |
| sss | `/sss` | 4 kategori, 14 soru (accordion) |
| yasal | `/kvkk`, `/cerez-politikasi`, `/mesafeli-satis-sozlesmesi` | Yasal metinler |
| hesap | `/hesabim` | Giriş/üye ol; siparişler, adresler, bilgiler, favoriler |
| odeme | `/odeme` | Checkout |
| onay | `/siparis-onayi` | Sipariş sonrası |
Global: sticky header, sepet çekmecesi, arama overlay'i, mobil tam ekran menü, footer, bülten bandı, sayfa geçiş perdesi, toast.

## Ürünler (yalnızca bu 6)
Lavaş: Klasik · Tam Buğday · Protein. Tortilla: Klasik · Tam Buğday · Protein.
Slug: `klasik-lavas`, `tam-bugday-lavas`, `protein-lavas`, `klasik-tortilla`, `tam-bugday-tortilla`, `protein-tortilla`.
Fiyatlar **örnektir**: Lavaş 49,90 / 59,90 / 79,90 ₺; Tortilla 54,90 / 62,90 / 84,90 ₺. Ücretsiz kargo ≥ ₺300 (uydurma kural), altı ₺49,90. **Gerçek değerlerle değiştirilmeli.**
Ambalaj görselleri `assets/gorseller/pk-{lavas|tortilla}-{klasik|tam-bugday|protein}.png` (şeffaf PNG, 560px genişlik, oran 1122/1402). Üretimde yüksek çözünürlüklü ambalaj çekimleri kullanılmalı.

## Layout & Sistem
- **Container:** max-width 1600px (header), içerik 1600px; yatan padding `clamp(20px,3.6vw,56px)`.
- **Header:** sticky, beyaz %90 + blur, logo solda (yükseklik `clamp(56px,4.6vw,72px)` → scroll sonrası 50px; dikey padding 16→8px), nav ortada (flex:1, center, gap `clamp(18px,2.4vw,40px)`), sağda arama / hesap / Sepet (sayaç rozeti) / mobilde hamburger. Breakpoint ≤1100px nav gizlenir, hamburger görünür.
- **Hero slider (3 slayt, 5 sn otomatik):** kart kenar yarıçapı 10px, yükseklik `clamp(620px,52vw,780px)`. Geçiş: `clip-path: inset(0 0 0 100%) → inset(0)` 1.3s `cubic-bezier(.77,0,.18,1)`; arka plan fotoğrafı `scale(1.16→1.02)` 9s; başlık satır satır `translateY(110%→0)` 1.1s, kademeli gecikme; CTA/paragraf `opacity+translateY(30px)` 0.9s.
  1. Lavaş — tam ekran fotoğraf (`dunya-ust.jpg`), solda koyu yeşil gradyan, başlık "İncecik. Esnek. *Sofralık.*", paket sağ altta −7° açıyla.
  2. Tortilla — sarı (#F6D98E) zemin, sağda fotoğraf (%54), paket birleşimde +5°, başlık "Sar. Katla. *Paylaş.*" 
  3. Tarifler — tam ekran fotoğraf, alttan metin, "Her öğüne *yeni bir fikir.*", "Günün tarifi" bağlantısı.
  Sağ üstte "01 — 03" sayaç (slayt 2'de koyu yeşil, diğerlerinde beyaz). **Alt bant** (yükseklik 96px): bordo→turuncu gradyan `#7A2418 → #A8401C → #D06A1E`, 3 sekme (küçük görsel, numara, ad, ilerleme çizgisi `kvProg`), ok butonları. Mobilde (≤900/600px) paket, küçük görsel, oklar gizlenir; yükseklik 620px.
- **Ürün kartları:** 3 sütun (≤900px 2, ≤600px 1); açık pastel zemin, paket ortada, hover'da hafif yukarı kayma; sepete ekle butonu 48×48, radius 8.
- **Ürün detay:** büyük ürün alanı, adet seçici (52px yükseklik), "Sepete ekle" (52px, padding 0 26px, radius 8), besin tablosu (100 g başına: Enerji, Yağ, Doymuş yağ, Karbonhidrat, Şekerler, Lif, Protein, Tuz) — **tüm değerler boş (—)**; "Değerler laboratuvar analizi onaylandıktan sonra yayımlanacaktır" notu. İçindekiler/alerjen/gramaj **köşeli parantezli yer tutucu**.
- **Radius:** butonlar 6–8px, kartlar 10–12px, rozet/chip 4–6px; ana kartta yuvarlak (pill) kullanılmaz.
- **Footer:** koyu yeşil (#0B3D1F), asimetrik üst kenar `clip-path: polygon(0 0,100% 8%,100% 100%,0 92%)`, 5 sütun (marka, menü, yardım, iletişim vb.), sosyal ikonlar (Instagram, Facebook, X, TikTok), yasal bağlantılar (KVKK, Çerez, Mesafeli Satış). Ödeme logoları, "3D Secure", iade koşulları **bilerek yok**.
- **Arka plan:** beyaz ve kırık beyaz (#FAF8F4), hafif bej doku; bölüm vurguları pastel (#E6F2DA yeşil, #FDEBD9 şeftali, #FBF1D3 sarı, #F3E7DA bej).

## Design Tokens
**Renk:** Koyu yeşil `#0B3D1F` (birincil/ink), yeşil `#087238`, açık yeşil `#72BF16`, altın/krem vurgu `#F9DF9D`, turuncu `#F47A12` (alt çizgi/vurgu), turuncu koyu `#C75F08`, bordo `#7A2418`, tuğla `#A8401C`, gövde metni `#3D5446`, ayraç `#ECE7DE`, kenar `#E5DFD3`, kırık beyaz `#FAF8F4`, krem `#F3ECDF`, beyaz `#FFFFFF`.
**Tipografi:** Başlık **Bricolage Grotesque** 800, letter-spacing −0.04…−0.05em, satır yüksekliği 0.9–1.0; vurgu italik **DM Serif Display** (≈1.04em, ters eğik, renkli); gövde **DM Sans**; etiket/sayaç **JetBrains Mono**. Hero başlık `clamp(58px,7.6vw,120px)`; bölüm başlığı `clamp(36px,4.2vw,64px)`; gövde 16–18px/1.6–1.75. Etiketler (eyebrow): 12px, 700, letter-spacing .18em, altında 3px turuncu çizgi.
**İkonlar:** Material Symbols Rounded, FILL 1, wght 500, 22–34px.
**Spacing:** bölüm arası 96–110px; grid gap `clamp(12px,1.4vw,20px)`.
**Motion:** 200–400ms mikro etkileşim, ease `cubic-bezier(.2,.7,.2,1)`; hero 0.9–1.3s; `prefers-reduced-motion` desteklenir.
**Breakpoint:** 1100 (nav→hamburger), 900 (grid 4→2, 3→1, 2→1), 600 (tek sütun, mobil hero).

## Interactions & Behavior
- **Sayfa geçişi:** turuncu + yeşil kıvrık perde (logo ortada) ≈0.5s; yeni sayfa 220ms sonra yüklenir. Reduced-motion'da atlanır.
- **Slider:** otomatik 5s; sekme/ok ile manuel; ilerleme çizgisi.
- **Sepete ekle:** sepete yazar, altta toast ("… sepete eklendi" + "Sepete git"), 2.6s.
- **Sepet çekmecesi:** sağdan; adet ±, kaldırma, ara toplam, kargo hesabı, ödemeye git. Boş durum ekranı var.
- **Arama:** tam ekran overlay; ürün / tarif / rehber sonuçları, boşken "popüler aramalar", sonuç yoksa mesaj.
- **Hesap:** giriş/üye ol sekmesi (şu an sahte), giriş sonrası Siparişlerim / Adreslerim / Hesap bilgileri / Favoriler.
- **Sipariş tamamla:** `placeOrder` → sipariş numarası üretir, onay sayfası + önerilen tarifler.
- **Tarif:** hazırlık/pişirme/zorluk (şu an toplam süreden tahmin), Yazdır (`window.print`), Paylaş (Web Share / panoya kopyala).
- **E-ticaret anahtarı:** `shopEnabled` prop'u `false` olunca sepet/adet butonları gizlenir; yerine "Toptan bilgi al" ve "Nereden alırım?" gösterilir. Ürünler satışa hazır olana kadar kapalı yayın için.
- **Mobil:** tam ekran menü (aşağıdan yumuşak giriş), 2 sütun ürün grid'i.

## State Management
`page`, `slide`, `cart {key: qty}`, `cartOpen`, `prod` (seçili ürün), `qty`, `rec` (tarif idx), `art` (makale idx), `legal`, `accSec`, `user`, `authTab`, `lastOrder`, `searchOpen`, `q`, `menuOpen`, `scrolled`, `toast`, `navTick`.
Üretimde: ürün/tarif/makale verisi bir **CMS veya JSON**'dan gelmeli (tasarım dosyasında `ARTS`, `recipes`, `LEGAL`, `FAQ_ALL`, `PRICES` sabit dizilerdedir). Sepet `localStorage` + sunucu oturumu.

## SEO (uygulanması gerekenler)
- Sayfa başına benzersiz `title`/`description` (tasarım dosyasında `SEO` haritası hazır), canonical, `hreflang=tr`, Open Graph (görsel yok — üretilecek).
- JSON-LD: Organization, FAQPage, BreadcrumbList, Product (ürün), Recipe (tarif), Article (rehber). Şablonlar `_ld` içinde.
- `robots.txt` ve `sitemap.xml` (bu pakette; alan adı `www.kivrimekmek.com` varsayıldı).
- Semantik HTML (h1 tek, doğru hiyerarşi), tüm görsellere alt metin, lazy-loading, WebP/AVIF, Core Web Vitals.
- Ana sayfada SEO metin bloğu: "Taze lavaş ve tortilla, sofranıza kadar" + 4 soru SSS.

## Eksik Entegrasyonlar (gerçek backend GEREKİR)
Çalışıyormuş gibi gösterilenler **sadece arayüzdür**: üyelik/giriş, sipariş, ödeme (iyzico/PayTR/…), kargo, form gönderimi (iletişim, toptan teklif, numune, bayilik), bülten aboneliği, favoriler, sipariş geçmişi (örnek veri). Formlar şu an `mailto:` ile yönleniyor. E-ticaret altyapısı olarak Shopify / ikas / WooCommerce ya da özel backend seçilebilir.
Gerçek içerik gerekenler: fiyatlar ve kargo kuralları, besin değerleri, içindekiler, alerjen, gramaj, raf ömrü, yasal metinler (**hukuk onayı**), ambalaj üzerindeki beyanlar ("Yüksek Protein", "Lif Kaynağı" vb. belgelenmeli), yüksek çözünürlüklü ambalaj/ürün/tarif fotoğrafları, Open Graph görselleri, satış noktaları (gerçek iş birliği yoksa gösterme).

## İletişim bilgileri (tasarımda kullanılan)
E-posta: `info@kivrimekmek.com` · Adres: Alemdağ Cad. No:89 Daire:16, Ümraniye / İstanbul · Sosyal: Instagram, Facebook, X, TikTok (bağlantılar `#`, doldurulacak).

## Assets
- `assets/kivrim-logo-renkli.png`, `kivrim-logo-beyaz.png` — marka logosu (kullanıcıdan).
- `assets/gorseller/pk-*.png` — 6 ambalaj (kullanıcıdan, ChatGPT ile üretilmiş temsili görseller; arka planı temizlendi).
- `assets/gorseller/dunya-ust.jpg`, `isletmeler-ust.jpg`, `urun-*-klasik.png` — temsili fotoğraf/kesit görseller.
- `uploads/ChatGPT Görseli 25 Kas 2026 03_08_*.png` — slider, tarif ve rehber için temsili fotoğraflar (gerçek lisanslı fotoğraflarla değiştirilmeli).
- `uploads/Kıvrım Lavaş ve Tortilla Ürün Kataloğu.png` — B2B katalog indirme (PNG; üretimde PDF olmalı).
- Fontlar: Google Fonts (Bricolage Grotesque, DM Sans, DM Serif Display, JetBrains Mono, Material Symbols Rounded).

## Files
- `KIVRIM Site.dc.html` — tüm site (şablon + mantık). Tarayıcıda `support.js` ile birlikte açın.
- `support.js` — tasarım dosyasını çalıştıran yardımcı; üretime taşınmaz.
- `robots.txt`, `sitemap.xml` — SEO taslakları.
- `assets/`, `uploads/` — görseller.

## Claude Code'a başlangıç talimatı (kopyalayıp yapıştırın)
> Bu klasörde KIVRIM markası için bir web sitesi tasarım referansı var (`README.md` + `KIVRIM Site.dc.html`). README'yi tamamen oku, tasarım dosyasını incele. Siteyi **Astro** (veya Next.js) ile gerçek bir çok sayfalı Türkçe siteye dönüştür: her sayfa için ayrı URL, sayfaya özel SEO meta + JSON-LD, ürün/tarif/makale verileri JSON/Markdown koleksiyonlarında, `shopEnabled` ortam değişkeni ile e-ticaretin açılıp kapanması. Tasarımı piksel hassasiyetinde koru (renk, tipografi, animasyonlar, mobil davranış). Backend gerektiren kısımları (üyelik, ödeme, form) sahte bırakma: önce formları bir form servisine/e-postaya bağla, e-ticareti gerçek bir altyapıyla (Shopify/ikas/Stripe-iyzico) entegre etmeyi bana sor. Sonunda GitHub'a push edip Vercel veya Cloudflare Pages'e deploy edecek adımları anlat.
