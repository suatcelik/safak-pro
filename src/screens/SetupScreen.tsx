import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigation/types';
import { saveUserSetup, getUserSetup, SetupInfo, clearPaintedDays } from '../utils/storage';
import { useStore } from '../store/useStore';
import { CalendarDays, Briefcase, CheckCircle, User, MapPin, Map, CarFront, ShieldAlert, Palmtree, Search, X, Shield } from 'lucide-react-native';
import { CITIES } from '../utils/cityData';
import { setupAllNotifications } from '../utils/notifications';

type SetupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

const MILITARY_TYPES = [
    { id: 'short', label: 'Kısa Dönem (6 Ay)', days: 180 },
    { id: 'long', label: 'Uzun Dönem (12 Ay)', days: 365 },
    { id: 'paid', label: 'Bedelli Askerlik', days: 28 },
    { id: 'officer', label: 'Yedek Subay (12 Ay)', days: 365 },
] as const;

// Validasyon sabitleri
const MAX_NAME_LENGTH = 50
const MAX_LEAVE_DAYS = 60
const MAX_PENALTY_DAYS = 365
const MAX_ROAD_LEAVE_DAYS = 10

const CITIES_ARRAY = Object.values(CITIES)
    .map(city => city.name)
    .sort((a, b) => a.localeCompare(b, 'tr'));

export default function SetupScreen() {
    const navigation = useNavigation<SetupNavigationProp>();
    const setSetup = useStore((state) => state.setSetup);

    const [userName, setUserName] = useState('');
    const [hometown, setHometown] = useState('');
    const [militaryCity, setMilitaryCity] = useState('');
    const [selectedType, setSelectedType] = useState<typeof MILITARY_TYPES[number]['id']>('short');

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const [usedLeave, setUsedLeave] = useState('');
    const [penalty, setPenalty] = useState('');
    const [roadLeave, setRoadLeave] = useState('');

    const [isCityModalVisible, setCityModalVisible] = useState(false);
    const [activeCityField, setActiveCityField] = useState<'hometown' | 'militaryCity' | null>(null);
    const [citySearchText, setCitySearchText] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            const existingData = await getUserSetup();
            if (existingData) {
                setUserName(existingData.userName || '');
                setHometown(existingData.hometown || '');
                setMilitaryCity(existingData.militaryCity || '');
                setStartDate(existingData.startDate);
                setDate(new Date(existingData.startDate));
                setUsedLeave(existingData.usedLeave?.toString() || '');
                setPenalty(existingData.penalty?.toString() || '');
                setRoadLeave(existingData.roadLeave?.toString() || '');
                // Mevcut tip varsa set et (officer dahil)
                const validType = MILITARY_TYPES.find(t => t.id === existingData.militaryType);
                if (validType) setSelectedType(validType.id);
            }
        };
        loadInitialData();
    }, []);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setStartDate(formattedDate);
        }
    };

    const openCityModal = (field: 'hometown' | 'militaryCity') => {
        setActiveCityField(field);
        setCitySearchText('');
        setCityModalVisible(true);
    };

    const handleCitySelect = (cityName: string) => {
        if (activeCityField === 'hometown') {
            setHometown(cityName);
        } else if (activeCityField === 'militaryCity') {
            setMilitaryCity(cityName);
        }
        setCityModalVisible(false);
    };

    const filteredCities = CITIES_ARRAY.filter(city =>
        city.toLocaleLowerCase('tr').includes(citySearchText.toLocaleLowerCase('tr'))
    );

    // E-3: Sayısal alan validasyonu
    const parseAndClampNumber = (value: string, max: number): number => {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed < 0) return 0;
        return Math.min(parsed, max);
    };

    const handleSave = async () => {
        const typeObj = MILITARY_TYPES.find(t => t.id === selectedType);
        if (!typeObj) return;

        const trimmedName = userName.trim();
        if (!trimmedName || trimmedName.length < 2) {
            Alert.alert("Eksik Bilgi", "Ad Soyad en az 2 karakter olmalıdır.");
            return;
        }

        if (!hometown) {
            Alert.alert("Eksik Bilgi", "Lütfen memleketinizi seçiniz.");
            return;
        }

        if (!militaryCity) {
            Alert.alert("Eksik Bilgi", "Lütfen askerlik yapacağınız şehri seçiniz.");
            return;
        }

        if (!startDate) {
            Alert.alert("Eksik Bilgi", "Lütfen sülüs tarihini (başlangıç) seçiniz.");
            return;
        }

        // Sayısal alanları doğrula ve sınırla
        const parsedRoadLeave = parseAndClampNumber(roadLeave, MAX_ROAD_LEAVE_DAYS);
        const parsedUsedLeave = parseAndClampNumber(usedLeave, MAX_LEAVE_DAYS);
        const parsedPenalty = parseAndClampNumber(penalty, MAX_PENALTY_DAYS);

        if (parseInt(roadLeave || '0', 10) > MAX_ROAD_LEAVE_DAYS) {
            Alert.alert("Geçersiz Değer", `Yol izni en fazla ${MAX_ROAD_LEAVE_DAYS} gün olabilir.`);
            return;
        }
        if (parseInt(usedLeave || '0', 10) > MAX_LEAVE_DAYS) {
            Alert.alert("Geçersiz Değer", `Kullanılan izin en fazla ${MAX_LEAVE_DAYS} gün olabilir.`);
            return;
        }
        if (parseInt(penalty || '0', 10) > MAX_PENALTY_DAYS) {
            Alert.alert("Geçersiz Değer", `Ceza en fazla ${MAX_PENALTY_DAYS} gün olabilir.`);
            return;
        }

        const existingData = await getUserSetup();
        if (existingData && existingData.militaryType !== selectedType) {
            await clearPaintedDays();
        }

        const payload: SetupInfo = {
            militaryType: selectedType,
            startDate: startDate,
            totalDays: typeObj.days,
            userName: trimmedName,
            hometown: hometown,
            militaryCity: militaryCity,
            usedLeave: parsedUsedLeave,
            penalty: parsedPenalty,
            roadLeave: parsedRoadLeave,
        };

        await saveUserSetup(payload);
        setSetup(payload);
        await setupAllNotifications(payload);

        navigation.replace('MainTabs');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-safakDark">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
                <Text className="text-white text-3xl font-bold mt-12 mb-2">Askerlik Bilgilerin</Text>
                <Text className="text-gray-400 text-base mb-8">
                    Uygulamayı kişiselleştirmek ve doğru hesaplama yapmak için bilgileri doldurun.
                </Text>

                <Text className="text-gray-300 font-semibold mb-3 text-lg">Kişisel Bilgiler</Text>
                <View className="gap-y-4 mb-8">
                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <User size={24} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={userName}
                            onChangeText={(t) => setUserName(t.slice(0, MAX_NAME_LENGTH))}
                            placeholder="Adınız Soyadınız"
                            placeholderTextColor="#64748b"
                            accessibilityLabel="Ad Soyad giriş alanı"
                            accessibilityHint="Adınızı ve soyadınızı girin"
                            maxLength={MAX_NAME_LENGTH}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => openCityModal('hometown')}
                        className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700"
                        accessibilityLabel="Memleket seç"
                        accessibilityHint="Memleket şehrinizi seçmek için dokunun"
                        accessibilityRole="button"
                    >
                        <MapPin size={24} color="#f43f5e" />
                        <Text className={`flex-1 ml-3 text-lg font-medium ${hometown ? 'text-white' : 'text-[#64748b]'}`}>
                            {hometown ? hometown : "Memleket Seçiniz"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => openCityModal('militaryCity')}
                        className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700"
                        accessibilityLabel="Askerlik şehri seç"
                        accessibilityHint="Askerlik yapacağınız şehri seçmek için dokunun"
                        accessibilityRole="button"
                    >
                        <Map size={24} color="#3b82f6" />
                        <Text className={`flex-1 ml-3 text-lg font-medium ${militaryCity ? 'text-white' : 'text-[#64748b]'}`}>
                            {militaryCity ? militaryCity : "Askerlik Yapılacak Şehir Seçiniz"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-300 font-semibold mb-3 text-lg">Askerlik Türü</Text>
                <View className="gap-y-3 mb-8">
                    {MILITARY_TYPES.map((item) => {
                        const isSelected = selectedType === item.id;
                        const IconComponent = item.id === 'officer' ? Shield : Briefcase;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedType(item.id)}
                                className={`flex-row items-center p-4 rounded-xl border-2 ${isSelected ? 'border-safakPrimary bg-[#10b98115]' : 'border-safakSecondary bg-transparent'}`}
                                accessibilityLabel={`Askerlik türü: ${item.label}`}
                                accessibilityState={{ selected: isSelected }}
                                accessibilityRole="radio"
                            >
                                <View className="mr-4">
                                    <IconComponent size={24} color={isSelected ? "#10b981" : "#94a3b8"} />
                                </View>
                                <Text className={`text-lg font-medium flex-1 ${isSelected ? 'text-safakPrimary' : 'text-gray-400'}`}>
                                    {item.label}
                                </Text>
                                {isSelected && <CheckCircle size={24} color="#10b981" />}
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text className="text-gray-300 font-semibold mb-3 text-lg">Tarih ve İzinler</Text>
                <View className="gap-y-4 mb-8">
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700"
                        accessibilityLabel="Sülüs tarihi seç"
                        accessibilityHint="Askerlik başlangıç tarihinizi seçmek için dokunun"
                        accessibilityRole="button"
                    >
                        <CalendarDays size={24} color="#94a3b8" />
                        <Text className={`flex-1 ml-3 text-lg font-medium ${startDate ? 'text-white' : 'text-[#64748b]'}`}>
                            {startDate ? startDate : "Sülüs Tarihi Seçin"}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date(2030, 0, 1)}
                            minimumDate={new Date(2020, 0, 1)}
                            locale="tr-TR"
                        />
                    )}

                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <CarFront size={24} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={roadLeave}
                            onChangeText={setRoadLeave}
                            placeholder={`Yol İzni (Gün, maks. ${MAX_ROAD_LEAVE_DAYS})`}
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            accessibilityLabel="Yol izni giriş alanı"
                            accessibilityHint={`Yol izni gün sayısını girin, maksimum ${MAX_ROAD_LEAVE_DAYS}`}
                        />
                    </View>

                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <Palmtree size={24} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={usedLeave}
                            onChangeText={setUsedLeave}
                            placeholder={`Kullanılan İzin (Gün, maks. ${MAX_LEAVE_DAYS})`}
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            accessibilityLabel="Kullanılan izin giriş alanı"
                            accessibilityHint={`Kullandığınız izin gün sayısını girin, maksimum ${MAX_LEAVE_DAYS}`}
                        />
                    </View>

                    <View className="flex-row items-center bg-safakSecondary rounded-xl p-4 border border-gray-700">
                        <ShieldAlert size={24} color="#ef4444" />
                        <TextInput
                            className="flex-1 ml-3 text-white text-lg font-medium outline-none"
                            value={penalty}
                            onChangeText={setPenalty}
                            placeholder={`Alınan Ceza (Gün, maks. ${MAX_PENALTY_DAYS})`}
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            accessibilityLabel="Ceza giriş alanı"
                            accessibilityHint={`Ceza gün sayısını girin, maksimum ${MAX_PENALTY_DAYS}`}
                        />
                    </View>
                </View>

                <View className="py-6 mb-10">
                    <TouchableOpacity
                        className="bg-safakPrimary w-full py-4 rounded-xl shadow-lg flex-row justify-center items-center"
                        onPress={handleSave}
                        accessibilityLabel="Bilgileri kaydet"
                        accessibilityHint="Girdiğiniz askerlik bilgilerini kaydeder"
                        accessibilityRole="button"
                    >
                        <Text className="text-safakDark font-bold text-xl mr-2">Bilgileri Kaydet</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                visible={isCityModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCityModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-safakDark h-5/6 rounded-t-3xl border-t border-gray-700">
                        <View className="flex-row justify-between items-center p-6 border-b border-gray-800">
                            <Text className="text-white text-xl font-bold">
                                {activeCityField === 'hometown' ? 'Memleket Seç' : 'Birlik Şehri Seç'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setCityModalVisible(false)}
                                className="bg-safakSecondary p-2 rounded-full"
                                accessibilityLabel="Kapat"
                                accessibilityRole="button"
                            >
                                <X size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        <View className="p-4">
                            <View className="flex-row items-center bg-safakSecondary rounded-xl p-3 border border-gray-700">
                                <Search size={20} color="#94a3b8" />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-base outline-none"
                                    placeholder="Şehir Ara..."
                                    placeholderTextColor="#64748b"
                                    value={citySearchText}
                                    onChangeText={setCitySearchText}
                                    autoCorrect={false}
                                    accessibilityLabel="Şehir arama alanı"
                                />
                            </View>
                        </View>

                        <FlatList
                            data={filteredCities}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 40 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="px-6 py-4 border-b border-gray-800 flex-row justify-between items-center"
                                    onPress={() => handleCitySelect(item)}
                                    accessibilityLabel={item}
                                    accessibilityRole="button"
                                >
                                    <Text className="text-gray-300 text-lg">{item}</Text>
                                    {((activeCityField === 'hometown' && hometown === item) ||
                                        (activeCityField === 'militaryCity' && militaryCity === item)) && (
                                            <CheckCircle size={20} color="#10b981" />
                                        )}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View className="p-6 items-center">
                                    <Text className="text-gray-500">Şehir bulunamadı.</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}
