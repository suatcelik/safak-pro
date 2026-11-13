import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Paintbrush, X } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useStore } from '../store/useStore';
import { buildCalendarLayout } from '../domain/calendarLayout';
import { effectiveTotalOf } from '../domain/service';

const COLORS = ['#10b981', '#3b82f6', '#a855f7', '#f43f5e', '#f97316', '#eab308'];

const CELL = {
  28: { size: 'w-[48px] h-[48px] m-1', text: 'text-base' },
  180: { size: 'w-[26px] h-[22px] m-[1px]', text: 'text-[9px]' },
  365: { size: 'w-[22px] h-[18px] m-[1px]', text: 'text-[8px]' },
} as const;

export default function CalendarScreen() {
  const navigation = useNavigation();
  const setup = useStore((s) => s.setup);
  const paintedDays = useStore((s) => s.paintedDays);
  const selectedColor = useStore((s) => s.lastColor);
  const togglePaintedDay = useStore((s) => s.togglePaintedDay);
  const setLastColor = useStore((s) => s.setLastColor);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, []),
  );

  const layout = useMemo(
    () => (setup ? buildCalendarLayout(setup.totalDays, effectiveTotalOf(setup)) : null),
    [setup],
  );

  if (!setup || !layout) {
    return (
      <View className="flex-1 items-center justify-center bg-safakDark">
        <Text className="text-white">Önce askerlik bilgilerini gir.</Text>
      </View>
    );
  }

  const sizeKey = setup.totalDays <= 28 ? 28 : setup.totalDays <= 180 ? 180 : 365;
  const cell = CELL[sizeKey];

  const renderCell = (day: number, key: string, sizeClass: string, textClass: string) => {
    if (day === 0) return <View key={key} className={sizeClass} />;
    const color = paintedDays[day];
    return (
      <TouchableOpacity
        key={key}
        onPress={() => togglePaintedDay(day, selectedColor)}
        style={color ? { backgroundColor: color, borderColor: color } : undefined}
        className={`${sizeClass} items-center justify-center rounded-sm border ${
          color ? '' : 'border-gray-700 bg-safakSecondary'
        }`}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Gün ${day}${color ? ', boyalı' : ''}`}
      >
        <Text className={`font-bold ${textClass} ${color ? 'text-white' : 'text-gray-400'}`}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="relative flex-1 flex-row bg-safakDark">
      <TouchableOpacity
        onPress={() => navigation.navigate('Home' as never)}
        className="absolute left-8 top-6 z-50 h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-safakSecondary shadow-lg"
        activeOpacity={0.7}
        accessibilityLabel="Takvimi kapat"
        accessibilityRole="button"
      >
        <X size={24} color="#f8fafc" />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <View className="w-full flex-row items-center justify-center gap-x-10 px-2 py-4">
              {layout.digits.map((digit, di) => (
                <View key={`digit-${di}`} className="flex-col">
                  {digit.rows.map((row, ri) => (
                    <View key={`row-${di}-${ri}`} className="flex-row">
                      {row.map((day, ci) =>
                        renderCell(day, `c-${di}-${ri}-${ci}`, cell.size, cell.text),
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          {layout.extraDays.length > 0 && (
            <View className="mb-6 mt-4 items-center px-4">
              <Text className="mb-2 text-xs text-gray-500">Ekstra Günler (ceza ve izin)</Text>
              <View className="max-w-[500px] flex-row flex-wrap justify-center">
                {layout.extraDays.map((day) =>
                  renderCell(day, `x-${day}`, 'w-[26px] h-[22px] m-[2px]', 'text-[9px]'),
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <View className="w-18 items-center border-l border-gray-800 bg-safakSecondary py-8 shadow-2xl">
        <View className="mb-6 rounded-full border border-gray-700 bg-safakDark p-2">
          <Paintbrush size={24} color={selectedColor} />
        </View>
        <View className="flex-1 justify-center gap-y-5">
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setLastColor(c)}
              style={{
                backgroundColor: c,
                borderWidth: selectedColor === c ? 3 : 0,
                borderColor: 'white',
              }}
              className="h-8 w-8 rounded-full shadow-lg"
              accessibilityRole="button"
              accessibilityLabel={`Renk ${c}`}
              accessibilityState={{ selected: selectedColor === c }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
