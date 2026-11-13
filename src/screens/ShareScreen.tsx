import React, { useMemo, useRef, useState } from 'react';
import { Alert, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { X } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { computeService } from '../domain/service';
import { useToday } from '../hooks/useToday';
import { colors } from '../theme/tokens';
import { Body, Button, Chip, Heading, IconButton, Screen, StateView } from '../components/ui';
import { ShareCard, ShareVariant } from '../components/share/ShareCard';

const EXPORT_PX = 1080;

export default function ShareScreen() {
  const navigation = useNavigation();
  const setup = useStore((s) => s.setup);
  const today = useToday();
  const { width } = useWindowDimensions();
  const [variant, setVariant] = useState<ShareVariant>('yellow');
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<View>(null);
  const stats = useMemo(() => (setup ? computeService(setup, today) : null), [setup, today]);

  if (!setup || !stats) {
    return (
      <Screen>
        <StateView
          kind="empty"
          title="Paylaşacak şafak yok"
          message="Önce askerlik bilgilerini gir."
        />
      </Screen>
    );
  }

  const size = Math.min(width - 48, 420);

  const share = async () => {
    setBusy(true);
    try {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        width: EXPORT_PX,
        height: EXPORT_PX,
      });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Paylaşım kullanılamıyor', 'Bu cihazda paylaşım menüsü açılamadı.');
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Şafağını paylaş' });
    } catch (e) {
      console.warn('[share]', e);
      Alert.alert('Paylaşılamadı', 'Kart görseli oluşturulamadı, tekrar dene.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen contentStyle={{ gap: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading>Paylaş</Heading>
        <IconButton label="Kapat" size={44} onPress={() => navigation.goBack()}>
          <X size={20} color={colors.text} strokeWidth={2.5} />
        </IconButton>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View style={{ borderRadius: 28, overflow: 'hidden' }}>
          <ShareCard
            ref={cardRef}
            stats={stats}
            name={setup.userName}
            city={setup.militaryCity}
            variant={variant}
            size={size}
          />
        </View>
      </View>

      <View
        accessibilityRole="radiogroup"
        style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}
      >
        <Chip
          label="Sarı"
          tone="yellow"
          selected={variant === 'yellow'}
          onPress={() => setVariant('yellow')}
        />
        <Chip
          label="Neon"
          tone="accent"
          selected={variant === 'accent'}
          onPress={() => setVariant('accent')}
        />
      </View>

      <Body color="textMuted" align="center">
        Kart kare görsel olarak paylaşılır; hikâyene ya da gruba atabilirsin.
      </Body>

      <View style={{ flex: 1 }} />
      <Button
        variant="primary"
        label={busy ? 'Hazırlanıyor…' : 'Paylaş'}
        disabled={busy}
        onPress={share}
      />
    </Screen>
  );
}
