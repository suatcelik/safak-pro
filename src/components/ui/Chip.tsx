import React from 'react';
import { Pressable, View } from 'react-native';
import { colors, ColorToken, radius } from '../../theme/tokens';
import { selectHaptic } from '../../services/haptics';
import { Typo } from './Typography';

interface Props {
  label: string;
  tone?: ColorToken;
  textTone?: ColorToken;
  /** Solda küçük koyu rozet (ör. plaka numarası) */
  badge?: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, tone = 'surface', textTone, badge, selected, onPress }: Props) {
  const fg: ColorToken =
    textTone ?? (tone === 'surface' || tone === 'surfaceRaised' ? 'text' : 'ink');
  const body = (
    <View
      style={{
        height: 36,
        borderRadius: radius.pill,
        paddingHorizontal: 14,
        backgroundColor: colors[tone],
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: selected ? 2 : 0,
        borderColor: colors.text,
      }}
    >
      {badge ? (
        <View
          style={{
            backgroundColor: colors.ink,
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 1,
          }}
        >
          <Typo variant="caption" color="white" size={12}>
            {badge}
          </Typo>
        </View>
      ) : null}
      <Typo variant="bodyStrong" color={fg} size={14}>
        {label}
      </Typo>
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      hitSlop={6}
      onPress={() => {
        selectHaptic();
        onPress();
      }}
    >
      {body}
    </Pressable>
  );
}
