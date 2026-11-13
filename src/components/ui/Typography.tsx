import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, ColorToken, fonts, fontSize } from '../../theme/tokens';

type Variant =
  | 'hero'
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'label';

const VARIANTS: Record<Variant, TextStyle> = {
  hero: {
    fontFamily: fonts.extrabold,
    fontSize: fontSize.hero,
    lineHeight: fontSize.hero,
    letterSpacing: -5,
  },
  display: {
    fontFamily: fonts.extrabold,
    fontSize: fontSize.display,
    lineHeight: fontSize.display,
    letterSpacing: -2.5,
  },
  title: {
    fontFamily: fonts.extrabold,
    fontSize: fontSize.title,
    lineHeight: 38,
    letterSpacing: -1,
  },
  heading: {
    fontFamily: fonts.extrabold,
    fontSize: fontSize.heading,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  subheading: { fontFamily: fonts.extrabold, fontSize: fontSize.subheading, lineHeight: 24 },
  body: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 25 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fonts.semibold, fontSize: fontSize.caption, lineHeight: 18 },
  label: {
    fontFamily: fonts.bold,
    fontSize: fontSize.caption,
    lineHeight: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
};

export interface TypographyProps extends TextProps {
  variant?: Variant;
  color?: ColorToken;
  size?: number;
  align?: TextStyle['textAlign'];
}

export function Typo({
  variant = 'body',
  color = 'text',
  size,
  align,
  style,
  ...rest
}: TypographyProps) {
  const base = VARIANTS[variant];
  return (
    <Text
      {...rest}
      style={[
        base,
        { color: colors[color], textAlign: align },
        size
          ? {
              fontSize: size,
              lineHeight: Math.round(
                size * (variant === 'hero' || variant === 'display' ? 1 : 1.3),
              ),
            }
          : null,
        style,
      ]}
    />
  );
}

type Shortcut = Omit<TypographyProps, 'variant'>;

/** Dev sayılar (sayaç) */
export const Display = (p: Shortcut & { big?: boolean }) => (
  <Typo variant={p.big ? 'hero' : 'display'} accessibilityRole="text" {...p} />
);
/** Başlıklar: level 1 = ekran başlığı, 2 = bölüm, 3 = kart */
export const Heading = ({ level = 1, ...p }: Shortcut & { level?: 1 | 2 | 3 }) => (
  <Typo
    variant={level === 1 ? 'title' : level === 2 ? 'heading' : 'subheading'}
    accessibilityRole="header"
    {...p}
  />
);
export const Body = ({ strong, ...p }: Shortcut & { strong?: boolean }) => (
  <Typo variant={strong ? 'bodyStrong' : 'body'} {...p} />
);
export const Caption = ({ upper, ...p }: Shortcut & { upper?: boolean }) => (
  <Typo variant={upper ? 'label' : 'caption'} color="textMuted" {...p} />
);
