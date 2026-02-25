import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { getUserSetup, SetupInfo, getPaintedDays, togglePaintedDay, getLastColor, saveLastColor, PaintedDaysMap } from '../utils/storage';
import { Paintbrush, X } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';

const COLORS = ['#10b981', '#3b82f6', '#a855f7', '#f43f5e', '#f97316', '#eab308'];

// --- KUSURSUZ 180 MATRİSLERİ ---

// 1 Rakamı (Kırmızı tasarıma göre baştan çizildi)
const oneLayout = [
    [1, 2, 3, 4, 0],
    [5, 6, 7, 8, 0],
    [0, 9, 10, 11, 0],
    [0, 12, 13, 14, 0],
    [0, 15, 16, 17, 0],
    [0, 18, 19, 20, 0],
    [0, 21, 22, 23, 0],
    [0, 24, 25, 26, 0],
    [0, 27, 28, 29, 0],
    [0, 30, 31, 32, 0],
    [0, 33, 34, 35, 0],
    [0, 36, 37, 38, 0],
    [39, 40, 41, 42, 43],
    [44, 45, 46, 47, 48]
];

// 8 Rakamı
const eightLayout = [
    [49, 50, 51, 52, 53, 54], [55, 56, 57, 58, 59, 60], [61, 62, 0, 0, 63, 64],
    [65, 66, 0, 0, 67, 68], [69, 70, 0, 0, 71, 72], [73, 74, 0, 0, 75, 76],
    [77, 78, 79, 80, 81, 82], [83, 84, 85, 86, 87, 88], [89, 90, 0, 0, 91, 92],
    [93, 94, 0, 0, 95, 96], [97, 98, 0, 0, 99, 100], [101, 102, 0, 0, 103, 104],
    [105, 106, 107, 108, 109, 110], [111, 112, 113, 114, 115, 116]
];

// 0 Rakamı
const zeroLayout = [
    [117, 118, 119, 120, 121, 122], [123, 124, 125, 126, 127, 128], [129, 130, 0, 0, 131, 132],
    [133, 134, 0, 0, 135, 136], [137, 138, 0, 0, 139, 140], [141, 142, 0, 0, 143, 144],
    [145, 146, 0, 0, 147, 148], [149, 150, 0, 0, 151, 152], [153, 154, 0, 0, 155, 156],
    [157, 158, 0, 0, 159, 160], [161, 162, 0, 0, 163, 164], [165, 166, 0, 0, 167, 168],
    [169, 170, 171, 172, 173, 174], [175, 176, 177, 178, 179, 180]
];

const bedelliTwoLayout = [
    [1, 2, 3, 4], [0, 0, 0, 5], [6, 7, 8, 9], [10, 0, 0, 0], [11, 12, 13, 14]
];
const bedelliEightLayout = [
    [15, 16, 17, 18], [19, 0, 0, 20], [0, 21, 22, 0], [23, 0, 0, 24], [25, 26, 27, 28]
];

const shape3 = [
    [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1]
];
const shape6 = [
    [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 0, 1, 1], [1, 1, 1, 0, 0, 1, 1], [1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1]
];
const shape5 = [
    [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1]
];

const generateMatrix = (shape: number[][], startNumber: number, maxDays: number) => {
    let currentNumber = startNumber;
    const result: number[][] = [];
    for (let r = 0; r < shape.length; r++) {
        const row: number[] = [];
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1 && currentNumber <= maxDays) {
                row.push(currentNumber);
                currentNumber++;
            } else {
                row.push(0);
            }
        }
        result.push(row);
    }
    return { layout: result, nextNumber: currentNumber };
};

export default function CalendarScreen({ navigation }: any) {
    const [setup, setSetup] = useState<SetupInfo | null>(null);
    const [paintedDays, setPaintedDays] = useState<PaintedDaysMap>({});
    const [selectedColor, setSelectedColor] = useState<string>('#10b981');
    const [refreshing, setRefreshing] = useState(false);
    const [daysArray, setDaysArray] = useState<number[]>([]);

    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            return () => {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            };
        }, [])
    );

    const loadData = async () => {
        const data = await getUserSetup();
        const painted = await getPaintedDays();
        const savedColor = await getLastColor();

        if (data) {
            setSetup(data);
            setDaysArray(Array.from({ length: data.totalDays }, (_, i) => i + 1));
        }
        setPaintedDays(painted);
        setSelectedColor(savedColor);
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
        const updated = await togglePaintedDay(day, selectedColor);
        setPaintedDays(updated);
    };

    const handleColorSelect = async (color: string) => {
        setSelectedColor(color);
        await saveLastColor(color);
    };

    if (!setup) return <View className="flex-1 bg-safakDark justify-center items-center"><Text className="text-white">Yükleniyor...</Text></View>;

    const totalDays = setup.totalDays;

    const gen3 = generateMatrix(shape3, 1, totalDays);
    const gen6 = generateMatrix(shape6, gen3.nextNumber, totalDays);
    const gen5 = generateMatrix(shape5, gen6.nextNumber, totalDays);

    const renderCell = (dayNumber: number, rowIndex: number, colIndex: number, layoutName: string, sizeClass: string, textClass: string) => {
        if (dayNumber === 0) return <View key={`empty-${layoutName}-${rowIndex}-${colIndex}`} className={`${sizeClass}`} />;
        if (dayNumber > totalDays) return <View key={`hidden-${dayNumber}`} className={`${sizeClass}`} />;

        const cellColor = paintedDays[dayNumber];
        const isPainted = !!cellColor;

        return (
            <TouchableOpacity
                key={`day-${dayNumber}`}
                onPress={() => handlePaintDay(dayNumber)}
                style={isPainted ? { backgroundColor: cellColor, borderColor: cellColor } : {}}
                className={`${sizeClass} rounded-sm items-center justify-center border ${!isPainted ? 'bg-safakSecondary border-gray-700' : ''}`}
                activeOpacity={0.7}
            >
                <Text className={`font-bold ${textClass} ${isPainted ? 'text-white' : 'text-gray-400'}`}>
                    {dayNumber}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderNumberLayout = (layout: number[][], layoutName: string, sizeClass: string, textClass: string) => (
        <View className="flex-col">
            {layout.map((row, rowIndex) => (
                <View key={`row-${layoutName}-${rowIndex}`} className="flex-row">
                    {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex, layoutName, sizeClass, textClass))}
                </View>
            ))}
        </View>
    );

    // Kutu boyutları referans tasarımdaki gibi kare-vari (w-[22px] h-[22px]) yapıldı.
    const renderContent = () => {
        if (totalDays <= 30) {
            return (
                <View className="flex-row items-center justify-center gap-x-20 px-2 w-full">
                    {renderNumberLayout(bedelliTwoLayout, 'two', 'w-[48px] h-[48px] m-1', 'text-base')}
                    {renderNumberLayout(bedelliEightLayout, 'eight', 'w-[48px] h-[48px] m-1', 'text-base')}
                </View>
            );
        } else if (totalDays <= 180) {
            return (
                <View className="flex-row items-center justify-center gap-x-20 px-1 w-full">
                    {renderNumberLayout(oneLayout, 'one', 'w-[28px] h-[22px] m-[1px]', 'text-[10px]')}
                    {renderNumberLayout(eightLayout, 'eight', 'w-[28px] h-[22px] m-[1px]', 'text-[10px]')}
                    {renderNumberLayout(zeroLayout, 'zero', 'w-[28px] h-[22px] m-[1px]', 'text-[10px]')}
                </View>
            );
        } else {
            return (
                <View className="flex-row items-center justify-center gap-x-20 px-1 w-full">
                    {renderNumberLayout(gen3.layout, 'three', 'w-[28px] h-[22px] m-[1px]', 'text-[9px]')}
                    {renderNumberLayout(gen6.layout, 'six', 'w-[28px] h-[22px] m-[1px]', 'text-[9px]')}
                    {renderNumberLayout(gen5.layout, 'five', 'w-[28px] h-[22px] m-[1px]', 'text-[9px]')}
                </View>
            );
        }
    };

    const layoutMaxCapacity = totalDays <= 30 ? 28 : totalDays <= 180 ? 180 : 365;
    const extraDays = daysArray.filter(day => day > layoutMaxCapacity);

    return (
        <View className="flex-1 bg-safakDark flex-row relative">

            {/* GERİ DÖN (KAPAT) BUTONU */}
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                className="absolute top-6 left-8 z-50 w-10 h-10 bg-safakSecondary rounded-full items-center justify-center border border-gray-700 shadow-lg"
                activeOpacity={0.7}
            >
                <X size={24} color="#f8fafc" />
            </TouchableOpacity>

            <View className="flex-1 items-center justify-center">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={selectedColor} />}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        {renderContent()}
                    </ScrollView>

                    {extraDays.length > 0 && (
                        <View className="mt-4 px-4 items-center mb-6">
                            <Text className="text-gray-500 mb-2 text-xs">Ekstra Günler (Cezalar vb.)</Text>
                            <View className="flex-row flex-wrap justify-center max-w-[500px]">
                                {extraDays.map(day => renderCell(day, 0, day, 'extra', 'w-[22px] h-[22px] m-[2px]', 'text-[10px]'))}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>

            {/* Sağ Taraf: Renk Paleti Menüsü */}
            <View className="w-18 bg-safakSecondary border-l border-gray-800 items-center py-8 shadow-2xl">
                <View className="mb-6 p-2 bg-safakDark rounded-full border border-gray-700">
                    <Paintbrush size={24} color={selectedColor} />
                </View>

                <View className="flex-1 justify-center gap-y-5">
                    {COLORS.map(c => (
                        <TouchableOpacity
                            key={c}
                            onPress={() => handleColorSelect(c)}
                            style={{ backgroundColor: c, borderWidth: selectedColor === c ? 3 : 0, borderColor: 'white' }}
                            className="w-8 h-8 rounded-full shadow-lg"
                        />
                    ))}
                </View>
            </View>

        </View>
    );
}