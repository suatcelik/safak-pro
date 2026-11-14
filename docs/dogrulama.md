# Elle doğrulama adımları

Birim testiyle kapsanmayan davranışlar için cihazda (veya simülatörde) yapılacak kontroller. Testle kapsananlar yanında test adıyla belirtildi.

## Faz 2 — Hata düzeltmeleri

| Madde | Doğrulama |
|---|---|
| 365 takvimi | `__tests__/calendarLayout.test.ts` → "365 günlük düzen tam 365 hücre". Cihazda: Uzun dönem seç, Takvim'i aç, son hücre 365 olmalı. |
| Ceza ve izin günleri | `calendarLayout.test.ts` → "ceza ve izin günleri ekstra gün olarak eklenir"; `service.test.ts` → "ceza ve kullanılan izin…". Cihazda: 5 gün ceza gir, Takvim'in altında "Ekstra Günler" 181–185 görünmeli. |
| Bildirimler 30 gün ileri | `notificationPlan.test.ts` → "her çağrıda pencere bugüne göre yeniden kurulur". Cihazda: uygulamayı aç-kapat; `Notifications.getAllScheduledNotificationsAsync()` 30 söz + kalan kilometre taşlarını döndürmeli. |
| Sıfırlama | `store.test.ts` → "reset her şeyi temizler". Cihazda: Ayarlar → Tüm Verileri Sıfırla → Onboarding açılmalı; planlanmış bildirim sayısı 0 olmalı. |
| Tarih kayması | `service.test.ts` → "saat farkı gün sayısını değiştirmez". Cihazda: saat dilimi UTC+3 iken gece 01:00'de başlangıç tarihi seç; kaydedilen tarih seçilen gün olmalı (bir gün önce değil). |
| Gece yarısı | Cihazda: Ana Sayfa açıkken cihaz saatini 23:59'a al, 1 dk bekle → kalan gün 1 azalmalı. Ayrıca uygulamayı arka plana al, tarihi bir gün ileri al, öne getir → kalan gün güncellenmeli. |
| İzin zamanlaması | Cihazda: temiz kurulum → açılışta izin penceresi çıkmamalı. Setup'ta "Bilgileri Kaydet" → önce açıklama, "İzin Ver" denirse sistem izin penceresi. |

## Eski sürümden geçiş

`store.test.ts` → "eski sürümün anahtarlarından veriyi taşır". Cihazda: 1.0 sürümü kurulu ve verisi dolu bir cihaza bu sürümü kur → kurulum ekranı tekrar sorulmamalı, boyalı günler korunmalı.

## Faz 4–5 — Yeni tasarım

Tasarım tuvali: https://claude.ai/artifact/UNuakzbtpzoBxTy4pxzDwG (yalnızca sahibine açık). Her ekranın cihaz ekran görüntüsünü tuvaldeki karşılığıyla yan yana koy.

| Ekran | Kontrol |
|---|---|
| Açılış | Siyah zemin, ortada neon güneş logosu; yazı tipi yüklenince hemen kaybolur. |
| Tanıtım | 3 sayfa: neon → pembe → mor. "Atla" ve "Başla" kurulumu açar. Durum çubuğu koyu. |
| Kurulum | 5 adım (izin daha önce sorulduysa 4). Ad < 2 harf ve eksik şehirde kırmızı uyarı. Tarih seçici iOS'ta alttan, Android'de diyalog. Terhis önizlemesi tarih değişince güncellenir. |
| Ana Sayfa | Halka açılışta dolar. Son 81 günde il çipi. Kilometre taşı tamamlanınca bir kez başarı titreşimi. Yüzen sekme çubuğu içeriği örtmez. |
| Takvim | Yatay açılır, sekme çubuğu gizli. Uzun dönemde 365 hücre tek ekrana sığar. Dokununca boyanır + seçim titreşimi; aynı renkle tekrar dokununca silinir. Bugün beyaz çerçeveli. |
| Ayarlar | Profil kartı; bildirim anahtarı kapatınca planlı bildirimler silinir, açınca gerekirse izin ister. Sürüm 2.0.0 görünür. |
| Paylaş | Sarı/Neon seçimi; "Paylaş" 1080×1080 PNG ile sistem paylaşım menüsünü açar. |
| Erişilebilirlik | VoiceOver/TalkBack: takvim hücreleri "Gün 45, boyalı", sekmeler "Şafak / Takvim / Ayarlar", +/- kontrolleri ayarlanabilir. |
| Tablet | iPad desteklenir (1.x iPad destekliyordu, App Store azaltmaya izin vermez) ve tam ekran açılır. iPad'de kontrol: ekranlar tam genişlikte taşmadan açılıyor, Takvim yatayda tek ekrana sığıyor, paylaşım kartı en fazla 420 pt. |

## Faz 6 — Gerçek cihazda duman testi

Her sürümden önce iOS ve Android'de birer gerçek cihazda (preview build: `eas build --profile preview`):

1. **İlk açılış:** temiz kurulum → koyu açılış ekranı → Tanıtım. İzin penceresi çıkmaz.
2. **Kurulum:** 5 adımı doldur; bildirim adımında "İzin Ver" → sistem penceresi.
3. **Sayaç:** Ana Sayfa'da kalan gün, terhis tarihi ve geçen gün Kurulum'daki tarihle tutarlı.
4. **Takvim boyama:** Takvim yataya döner, birkaç gün boya, uygulamayı kapat-aç → boyalar duruyor.
5. **Bildirim:** cihaz saatini ertesi gün 07:59'a al → 08:00'de günün sözü gelir.
6. **Sıfırlama:** Ayarlar → Tüm verileri sıfırla → Tanıtım açılır, planlı bildirim kalmaz.
7. **Paylaşım:** Paylaş → kart görseli WhatsApp/Instagram'a gider, 1080×1080.
8. **Güncelleme:** 1.0 sürümü kurulu cihaza bu sürümü kur → veriler korunur.
