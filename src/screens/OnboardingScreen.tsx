import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, Target, Flag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const slides = [
  {
    id: '1',
    title: 'Şafağını Say',
    description: 'Askersen, şafağını en güzel şekilde hesaplamak için doğru yerdesin.',
    icon: <Calendar size={80} color="#10b981" />,
  },
  {
    id: '2',
    title: 'Motivasyon',
    description: 'Her gün sana moral verecek yeni sözlerle askerliğini renklendir.',
    icon: <Target size={80} color="#10b981" />,
  },
  {
    id: '3',
    title: 'Hemen Başla',
    description: 'Bilgilerini gir ve vatan borcunu saymaya başla!',
    icon: <Flag size={80} color="#10b981" />,
  },
];

export default function OnboardingScreen() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigation = useNavigation<OnboardingNavigationProp>();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      completeOnboarding();
      navigation.replace('Setup');
    }
  };

  const skipSlide = () => {
    completeOnboarding();
    navigation.replace('Setup');
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <View className="flex-1 items-center justify-center bg-safakDark p-6">
      {/* İkon */}
      <View className="flex-1 items-center justify-center">
        <View className="rounded-full bg-safakSecondary p-8 shadow-lg">{currentSlide.icon}</View>
        <Text className="mt-10 text-center text-3xl font-bold text-white">
          {currentSlide.title}
        </Text>
        <Text className="mt-4 px-4 text-center text-lg leading-7 text-gray-400">
          {currentSlide.description}
        </Text>
      </View>

      {/* Noktalar */}
      <View className="mb-12 flex-row">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`mx-1 h-2 rounded-full ${
              currentSlideIndex === index ? 'w-8 bg-safakPrimary' : 'w-2 bg-gray-600'
            }`}
          />
        ))}
      </View>

      {/* Butonlar */}
      <View className="mb-8 w-full flex-row items-center justify-between px-4">
        <TouchableOpacity onPress={skipSlide}>
          <Text className="text-lg font-semibold text-gray-400">Atla</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-full bg-safakPrimary px-10 py-4 shadow-lg"
          onPress={nextSlide}
        >
          <Text className="text-lg font-bold text-safakDark">
            {currentSlideIndex === slides.length - 1 ? 'Başla' : 'İleri'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
