import React from 'react';
import { Pressable, View } from 'react-native';
import { colors, paintPalette } from '../../theme/tokens';
import { selectHaptic } from '../../services/haptics';

/** Takvimin sağındaki yuvarlak renk paleti */
export function ColorPalette({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Boya rengi"
      style={{
        width: 76,
        borderTopLeftRadius: 28,
        borderBottomLeftRadius: 28,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      {paintPalette.map(({ color, name }) => {
        const selected = value === color;
        return (
          <Pressable
            key={color}
            accessibilityRole="radio"
            accessibilityLabel={name}
            accessibilityState={{ selected }}
            hitSlop={4}
            onPress={() => {
              selectHaptic();
              onChange(color);
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: selected ? 3 : 0,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: selected ? 28 : 36,
                height: selected ? 28 : 36,
                borderRadius: 999,
                backgroundColor: color,
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
