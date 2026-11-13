import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  /** 0..1 */
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  accessibilityLabel?: string;
  children?: React.ReactNode;
}

/** Açılışta akıcı dolan ilerleme halkası */
export function ProgressRing({
  progress,
  size = 300,
  stroke = 18,
  color = colors.accent,
  trackColor = colors.surfaceRaised,
  accessibilityLabel,
  children,
}: Props) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const value = useSharedValue(0);

  useEffect(() => {
    value.value = withTiming(Math.max(0, Math.min(1, progress)), {
      duration: 1100,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - value.value),
  }));

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible={!!accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

/** Kartlardaki ince ilerleme çubuğu */
export function ProgressBar({
  progress,
  tone = 'ink',
}: {
  progress: number;
  tone?: 'ink' | 'accent';
}) {
  return (
    <View
      style={{
        height: 8,
        borderRadius: 4,
        backgroundColor: tone === 'ink' ? 'rgba(11,11,15,0.15)' : colors.surfaceRaised,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${Math.round(progress * 100)}%`,
          height: '100%',
          borderRadius: 4,
          backgroundColor: tone === 'ink' ? colors.ink : colors.accent,
        }}
      />
    </View>
  );
}
