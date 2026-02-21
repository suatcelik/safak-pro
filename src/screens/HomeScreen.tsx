import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import {
    ShieldAlert, Sun, CalendarDays, MapPin, Map,
    Footprints, ShieldCheck, Star, CheckCircle,
    TrendingDown, Layers, Clock, Target, Sunrise
} from 'lucide-react-native';
import { getUserSetup, SetupInfo } from '../utils/storage';
import { differenceInDays, addDays, parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function HomeScreen() {
    const [setup, setSetup] = useState<SetupInfo | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({ passed: 0, remaining: 0, percentage: 0, targetDate: '', totalDays: 0 });

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

            const roadLeave = data.roadLeave || 0;
            const usedLeave = data.usedLeave || 0;
            const penalty = data.penalty || 0;

            // 1. Gerçekte geçen takvim günü
            const realPassed = differenceInDays(today, start);

            // 2. Yol İzni: Askerlikten sayıldığı için "Geçen Gün"e eklenir, şafaktan düşer.
            let passed = realPassed + roadLeave;
            if (passed < 0) passed = 0;

            // 3. Kullanılan İzin ve Ceza: Askerliği uzatır, şafağa (toplam güne) eklenir.
            const effectiveTotalDays = data.totalDays + usedLeave + penalty;

            if (passed > effectiveTotalDays) passed = effectiveTotalDays;

            // 4. Kalan şafak ve yüzdelik hesaplaması
            const remaining = effectiveTotalDays - passed;
            const percentage = (passed / effectiveTotalDays) * 100;

            // 5. Bitiş Tarihi: Başlangıç + (Toplam Gün + Ceza + İzin) - Yol İzni
            const end = addDays(start, effectiveTotalDays - roadLeave);

            setStats({
                passed,
                remaining,
                percentage: Math.min(percentage, 100),
                targetDate: format(end, 'dd MMMM yyyy', { locale: tr }),
                totalDays: effectiveTotalDays
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

    // GÖREV ALGORİTMASI: Kutuların kendi aralarındaki ilişki ve sıralı tamamlanma mantığı
    const rawMilestones = [
        { id: 1, title: 'Acemilik Başladı', targetPassed: 1, icon: Footprints },
        { id: 2, title: 'Acemilik Bitiyor', targetPassed: 28, icon: ShieldCheck },
        { id: 3, title: '2. Ay Hoş Geldin', targetPassed: 30, icon: Star },
        { id: 4, title: '2. Ay Bitiyor', targetPassed: 60, icon: CheckCircle },
        { id: 5, title: 'Yüzler Bitiyor', targetPassed: stats.totalDays - 100, icon: TrendingDown },
        { id: 6, title: 'Çift Rakamlar', targetPassed: stats.totalDays - 99, icon: Layers },
        { id: 7, title: 'Plakalar', targetPassed: stats.totalDays - 81, icon: Map },
        { id: 8, title: 'Son 2 Ay', targetPassed: stats.totalDays - 60, icon: CalendarDays },
        { id: 9, title: 'Son 1 Ay', targetPassed: stats.totalDays - 30, icon: Clock },
        { id: 10, title: 'Tek Rakamlar', targetPassed: stats.totalDays - 9, icon: Target },
        { id: 11, title: 'Doğan Güneş', targetPassed: stats.totalDays, icon: Sunrise },
    ];

    // Görevlerin birbirine bağlı olarak ne zaman başlayıp bittiğini hesaplar
    let prevTarget = 0;
    const milestones = rawMilestones.map((m) => {
        let currentTarget = Math.max(prevTarget, m.targetPassed);
        currentTarget = Math.min(stats.totalDays, currentTarget);

        const mInfo = {
            ...m,
            startAt: prevTarget,
            endAt: currentTarget,
            kalanSafak: Math.max(0, stats.totalDays - currentTarget) // "Kalan Şafak" baremi hesaplaması
        };
        prevTarget = currentTarget;
        return mInfo;
    });

    return (
        <ScrollView
            className="flex-1 bg-safakDark"
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
        >
            <View className="mt-8 flex-row justify-between items-center mb-6">
                <View>
                    <Text className="text-gray-400 text-lg uppercase tracking-wider font-semibold">
                        Merhaba, {setup.userName}
                    </Text>
                    <Text className="text-white text-4xl font-bold mt-1">Şafak SAYAR</Text>
                </View>
                <View className="bg-[#10b98115] p-3 rounded-full">
                    <ShieldAlert size={32} color="#10b981" />
                </View>
            </View>

            {/* Lokasyon Bilgileri */}
            <View className="flex-row mb-8 bg-safakSecondary p-4 rounded-2xl border border-gray-700">
                <View className="flex-1 flex-row items-center border-r border-gray-700 pr-2">
                    <MapPin size={20} color="#f43f5e" className="mr-2" />
                    <View>
                        <Text className="text-gray-400 text-xs">Memleket</Text>
                        <Text className="text-white font-medium" numberOfLines={1}>{setup.hometown}</Text>
                    </View>
                </View>
                <View className="flex-1 flex-row items-center pl-4">
                    <Map size={20} color="#3b82f6" className="mr-2" />
                    <View>
                        <Text className="text-gray-400 text-xs">Birlik</Text>
                        <Text className="text-white font-medium" numberOfLines={1}>{setup.militaryCity}</Text>
                    </View>
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

            {/* Görev Dönüm Noktaları - Yatay Liste */}
            <View className="mb-8">
                <Text className="text-white font-semibold text-lg mb-4">Şafak Görevleri</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="-mx-6 px-6"
                    contentContainerStyle={{ paddingRight: 48 }}
                >
                    {milestones.map((m) => {
                        let mPercentage = 0;
                        let isCompleted = false;
                        let isActive = false;
                        let daysLeftForMission = 0;

                        if (m.endAt === m.startAt) {
                            if (stats.passed >= m.endAt) {
                                isCompleted = true;
                                mPercentage = 100;
                            }
                        } else {
                            if (stats.passed >= m.endAt) {
                                isCompleted = true;
                                mPercentage = 100;
                            } else if (stats.passed < m.startAt) {
                                mPercentage = 0;
                                daysLeftForMission = m.endAt - m.startAt; // Daha başlamadıysa toplam görevi göster
                            } else {
                                isActive = true;
                                mPercentage = ((stats.passed - m.startAt) / (m.endAt - m.startAt)) * 100;
                                daysLeftForMission = m.endAt - stats.passed; // Aktif görev için kalan gün
                            }
                        }

                        const remainingPercentage = Math.max(0, 100 - mPercentage);

                        return (
                            <View
                                key={m.id}
                                className={`w-36 p-4 rounded-2xl border mr-4 justify-between ${isCompleted ? 'bg-[#10b98115] border-[#10b98150]' : (isActive ? 'bg-safakSecondary border-safakPrimary shadow-sm shadow-safakPrimary/20' : 'bg-safakSecondary border-gray-700 opacity-80')
                                    }`}
                            >
                                <View className="items-center mb-2">
                                    <m.icon size={28} color={isCompleted ? '#10b981' : (isActive ? '#f43f5e' : '#6b7280')} />
                                </View>
                                <Text className="text-white font-bold text-center text-sm mb-1 h-10" numberOfLines={2}>
                                    {m.title}
                                </Text>

                                {/* "Hedef Şafak" yerine "Kalan Şafak" eklendi */}
                                <Text className="text-gray-400 text-[10px] text-center mb-2">
                                    Görev Şafağı: <Text className="text-white font-bold">{m.kalanSafak}</Text>
                                </Text>

                                <View className="mt-auto">
                                    {/* Aktif görevlerde X Gün Kaldı metni */}
                                    <Text className={`text-[11px] text-center mb-2 font-medium ${isCompleted ? 'text-[#10b981]' : (isActive ? 'text-safakPrimary' : 'text-gray-400')}`}>
                                        {isCompleted ? 'Görev Tamamlandı' : (isActive ? `${daysLeftForMission} Gün Kaldı` : 'Bekleniyor')}
                                    </Text>

                                    <View className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <View
                                            className={`h-full rounded-full ${isCompleted ? 'bg-[#10b981]' : 'bg-safakPrimary'}`}
                                            style={{ width: `${mPercentage}%` }}
                                        />
                                    </View>

                                    {!isCompleted && isActive && (
                                        <Text className="text-[10px] text-right mt-1 font-bold text-safakPrimary">
                                            %{remainingPercentage.toFixed(0)} Kaldı
                                        </Text>
                                    )}
                                    {!isCompleted && !isActive && (
                                        <Text className="text-[10px] text-right mt-1 font-bold text-gray-500">
                                            %100 Kaldı
                                        </Text>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Ekstra Bilgiler (İzin & Ceza) */}
            <View className="bg-safakSecondary p-5 rounded-2xl border border-gray-700 flex-row justify-between">
                <View className="items-center flex-1 border-r border-gray-700">
                    <Text className="text-gray-400 text-xs mb-1">Yol İzni</Text>
                    <Text className="text-white font-bold">{setup.roadLeave || 0} Gün</Text>
                </View>
                <View className="items-center flex-1 border-r border-gray-700">
                    <Text className="text-gray-400 text-xs mb-1">Kullanılan İzin</Text>
                    <Text className="text-white font-bold">{setup.usedLeave || 0} Gün</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-gray-400 text-xs mb-1">Ceza</Text>
                    <Text className="text-red-400 font-bold">{setup.penalty || 0} Gün</Text>
                </View>
            </View>

        </ScrollView>
    );
}