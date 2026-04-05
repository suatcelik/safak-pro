import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Palmtree, CarFront, ShieldAlert, CalendarDays, Info, CheckCircle2 } from 'lucide-react-native';
import { getUserSetup, SetupInfo } from '../utils/storage';
import { differenceInDays, addDays, parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Askerlik türüne göre hak edilen izin gün sayıları (Türk Silahlı Kuvvetleri)
const EARNED_LEAVE_BY_TYPE: Record<string, number> = {
    short: 14,   // 6 ay — 14 gün
    long: 28,    // 12 ay — 28 gün
    officer: 30, // Yedek subay — 30 gün
    paid: 0,     // Bedelli — izin yok
};

const ROAD_LEAVE_BY_TYPE: Record<string, number> = {
    short: 4,
    long: 4,
    officer: 4,
    paid: 0,
};

interface LeaveStats {
    earnedLeave: number;
    defaultRoadLeave: number;
    usedLeave: number;
    roadLeave: number;
    penalty: number;
    remainingLeave: number;
    effectiveTotalDays: number;
    dischargeDate: string;
    daysFromToday: number;
    passed: number;
    serviceType: string;
}

function computeLeaveStats(setup: SetupInfo): LeaveStats {
    const earnedLeave = EARNED_LEAVE_BY_TYPE[setup.militaryType] ?? 0;
    const defaultRoadLeave = ROAD_LEAVE_BY_TYPE[setup.militaryType] ?? 0;

    const usedLeave = setup.usedLeave || 0;
    const roadLeave = setup.roadLeave || 0;
    const penalty = setup.penalty || 0;

    const remainingLeave = Math.max(0, earnedLeave - usedLeave);

    const effectiveTotalDays = setup.totalDays + usedLeave + penalty;

    const start = parseISO(setup.startDate);
    const dischargeDay = addDays(start, effectiveTotalDays - roadLeave);
    const dischargeDate = format(dischargeDay, 'dd MMMM yyyy', { locale: tr });

    const today = new Date();
    const daysFromToday = differenceInDays(dischargeDay, today);

    const realPassed = differenceInDays(today, start);
    const passed = Math.max(0, Math.min(realPassed + roadLeave, effectiveTotalDays));

    const typeLabels: Record<string, string> = {
        short: 'Kısa Dönem (6 Ay)',
        long: 'Uzun Dönem (12 Ay)',
        officer: 'Yedek Subay (12 Ay)',
        paid: 'Bedelli Askerlik',
    };

    return {
        earnedLeave,
        defaultRoadLeave,
        usedLeave,
        roadLeave,
        penalty,
        remainingLeave,
        effectiveTotalDays,
        dischargeDate,
        daysFromToday: Math.max(0, daysFromToday),
        passed,
        serviceType: typeLabels[setup.militaryType] ?? setup.militaryType,
    };
}

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueColor?: string;
    isLast?: boolean;
}

function InfoRow({ icon, label, value, valueColor = 'text-white', isLast = false }: InfoRowProps) {
    return (
        <View className={`flex-row items-center justify-between py-4 ${!isLast ? 'border-b border-gray-800' : ''}`}>
            <View className="flex-row items-center flex-1">
                <View className="w-8 items-center">{icon}</View>
                <Text className="text-gray-300 ml-3 text-base flex-1">{label}</Text>
            </View>
            <Text className={`font-bold text-base ml-2 ${valueColor}`}>{value}</Text>
        </View>
    );
}

export default function LeaveCalculatorScreen() {
    const navigation = useNavigation<any>();
    const [leaveStats, setLeaveStats] = useState<LeaveStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const setup = await getUserSetup();
                if (!setup) {
                    setError('Askerlik bilgisi bulunamadı. Lütfen önce kurulumu tamamlayın.');
                    return;
                }
                setLeaveStats(computeLeaveStats(setup));
            } catch (e) {
                console.error('[LeaveCalculator]', e);
                setError('Hesaplama sırasında bir hata oluştu.');
            }
        })();
    }, []);

    return (
        <View className="flex-1 bg-safakDark">
            {/* Başlık */}
            <View className="mt-12 px-6 flex-row items-center mb-6">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-safakSecondary p-3 rounded-full mr-4"
                    accessibilityLabel="Geri dön"
                    accessibilityRole="button"
                >
                    <ArrowLeft size={22} color="#94a3b8" />
                </TouchableOpacity>
                <View>
                    <Text className="text-white text-2xl font-bold">İzin Hesabı</Text>
                    <Text className="text-gray-400 text-sm">Hak edilen ve kalan izinler</Text>
                </View>
            </View>

            {error ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Info size={48} color="#f59e0b" />
                    <Text className="text-white text-center mt-4 text-base">{error}</Text>
                </View>
            ) : leaveStats ? (
                <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>

                    {/* Servis türü */}
                    <View className="bg-[#10b98115] rounded-2xl p-4 border border-[#10b98130] mb-6 flex-row items-center">
                        <CheckCircle2 size={20} color="#10b981" />
                        <Text className="text-emerald-400 font-semibold ml-3">{leaveStats.serviceType}</Text>
                    </View>

                    {/* İzin Bilgileri */}
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">
                        İzin Durumu
                    </Text>
                    <View className="bg-safakSecondary rounded-2xl border border-gray-700 px-4 mb-6">
                        <InfoRow
                            icon={<Palmtree size={18} color="#10b981" />}
                            label="Hak Edilen İzin"
                            value={`${leaveStats.earnedLeave} Gün`}
                            valueColor="text-emerald-400"
                        />
                        <InfoRow
                            icon={<Palmtree size={18} color="#f59e0b" />}
                            label="Kullanılan İzin"
                            value={`${leaveStats.usedLeave} Gün`}
                            valueColor="text-yellow-400"
                        />
                        <InfoRow
                            icon={<Palmtree size={18} color="#3b82f6" />}
                            label="Kalan İzin"
                            value={`${leaveStats.remainingLeave} Gün`}
                            valueColor={leaveStats.remainingLeave > 0 ? 'text-blue-400' : 'text-gray-500'}
                            isLast
                        />
                    </View>

                    {/* Yol ve Ceza */}
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">
                        Yol İzni & Ceza
                    </Text>
                    <View className="bg-safakSecondary rounded-2xl border border-gray-700 px-4 mb-6">
                        <InfoRow
                            icon={<CarFront size={18} color="#94a3b8" />}
                            label="Standart Yol İzni"
                            value={`${leaveStats.defaultRoadLeave} Gün`}
                        />
                        <InfoRow
                            icon={<CarFront size={18} color="#10b981" />}
                            label="Kullandığınız Yol İzni"
                            value={`${leaveStats.roadLeave} Gün`}
                            valueColor="text-emerald-400"
                        />
                        <InfoRow
                            icon={<ShieldAlert size={18} color="#ef4444" />}
                            label="Ceza (uzayan süre)"
                            value={leaveStats.penalty > 0 ? `+${leaveStats.penalty} Gün` : 'Yok'}
                            valueColor={leaveStats.penalty > 0 ? 'text-red-400' : 'text-gray-500'}
                            isLast
                        />
                    </View>

                    {/* Hesaplanan Bitiş */}
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">
                        Tahmini Terhis
                    </Text>
                    <View className="bg-safakSecondary rounded-2xl border border-gray-700 px-4 mb-6">
                        <InfoRow
                            icon={<CalendarDays size={18} color="#3b82f6" />}
                            label="Toplam Hizmet Süresi"
                            value={`${leaveStats.effectiveTotalDays} Gün`}
                        />
                        <InfoRow
                            icon={<CalendarDays size={18} color="#10b981" />}
                            label="Geçen Gün (fiili)"
                            value={`${leaveStats.passed} Gün`}
                            valueColor="text-emerald-400"
                        />
                        <InfoRow
                            icon={<CalendarDays size={18} color="#f59e0b" />}
                            label="Terhis Tarihi"
                            value={leaveStats.dischargeDate}
                            valueColor="text-yellow-400"
                        />
                        <InfoRow
                            icon={<CalendarDays size={18} color="#a855f7" />}
                            label="Terhise Kalan"
                            value={`${leaveStats.daysFromToday} Gün`}
                            valueColor="text-purple-400"
                            isLast
                        />
                    </View>

                    {/* Not */}
                    <View className="bg-safakSecondary/40 rounded-2xl border border-gray-700 p-4">
                        <View className="flex-row items-center mb-2">
                            <Info size={16} color="#64748b" />
                            <Text className="text-gray-500 text-xs ml-2 font-semibold uppercase">Not</Text>
                        </View>
                        <Text className="text-gray-500 text-sm leading-5">
                            Bu hesaplama girdiğiniz bilgilere dayanmaktadır. Resmi terhis tarihi birlik komutanlığınız
                            tarafından belirlenir. Ceza ve izin günleri tahmini olarak etkilenir.
                        </Text>
                    </View>
                </ScrollView>
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Yükleniyor...</Text>
                </View>
            )}
        </View>
    );
}
