import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker'; // Takvim paketi eklendi
import { RootStackParamList } from '../navigation/types';
import { saveUserSetup, getUserSetup, SetupInfo } from '../utils/storage';
import { useStore } from '../store/useStore'; // Zustand Store eklendi
import { CalendarDays, Briefcase, CheckCircle, User, MapPin, Map, CarFront, ShieldAlert, Palmtree } from 'lucide-react-native';

type SetupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

const MILITARY_TYPES = [
    { id: 'short', label: 'Kısa Dönem (6 Ay)', days: 180 },
    { id: 'long', label: 'Uzun Dönem (12 Ay)', days: 365 },
    { id: 'paid', label: 'Bedelli Askerlik', days: 28 },
    { id: 'officer', label: 'Yedek Subay/Astay', days: 365 },
] as const;

export default function SetupScreen() {
    const navigation = useNavigation<SetupNavigationProp>();

    // Zustand'dan setSetup fonksiyonunu alıyoruz
    const setSetup = useStore((state) => state.setSetup);

    // Form State'leri
    const [userName, setUserName] = useState('');
    const [hometown, setHometown] = useState('');
    const [militaryCity, setMilitaryCity] = useState('');
    const [selectedType, setSelectedType] = useState<typeof MILITARY_TYPES[number]['id']>('short');

    // Takvim (Date Picker) State'leri
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const [usedLeave, setUsedLeave] = useState('');
    const [penalty, setPenalty] = useState('');
    const [roadLeave, setRoadLeave] = useState('');

    // Sayfa açıldığında mevcut verileri yükle
    useEffect(() => {
        const loadInitialData = async () => {
            const existingData = await getUserSetup();
            if (existingData) {
                setUserName(existingData.userName || '');
                setHometown(existingData.hometown || '');
                setMilitaryCity(existingData.militaryCity || '');
                setSelectedType(existingData.militaryType);

                // Tarih verilerini hem string hem de Date objesi olarak ayarla
                setStartDate(existingData.startDate);
                setDate(new Date(existingData.startDate));

                setUsedLeave(existingData.usedLeave?.toString() || '');
                setPenalty(existingData.penalty?.toString() || '');
                setRoadLeave(existingData.roadLeave?.toString() || '');
            }
        };
        loadInitialData();
    }, []);

    // Takvimden tarih seçildiğinde çalışacak fonksiyon
    const handleDateChange = (event: any, selectedDate?: Date) => {
        // Android'de seçim yapıldıktan sonra takvimi kapatmak için
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            setDate(selectedDate);
            // Seçilen tarihi YYYY-MM-DD formatına çevir
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setStartDate(formattedDate);
        }
    };

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
            userName: userName.trim() || 'Asker',
            hometown: hometown.trim() || 'Belirtilmedi',
            militaryCity: militaryCity.trim() || 'Belirtilmedi',
            usedLeave: parseInt(usedLeave) || 0,
            penalty: parseInt(penalty) || 0,
            roadLeave: parseInt(roadLeave) || 0,
        };

        // 1. Cihaz hafızasına kaydet (AsyncStorage)
        await saveUserSetup(payload);

        // 2. Zustand Store'a kaydet (Uygulama anında güncellensin)
        setSetup(payload);

        // 3. Ana sayfaya yönlendir
        navigation.replace('MainTabs');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-safakDark"
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
                <Text className="text-white text-3xl font-bold mt-12 mb-2">Askerlik Bilgilerin</Text>
                <Text className="text-gray-400 text-base mb-8">
                    Uygulamayı kişiselleştirmek ve doğru hesaplama yapmak için bilgileri doldurun.
                </Text>

                {/* Kişisel Bilgiler */}
                <Text className="text-gray-300 font-semibold mb-3 text-lg">Kişisel Bilgiler</Text>
                <View className="gap-y-4 mb-8">
                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <User size={24} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={userName}
                            onChangeText={setUserName}
                            placeholder="Adınız Soyadınız"
                            placeholderTextColor="#64748b"
                        />
                    </View>
                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <MapPin size={24} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={hometown}
                            onChangeText={setHometown}
                            placeholder="Memleketiniz"
                            placeholderTextColor="#64748b"
                        />
                    </View>
                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <Map size={24} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={militaryCity}
                            onChangeText={setMilitaryCity}
                            placeholder="Askerlik Yapacağınız Şehir"
                            placeholderTextColor="#64748b"
                        />
                    </View>
                </View>

                {/* Askerlik Türü */}
                <Text className="text-gray-300 font-semibold mb-3 text-lg">Askerlik Türü</Text>
                <View className="gap-y-3 mb-8">
                    {MILITARY_TYPES.map((item) => {
                        const isSelected = selectedType === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedType(item.id)}
                                className={`flex-row items-center p-4 rounded-xl border-2 ${isSelected ? 'border-safakPrimary bg-[#10b98115]' : 'border-safakSecondary bg-transparent'}`}
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

                {/* Tarih ve İzinler */}
                <Text className="text-gray-300 font-semibold mb-3 text-lg">Tarih ve İzinler</Text>
                <View className="gap-y-4 mb-8">

                    {/* YENİ: Takvim Seçici (Date Picker) Alanı */}
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700"
                    >
                        <CalendarDays size={24} color="#94a3b8" />
                        <Text className={`flex-1 ml-3 text-lg font-medium ${startDate ? 'text-white' : 'text-[#64748b]'}`}>
                            {startDate ? startDate : "Sülüs Tarihi Seçin"}
                        </Text>
                    </TouchableOpacity>

                    {/* Takvim Bileşeni - Sadece showDatePicker true olduğunda görünür */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date(2030, 0, 1)}
                            minimumDate={new Date(2020, 0, 1)}
                        />
                    )}

                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <CarFront size={24} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={roadLeave}
                            onChangeText={setRoadLeave}
                            placeholder="Yol İzni (Gün)"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                        />
                    </View>

                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <Palmtree size={24} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={usedLeave}
                            onChangeText={setUsedLeave}
                            placeholder="Kullanılan İzin (Gün)"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                        />
                    </View>

                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <ShieldAlert size={24} color="#ef4444" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={penalty}
                            onChangeText={setPenalty}
                            placeholder="Alınan Ceza (Gün)"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View className="py-6 mb-10">
                    <TouchableOpacity
                        className="bg-safakPrimary w-full py-4 rounded-xl shadow-lg flex-row justify-center items-center"
                        onPress={handleSave}
                    >
                        <Text className="text-safakDark font-bold text-xl mr-2">Bilgileri Güncelle</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}