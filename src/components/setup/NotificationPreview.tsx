import React from 'react';
import { View } from 'react-native';
import {
  MILESTONE_HOUR,
  MILESTONE_NOTIFICATIONS,
  QUOTE_HOUR,
  QUOTE_TITLE,
} from '../../domain/notificationPlan';
import { colors, ColorToken, radius } from '../../theme/tokens';
import { DeckLogo } from '../../assets/illustrations';
import { Typo } from '../ui';

const hour = (h: number) => `${String(h).padStart(2, '0')}:00`;

const SAMPLE_QUOTE = 'Her yeni şafak, eve bir adım daha yakın demektir.';
const DALYA = MILESTONE_NOTIFICATIONS.find((m) => m.daysLeft === 100)!;

function PreviewCard({
  tone,
  icon,
  title,
  time,
  body,
  timeTone,
  style,
}: {
  tone: ColorToken;
  icon: React.ReactNode;
  title: string;
  time: string;
  body: string;
  timeTone: ColorToken;
  style: object;
}) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          minHeight: 92,
          borderRadius: 24,
          backgroundColor: colors[tone],
          padding: 16,
          flexDirection: 'row',
          gap: 12,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.chip,
          backgroundColor: colors.ink,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <Typo variant="bodyStrong" color="ink" size={15} numberOfLines={1} style={{ flex: 1 }}>
            {title}
          </Typo>
          <Typo variant="caption" color={timeTone}>
            {time}
          </Typo>
        </View>
        <Typo variant="caption" color="ink" size={14} style={{ marginTop: 2 }} numberOfLines={2}>
          {body}
        </Typo>
      </View>
    </View>
  );
}

/**
 * Kurulumun bildirim adımında, gelecek bildirimlerin nasıl görüneceğini
 * gösteren iki eğik örnek kart. Metinler gerçek bildirim planından gelir.
 */
export function NotificationPreview() {
  return (
    <View
      style={{ height: 260 }}
      accessible
      accessibilityLabel={`Örnek bildirimler: her sabah ${hour(QUOTE_HOUR)}'de günün sözü; şafak 100'de "${DALYA.body}"`}
    >
      <PreviewCard
        tone="white"
        icon={<DeckLogo size={30} />}
        title={QUOTE_TITLE}
        time={hour(QUOTE_HOUR)}
        body={SAMPLE_QUOTE}
        timeTone="inkMuted"
        style={{ left: 0, right: 0, top: 20, transform: [{ rotate: '-3deg' }] }}
      />
      <PreviewCard
        tone="yellow"
        icon={
          <Typo variant="caption" color="yellow" size={14}>
            100
          </Typo>
        }
        title={DALYA.title}
        time={hour(MILESTONE_HOUR)}
        body={DALYA.body}
        timeTone="inkMuted"
        style={{ left: 20, right: -6, top: 130, transform: [{ rotate: '2.5deg' }] }}
      />
    </View>
  );
}
