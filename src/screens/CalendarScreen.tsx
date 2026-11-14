import React, { useCallback, useMemo } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setStatusBarHidden } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { X } from 'lucide-react-native';
import { differenceInCalendarDays } from 'date-fns';
import { useStore } from '../store/useStore';
import { buildCalendarLayout } from '../domain/calendarLayout';
import { effectiveTotalOf } from '../domain/service';
import { fromDateKey } from '../domain/dates';
import { useToday } from '../hooks/useToday';
import { selectHaptic } from '../services/haptics';
import { colors } from '../theme/tokens';
import { Caption, IconButton, Screen, StateView, Typo } from '../components/ui';
import { DayCell } from '../components/calendar/DayCell';
import { ColorPalette } from '../components/calendar/ColorPalette';

const GAP = 2;
const DIGIT_GAP = 28;
const EXTRA_ROW = 40;

export default function CalendarScreen() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const setup = useStore((s) => s.setup);
  const paintedDays = useStore((s) => s.paintedDays);
  const color = useStore((s) => s.lastColor);
  const togglePaintedDay = useStore((s) => s.togglePaintedDay);
  const setLastColor = useStore((s) => s.setLastColor);
  const today = useToday();

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});
      // Sekme ekranları açık kaldığı için durum çubuğunu odakla birlikte yönet
      setStatusBarHidden(true, 'fade');
      return () => {
        setStatusBarHidden(false, 'fade');
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
      };
    }, []),
  );

  const layout = useMemo(
    () => (setup ? buildCalendarLayout(setup.totalDays, effectiveTotalOf(setup)) : null),
    [setup],
  );

  const onPaint = useCallback(
    (day: number) => {
      selectHaptic();
      togglePaintedDay(day, color);
    },
    [togglePaintedDay, color],
  );

  if (!setup || !layout) {
    return (
      <Screen>
        <StateView
          kind="empty"
          title="Takvim boş"
          message="Önce askerlik bilgilerini gir, rakamların burada belirsin."
          actionLabel="Ana sayfaya dön"
          onAction={() => navigation.navigate('Home' as never)}
        />
      </Screen>
    );
  }

  const todayNumber = differenceInCalendarDays(today, fromDateKey(setup.startDate)) + 1;
  const total = effectiveTotalOf(setup);
  const paintedCount = Object.keys(paintedDays).filter((d) => Number(d) <= total).length;

  // Hücre boyutu: ekran yatayken yükseklik ve genişliğe sığacak en büyük kare
  const rows = Math.max(...layout.digits.map((d) => d.rows.length));
  const cols = layout.digits.reduce((sum, d) => sum + d.rows[0].length, 0);
  const landscapeH = Math.min(width, height);
  const landscapeW = Math.max(width, height);
  const availH = landscapeH - 40 - (layout.extraDays.length ? EXTRA_ROW : 0);
  const availW = landscapeW - 56 - 64 - 76 - 24 - DIGIT_GAP * (layout.digits.length - 1);
  const cell = Math.max(12, Math.min(48, Math.floor(Math.min(availH / rows, availW / cols) - GAP)));

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg, flexDirection: 'row' }}
      edges={['left', 'right']}
    >
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 20,
          paddingLeft: 24,
          paddingRight: 16,
        }}
      >
        <IconButton
          label="Takvimi kapat"
          size={44}
          onPress={() => navigation.navigate('Home' as never)}
        >
          <X size={20} color={colors.text} strokeWidth={2.5} />
        </IconButton>
        <Typo
          variant="label"
          color="textMuted"
          style={{
            width: 160,
            textAlign: 'center',
            transform: [{ rotate: '-90deg' }],
            marginBottom: 60,
          }}
        >
          {paintedCount} / {total} boyandı
        </Typo>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 20,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', gap: DIGIT_GAP, alignItems: 'flex-start' }}>
          {layout.digits.map((digit, di) => (
            <View key={di} style={{ gap: GAP }} accessibilityLabel={`Rakam ${digit.char}`}>
              {digit.rows.map((row, ri) => (
                <View key={ri} style={{ flexDirection: 'row', gap: GAP }}>
                  {row.map((day, ci) => (
                    <DayCell
                      key={ci}
                      day={day}
                      size={cell}
                      color={day ? paintedDays[day] : undefined}
                      isToday={day === todayNumber}
                      onPress={onPaint}
                    />
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>

        {layout.extraDays.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Caption upper>Ekstra · ceza ve izin</Caption>
            <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>
              {layout.extraDays.map((day) => (
                <DayCell
                  key={day}
                  day={day}
                  size={Math.max(cell, 20)}
                  color={paintedDays[day]}
                  isToday={day === todayNumber}
                  onPress={onPaint}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={{ paddingVertical: 20 }}>
        <ColorPalette value={color} onChange={setLastColor} />
      </View>
    </SafeAreaView>
  );
}
