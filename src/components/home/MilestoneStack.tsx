import React from 'react';
import { ScrollView, View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { Milestone } from '../../domain/service';
import { colors, ColorToken } from '../../theme/tokens';
import { Card, ProgressBar, Typo } from '../ui';

const UPCOMING_TONES: ColorToken[] = ['blue', 'pink', 'purple'];
const TILTS = [-4, 3, -3, 2];

/**
 * Eğik, üst üste binen kilometre taşı kartları. Son tamamlanan taştan
 * başlar; sıradaki sarı, sonrakiler renkli.
 */
export function MilestoneStack({
  milestones,
  passed,
}: {
  milestones: Milestone[];
  passed: number;
}) {
  const currentIndex = milestones.findIndex((m) => m.status === 'current');
  const start = Math.max(0, (currentIndex === -1 ? milestones.length : currentIndex) - 1);
  const visible = milestones.slice(start);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
      style={{ marginHorizontal: -24 }}
      accessibilityLabel="Kilometre taşları"
    >
      {visible.map((m, i) => {
        const done = m.status === 'done';
        const current = m.status === 'current';
        const tone: ColorToken = done
          ? 'surfaceRaised'
          : current
            ? 'yellow'
            : UPCOMING_TONES[i % UPCOMING_TONES.length];
        const fg: ColorToken = done ? 'text' : 'ink';
        const daysLeft = m.passedAt - passed;
        return (
          <Card
            key={m.id}
            tone={tone}
            padding={18}
            accessible
            accessibilityLabel={`${m.title}, şafak ${m.remainingAt}, ${
              done ? 'tamamlandı' : current ? `${daysLeft} gün sonra` : 'sırada'
            }`}
            style={{
              width: 168,
              height: current ? 196 : 184,
              marginLeft: i === 0 ? 0 : -28,
              marginTop: current ? 0 : 12,
              justifyContent: 'space-between',
              transform: [{ rotate: `${TILTS[i % TILTS.length]}deg` }],
              zIndex: current ? 2 : 1,
            }}
          >
            {done ? (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={18} color={colors.ink} strokeWidth={3} />
              </View>
            ) : current ? (
              <Typo variant="label" color="ink">
                Sıradaki
              </Typo>
            ) : (
              <View />
            )}
            <View>
              <Typo variant="caption" color={done ? 'textMuted' : 'inkMuted'}>
                Şafak {m.remainingAt}
              </Typo>
              <Typo variant="subheading" color={fg} size={20} style={{ marginTop: 2 }}>
                {m.title}
              </Typo>
              {current ? (
                <View style={{ marginTop: 12, gap: 6 }}>
                  <ProgressBar progress={m.progress} />
                  <Typo variant="caption" color="ink">
                    {daysLeft} gün sonra
                  </Typo>
                </View>
              ) : null}
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}
