import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { colors, ColorToken, radius } from '../../theme/tokens';
import { Caption, Typo } from './Typography';

interface CardProps extends ViewProps {
  tone?: ColorToken;
  small?: boolean;
  /** Vitrin alanları için hafif eğim (derece) */
  tilt?: number;
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

export function Card({ tone = 'surface', small, tilt, padding = 20, style, ...rest }: CardProps) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors[tone],
          borderRadius: small ? radius.cardSm : radius.card,
          padding,
          transform: tilt ? [{ rotate: `${tilt}deg` }] : undefined,
        },
        style,
      ]}
    />
  );
}

interface StatProps {
  label: string;
  value: string;
  unit?: string;
  tone?: ColorToken;
  valueSize?: number;
  style?: StyleProp<ViewStyle>;
}

/** Etiket + büyük değer kartı (Geçen / Terhis) */
export function StatCard({
  label,
  value,
  unit,
  tone = 'surface',
  valueSize = 34,
  style,
}: StatProps) {
  return (
    <Card
      tone={tone}
      style={[{ gap: 6 }, style]}
      accessible
      accessibilityLabel={`${label}: ${value}${unit ? ` ${unit}` : ''}`}
    >
      <Caption upper>{label}</Caption>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Typo variant="title" size={valueSize}>
          {value}
        </Typo>
        {unit ? (
          <Typo variant="subheading" color="textMuted" size={17} style={{ marginLeft: 4 }}>
            {unit}
          </Typo>
        ) : null}
      </View>
    </Card>
  );
}
