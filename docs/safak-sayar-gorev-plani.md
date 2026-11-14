# Şafak Sayar — Yeniden Tasarım ve Temizlik Görev Planı

13 Kasım 2026

Repo: `suatcelik/safak-pro` (Expo SDK 54, React Native 0.81, NativeWind, Zustand). Bu plan; reklam ve satın alma kodunun kaldırılmasını, kalan hataların düzeltilmesini, kod mimarisinin toparlanmasını ve uygulamanın baştan profesyonel bir tasarıma geçirilmesini görev görev tanımlar. Her fazın altında "bitti" sayılması için gereken kabul kriterleri var. Plan bir yapay zekâ ajanına (Claude Code, Antigravity vb.) aynen verilebilecek şekilde yazıldı.

## Kararlar

- **Gelir yok.** Reklam (AdMob), uygulama içi satın alma (react-native-iap) ve takip izni (ATT) tamamen kaldırılıyor. Uygulama ücretsiz ve veri toplamıyor.
- **Tasarım referansı:** Doygun tek renkli tam ekranlar, büyük kalın yuvarlak yazılar, siyah/beyaz hap butonlar, köşeleri çok yuvarlak ve üst üste duran renkli kartlar, illüstrasyon/karakter kullanımı.
- **Görsel yön: B — Siyah zemin + tek neon vurgu** *(önerilen; onay bekliyor)*. Günlük ekranlar (Ana Sayfa, Takvim, Ayarlar) koyu zeminde, kalan gün sayacı neon yeşil ve dev boyutta. Onboarding, Setup adımları ve paylaşım kartı referanstaki gibi tam renkli. A (her ekran kendi rengi) seçilirse yalnızca Faz 4 ve 5'teki renk atamaları değişir.
- **İsim:** "Pro" ibaresi kaldırılıp uygulama adı "Şafak Sayar" yapılıyor *(öneri)*.
- **Kapsam dışı (sonraki sürüm):** Ana ekran widget'ı, JSON yedekleme/geri yükleme.

## Tasarım dili (Faz 4'ün girdisi)

### Renkler

| Token | Değer | Kullanım |
|---|---|---|
| `bg` | `#0B0B0F` | Ana zemin |
| `surface` | `#17171C` | Kart, liste satırı |
| `surfaceRaised` | `#222229` | Öne çıkan kart |
| `border` | `#2A2A33` | İnce çizgiler |
| `text` | `#FFFFFF` | Başlık, sayılar |
| `textMuted` | `#A1A1AA` | Açıklamalar |
| `accent` | `#C6F432` | Neon yeşil: sayaç, ana buton, aktif sekme |
| `pink` | `#FF5C8A` | Onboarding 2, kilometre taşı kartları |
| `purple` | `#8B5CF6` | Onboarding 3, Setup |
| `yellow` | `#FFE14D` | Kilometre taşı kartları, paylaşım kartı |
| `blue` | `#4DA3FF` | Kilometre taşı kartları, bilgi |
| `danger` | `#FF4D4F` | Ceza, sıfırlama |

### Yazı

Başlıklar ve sayılar için kalın, yuvarlak hatlı bir yazı tipi (öneri: *Plus Jakarta Sans* ExtraBold/Bold; alternatif *Outfit*). Gövde metni aynı ailenin Regular/Medium ağırlığı. Ölçek: 64 (sayaç) / 34 / 24 / 18 / 15 / 13.

### Biçim

Kart köşesi 28, küçük kart 20, buton tam yuvarlak (hap), buton yüksekliği 56. Aralık ölçeği 4'ün katları (4, 8, 12, 16, 24, 32). Kartlarda hafif eğim (−4° / +3°) ve üst üste bindirme yalnızca vitrin alanlarında (onboarding, kilometre taşları).

### İllüstrasyon

Asker karakteri, bot, kumanya, takvim, güneş doğuşu gibi 4–6 sade vektör çizim (SVG). Tek tip çizgi kalınlığı ve aynı renk paleti.

## Faz 0 — Hazırlık

- [ ] `redesign` adında yeni bir branch aç.
- [ ] ESLint ve Prettier ekle; `prettier-plugin-tailwindcss` paketini devDependencies'e taşı.
- [ ] README yaz: kurulum, çalıştırma, klasör yapısı, commit kuralı (Conventional Commits).

**Kabul:** `npm run lint` ve `npx tsc --noEmit` hatasız.

## Faz 1 — Reklam ve satın almayı kaldır

- [ ] Sil: `src/services/ads.ts`, `src/services/iapService.ts`, `src/components/AdBanner.tsx`, `src/screens/PremiumScreen.tsx`.
- [ ] Paketleri kaldır: `react-native-google-mobile-ads`, `react-native-iap`, `expo-tracking-transparency`.
- [ ] `app.json`: AdMob, IAP ve ATT eklentilerini, `NSUserTrackingUsageDescription` anahtarını çıkar; Android için `blockedPermissions: ["com.google.android.gms.permission.AD_ID"]` ekle.
- [ ] `App.tsx`: ATT/reklam/IAP başlatma bloğunu ve AppState dinleyicisini kaldır.
- [ ] `TabNavigator`: ödüllü reklam kapısını kaldır; Takvim doğrudan açılsın.
- [ ] Store ve storage'dan `isPremium`, `getPremiumLocal`, `setPremiumLocal` alanlarını sil; `Premium` route'unu kaldır.
- [ ] Ayarlar'daki "Reklamları Kaldır" satırını ve banner için bırakılan alt boşlukları (`paddingBottom: 170`) kaldır.

**Kabul:** Projede `ads`, `iap`, `premium`, `TestIds` aramaları sonuç vermiyor; uygulama iOS ve Android'de açılıyor, Takvim tek dokunuşla açılıyor.

## Faz 2 — Kalan hataları düzelt

- [ ] **365 takvimi:** Uzun dönem/yedek subay düzeni şu an 181 hücre; 365 günün tamamı görünmeli.
- [ ] **Ceza ve izin günleri:** Takvim `totalDays + usedLeave + penalty` kadar gün göstermeli; fazlası "Ekstra Günler" bölümünde çıkmalı.
- [ ] **Bildirimler:** Günlük sözler uygulama her açıldığında 30 gün ileriye yeniden planlanmalı (şu an 30 gün sonra bitiyor).
- [ ] **Sıfırlama:** "Tüm Verileri Sıfırla" planlanmış bildirimleri iptal etmeli ve store'u temizlemeli.
- [ ] **Tarih kayması:** Başlangıç tarihi `toISOString()` yerine `format(date, 'yyyy-MM-dd')` ile kaydedilmeli; okurken `parseISO` kullanılmalı.
- [ ] **Gece yarısı:** Uygulama öne geldiğinde (`AppState` → `active`) kalan gün yeniden hesaplanmalı.
- [ ] **İzin zamanlaması:** Bildirim izni açılışta değil, Setup'ın son adımında, ne işe yaradığı anlatılarak istenmeli.

**Kabul:** Her madde için en az bir birim testi (Faz 3'teki hesap modülü üzerinden) veya elle doğrulama adımı yazılı.

## Faz 3 — Kod mimarisi

- [ ] **Hesap modülü:** `src/domain/service.ts` — `computeService(setup, today)` saf fonksiyonu: geçen gün, kalan gün, efektif toplam, terhis tarihi, yüzde, kilometre taşları. Ana sayfa, takvim ve bildirimler yalnızca bunu kullanır.
- [ ] **Tek veri kaynağı:** Zustand `persist` middleware + AsyncStorage. Ekranlar `getUserSetup()` çağırmaz, store'dan okur. Setup'taki değişiklik takvime anında yansır.
- [ ] **Takvim üretimi:** "180", "365" ve "28" düzenleri elle yazılmış matrisler yerine rakam şablonlarından (`digitTemplates`) otomatik üretilsin; hücre sayısını doğrulayan test eklensin.
- [ ] **Klasör yapısı:** `src/domain`, `src/store`, `src/theme`, `src/components/ui`, `src/components/<özellik>`, `src/screens`, `src/assets/illustrations`.
- [ ] **Ölü kod:** Kullanılmayan tema kodu, `LeaveCalculator` route'u, kullanılmayan importlar, sahte `leaveCalculator.test.ts` silinsin; `cityData.ts` yalnızca il adı + plaka listesine indirilsin.
- [ ] **Açılış:** 2 saniyelik yapay bekleme yerine `expo-splash-screen`; store yüklenince hemen yönlendir.

**Kabul:** `computeService` için sınır durumlarını kapsayan testler (bedelli 28 gün, kısa 180, uzun 365, ceza, yol izni, başlangıç gelecekte, terhis geçmiş) yeşil.

## Faz 4 — Tasarım sistemi

- [ ] `src/theme/tokens.ts`: renk, yazı ölçeği, aralık, köşe değerleri (yukarıdaki tablo). `tailwind.config.js` bu dosyadan beslensin; kodda hiçbir yerde ham hex kalmasın.
- [ ] Yazı tipini `expo-font` ile yükle; `Heading`, `Display` (sayaç), `Body`, `Caption` metin bileşenleri.
- [ ] UI bileşenleri (`src/components/ui`): `Screen` (güvenli alan + zemin rengi), `Button` (primary neon / secondary siyah / ghost; hap biçim), `Card`, `StatCard`, `ListRow`, `Chip`, `PageDots`, `ProgressRing` (Reanimated ile akıcı dolum), `IconButton`.
- [ ] Özellik bileşenleri: `CountdownHero`, `MilestoneStack` (eğik, üst üste renkli kartlar), `DayCell`, `ColorPalette`, `ShareCard`.
- [ ] `expo-haptics`: buton, gün boyama ve kilometre taşı tamamlanınca hafif titreşim.
- [ ] Sekme çubuğu: koyu yüzey, neon aktif ikon, yuvarlatılmış yüzen çubuk.

**Kabul:** Bütün ekranlar yalnızca token ve UI bileşenleriyle kurulu; `src/screens` içinde ham hex renk kodu yok.

## Faz 5 — Ekranlar

Her ekran önce tasarım tuvalinde çizilip onaylanır, sonra koda geçer.

- [ ] **Splash:** Siyah zemin, ortada logo (yıldız/güneş doğuşu), altında küçük "Şafak Sayar".
- [ ] **Onboarding (3 sayfa):** Referanstaki gibi tam renkli — 1) neon yeşil "Şafağını say", 2) pembe "Günlerini boya", 3) mor "Kilometre taşlarını aç". Üstte illüstrasyon, ortada büyük başlık, altta siyah hap buton ve sayfa noktaları.
- [ ] **Setup (adım adım sihirbaz):** Uzun form yerine adımlar — ad, askerlik türü (büyük renkli seçim kartları), başlangıç tarihi, memleket/birlik şehri; isteğe bağlı izin/ceza ayrı bir adımda. Son adımda bildirim izni açıklaması.
- [ ] **Ana Sayfa:** Üstte selam + paylaş butonu; dev neon sayaç ve ilerleme halkası; son 81 günde il çipi; "Geçen / Terhis" kart çifti; izin-ceza satırı; günün sözü kartı; yatay `MilestoneStack`.
- [ ] **Takvim:** Yatay ekran; koyu zemin, boyanan günler palet renklerinde dolu; sağda yuvarlak renk paleti; ekstra günler altta.
- [ ] **Ayarlar:** Gruplu liste satırları — Bilgileri Güncelle, Bildirimler, Gizlilik Politikası, Hakkında (sürüm `expo-constants`'tan), Tüm Verileri Sıfırla (kırmızı).
- [ ] **Paylaşım kartı:** `react-native-view-shot` ile görsel olarak paylaşılan, sarı veya neon zeminli kare kart: kalan gün, terhis tarihi, il adı.
- [ ] **Boş/hata durumları:** Her ekran için illüstrasyonlu boş ve hata görünümü.
- [ ] **Erişilebilirlik:** Takvim hücrelerine "Gün 45, boyalı" gibi etiketler; tüm metinlerde yeterli kontrast.
- [ ] **Tablet:** iPad'de test et ya da `supportsTablet: false` yap.

**Kabul:** Her ekranın tuval tasarımı ile uygulama ekran görüntüsü yan yana karşılaştırılıp onaylanmış.

## Faz 6 — Kalite ve dağıtım

- [ ] GitHub Actions: her PR'da `tsc`, lint, `jest`.
- [ ] `eas.json`: `autoIncrement: true`, `appVersionSource: "remote"`.
- [ ] Gerçek cihazda duman testi listesi: ilk açılış, setup, sayaç, takvim boyama, bildirim, sıfırlama, paylaşım.

**Kabul:** CI yeşil; preview build iki platformda kuruluyor.

## Faz 7 — Mağaza

- [ ] Gizlilik politikasını "hiçbir veri toplanmaz, her şey cihazda kalır" olarak güncelle.
- [ ] App Store "Data Not Collected" ve Google Play veri güvenliği formunu güncelle.
- [ ] Uygulama adı, ikon ve yeni tasarımla mağaza ekran görüntüleri (5–6 adet, onboarding renklerinde).

## Önerilen sıra

Faz 0 → 1 → 3 → 2 → 4 → 5 → 6 → 7. Faz 3 (hesap modülü ve store) Faz 2'deki düzeltmelerin çoğunu kolaylaştırdığı için ondan önce geliyor. Faz 4 ve 5 başlamadan önce görsel yönün (A veya B) kesinleşmesi gerekiyor.
