import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/tokens';

interface Props {
  day: number;
  size: number;
  color?: string;
  isToday?: boolean;
  onPress: (day: number) => void;
}

/** Takvimde tek gün hücresi. 0 = boş hücre (yer tutucu). */
export const DayCell = memo(function DayCell({ day, size, color, isToday, onPress }: Props) {
  if (day === 0) return <View style={{ width: size, height: size }} />;
  return (
    <Pressable
      onPress={() => onPress(day)}
      accessibilityRole="button"
      accessibilityLabel={`Gün ${day}${color ? ', boyalı' : ''}${isToday ? ', bugün' : ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(4, size * 0.28),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color ?? colors.surfaceRaised,
        borderWidth: isToday && !color ? 2 : 0,
        borderColor: colors.white,
      }}
    >
      <Text
        allowFontScaling={false}
        style={{
          fontFamily: fonts.extrabold,
          fontSize: Math.max(7, Math.round(size * 0.42)),
          color: color ? colors.ink : colors.textMuted,
        }}
      >
        {day}
      </Text>
    </Pressable>
  );
});
