# Şafak Sayar

Askerlik süresini gün gün sayan, takvimde günleri boyamaya ve kilometre taşlarını takip etmeye yarayan mobil uygulama. Reklam yok, satın alma yok, veri toplamıyor: her şey cihazda kalır.

**Teknoloji:** Expo SDK 54 · React Native 0.81 · TypeScript · NativeWind (Tailwind) · Zustand · date-fns

## Kurulum

```bash
npm install
```

Node 20+ önerilir. Uygulama native modüller kullandığı için Expo Go yerine development build ile çalıştırılır.

## Çalıştırma

| Komut                             | Ne yapar                                |
| --------------------------------- | --------------------------------------- |
| `npm start`                       | Metro'yu başlatır                       |
| `npm run android` / `npm run ios` | Native derleyip cihazda/emülatörde açar |
| `npm test`                        | Jest testleri                           |
| `npm run typecheck`               | `tsc --noEmit`                          |
| `npm run lint`                    | ESLint (eslint-config-expo + prettier)  |
| `npm run format`                  | Prettier ile tüm projeyi biçimlendirir  |

## Klasör yapısı

```
src/
  domain/        Saf iş mantığı (servis hesabı, takvim düzenleri) — UI'dan bağımsız, testli
  store/         Zustand store (AsyncStorage'a kalıcı)
  theme/         Tasarım token'ları (renk, yazı, aralık, köşe)
  components/
    ui/          Genel UI bileşenleri (Button, Card, Screen…)
    <özellik>/   Özelliğe ait bileşenler
  screens/       Ekranlar
  navigation/    React Navigation yapısı
  utils/         Bildirimler, sözler, il listesi
  assets/illustrations/
__tests__/       Jest testleri
docs/            Görev planı ve tasarım notları
```

## Commit kuralı

[Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`. Örnek: `fix(calendar): uzun dönemde 365 günün tamamını göster`.
