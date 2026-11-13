import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';
import { colors } from '../theme/tokens';
import { Body, Button, Heading, PageDots, Screen, ScreenTone, Typo } from '../components/ui';
import { CountdownArt, MilestonesArt, PaintArt } from '../components/onboarding/OnboardingArt';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const SLIDES: { tone: ScreenTone; title: string; text: string; Art: () => React.JSX.Element }[] = [
  {
    tone: 'accent',
    title: 'Şafağını say',
    text: 'Kalan günün, terhis tarihin ve ilerlemen her sabah tek bakışta.',
    Art: CountdownArt,
  },
  {
    tone: 'pink',
    title: 'Günlerini boya',
    text: 'Biten her günü takvimde istediğin renkle boya, şafağın rakamları dolsun.',
    Art: PaintArt,
  },
  {
    tone: 'purple',
    title: 'Kilometre taşlarını aç',
    text: 'Acemilikten doğan güneşe, her eşiği geçtikçe yeni bir kart açılır.',
    Art: MilestonesArt,
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation<Nav>();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  const finish = () => {
    completeOnboarding();
    navigation.replace('Setup');
  };

  return (
    <Screen tone={slide.tone}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable
          onPress={finish}
          accessibilityRole="button"
          accessibilityLabel="Tanıtımı atla"
          style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 }}
        >
          <Typo variant="bodyStrong" color="ink">
            Atla
          </Typo>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <slide.Art />
      </View>

      <View style={{ gap: 12, marginBottom: 32 }}>
        <Heading color="ink" size={40} style={{ lineHeight: 42, letterSpacing: -1.2 }}>
          {slide.title}
        </Heading>
        <Body color="ink">{slide.text}</Body>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <PageDots count={SLIDES.length} index={index} />
        <Button
          variant="secondary"
          label={last ? 'Başla' : 'İleri'}
          icon={<ArrowRight size={20} color={colors.white} strokeWidth={2.5} />}
          onPress={() => (last ? finish() : setIndex(index + 1))}
        />
      </View>
    </Screen>
  );
}
