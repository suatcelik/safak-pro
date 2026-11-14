import React from 'react';
import { View } from 'react-native';
import { CITIES } from '../../domain/cities';
import type { ServiceStats } from '../../domain/service';
import { Chip, ProgressRing, Typo } from '../ui';

/** Dev neon sayaç + ilerleme halkası + il / yüzde çipleri */
export function CountdownHero({ stats }: { stats: ServiceStats }) {
  const pct = Math.round(stats.percentage);
  const plate = stats.plateCity ? CITIES.find((c) => c.name === stats.plateCity)?.plate : undefined;

  let caption = 'gün kaldı';
  if (stats.status === 'notStarted') caption = `başlamaya ${stats.daysUntilStart} gün`;
  if (stats.status === 'done') caption = 'Hürgeneral!';

  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <ProgressRing
        progress={stats.percentage / 100}
        size={300}
        accessibilityLabel={`Şafak ${stats.remaining}, ${caption}. Yüzde ${pct} tamamlandı.`}
      >
        <View style={{ alignItems: 'center' }}>
          <Typo variant="label" color="textMuted" style={{ letterSpacing: 1.5 }}>
            Şafak
          </Typo>
          <Typo variant="hero" color="accent" adjustsFontSizeToFit numberOfLines={1}>
            {stats.remaining}
          </Typo>
          <Typo variant="subheading" size={17} style={{ marginTop: 4 }}>
            {caption}
          </Typo>
        </View>
      </ProgressRing>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {stats.plateCity && plate ? (
          <Chip tone="white" badge={String(plate)} label={stats.plateCity} />
        ) : null}
        <Chip label={`%${pct} tamam`} />
      </View>
    </View>
  );
}
