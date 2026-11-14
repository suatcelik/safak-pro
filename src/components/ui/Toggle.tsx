import React from 'react';
import { Pressable, View } from 'react-native';
import { colors, radius } from '../../theme/tokens';
import { selectHaptic } from '../../services/haptics';

/** Neon açma/kapama anahtarı */
export function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => {
        selectHaptic();
        onChange(!value);
      }}
      style={{
        width: 52,
        height: 32,
        borderRadius: radius.pill,
        padding: 3,
        justifyContent: 'center',
        alignItems: value ? 'flex-end' : 'flex-start',
        backgroundColor: value ? colors.accent : colors.inkMuted,
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: radius.pill,
          backgroundColor: value ? colors.ink : colors.white,
        }}
      />
    </Pressable>
  );
}
