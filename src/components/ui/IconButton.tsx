import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { colors, radius, sizes } from '../../theme/tokens';
import { tapHaptic } from '../../services/haptics';

interface Props {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
  /** surface: koyu zeminde; ink: renkli zeminde yarı saydam siyah */
  tone?: 'surface' | 'ink';
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  label,
  onPress,
  children,
  tone = 'surface',
  size = 48,
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={size < sizes.touch ? (sizes.touch - size) / 2 : 0}
      onPress={() => {
        tapHaptic();
        onPress();
      }}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tone === 'surface' ? colors.surface : 'rgba(11,11,15,0.12)',
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
