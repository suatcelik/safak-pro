import React from 'react';
import { Pressable, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDays, Home, Settings } from 'lucide-react-native';
import { colors, radius, sizes } from '../theme/tokens';
import { selectHaptic } from '../services/haptics';
import { Typo } from '../components/ui';

const TABS: Record<string, { label: string; Icon: typeof Home }> = {
  Home: { label: 'Şafak', Icon: Home },
  Calendar: { label: 'Takvim', Icon: CalendarDays },
  Settings: { label: 'Ayarlar', Icon: Settings },
};

export const TAB_BAR_SPACE = sizes.tabBar + 32;

/** Koyu, yuvarlatılmış, yüzen sekme çubuğu; aktif sekme neon hap. */
export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index];
  // Takvim yatay tam ekran açılır; kendi kapatma butonu var.
  if (active.name === 'Calendar') return null;

  return (
    <View
      accessibilityRole="tablist"
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: Math.max(insets.bottom, 16),
        height: sizes.tabBar,
        borderRadius: radius.pill,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
      }}
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const tab = TABS[route.name];
        if (!tab) return null;
        const { Icon, label } = tab;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: focused }}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                selectHaptic();
                navigation.navigate(route.name);
              }
            }}
            style={{
              height: 52,
              minWidth: 52,
              paddingHorizontal: focused ? 20 : 0,
              borderRadius: radius.pill,
              backgroundColor: focused ? colors.accent : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Icon
              size={focused ? 22 : 24}
              color={focused ? colors.ink : colors.textMuted}
              strokeWidth={2.3}
            />
            {focused ? (
              <Typo variant="bodyStrong" color="ink" size={15}>
                {label}
              </Typo>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
