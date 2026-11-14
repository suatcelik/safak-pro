import React from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight, ArrowUpRight } from 'lucide-react-native';
import { colors, ColorToken, radius } from '../../theme/tokens';
import { tapHaptic } from '../../services/haptics';
import { Typo } from './Typography';

interface Props {
  title: string;
  /** Sol taraftaki ikon kutusunun rengi */
  iconTone: ColorToken;
  icon: React.ReactNode;
  onPress?: () => void;
  accessory?: 'chevron' | 'external' | 'none';
  /** Sağda gösterilecek değer ya da kontrol (switch) */
  right?: React.ReactNode;
  danger?: boolean;
  divider?: boolean;
  accessibilityRole?: 'button' | 'link';
}

export function ListRow({
  title,
  iconTone,
  icon,
  onPress,
  accessory = onPress ? 'chevron' : 'none',
  right,
  danger,
  divider,
  accessibilityRole = 'button',
}: Props) {
  const content = (
    <>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.chip,
          backgroundColor: colors[iconTone],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <Typo variant="bodyStrong" color={danger ? 'dangerText' : 'text'} style={{ flex: 1 }}>
        {title}
      </Typo>
      {right}
      {accessory === 'chevron' ? <ChevronRight size={20} color={colors.textMuted} /> : null}
      {accessory === 'external' ? <ArrowUpRight size={20} color={colors.textMuted} /> : null}
    </>
  );
  const rowStyle = {
    minHeight: 60,
    paddingHorizontal: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 14,
    borderBottomWidth: divider ? 1 : 0,
    borderBottomColor: colors.border,
  };
  if (!onPress) return <View style={rowStyle}>{content}</View>;
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={title}
      onPress={() => {
        tapHaptic();
        onPress();
      }}
      style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.7 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

/** Satırları gruplayan yuvarlak kutu */
export function ListGroup({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <View
      style={{
        borderRadius: radius.cardSm,
        backgroundColor: danger ? colors.dangerSurface : colors.surface,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}
