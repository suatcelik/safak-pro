import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Share, TouchableOpacity } from 'react-native';
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
  Quote,
  Share2,
  LucideIcon,
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useStore } from '../store/useStore';
import { computeService } from '../domain/service';
import { getRandomQuote } from '../domain/quotes';
import { useToday } from '../hooks/useToday';

const MILESTONE_ICONS: Record<string, LucideIcon> = {
  'acemi-basladi': Footprints,
  'acemi-bitti': ShieldCheck,
  'ikinci-ay': Star,
  'iki-ay-bitti': CheckCircle,
  '200ler': TrendingDown,
  yarisi: CheckCircle,
  yuzler: TrendingDown,
  'cift-rakam': Layers,
  plakalar: Map,
  'son-2-ay': CalendarDays,
  'son-1-ay': Clock,
  'tek-rakam': Target,
  'dogan-gunes': Sunrise,
};

// Yalnızca bu bileşen saniyede bir render edilir
const DailyProgressCircle = ({
  remaining,
  plateCity,
  notStartedDays,
}: {
  remaining: number;
  plateCity: string | null;
  notStartedDays: number;
}) => {
  const [dayProgress, setDayProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      setDayProgress((seconds / 86400) * 100);
    };
    update();
    const timer = setInterval(update, 1000);
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
        accessibilityLabel={`Kalan gün ${remaining}. Günlük ilerleme yüzde ${dayProgress.toFixed(0)}`}
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

          {notStartedDays > 0 ? (
            <Text className="mt-1 text-sm italic text-gray-300">
              başlamaya {notStartedDays} gün
            </Text>
          ) : plateCity ? (
            <View className="mt-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-4 py-1.5">
              <Text className="text-lg font-bold text-emerald-400">📍 {plateCity}</Text>
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
  const setup = useStore((s) => s.setup);
  const today = useToday();
  const [quote] = useState(getRandomQuote);

  const stats = useMemo(() => (setup ? computeService(setup, today) : null), [setup, today]);

  if (!setup || !stats) {
    return (
      <View className="flex-1 items-center justify-center bg-safakDark p-6">
        <ShieldAlert size={48} color="#f43f5e" />
        <Text className="mt-4 text-center text-lg text-white">Kullanıcı bilgileri bulunamadı.</Text>
      </View>
    );
  }

  const targetDate = format(stats.endDate, 'dd MMMM yyyy', { locale: tr });

  const handleShare = async () => {
    try {
      const message =
        `🎖️ Askerlik yolculuğumda:\n` +
        `✅ ${stats.passed} gün tamamlandı\n` +
        `⏳ ${stats.remaining} gün kaldı\n` +
        `📅 Terhis: ${targetDate}\n\n` +
        `#ŞafakSayar #Askerlik`;
      await Share.share({ message, title: 'Şafak Sayar' });
    } catch (e) {
      console.warn('[Share]', e);
    }
  };

  return (
    <View className="flex-1 bg-safakDark">
      <ScrollView
        className="flex-1 bg-safakDark"
        contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
      >
        <View className="mb-6 mt-8 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold uppercase tracking-wider text-gray-400">
              Merhaba, {setup.userName}
            </Text>
            <Text className="mt-1 text-4xl font-bold text-white">Şafak SAYAR</Text>
          </View>
          <TouchableOpacity
            onPress={handleShare}
            className="rounded-full border border-[#3b82f630] bg-[#3b82f615] p-3"
            accessibilityLabel="Askerlik durumunu paylaş"
            accessibilityRole="button"
          >
            <Share2 size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

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

        <DailyProgressCircle
          remaining={stats.remaining}
          plateCity={stats.plateCity}
          notStartedDays={stats.daysUntilStart}
        />

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
            accessibilityLabel={`Terhis tarihi: ${targetDate}`}
          >
            <CalendarDays size={28} color="#3b82f6" className="mb-3" />
            <Text className="mb-1 text-sm text-gray-400">Bitiş</Text>
            <Text className="text-center text-base font-bold text-white">{targetDate}</Text>
          </View>
        </View>

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

        <View className="mb-8 flex-row items-start rounded-2xl border border-safakPrimary/20 bg-safakSecondary/50 p-5">
          <Quote size={20} color="#10b981" className="mr-3 mt-1" />
          <View className="flex-1">
            <Text className="mb-1 text-xs font-bold uppercase text-gray-400">Günün Sözü</Text>
            <Text className="text-base italic leading-6 text-white">{`"${quote}"`}</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold text-white">Şafak Görevleri</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-6 px-6"
            contentContainerStyle={{ paddingRight: 48 }}
            accessibilityLabel="Şafak görevleri listesi"
          >
            {stats.milestones.map((m) => {
              const Icon = MILESTONE_ICONS[m.id] ?? CheckCircle;
              const done = m.status === 'done';
              return (
                <View
                  key={m.id}
                  className={`mr-4 w-36 justify-between rounded-2xl border p-4 ${
                    done ? 'border-[#10b98150] bg-[#10b98115]' : 'border-gray-700 bg-safakSecondary'
                  }`}
                  accessibilityLabel={`${m.title}${done ? ', tamamlandı' : `, şafak ${m.remainingAt}`}`}
                >
                  <View className="mb-2 items-center">
                    <Icon size={28} color={done ? '#10b981' : '#6b7280'} />
                  </View>
                  <Text
                    className="mb-1 h-10 text-center text-sm font-bold text-white"
                    numberOfLines={2}
                  >
                    {m.title}
                  </Text>
                  <Text className="mb-2 text-center text-[10px] text-gray-400">
                    Görev Şafağı: <Text className="font-bold text-white">{m.remainingAt}</Text>
                  </Text>
                  <View className="mt-auto">
                    <View className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                      <View
                        className="h-full bg-safakPrimary"
                        style={{ width: `${m.progress * 100}%` }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
