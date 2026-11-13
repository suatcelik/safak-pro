/**
 * Şafak Sayar tasarım token'ları — uygulamadaki tek renk/yazı/aralık kaynağı.
 * tailwind.config.js bu dosyayı okur; ekran ve bileşenlerde ham hex kullanılmaz.
 */

export const colors = {
  bg: '#0B0B0F',
  surface: '#17171C',
  surfaceRaised: '#222229',
  border: '#2A2A33',
  text: '#FFFFFF',
  textMuted: '#A1A1AA',
  /** Açık zemin (renkli kart/ekran) üstündeki ikincil metin */
  inkMuted: '#3F3F46',
  /** Açık zemin üstündeki ana metin */
  ink: '#0B0B0F',
  accent: '#C6F432',
  pink: '#FF5C8A',
  purple: '#8B5CF6',
  yellow: '#FFE14D',
  blue: '#4DA3FF',
  danger: '#FF4D4F',
  /** Koyu zemin üstünde okunur kırmızı metin */
  dangerText: '#FF6B6D',
  dangerSurface: '#1F1013',
  white: '#FFFFFF',
  /** Açık (beyaz) girdi alanlarındaki yer tutucu metin */
  placeholder: '#71717A',
} as const;

export type ColorToken = keyof typeof colors;

/** Takvimde gün boyama paleti */
export const paintPalette = [
  { color: colors.accent, name: 'Neon yeşil' },
  { color: colors.yellow, name: 'Sarı' },
  { color: colors.blue, name: 'Mavi' },
  { color: colors.pink, name: 'Pembe' },
  { color: colors.purple, name: 'Mor' },
  { color: colors.white, name: 'Beyaz' },
] as const;

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

/** Yazı ölçeği (px): sayaç / başlık / alt başlık / gövde / küçük */
export const fontSize = {
  hero: 112,
  display: 64,
  title: 34,
  heading: 24,
  subheading: 18,
  body: 15,
  caption: 13,
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { card: 28, cardSm: 20, chip: 12, pill: 999 } as const;

export const sizes = { button: 56, touch: 44, tabBar: 72 } as const;
