# Şafak Sayar

Askerlik süresini gün gün sayan, takvimde günleri boyamaya ve kilometre taşlarını takip etmeye yarayan mobil uygulama. Reklam yok, satın alma yok, veri toplamıyor: her şey cihazda kalır.

**Teknoloji:** Expo SDK 58 · React Native 0.88 · TypeScript · Zustand · date-fns

## Kurulum

```bash
npm install
```

Node 22.13+ gerekir. Tüm native modüller Expo Go (SDK 58) içinde hazır: `npm start` ile açıp Expo Go ile tara. İkon ve açılış ekranı yalnızca derlenmiş sürümde (`eas build`) görünür.

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
  services/      Yan etkili servisler (bildirim planlama)
  hooks/         React kancaları (useToday)
  assets/illustrations/
__tests__/       Jest testleri
docs/            Görev planı ve tasarım notları
```

## Commit kuralı

[Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`. Örnek: `fix(calendar): uzun dönemde 365 günün tamamını göster`.
