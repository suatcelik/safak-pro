import React from 'react';
import { Alert, Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { Bell, Info, PencilLine, ShieldCheck, Trash2 } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';
import {
  cancelAllNotifications,
  getNotificationPermission,
  requestNotificationPermission,
  rescheduleNotifications,
} from '../services/notifications';
import { colors } from '../theme/tokens';
import { Caption, Card, Heading, ListGroup, ListRow, Screen, Toggle, Typo } from '../components/ui';
import { TAB_BAR_SPACE } from '../navigation/FloatingTabBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRIVACY_POLICY_URL = 'https://suatcelik.github.io/-afak-Sayar-privacy-policy/';

const TYPE_LABEL = {
  short: 'Kısa dönem',
  long: 'Uzun dönem',
  paid: 'Bedelli',
  officer: 'Yedek subay',
};

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const setup = useStore((s) => s.setup);
  const resetStore = useStore((s) => s.reset);
  const notificationsEnabled = useStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useStore((s) => s.setNotificationsEnabled);
  const version = Constants.expoConfig?.version ?? '';

  const toggleNotifications = async (next: boolean) => {
    if (!next) {
      setNotificationsEnabled(false);
      await cancelAllNotifications().catch(() => {});
      return;
    }
    let status = await getNotificationPermission();
    if (status === 'undetermined')
      status = (await requestNotificationPermission()) ? 'granted' : 'denied';
    if (status !== 'granted') {
      Alert.alert(
        'Bildirim izni kapalı',
        'Bildirimleri açmak için telefonunun ayarlarından Şafak Sayar için izin ver.',
        [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'Ayarları aç', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    setNotificationsEnabled(true);
    if (setup) await rescheduleNotifications(setup);
  };

  const openPrivacy = async () => {
    try {
      await Linking.openURL(PRIVACY_POLICY_URL);
    } catch {
      Alert.alert('Hata', 'Gizlilik politikası şu an açılamıyor.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Tüm veriler silinsin mi?',
      'Şafak bilgilerin, boyadığın günler ve bildirimler silinecek.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil ve sıfırla',
          style: 'destructive',
          onPress: async () => {
            await cancelAllNotifications().catch(() => {});
            resetStore();
            const root = navigation.getParent<Nav>() ?? navigation;
            root.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          },
        },
      ],
    );
  };

  const initial = setup?.userName?.trim().charAt(0).toLocaleUpperCase('tr') || 'Ş';

  return (
    <Screen scroll edges={['top']} bottomInset={TAB_BAR_SPACE} contentStyle={{ gap: 20 }}>
      <Heading>Ayarlar</Heading>

      {setup ? (
        <Card tone="accent" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: colors.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typo variant="heading" color="accent" size={22}>
              {initial}
            </Typo>
          </View>
          <View style={{ flex: 1 }}>
            <Typo variant="subheading" color="ink" size={20} numberOfLines={1}>
              {setup.userName}
            </Typo>
            <Typo variant="caption" color="inkMuted" size={14} numberOfLines={1}>
              {TYPE_LABEL[setup.militaryType]} · {setup.hometown} → {setup.militaryCity}
            </Typo>
          </View>
        </Card>
      ) : null}

      <ListGroup>
        <ListRow
          title="Bilgileri güncelle"
          iconTone="blue"
          icon={<PencilLine size={20} color={colors.ink} strokeWidth={2.2} />}
          onPress={() => navigation.navigate('Setup')}
          divider
        />
        <ListRow
          title="Bildirimler"
          iconTone="yellow"
          icon={<Bell size={20} color={colors.ink} strokeWidth={2.2} />}
          right={
            <Toggle
              label="Bildirimler"
              value={notificationsEnabled}
              onChange={toggleNotifications}
            />
          }
        />
      </ListGroup>

      <ListGroup>
        <ListRow
          title="Gizlilik politikası"
          iconTone="purple"
          icon={<ShieldCheck size={20} color={colors.ink} strokeWidth={2.2} />}
          onPress={openPrivacy}
          accessory="external"
          accessibilityRole="link"
          divider
        />
        <ListRow
          title="Hakkında"
          iconTone="white"
          icon={<Info size={20} color={colors.ink} strokeWidth={2.2} />}
          right={<Caption>Sürüm {version}</Caption>}
        />
      </ListGroup>

      <ListGroup danger>
        <ListRow
          title="Tüm verileri sıfırla"
          iconTone="danger"
          icon={<Trash2 size={20} color={colors.ink} strokeWidth={2.2} />}
          onPress={handleReset}
          accessory="none"
          danger
        />
      </ListGroup>

      <Caption align="center">Reklam yok · Veri toplanmaz · Her şey telefonunda</Caption>
    </Screen>
  );
}
