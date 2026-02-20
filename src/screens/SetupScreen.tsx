import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { saveUserSetup, SetupInfo } from '../utils/storage';
import { CalendarDays, Briefcase, CheckCircle } from 'lucide-react-native';

type SetupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

const MILITARY_TYPES = [
    { id: 'short', label: 'Kısa Dönem (6 Ay)', days: 180 },
    { id: 'long', label: 'Uzun Dönem (12 Ay)', days: 365 },
    { id: 'paid', label: 'Bedelli Askerlik', days: 28 },
    { id: 'officer', label: 'Yedek Subay/Astay', days: 365 },
] as const;

export default function SetupScreen() {
    const navigation = useNavigation<SetupNavigationProp>();

    const [selectedType, setSelectedType] = useState<typeof MILITARY_TYPES[number]['id']>('short');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Sadece yyyy-aa-gg için basit bir çözüm, date picker da eklenebilir.

    const handleSave = async () => {
        const typeObj = MILITARY_TYPES.find(t => t.id === selectedType);
        if (!typeObj) return;

        if (!startDate) {
            Alert.alert("Hata", "Lütfen sülüs tarihini (başlangıç) giriniz.");
            return;
        }

        const payload: SetupInfo = {
            militaryType: selectedType,
            startDate: startDate,
            totalDays: typeObj.days,
        };

        await saveUserSetup(payload);
        navigation.replace('MainTabs');
    };

    return (
        <View className="flex-1 bg-safakDark p-6">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-white text-3xl font-bold mt-12 mb-2">Askerlik Bilgilerin</Text>
                <Text className="text-gray-400 text-base mb-10">
                    Uygulamayı kullanabilmek için başlangıç bilgilerini girmelisiniz.
                </Text>

                <Text className="text-gray-300 font-semibold mb-3 text-lg">Askerlik Türü</Text>
                <View className="gap-y-3 mb-8">
                    {MILITARY_TYPES.map((item) => {
                        const isSelected = selectedType === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedType(item.id)}
                                className={`flex-row items-center p-4 rounded-xl border-2 ${isSelected ? 'border-safakPrimary bg-[#10b98115]' : 'border-safakSecondary bg-transparent'
                                    }`}
                            >
                                <View className="mr-4">
                                    <Briefcase size={24} color={isSelected ? "#10b981" : "#94a3b8"} />
                                </View>
                                <Text className={`text-lg font-medium flex-1 ${isSelected ? 'text-safakPrimary' : 'text-gray-400'}`}>
                                    {item.label}
                                </Text>
                                {isSelected && <CheckCircle size={24} color="#10b981" />}
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text className="text-gray-300 font-semibold mb-3 text-lg">Başlangıç (Sülüs) Tarihi</Text>
                <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                    <CalendarDays size={24} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                        value={startDate}
                        onChangeText={setStartDate}
                        placeholder="YYYY-AA-GG (Örn: 2024-05-15)"
                        placeholderTextColor="#64748b"
                        keyboardType="numbers-and-punctuation"
                    />
                </View>
                <Text className="text-gray-500 text-sm mt-2 ml-1">Tarihi YYYY-AA-GG formatında girin. (Örn: 2024-05-15)</Text>

            </ScrollView>

            <View className="py-6">
                <TouchableOpacity
                    className="bg-safakPrimary w-full py-4 rounded-xl shadow-lg flex-row justify-center items-center"
                    onPress={handleSave}
                >
                    <Text className="text-safakDark font-bold text-xl mr-2">Şafak Saymaya Başla</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
