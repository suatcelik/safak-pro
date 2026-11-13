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
