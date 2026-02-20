import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, Target, Flag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { setFirstLaunch } from '../utils/storage';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: "Şafağını Say",
        description: "Askersen, şafağını en güzel şekilde hesaplamak için doğru yerdesin.",
        icon: <Calendar size={80} color="#10b981" />
    },
    {
        id: '2',
        title: "Motivasyon",
        description: "Her gün sana moral verecek yeni sözlerle askerliğini renklendir.",
        icon: <Target size={80} color="#10b981" />
    },
    {
        id: '3',
        title: "Hemen Başla",
        description: "Bilgilerini gir ve vatan borcunu saymaya başla!",
        icon: <Flag size={80} color="#10b981" />
    }
];

export default function OnboardingScreen() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const navigation = useNavigation<OnboardingNavigationProp>();

    const nextSlide = async () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        } else {
            await setFirstLaunch(false); // Onboarding tamamlandı
            navigation.replace('Setup');
        }
    };

    const skipSlide = async () => {
        await setFirstLaunch(false);
        navigation.replace('Setup');
    };

    const currentSlide = slides[currentSlideIndex];

    return (
        <View className="flex-1 bg-safakDark p-6 items-center justify-center">

            {/* İkon */}
            <View className="flex-1 justify-center items-center">
                <View className="bg-safakSecondary p-8 rounded-full shadow-lg">
                    {currentSlide.icon}
                </View>
                <Text className="text-white text-3xl font-bold mt-10 text-center">
                    {currentSlide.title}
                </Text>
                <Text className="text-gray-400 text-lg mt-4 text-center px-4 leading-7">
                    {currentSlide.description}
                </Text>
            </View>

            {/* Noktalar */}
            <View className="flex-row mb-12">
                {slides.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 rounded-full mx-1 ${currentSlideIndex === index ? 'w-8 bg-safakPrimary' : 'w-2 bg-gray-600'
                            }`}
                    />
                ))}
            </View>

            {/* Butonlar */}
            <View className="w-full flex-row justify-between items-center mb-8 px-4">
                <TouchableOpacity onPress={skipSlide}>
                    <Text className="text-gray-400 text-lg font-semibold">Atla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-safakPrimary py-4 px-10 rounded-full shadow-lg"
                    onPress={nextSlide}
                >
                    <Text className="text-safakDark font-bold text-lg">
                        {currentSlideIndex === slides.length - 1 ? "Başla" : "İleri"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
