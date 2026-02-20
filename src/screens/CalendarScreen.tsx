import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { getUserSetup, SetupInfo, getPaintedDays, togglePaintedDay } from '../utils/storage';
import { Paintbrush } from 'lucide-react-native';

export default function CalendarScreen() {
    const [setup, setSetup] = useState<SetupInfo | null>(null);
    const [paintedDays, setPaintedDays] = useState<number[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [daysArray, setDaysArray] = useState<number[]>([]);

    const loadData = async () => {
        const data = await getUserSetup();
        const painted = await getPaintedDays();

        if (data) {
            setSetup(data);
            // Toplam askerlik süresi kadar bir dizi oluştur (1'den totalDays'e kadar)
            // Eğer yol izni veya ceza ile bu gün sayısı değişiyorsa buraya formülü ekleyebilirsiniz
            const total = data.totalDays;
            const days = Array.from({ length: total }, (_, i) => i + 1);
            setDaysArray(days);
        }
        setPaintedDays(painted);
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handlePaintDay = async (day: number) => {
        const updated = await togglePaintedDay(day);
        setPaintedDays(updated);
    };

    if (!setup) {
        return (
            <View className="flex-1 bg-safakDark justify-center items-center">
                <Text className="text-white text-lg">Yükleniyor...</Text>
            </View>
        );
    }

    // Her bir gün kutucuğunun tasarımı
    const renderDayCell = ({ item }: { item: number }) => {
        const isPainted = paintedDays.includes(item);

        return (
            <TouchableOpacity
                onPress={() => handlePaintDay(item)}
                className={`m-1 w-12 h-12 rounded-lg items-center justify-center border-2 
                    ${isPainted ? 'bg-emerald-500 border-emerald-400' : 'bg-safakSecondary border-gray-700'}`}
                activeOpacity={0.7}
            >
                <Text className={`font-bold text-lg ${isPainted ? 'text-white' : 'text-gray-400'}`}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-safakDark">
            {/* Üst Bilgi Başlığı */}
            <View className="px-6 pt-16 pb-4 bg-safakSecondary border-b border-gray-800 flex-row justify-between items-center">
                <View>
                    <Text className="text-white text-2xl font-bold">Şafak Takvimi</Text>
                    <Text className="text-gray-400 mt-1">Günü bitir, kutuyu boya!</Text>
                </View>
                <View className="bg-[#10b98120] p-3 rounded-full">
                    <Paintbrush size={24} color="#10b981" />
                </View>
            </View>

            {/* İstatistik Çubuğu */}
            <View className="flex-row justify-between px-6 py-4 bg-safakDark">
                <View className="items-center">
                    <Text className="text-gray-400 text-sm">Boyanan</Text>
                    <Text className="text-emerald-400 font-bold text-lg">{paintedDays.length} Gün</Text>
                </View>
                <View className="items-center">
                    <Text className="text-gray-400 text-sm">Boyanacak</Text>
                    <Text className="text-white font-bold text-lg">{daysArray.length - paintedDays.length} Gün</Text>
                </View>
            </View>

            {/* Takvim Izgarası */}
            <FlatList
                data={daysArray}
                keyExtractor={(item) => item.toString()}
                renderItem={renderDayCell}
                numColumns={6} // Yan yana 6 kutu sığacak şekilde
                columnWrapperStyle={{ justifyContent: 'center' }}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
            />
        </View>
    );
}