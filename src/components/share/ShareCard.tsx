import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CITIES } from '../../domain/cities';
import type { ServiceStats } from '../../domain/service';
import { colors, radius } from '../../theme/tokens';
import { DeckLogo } from '../../assets/illustrations';
import { ProgressBar, Typo } from '../ui';

export type ShareVariant = 'yellow' | 'accent';

interface Props {
  stats: ServiceStats;
  name?: string;
  city?: string;
  variant: ShareVariant;
  size: number;
}

/**
 * Görsel olarak paylaşılan kare kart. Tasarım 540 birimlik kareye göre
 * çizildi; `size` ile ölçeklenir (paylaşımda 1080 piksele çekilir).
 */
export const ShareCard = forwardRef<View, Props>(function ShareCard(
  { stats, name, city, variant, size },
  ref,
) {
  const k = size / 540;
  const bg = variant === 'yellow' ? colors.yellow : colors.accent;
  const end = format(stats.endDate, 'd MMMM yyyy', { locale: tr });
  const plateCity = stats.plateCity ?? city;
  const plate = stats.plateCity ? CITIES.find((c) => c.name === stats.plateCity)?.plate : undefined;
  const pct = Math.round(stats.percentage);

  return (
    <View
      ref={ref}
      collapsable={false}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        padding: 44 * k,
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {variant === 'yellow' ? (
          <>
            <Typo variant="subheading" color="ink" size={20 * k}>
              {name ? `${name}'in şafağı` : 'Şafağım'}
            </Typo>
            <DeckLogo size={56 * k} backRight={colors.ink} />
          </>
        ) : (
          <>
            <View
              style={{
                backgroundColor: colors.ink,
                borderRadius: radius.pill,
                paddingHorizontal: 18 * k,
                paddingVertical: 10 * k,
              }}
            >
              <Typo variant="bodyStrong" color="accent" size={16 * k}>
                Şafak {stats.remaining}
              </Typo>
            </View>
            <Typo variant="bodyStrong" color="ink" size={16 * k}>
              Şafak Sayar
            </Typo>
          </>
        )}
      </View>

      <View
        style={{
          flexDirection: variant === 'yellow' ? 'column' : 'row',
          alignItems: variant === 'yellow' ? 'flex-start' : 'flex-end',
          gap: 14 * k,
        }}
      >
        <Typo
          variant="hero"
          color="ink"
          size={(variant === 'yellow' ? 220 : 200) * k}
          style={{ letterSpacing: -11 * k }}
        >
          {stats.remaining}
        </Typo>
        <Typo
          variant="title"
          color="ink"
          size={(variant === 'yellow' ? 34 : 30) * k}
          style={{ paddingBottom: variant === 'yellow' ? 0 : 10 * k }}
        >
          {variant === 'yellow' ? 'gün kaldı' : 'gün\nkaldı'}
        </Typo>
      </View>

      {variant === 'yellow' ? (
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <View>
            <Typo variant="label" color="inkMuted" size={14 * k}>
              Terhis
            </Typo>
            <Typo variant="heading" color="ink" size={24 * k}>
              {end}
            </Typo>
          </View>
          <Typo variant="bodyStrong" color="ink" size={15 * k}>
            Şafak Sayar
          </Typo>
        </View>
      ) : (
        <View style={{ gap: 14 * k }}>
          <ProgressBar progress={stats.percentage / 100} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typo variant="subheading" color="ink" size={18 * k}>
              %{pct} tamam
            </Typo>
            <Typo variant="subheading" color="ink" size={18 * k}>
              Terhis {end}
            </Typo>
          </View>
        </View>
      )}

      {plateCity ? (
        <View
          style={{
            position: 'absolute',
            right: 40 * k,
            top: (variant === 'yellow' ? 170 : 118) * k,
            backgroundColor: variant === 'yellow' ? colors.ink : colors.pink,
            borderRadius: radius.card * k,
            paddingHorizontal: 22 * k,
            paddingVertical: 16 * k,
            transform: [{ rotate: variant === 'yellow' ? '6deg' : '-7deg' }],
          }}
        >
          <Typo variant="label" color={variant === 'yellow' ? 'textMuted' : 'ink'} size={13 * k}>
            {plate ? `Plaka ${plate}` : 'Birlik'}
          </Typo>
          <Typo variant="title" color={variant === 'yellow' ? 'yellow' : 'ink'} size={30 * k}>
            {plateCity}
          </Typo>
        </View>
      ) : null}
    </View>
  );
});
