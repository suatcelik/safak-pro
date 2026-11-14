import React from 'react';
import { View } from 'react-native';
import { colors } from '../../theme/tokens';

export function PageDots({ count, index }: { count: number; index: number }) {
  return (
    <View
      style={{ flexDirection: 'row', gap: 6 }}
      accessible
      accessibilityLabel={`Sayfa ${index + 1} / ${count}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === index ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.ink,
            opacity: i === index ? 1 : 0.25,
          }}
        />
      ))}
    </View>
  );
}

/** Kurulum sihirbazının üst ilerleme çubuğu */
export function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <View
      style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(11,11,15,0.18)' }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Adım ${step} / ${total}`}
    >
      <View
        style={{
          width: `${(step / total) * 100}%`,
          height: '100%',
          borderRadius: 4,
          backgroundColor: colors.ink,
        }}
      />
    </View>
  );
}
