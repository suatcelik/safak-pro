import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import {
    ShieldAlert, Sun, CalendarDays, MapPin, Map,
    Footprints, ShieldCheck, Star, CheckCircle,
    TrendingDown, Layers, Clock, Target, Sunrise, Lock,
    Quote
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { getUserSetup, SetupInfo } from '../utils/storage';
import { useStore } from '../store/useStore';
import { differenceInDays, addDays, parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getRandomQuote } from '../utils/quotes';
import { CITY_PLATES } from '../utils/cityPlates';

// ✅ EKLENDİ: Banner component
import AdBanner from '../components/AdBanner';

// --- Sadece bu bileşen saniyede bir render edilecek ---
const DailyProgressCircle = ({ remaining }: { remaining: number }) => {
    const [dayProgress, setDayProgress] = useState(0);

    const cityName = useMemo(() => {
        if (remaining <= 81 && remaining > 0) {
            return CITY_PLATES[remaining] || null;
        }
        return null;
    }, [remaining]);

    useEffect(() => {
        const updateDayProgress = () => {
            const now = new Date();
            const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            const totalSecondsInDay = 24 * 3600;
            setDayProgress((secondsSinceMidnight / totalSecondsInDay) * 100);
        };

        updateDayProgress();
        const timer = setInterval(updateDayProgress, 1000);
        return () => clearInterval(timer);
    }, []);

    const radius = 110;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (dayProgress / 100) * circumference;

    return (
        <View className="items-center justify-center mb-10 mt-4">
            <View className="relative items-center justify-center w-[250px] h-[250px]">
                <Svg width="250" height="250" viewBox="0 0 250 250" className="absolute">
                    <Circle cx="125" cy="125" r={radius} stroke="#374151" strokeWidth={strokeWidth} fill="transparent" />
                    <Circle
                        cx="125" cy="125"
                        r={radius}
                        stroke="#10b981"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin="125, 125"
                    />
                </Svg>

                <View className="absolute items-center justify-center">
                    <Text className="text-gray-400 text-lg mb-1 font-medium">Kalan Gün</Text>
                    <Text className="text-safakPrimary text-7xl font-black">{remaining}</Text>

                    {cityName ? (
                        <View className="bg-emerald-500/20 px-4 py-1.5 rounded-full mt-2 border border-emerald-500/30">
                            <Text className="text-emerald-400 text-lg font-bold">📍 {cityName}</Text>
                        </View>
                    ) : remaining === 0 ? (
                        <Text className="text-emerald-400 text-xl font-bold mt-2">Hürgeneral! 🎖️</Text>
                    ) : (
                        <Text className="text-gray-300 text-sm mt-1 italic">vatan borcu biter...</Text>
                    )}
                </View>
            </View>

            <Text className="text-gray-500 text-xs mt-4 font-medium uppercase tracking-widest">
                Günlük İlerleme: %{dayProgress.toFixed(1)}
            </Text>
        </View>
    );
};

export default function HomeScreen() {
    const setup = useStore((state) => state.setup);
    const setSetup = useStore((state) => state.setSetup);

    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({ passed: 0, remaining: 0, percentage: 0, targetDate: '', totalDays: 0 });
    const [quote, setQuote] = useState('');

    useEffect(() => {
        setQuote(getRandomQuote());
    }, []);

    const loadData = async () => {
        try {
            setError(null);
            const data = await getUserSetup();
            if (data && data.startDate) {
                setSetup(data);
            } else {
                setError('Kullanıcı bilgileri bulunamadı.');
            }
        } catch (err) {
            console.error('Home Stats error', err);
            setError('Veriler yüklenirken bir sorun oluştu.');
        }
    };

    const calculateStats = (data: SetupInfo) => {
        try {
            const start = parseISO(data.startDate);
            const today = new Date();
            const roadLeave = data.roadLeave || 0;
            const usedLeave = data.usedLeave || 0;
            const penalty = data.penalty || 0;

            const realPassed = differenceInDays(today, start);
            let passed = realPassed + roadLeave;
            if (passed < 0) passed = 0;

            const effectiveTotalDays = data.totalDays + usedLeave + penalty;
            if (passed > effectiveTotalDays) passed = effectiveTotalDays;

            const remaining = effectiveTotalDays - passed;
            const percentage = (passed / effectiveTotalDays) * 100;
            const end = addDays(start, effectiveTotalDays - roadLeave);

            setStats({
                passed,
                remaining,
                percentage: Math.min(percentage, 100),
                targetDate: format(end, 'dd MMMM yyyy', { locale: tr }),
                totalDays: effectiveTotalDays,
            });
        } catch (e) {
            console.error('Calculation error', e);
            setError('Tarih hesaplamasında bir hata oluştu.');
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

    useEffect(() => {
        if (setup) calculateStats(setup);
    }, [setup]);

    const milestones = useMemo(() => {
        if (!stats.totalDays) return [];
        const rawMilestones = [
            { id: 1, title: 'Acemilik Başladı', targetPassed: 1, icon: Footprints },
            { id: 2, title: 'Acemilik Bitiyor', targetPassed: 28, icon: ShieldCheck },
            { id: 3, title: '2. Ay Hoş Geldin', targetPassed: 30, icon: Star },
            { id: 4, title: '2. Ay Bitiyor', targetPassed: 60, icon: CheckCircle },
            { id: 91, title: "200'ler Bitiyor", targetPassed: stats.totalDays - 200, icon: TrendingDown },
            { id: 92, title: 'Yolun Yarısı', targetPassed: Math.floor(stats.totalDays / 2), icon: CheckCircle },
            { id: 5, title: 'Yüzler Bitiyor', targetPassed: stats.totalDays - 100, icon: TrendingDown },
            { id: 6, title: 'Çift Rakamlar', targetPassed: stats.totalDays - 99, icon: Layers },
            { id: 7, title: 'Plakalar', targetPassed: stats.totalDays - 81, icon: Map },
            { id: 8, title: 'Son 2 Ay', targetPassed: stats.totalDays - 60, icon: CalendarDays },
            { id: 9, title: 'Son 1 Ay', targetPassed: stats.totalDays - 30, icon: Clock },
            { id: 10, title: 'Tek Rakamlar', targetPassed: stats.totalDays - 9, icon: Target },
            { id: 11, title: 'Doğan Güneş', targetPassed: stats.totalDays, icon: Sunrise },
        ];

        const validMilestones = rawMilestones.filter((m) => m.targetPassed > 0 && m.targetPassed <= stats.totalDays);
        const lockedMilestones = rawMilestones.filter((m) => m.targetPassed <= 0 || m.targetPassed > stats.totalDays);

        validMilestones.sort((a, b) => a.targetPassed - b.targetPassed);

        let prevTarget = 0;
        const processedValidMilestones = validMilestones.map((m) => {
            const mInfo = {
                ...m,
                isLocked: false,
                startAt: prevTarget,
                endAt: m.targetPassed,
                kalanSafak: Math.max(0, stats.totalDays - m.targetPassed),
            };
            prevTarget = m.targetPassed;
            return mInfo;
        });

        return [
            ...processedValidMilestones,
            ...lockedMilestones.map((m) => ({ ...m, isLocked: true, startAt: 0, endAt: 0, kalanSafak: 0 })),
        ];
    }, [stats.totalDays, stats.passed]);

    if (error) {
        return (
            <View className="flex-1 bg-safakDark justify-center items-center p-6">
                <ShieldAlert size={48} color="#f43f5e" className="mb-4" />
                <Text className="text-white text-lg text-center">{error}</Text>
            </View>
        );
    }

    if (!setup) return null;

    return (
        // ✅ DIŞ KAPLAMA: banner'ı sabitlemek için
        <View className="flex-1 bg-safakDark">
            <ScrollView
                className="flex-1 bg-safakDark"
                // ✅ banner için ekstra boşluk (UI üst kısım aynen kalır)
                contentContainerStyle={{ padding: 24, paddingBottom: 170 }}
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

                <View className="flex-row mb-8 bg-safakSecondary p-4 rounded-2xl border border-gray-700">
                    <View className="flex-1 flex-row items-center border-r border-gray-700 pr-2">
                        <MapPin size={20} color="#f43f5e" className="mr-2" />
                        <View>
                            <Text className="text-gray-400 text-xs">Memleket</Text>
                            <Text className="text-white font-medium" numberOfLines={1}>
                                {setup.hometown}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-1 flex-row items-center pl-4">
                        <Map size={20} color="#3b82f6" className="mr-2" />
                        <View>
                            <Text className="text-gray-400 text-xs">Birlik</Text>
                            <Text className="text-white font-medium" numberOfLines={1}>
                                {setup.militaryCity}
                            </Text>
                        </View>
                    </View>
                </View>

                <DailyProgressCircle remaining={stats.remaining} />

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

                <View className="bg-safakSecondary p-5 rounded-2xl border border-gray-700 flex-row justify-between mb-8">
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

                <View className="bg-safakSecondary/50 p-5 rounded-2xl border border-safakPrimary/20 mb-8 flex-row items-start">
                    <Quote size={20} color="#10b981" className="mr-3 mt-1" />
                    <View className="flex-1">
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Günün Sözü</Text>
                        <Text className="text-white italic text-base leading-6">"{quote}"</Text>
                    </View>
                </View>

                <View className="mb-8">
                    <Text className="text-white font-semibold text-lg mb-4">Şafak Görevleri</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="-mx-6 px-6"
                        contentContainerStyle={{ paddingRight: 48 }}
                    >
                        {milestones.map((m) => (
                            <View
                                key={m.id}
                                className={`w-36 p-4 rounded-2xl border mr-4 justify-between ${m.isLocked
                                    ? 'bg-safakSecondary border-gray-800 opacity-50'
                                    : stats.passed >= m.endAt
                                        ? 'bg-[#10b98115] border-[#10b98150]'
                                        : 'bg-safakSecondary border-gray-700'
                                    }`}
                            >
                                <View className="items-center mb-2">
                                    {m.isLocked ? (
                                        <Lock size={28} color="#4b5563" />
                                    ) : (
                                        <m.icon size={28} color={stats.passed >= m.endAt ? '#10b981' : '#6b7280'} />
                                    )}
                                </View>
                                <Text className="text-white font-bold text-center text-sm mb-1 h-10" numberOfLines={2}>
                                    {m.title}
                                </Text>
                                <Text className="text-gray-400 text-[10px] text-center mb-2">
                                    Görev Şafağı: <Text className="text-white font-bold">{m.isLocked ? '--' : m.kalanSafak}</Text>
                                </Text>
                                <View className="mt-auto">
                                    <View className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <View
                                            className="h-full bg-safakPrimary"
                                            style={{ width: `${m.isLocked ? 0 : Math.min(100, (stats.passed / m.endAt) * 100)}%` }}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* ✅ Sabit Banner (UI değişmeden, altta durur) */}
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                <AdBanner />
            </View>
        </View>
    );
}