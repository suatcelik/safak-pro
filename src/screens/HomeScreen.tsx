import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, Share, TouchableOpacity } from 'react-native';
import {
  ShieldAlert,
  Sun,
  CalendarDays,
  MapPin,
  Map,
  Footprints,
  ShieldCheck,
  Star,
  CheckCircle,
  TrendingDown,
  Layers,
  Clock,
  Target,
  Sunrise,
  Lock,
  Quote,
  Share2,
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { getUserSetup, SetupInfo } from '../utils/storage';
import { useStore } from '../store/useStore';
import { differenceInDays, addDays, parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getRandomQuote } from '../utils/quotes';
import { CITY_PLATES } from '../utils/cityPlates';
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
    <View className="mb-10 mt-4 items-center justify-center">
      <View
        className="relative h-[250px] w-[250px] items-center justify-center"
        accessibilityLabel={`Günlük ilerleme: yüzde ${dayProgress.toFixed(0)}`}
        accessibilityRole="progressbar"
      >
        <Svg width="250" height="250" viewBox="0 0 250 250" className="absolute">
          <Circle
            cx="125"
            cy="125"
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx="125"
            cy="125"
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
          <Text className="mb-1 text-lg font-medium text-gray-400">Kalan Gün</Text>
          <Text className="text-7xl font-black text-safakPrimary">{remaining}</Text>

          {cityName ? (
            <View className="mt-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-4 py-1.5">
              <Text className="text-lg font-bold text-emerald-400">📍 {cityName}</Text>
            </View>
          ) : remaining === 0 ? (
            <Text className="mt-2 text-xl font-bold text-emerald-400">Hürgeneral! 🎖️</Text>
          ) : (
            <Text className="mt-1 text-sm italic text-gray-300">vatan borcu biter...</Text>
          )}
        </View>
      </View>

      <Text className="mt-4 text-xs font-medium uppercase tracking-widest text-gray-500">
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
  const [stats, setStats] = useState({
    passed: 0,
    remaining: 0,
    percentage: 0,
    targetDate: '',
    totalDays: 0,
  });
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

  // Y-3: Sosyal medya paylaşım fonksiyonu
  const handleShare = async () => {
    if (!setup) return;
    try {
      const message =
        `🎖️ Askerlik yolculuğumda:\n` +
        `✅ ${stats.passed} gün tamamlandı\n` +
        `⏳ ${stats.remaining} gün kaldı\n` +
        `📅 Terhis: ${stats.targetDate}\n\n` +
        `#ŞafakSayar #Askerlik`;
      await Share.share({ message, title: 'Şafak Sayar' });
    } catch (e) {
      console.log('[Share] Hata:', e);
    }
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
      {
        id: 92,
        title: 'Yolun Yarısı',
        targetPassed: Math.floor(stats.totalDays / 2),
        icon: CheckCircle,
      },
      { id: 5, title: 'Yüzler Bitiyor', targetPassed: stats.totalDays - 100, icon: TrendingDown },
      { id: 6, title: 'Çift Rakamlar', targetPassed: stats.totalDays - 99, icon: Layers },
      { id: 7, title: 'Plakalar', targetPassed: stats.totalDays - 81, icon: Map },
      { id: 8, title: 'Son 2 Ay', targetPassed: stats.totalDays - 60, icon: CalendarDays },
      { id: 9, title: 'Son 1 Ay', targetPassed: stats.totalDays - 30, icon: Clock },
      { id: 10, title: 'Tek Rakamlar', targetPassed: stats.totalDays - 9, icon: Target },
      { id: 11, title: 'Doğan Güneş', targetPassed: stats.totalDays, icon: Sunrise },
    ];

    const validMilestones = rawMilestones.filter(
      (m) => m.targetPassed > 0 && m.targetPassed <= stats.totalDays,
    );
    const lockedMilestones = rawMilestones.filter(
      (m) => m.targetPassed <= 0 || m.targetPassed > stats.totalDays,
    );

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
      ...lockedMilestones.map((m) => ({
        ...m,
        isLocked: true,
        startAt: 0,
        endAt: 0,
        kalanSafak: 0,
      })),
    ];
  }, [stats.totalDays, stats.passed]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-safakDark p-6">
        <ShieldAlert size={48} color="#f43f5e" />
        <Text className="mt-4 text-center text-lg text-white">{error}</Text>
      </View>
    );
  }

  if (!setup) return null;

  return (
    <View className="flex-1 bg-safakDark">
      <ScrollView
        className="flex-1 bg-safakDark"
        contentContainerStyle={{ padding: 24, paddingBottom: 170 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        {/* Başlık + Paylaş butonu */}
        <View className="mb-6 mt-8 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold uppercase tracking-wider text-gray-400">
              Merhaba, {setup.userName}
            </Text>
            <Text className="mt-1 text-4xl font-bold text-white">Şafak SAYAR</Text>
          </View>
          <View className="flex-row items-center gap-x-3">
            {/* Y-3: Paylaş butonu */}
            <TouchableOpacity
              onPress={handleShare}
              className="rounded-full border border-[#3b82f630] bg-[#3b82f615] p-3"
              accessibilityLabel="Askerlik durumunu paylaş"
              accessibilityHint="Askerlik istatistiklerinizi sosyal medyada paylaşır"
              accessibilityRole="button"
            >
              <Share2 size={24} color="#3b82f6" />
            </TouchableOpacity>
            <View className="rounded-full bg-[#10b98115] p-3">
              <ShieldAlert size={32} color="#10b981" />
            </View>
          </View>
        </View>

        {/* Memleket / Birlik */}
        <View
          className="mb-8 flex-row rounded-2xl border border-gray-700 bg-safakSecondary p-4"
          accessibilityLabel={`Memleket: ${setup.hometown}, Birlik şehri: ${setup.militaryCity}`}
        >
          <View className="flex-1 flex-row items-center border-r border-gray-700 pr-2">
            <MapPin size={20} color="#f43f5e" className="mr-2" />
            <View>
              <Text className="text-xs text-gray-400">Memleket</Text>
              <Text className="font-medium text-white" numberOfLines={1}>
                {setup.hometown}
              </Text>
            </View>
          </View>
          <View className="flex-1 flex-row items-center pl-4">
            <Map size={20} color="#3b82f6" className="mr-2" />
            <View>
              <Text className="text-xs text-gray-400">Birlik</Text>
              <Text className="font-medium text-white" numberOfLines={1}>
                {setup.militaryCity}
              </Text>
            </View>
          </View>
        </View>

        <DailyProgressCircle remaining={stats.remaining} />

        {/* Geçen gün / Bitiş tarihi */}
        <View className="mb-8 flex-row justify-between gap-x-4">
          <View
            className="flex-1 items-center rounded-2xl border border-gray-700 bg-safakSecondary p-5"
            accessibilityLabel={`Geçen gün: ${stats.passed}`}
          >
            <Sun size={28} color="#f59e0b" className="mb-3" />
            <Text className="mb-1 text-sm text-gray-400">Geçen</Text>
            <Text className="text-2xl font-bold text-white">{stats.passed} Gün</Text>
          </View>
          <View
            className="flex-1 items-center rounded-2xl border border-gray-700 bg-safakSecondary p-5"
            accessibilityLabel={`Terhis tarihi: ${stats.targetDate}`}
          >
            <CalendarDays size={28} color="#3b82f6" className="mb-3" />
            <Text className="mb-1 text-sm text-gray-400">Bitiş</Text>
            <Text className="text-center text-base font-bold text-white">{stats.targetDate}</Text>
          </View>
        </View>

        {/* İzin / Ceza bilgileri */}
        <View
          className="mb-8 flex-row justify-between rounded-2xl border border-gray-700 bg-safakSecondary p-5"
          accessibilityLabel={`Yol izni ${setup.roadLeave || 0} gün, kullanılan izin ${setup.usedLeave || 0} gün, ceza ${setup.penalty || 0} gün`}
        >
          <View className="flex-1 items-center border-r border-gray-700">
            <Text className="mb-1 text-xs text-gray-400">Yol İzni</Text>
            <Text className="font-bold text-white">{setup.roadLeave || 0} Gün</Text>
          </View>
          <View className="flex-1 items-center border-r border-gray-700">
            <Text className="mb-1 text-xs text-gray-400">Kullanılan İzin</Text>
            <Text className="font-bold text-white">{setup.usedLeave || 0} Gün</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="mb-1 text-xs text-gray-400">Ceza</Text>
            <Text className="font-bold text-red-400">{setup.penalty || 0} Gün</Text>
          </View>
        </View>

        {/* Günün Sözü */}
        <View className="mb-8 flex-row items-start rounded-2xl border border-safakPrimary/20 bg-safakSecondary/50 p-5">
          <Quote size={20} color="#10b981" className="mr-3 mt-1" />
          <View className="flex-1">
            <Text className="mb-1 text-xs font-bold uppercase text-gray-400">Günün Sözü</Text>
            <Text className="text-base italic leading-6 text-white">{`"${quote}"`}</Text>
          </View>
        </View>

        {/* Şafak Görevleri */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold text-white">Şafak Görevleri</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-6 px-6"
            contentContainerStyle={{ paddingRight: 48 }}
            accessibilityLabel="Şafak görevleri listesi"
          >
            {milestones.map((m) => {
              const isCompleted = !m.isLocked && stats.passed >= m.endAt;
              return (
                <View
                  key={m.id}
                  className={`mr-4 w-36 justify-between rounded-2xl border p-4 ${
                    m.isLocked
                      ? 'border-gray-800 bg-safakSecondary opacity-50'
                      : isCompleted
                        ? 'border-[#10b98150] bg-[#10b98115]'
                        : 'border-gray-700 bg-safakSecondary'
                  }`}
                  accessibilityLabel={`${m.title}${isCompleted ? ', tamamlandı' : m.isLocked ? ', kilitli' : `, ${m.kalanSafak} gün kaldı`}`}
                >
                  <View className="mb-2 items-center">
                    {m.isLocked ? (
                      <Lock size={28} color="#4b5563" />
                    ) : (
                      <m.icon size={28} color={isCompleted ? '#10b981' : '#6b7280'} />
                    )}
                  </View>
                  <Text
                    className="mb-1 h-10 text-center text-sm font-bold text-white"
                    numberOfLines={2}
                  >
                    {m.title}
                  </Text>
                  <Text className="mb-2 text-center text-[10px] text-gray-400">
                    Görev Şafağı:{' '}
                    <Text className="font-bold text-white">{m.isLocked ? '--' : m.kalanSafak}</Text>
                  </Text>
                  <View className="mt-auto">
                    <View className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                      <View
                        className="h-full bg-safakPrimary"
                        style={{
                          width: `${m.isLocked ? 0 : Math.min(100, (stats.passed / m.endAt) * 100)}%`,
                        }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Sabit Banner */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <AdBanner />
      </View>
    </View>
  );
}
