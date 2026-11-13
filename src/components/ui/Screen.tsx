import React from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../theme/tokens';

export type ScreenTone = 'bg' | 'accent' | 'pink' | 'purple' | 'yellow';

interface Props {
  tone?: ScreenTone;
  scroll?: boolean;
  edges?: Edge[];
  /** Kaydırılabilir içeriğin altına bırakılacak boşluk (ör. yüzen sekme çubuğu) */
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** Güvenli alan + zemin rengi + doğru durum çubuğu stili */
export function Screen({
  tone = 'bg',
  scroll,
  edges = ['top', 'bottom'],
  bottomInset = 0,
  contentStyle,
  children,
}: Props) {
  const background = colors[tone];
  const padding: ViewStyle = { paddingHorizontal: 24, paddingTop: 16 };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }} edges={edges}>
      <StatusBar style={tone === 'bg' ? 'light' : 'dark'} />
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[padding, { paddingBottom: 24 + bottomInset }, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingBottom: 16 }, padding, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
