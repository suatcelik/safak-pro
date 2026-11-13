import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Share } from 'lucide-react-native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';
import { computeService } from '../domain/service';
import { getRandomQuote } from '../domain/quotes';
import { useToday } from '../hooks/useToday';
import { successHaptic } from '../services/haptics';
import { colors } from '../theme/tokens';
import {
  Body,
  Caption,
  Card,
  Heading,
  IconButton,
  Screen,
  StateView,
  StatCard,
  Typo,
} from '../components/ui';
import { CountdownHero } from '../components/home/CountdownHero';
import { MilestoneStack } from '../components/home/MilestoneStack';
import { TAB_BAR_SPACE } from '../navigation/FloatingTabBar';
import Svg, { Path } from 'react-native-svg';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const setup = useStore((s) => s.setup);
  const celebrated = useStore((s) => s.celebratedMilestones);
  const setCelebrated = useStore((s) => s.setCelebratedMilestones);
  const today = useToday();
  const [quote] = useState(getRandomQuote);

  const stats = useMemo(() => (setup ? computeService(setup, today) : null), [setup, today]);
  const doneCount = stats?.milestones.filter((m) => m.status === 'done').length ?? 0;

  // Yeni bir kilometre taşı tamamlandıysa bir kez kutla
  useEffect(() => {
    if (!stats) return;
    if (doneCount > celebrated) successHaptic();
    if (doneCount !== celebrated) setCelebrated(doneCount);
  }, [stats, doneCount, celebrated, setCelebrated]);

  if (!setup || !stats) {
    return (
      <Screen>
        <StateView
          kind="empty"
          title="Şafak henüz başlamadı"
          message="Saymaya başlamak için askerlik bilgilerini gir. Bir dakikanı alır."
          actionLabel="Bilgilerini gir"
          onAction={() => navigation.navigate('Setup')}
        />
      </Screen>
    );
  }

  const endText = format(stats.endDate, 'd MMMM yyyy', { locale: tr });
  const [endDay, endYear] = [
    format(stats.endDate, 'd MMMM', { locale: tr }),
    format(stats.endDate, 'yyyy'),
  ];

  return (
    <Screen scroll edges={['top']} bottomInset={TAB_BAR_SPACE} contentStyle={{ gap: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Typo variant="bodyStrong" color="textMuted" size={15} numberOfLines={1}>
            Merhaba, {setup.userName}
          </Typo>
          <Heading level={2}>{format(today, 'd MMMM EEEE', { locale: tr })}</Heading>
        </View>
        <IconButton label="Durumunu paylaş" onPress={() => navigation.navigate('Share')}>
          <Share size={22} color={colors.text} strokeWidth={2.2} />
        </IconButton>
      </View>

      <CountdownHero stats={stats} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Geçen" value={String(stats.passed)} unit="gün" style={{ flex: 1 }} />
        <Card
          tone="surfaceRaised"
          style={{ flex: 1, gap: 6 }}
          accessible
          accessibilityLabel={`Terhis: ${endText}`}
        >
          <Caption upper>Terhis</Caption>
          <Typo variant="heading">{`${endDay}\n${endYear}`}</Typo>
        </Card>
      </View>

      <Card
        small
        padding={16}
        style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}
        accessible
        accessibilityLabel={`Yol izni ${setup.roadLeave ?? 0} gün, kullanılan izin ${setup.usedLeave ?? 0} gün, ceza ${setup.penalty ?? 0} gün`}
      >
        <Mini label="Yol izni" value={setup.roadLeave ?? 0} />
        <View style={{ width: 1, backgroundColor: colors.border }} />
        <Mini label="İzin" value={setup.usedLeave ?? 0} />
        <View style={{ width: 1, backgroundColor: colors.border }} />
        <Mini label="Ceza" value={setup.penalty ?? 0} danger />
      </Card>

      <Card padding={24} style={{ gap: 12 }}>
        <Svg width={32} height={24} viewBox="0 0 32 24">
          <Path
            d="M0 24V14C0 6 4 1 12 0v5c-4 1-6 4-6 8h6v11zm18 0V14c0-8 4-13 12-14v5c-4 1-6 4-6 8h6v11z"
            fill={colors.accent}
          />
        </Svg>
        <Typo variant="subheading" size={20} style={{ lineHeight: 28 }}>
          {quote}
        </Typo>
        <Caption upper>Günün sözü</Caption>
      </Card>

      <View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}
        >
          <Heading level={2}>Kilometre taşları</Heading>
          <Body strong color="textMuted">
            {doneCount} / {stats.milestones.length}
          </Body>
        </View>
        <MilestoneStack milestones={stats.milestones} passed={stats.passed} />
      </View>
    </Screen>
  );
}

function Mini({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <View>
      <Caption>{label}</Caption>
      <Typo
        variant="subheading"
        color={danger && value > 0 ? 'dangerText' : 'text'}
        style={{ marginTop: 2 }}
      >
        {value} gün
      </Typo>
    </View>
  );
}
