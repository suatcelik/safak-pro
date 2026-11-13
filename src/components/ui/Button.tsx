import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { colors, ColorToken, radius, sizes } from '../../theme/tokens';
import { tapHaptic } from '../../services/haptics';
import { Typo } from './Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

const STYLES: Record<ButtonVariant, { bg: string; fg: ColorToken; border?: string }> = {
  primary: { bg: colors.accent, fg: 'ink' },
  secondary: { bg: colors.ink, fg: 'white' },
  outline: { bg: 'transparent', fg: 'ink', border: colors.ink },
  ghost: { bg: 'transparent', fg: 'ink' },
};

interface Props {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** ghost/outline koyu zeminde kullanılacaksa metni açık yapar */
  onDark?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

/** Hap biçimli buton: primary neon, secondary siyah, outline/ghost şeffaf */
export function Button({
  label,
  onPress,
  variant = 'secondary',
  onDark,
  icon,
  disabled,
  accessibilityHint,
  style,
}: Props) {
  const s = STYLES[variant];
  const fg: ColorToken = onDark && (variant === 'ghost' || variant === 'outline') ? 'text' : s.fg;
  const border = onDark && variant === 'outline' ? colors.text : s.border;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={() => {
        tapHaptic();
        onPress();
      }}
      style={({ pressed }) => [
        {
          height: variant === 'ghost' ? 48 : sizes.button,
          borderRadius: radius.pill,
          paddingHorizontal: 28,
          backgroundColor: s.bg,
          borderWidth: border ? 3 : 0,
          borderColor: border,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      <Typo variant="bodyStrong" color={fg} size={17}>
        {label}
      </Typo>
      {icon ? <View style={{ marginLeft: 10 }}>{icon}</View> : null}
    </Pressable>
  );
}
