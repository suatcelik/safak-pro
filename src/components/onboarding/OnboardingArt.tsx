import React from 'react';
import { View } from 'react-native';
import { Paintbrush } from 'lucide-react-native';
import { colors, paintPalette } from '../../theme/tokens';
import { Card, Typo } from '../ui';
import { DeckLogo } from '../../assets/illustrations';

/** 1 — Şafağını say: eğik sayaç kartları */
export function CountdownArt() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} accessible={false}>
      <Card
        tone="white"
        tilt={6}
        style={{
          position: 'absolute',
          width: 230,
          height: 270,
          transform: [{ translateX: 34 }, { translateY: -10 }, { rotate: '6deg' }],
        }}
      />
      <Card
        tone="ink"
        tilt={-4}
        padding={24}
        style={{ width: 240, height: 280, justifyContent: 'space-between' }}
      >
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typo variant="label" color="textMuted">
            Şafak
          </Typo>
          <DeckLogo size={32} />
        </View>
        <View>
          <Typo variant="hero" color="accent" size={96} style={{ letterSpacing: -4 }}>
            142
          </Typo>
          <Typo variant="subheading" color="white" style={{ marginTop: 8 }}>
            gün kaldı
          </Typo>
        </View>
      </Card>
      <View
        style={{
          position: 'absolute',
          bottom: 48,
          left: 8,
          backgroundColor: colors.yellow,
          borderRadius: 999,
          paddingHorizontal: 16,
          paddingVertical: 10,
          transform: [{ rotate: '-8deg' }],
        }}
      >
        <Typo variant="bodyStrong" color="ink" size={14}>
          Terhis 12 Nisan
        </Typo>
      </View>
    </View>
  );
}

/** 2 — Günlerini boya: renkli gün ızgarası */
export function PaintArt() {
  const cells = Array.from({ length: 30 }, (_, i) => i);
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Card
        tone="ink"
        tilt={3}
        padding={20}
        style={{ width: 268, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}
      >
        {cells.map((i) => {
          const painted = i < 18;
          const bg = painted ? paintPalette[Math.floor(i / 4) % 5].color : colors.surfaceRaised;
          return (
            <View
              key={i}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: bg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typo variant="caption" color={painted ? 'ink' : 'textMuted'} size={12}>
                {i + 1}
              </Typo>
            </View>
          );
        })}
      </Card>
      <View
        style={{
          position: 'absolute',
          right: 8,
          top: 24,
          width: 64,
          height: 64,
          borderRadius: 999,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: '-10deg' }],
        }}
      >
        <Paintbrush size={30} color={colors.ink} />
      </View>
    </View>
  );
}

/** 3 — Kilometre taşları: üst üste renkli kartlar */
export function MilestonesArt() {
  const card = (tone: 'blue' | 'yellow', label: string, title: string, style: object) => (
    <Card
      tone={tone}
      padding={20}
      style={[
        { position: 'absolute', width: 220, height: 150, justifyContent: 'space-between' },
        style,
      ]}
    >
      <Typo variant="label" color="ink">
        {label}
      </Typo>
      <Typo variant="heading" color="ink" size={26}>
        {title}
      </Typo>
    </Card>
  );
  return (
    <View style={{ flex: 1 }}>
      {card('blue', 'Şafak 81', 'Plakalar', {
        left: 16,
        top: 24,
        transform: [{ rotate: '-6deg' }],
      })}
      {card('yellow', 'Şafak 100', 'Yüzler bitiyor', {
        right: 0,
        top: 112,
        transform: [{ rotate: '5deg' }],
      })}
      <Card
        tone="ink"
        padding={20}
        style={{
          position: 'absolute',
          left: 36,
          top: 214,
          width: 236,
          height: 160,
          justifyContent: 'space-between',
          transform: [{ rotate: '-2deg' }],
        }}
      >
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typo variant="label" color="textMuted">
            Şafak 0
          </Typo>
          <DeckLogo size={36} />
        </View>
        <Typo variant="heading" color="accent" size={28}>
          Doğan Güneş
        </Typo>
      </Card>
    </View>
  );
}
