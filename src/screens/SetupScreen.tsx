import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, CalendarDays, Check, Minus, Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';
import { colors, ColorToken, fonts, radius } from '../theme/tokens';
import { fromDateKey, toDateKey } from '../domain/dates';
import { computeService, MilitaryType } from '../domain/service';
import {
  draftFromSetup,
  emptyDraft,
  LIMITS,
  SETUP_STEPS,
  SetupDraft,
  SetupStep,
  setupFromDraft,
  stepError,
} from '../domain/setupForm';
import {
  getNotificationPermission,
  requestNotificationPermission,
  rescheduleNotifications,
} from '../services/notifications';
import { selectHaptic, successHaptic } from '../services/haptics';
import {
  Body,
  Button,
  Caption,
  Card,
  Heading,
  IconButton,
  Screen,
  StepBar,
  Typo,
} from '../components/ui';
import { CityPicker } from '../components/setup/CityPicker';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

const TYPES: { id: MilitaryType; days: number; label: string; tone: ColorToken }[] = [
  { id: 'short', days: 180, label: 'Kısa Dönem', tone: 'accent' },
  { id: 'long', days: 365, label: 'Uzun Dönem', tone: 'blue' },
  { id: 'paid', days: 28, label: 'Bedelli', tone: 'yellow' },
  { id: 'officer', days: 365, label: 'Yedek Subay', tone: 'pink' },
];

const COPY: Record<SetupStep, { title: string; text: string }> = {
  name: { title: 'Sana ne diyelim?', text: 'Ana sayfada seni adınla selamlayacağız.' },
  type: { title: 'Hangi askerlik?', text: 'Süre ve takvim düzeni buna göre ayarlanır.' },
  date: { title: 'Sülüs ne zaman?', text: 'Başlangıç tarihin ve şehirlerin.' },
  extras: {
    title: 'İzin ve ceza',
    text: "Yol izni terhisi öne çeker; kullanılan izin ve ceza süreyi uzatır. Sonra Ayarlar'dan değiştirebilirsin.",
  },
  notify: {
    title: 'Sabahları haber verelim mi?',
    text: "Her sabah 08:00'de günün sözü; şafak 100, 81 ve terhis gününde müjde. Bildirimler yalnızca telefonunda planlanır.",
  },
};

const longDate = (key: string) => format(fromDateKey(key), 'd MMMM yyyy', { locale: tr });

export default function SetupScreen() {
  const navigation = useNavigation<Nav>();
  const existing = useStore((s) => s.setup);
  const saveSetup = useStore((s) => s.saveSetup);
  const notificationsEnabled = useStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useStore((s) => s.setNotificationsEnabled);

  const [draft, setDraft] = useState<SetupDraft>(() =>
    existing ? draftFromSetup(existing) : emptyDraft(toDateKey(new Date())),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [askNotify, setAskNotify] = useState(false);
  const [cityField, setCityField] = useState<'hometown' | 'militaryCity' | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNotificationPermission()
      .then((p) => setAskNotify(p === 'undetermined'))
      .catch(() => setAskNotify(false));
  }, []);

  const steps = useMemo(() => SETUP_STEPS.filter((s) => s !== 'notify' || askNotify), [askNotify]);
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const isLast = stepIndex >= steps.length - 1;
  const update = (patch: Partial<SetupDraft>) => {
    setError(null);
    setDraft((d) => ({ ...d, ...patch }));
  };

  const preview = useMemo(() => computeService(setupFromDraft(draft), new Date()), [draft]);

  const finish = async (enableNotifications: boolean, from: SetupDraft = draft) => {
    const setup = setupFromDraft(from);
    saveSetup(setup);
    setNotificationsEnabled(enableNotifications);
    if (enableNotifications) await rescheduleNotifications(setup);
    successHaptic();
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace('MainTabs');
  };

  const advance = () => {
    if (isLast) finish(notificationsEnabled);
    else setStepIndex(stepIndex + 1);
  };

  const next = () => {
    const err = stepError(step, draft);
    if (err) setError(err);
    else advance();
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <Screen tone="purple">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {stepIndex > 0 || navigation.canGoBack() ? (
            <IconButton label="Geri" tone="ink" size={44} onPress={back}>
              <ArrowLeft size={20} color={colors.ink} strokeWidth={2.5} />
            </IconButton>
          ) : null}
          <StepBar step={stepIndex + 1} total={steps.length} />
          <Typo variant="bodyStrong" color="ink" size={14}>
            {stepIndex + 1}/{steps.length}
          </Typo>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 36, paddingBottom: 24, gap: 28 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 12 }}>
            {step === 'extras' ? (
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: colors.yellow,
                  borderRadius: radius.pill,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Typo variant="caption" color="ink">
                  İsteğe bağlı
                </Typo>
              </View>
            ) : null}
            <Heading color="ink" size={40} style={{ lineHeight: 42, letterSpacing: -1.2 }}>
              {COPY[step].title}
            </Heading>
            <Body color="ink">{COPY[step].text}</Body>
          </View>

          {step === 'name' ? (
            <View style={{ gap: 8 }}>
              <Typo variant="label" color="ink">
                Adın
              </Typo>
              <TextInput
                value={draft.userName}
                onChangeText={(t) => update({ userName: t.slice(0, LIMITS.name) })}
                placeholder="Adın"
                placeholderTextColor={colors.placeholder}
                autoFocus={!existing}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={next}
                accessibilityLabel="Adın"
                style={{
                  height: 64,
                  borderRadius: radius.cardSm,
                  borderWidth: 3,
                  borderColor: colors.ink,
                  backgroundColor: colors.white,
                  paddingHorizontal: 20,
                  fontFamily: fonts.bold,
                  fontSize: 20,
                  color: colors.ink,
                }}
              />
            </View>
          ) : null}

          {step === 'type' ? (
            <View
              accessibilityRole="radiogroup"
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}
            >
              {TYPES.map((t) => {
                const selected = draft.militaryType === t.id;
                return (
                  <Pressable
                    key={t.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${t.label}, ${t.days} gün`}
                    onPress={() => {
                      selectHaptic();
                      update({ militaryType: t.id });
                    }}
                    style={{
                      width: '47.5%',
                      height: 168,
                      borderRadius: radius.card,
                      backgroundColor: colors[t.tone],
                      padding: 18,
                      justifyContent: 'space-between',
                      borderWidth: 3,
                      borderColor: selected ? colors.ink : 'transparent',
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typo variant="display" color="ink" size={44} style={{ letterSpacing: -1.5 }}>
                        {t.days}
                      </Typo>
                      {selected ? (
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 999,
                            backgroundColor: colors.ink,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={16} color={colors.white} strokeWidth={3} />
                        </View>
                      ) : null}
                    </View>
                    <View>
                      <Typo variant="caption" color="inkMuted">
                        gün
                      </Typo>
                      <Typo variant="subheading" color="ink" size={17}>
                        {t.label}
                      </Typo>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          {step === 'date' ? (
            <View style={{ gap: 12 }}>
              <Pressable
                onPress={() => setShowDate(true)}
                accessibilityRole="button"
                accessibilityLabel={`Başlangıç tarihi: ${longDate(draft.startDate)}. Değiştirmek için dokun.`}
                style={{
                  height: 88,
                  borderRadius: radius.card,
                  borderWidth: 3,
                  borderColor: colors.ink,
                  backgroundColor: colors.white,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Typo variant="label" color="inkMuted">
                    Başlangıç
                  </Typo>
                  <Typo variant="heading" color="ink">
                    {longDate(draft.startDate)}
                  </Typo>
                </View>
                <CalendarDays size={28} color={colors.ink} />
              </Pressable>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                {(['hometown', 'militaryCity'] as const).map((field) => (
                  <Pressable
                    key={field}
                    onPress={() => setCityField(field)}
                    accessibilityRole="button"
                    accessibilityLabel={`${field === 'hometown' ? 'Memleket' : 'Birlik'}: ${draft[field] || 'seçilmedi'}`}
                    style={{
                      flex: 1,
                      height: 88,
                      borderRadius: radius.card,
                      backgroundColor: colors.white,
                      paddingHorizontal: 18,
                      justifyContent: 'center',
                    }}
                  >
                    <Typo variant="label" color="inkMuted">
                      {field === 'hometown' ? 'Memleket' : 'Birlik'}
                    </Typo>
                    <Typo
                      variant="subheading"
                      color={draft[field] ? 'ink' : 'placeholder'}
                      size={20}
                      numberOfLines={1}
                    >
                      {draft[field] || 'Seç'}
                    </Typo>
                  </Pressable>
                ))}
              </View>

              <Card
                tone="ink"
                tilt={-1.5}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Caption upper>Terhis</Caption>
                  <Typo variant="heading" color="accent" size={22}>
                    {format(preview.endDate, 'd MMMM yyyy', { locale: tr })}
                  </Typo>
                </View>
                <Typo variant="bodyStrong" color="white">
                  {preview.effectiveTotal} gün
                </Typo>
              </Card>
            </View>
          ) : null}

          {step === 'extras' ? (
            <View style={{ gap: 10 }}>
              <Stepper
                label="Yol izni"
                hint={`En fazla ${LIMITS.roadLeave} gün`}
                value={draft.roadLeave}
                max={LIMITS.roadLeave}
                onChange={(v) => update({ roadLeave: v })}
              />
              <Stepper
                label="Kullanılan izin"
                hint={`En fazla ${LIMITS.usedLeave} gün`}
                value={draft.usedLeave}
                max={LIMITS.usedLeave}
                onChange={(v) => update({ usedLeave: v })}
              />
              <Stepper
                label="Ceza"
                hint="Süreyi uzatır"
                value={draft.penalty}
                max={LIMITS.penalty}
                danger
                onChange={(v) => update({ penalty: v })}
              />
            </View>
          ) : null}

          {error ? (
            <View
              accessibilityLiveRegion="polite"
              style={{ backgroundColor: colors.ink, borderRadius: radius.cardSm, padding: 14 }}
            >
              <Typo variant="bodyStrong" color="dangerText">
                {error}
              </Typo>
            </View>
          ) : null}
        </ScrollView>

        {step === 'notify' ? (
          <View style={{ gap: 10 }}>
            <Button
              label="Bildirimlere izin ver"
              onPress={async () => {
                const granted = await requestNotificationPermission().catch(() => false);
                finish(granted);
              }}
            />
            <Button variant="ghost" label="Şimdi değil" onPress={() => finish(false)} />
          </View>
        ) : step === 'extras' ? (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              variant="outline"
              label="Atla"
              style={{ flex: 1 }}
              onPress={() => {
                // Atla: bu adımdaki değişiklikleri geri al
                const reverted: SetupDraft = {
                  ...draft,
                  roadLeave: existing?.roadLeave ?? 0,
                  usedLeave: existing?.usedLeave ?? 0,
                  penalty: existing?.penalty ?? 0,
                };
                setDraft(reverted);
                if (isLast) finish(notificationsEnabled, reverted);
                else setStepIndex(stepIndex + 1);
              }}
            />
            <Button label={isLast ? 'Kaydet' : 'Devam'} style={{ flex: 1.4 }} onPress={next} />
          </View>
        ) : (
          <Button label="Devam" onPress={next} />
        )}
      </KeyboardAvoidingView>

      <CityPicker
        visible={cityField !== null}
        title={cityField === 'hometown' ? 'Memleket' : 'Birlik şehri'}
        value={cityField ? draft[cityField] : ''}
        onClose={() => setCityField(null)}
        onSelect={(city) => {
          if (cityField) update({ [cityField]: city });
          setCityField(null);
        }}
      />

      {showDate && Platform.OS === 'android' ? (
        <DateTimePicker
          value={fromDateKey(draft.startDate)}
          mode="date"
          minimumDate={new Date(2020, 0, 1)}
          maximumDate={new Date(2035, 0, 1)}
          onChange={(event, date) => {
            setShowDate(false);
            if (event.type === 'set' && date) update({ startDate: toDateKey(date) });
          }}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDate}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDate(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
              style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: radius.card,
                borderTopRightRadius: radius.card,
                padding: 24,
                paddingBottom: 40,
              }}
            >
              <DateTimePicker
                value={fromDateKey(draft.startDate)}
                mode="date"
                display="spinner"
                locale="tr-TR"
                themeVariant="light"
                minimumDate={new Date(2020, 0, 1)}
                maximumDate={new Date(2035, 0, 1)}
                onChange={(_, date) => date && update({ startDate: toDateKey(date) })}
              />
              <Button label="Tamam" onPress={() => setShowDate(false)} />
            </View>
          </View>
        </Modal>
      ) : null}
    </Screen>
  );
}

function Stepper({
  label,
  hint,
  value,
  max,
  danger,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  max: number;
  danger?: boolean;
  onChange: (v: number) => void;
}) {
  const dec = () => onChange(Math.max(0, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  const btn = (dark: boolean) => ({
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: dark ? colors.ink : colors.surfaceRaised,
  });
  return (
    <View
      style={{
        minHeight: 76,
        borderRadius: radius.cardSm,
        backgroundColor: colors.white,
        paddingLeft: 20,
        paddingRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Typo variant="subheading" color="ink" size={17}>
          {label}
        </Typo>
        <Typo variant="caption" color="inkMuted">
          {hint}
        </Typo>
      </View>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={`${label}: ${value} gün`}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'increment' ? inc() : dec())}
      >
        <Pressable
          onPress={() => {
            selectHaptic();
            dec();
          }}
          style={btn(false)}
        >
          <Minus size={20} color={colors.white} strokeWidth={2.5} />
        </Pressable>
        <Typo
          variant="heading"
          color={danger && value > 0 ? 'danger' : 'ink'}
          align="center"
          style={{ width: 44 }}
        >
          {value}
        </Typo>
        <Pressable
          onPress={() => {
            selectHaptic();
            inc();
          }}
          style={btn(true)}
        >
          <Plus size={20} color={colors.white} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
