import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { ShieldAlert, Sun, Moon, CalendarDays } from 'lucide-react-native';
import { getUserSetup, SetupInfo } from '../utils/storage';
import { differenceInDays, addDays, parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function HomeScreen() {
    const [setup, setSetup] = useState<SetupInfo | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({ passed: 0, remaining: 0, percentage: 0, targetDate: '' });

    const loadData = async () => {
        const data = await getUserSetup();
        if (data && data.startDate) {
            setSetup(data);
            calculateStats(data);
        }
    };

    const calculateStats = (data: SetupInfo) => {
        try {
            const start = parseISO(data.startDate);
            const today = new Date();
            const end = addDays(start, data.totalDays);

            let passed = differenceInDays(today, start);
            if (passed < 0) passed = 0; // Henüz başlamamış
            if (passed > data.totalDays) passed = data.totalDays; // Bitmiş

            const remaining = data.totalDays - passed;
            const percentage = (passed / data.totalDays) * 100;

            setStats({
                passed,
                remaining,
                percentage: Math.min(percentage, 100),
                targetDate: format(end, 'dd MMMM yyyy', { locale: tr })
            });
        } catch (e) {
            console.error("Home Stats error", e);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (!setup) {
        return (
            <View className="flex-1 bg-safakDark justify-center items-center">
                <Text className="text-white text-lg">Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-safakDark"
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
        >
            <View className="mt-8 flex-row justify-between items-center mb-10">
                <View>
                    <Text className="text-gray-400 text-lg uppercase tracking-wider font-semibold">Şafak</Text>
                    <Text className="text-white text-4xl font-bold mt-1">SAYAR</Text>
                </View>
                <View className="bg-[#10b98115] p-3 rounded-full">
                    <ShieldAlert size={32} color="#10b981" />
                </View>
            </View>

            {/* Ana Çember Gösterge */}
            <View className="items-center justify-center py-10 bg-safakSecondary rounded-3xl shadow-xl mb-8 border border-gray-700">
                <Text className="text-gray-400 text-lg mb-2 font-medium">Kalan Gün</Text>
                <Text className="text-safakPrimary text-8xl font-black mb-1">{stats.remaining}</Text>
                {stats.remaining === 0 ? (
                    <Text className="text-emerald-400 text-xl font-bold mt-2">Hürgeneral! 🎖️</Text>
                ) : (
                    <Text className="text-gray-300 text-base mt-2">vatan borcu biter...</Text>
                )}
            </View>

            {/* İstatistik Kartları */}
            <View className="flex-row justify-between mb-8 gap-x-4">
                <View className="flex-1 bg-safakSecondary p-5 rounded-2xl border border-gray-700 items-center">
                    <Sun size={28} color="#f59e0b" className="mb-3" />
                    <Text className="text-gray-400 text-sm mb-1">Geçen</Text>
                    <Text className="text-white text-2xl font-bold">{stats.passed} Gün</Text>
                </View>
                <View className="flex-1 bg-safakSecondary p-5 rounded-2xl border border-gray-700 items-center">
                    <CalendarDays size={28} color="#3b82f6" className="mb-3" />
                    <Text className="text-gray-400 text-sm mb-1">Bitiş</Text>
                    <Text className="text-white text-base font-bold text-center">{stats.targetDate}</Text>
                </View>
            </View>

            {/* İlerleme Çubuğu */}
            <View className="bg-safakSecondary p-6 rounded-2xl border border-gray-700">
                <View className="flex-row justify-between mb-3">
                    <Text className="text-white font-semibold">Tüm İlerleme</Text>
                    <Text className="text-safakPrimary font-bold">{stats.percentage.toFixed(1)}%</Text>
                </View>
                <View className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-safakPrimary rounded-full"
                        style={{ width: `${stats.percentage}%` }}
                    />
                </View>
            </View>

        </ScrollView>
    );
}
