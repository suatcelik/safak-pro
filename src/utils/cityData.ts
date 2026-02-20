export interface CityData {
    name: string;
    imageUrl: string;
}

// Varsayılan arka plan resmi (Özel resmi olmayan şehirler için kullanılacak)
const DEFAULT_BG = 'https://images.unsplash.com/photo-1588846326573-d20af2427f4f?q=80&w=1000';

// 81 İlin Tam Listesi ve Plaka Kodları
export const CITIES: { [key: number]: CityData } = {
    1: { name: 'ADANA', imageUrl: 'https://images.unsplash.com/photo-1576502200270-6c5bd1003329?q=80&w=1000' },
    2: { name: 'ADIYAMAN', imageUrl: DEFAULT_BG },
    3: { name: 'AFYONKARAHİSAR', imageUrl: DEFAULT_BG },
    4: { name: 'AĞRI', imageUrl: DEFAULT_BG },
    5: { name: 'AMASYA', imageUrl: DEFAULT_BG },
    6: { name: 'ANKARA', imageUrl: 'https://images.unsplash.com/photo-1568632234155-933d77207b14?q=80&w=1000' },
    7: { name: 'ANTALYA', imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000' },
    8: { name: 'ARTVİN', imageUrl: DEFAULT_BG },
    9: { name: 'AYDIN', imageUrl: DEFAULT_BG },
    10: { name: 'BALIKESİR', imageUrl: DEFAULT_BG },
    11: { name: 'BİLECİK', imageUrl: DEFAULT_BG },
    12: { name: 'BİNGÖL', imageUrl: DEFAULT_BG },
    13: { name: 'BİTLİS', imageUrl: DEFAULT_BG },
    14: { name: 'BOLU', imageUrl: DEFAULT_BG },
    15: { name: 'BURDUR', imageUrl: DEFAULT_BG },
    16: { name: 'BURSA', imageUrl: 'https://images.unsplash.com/photo-1623168885165-66b3fb5125c3?q=80&w=1000' },
    17: { name: 'ÇANAKKALE', imageUrl: DEFAULT_BG },
    18: { name: 'ÇANKIRI', imageUrl: DEFAULT_BG },
    19: { name: 'ÇORUM', imageUrl: DEFAULT_BG },
    20: { name: 'DENİZLİ', imageUrl: DEFAULT_BG },
    21: { name: 'DİYARBAKIR', imageUrl: DEFAULT_BG },
    22: { name: 'EDİRNE', imageUrl: DEFAULT_BG },
    23: { name: 'ELAZIĞ', imageUrl: DEFAULT_BG },
    24: { name: 'ERZİNCAN', imageUrl: DEFAULT_BG },
    25: { name: 'ERZURUM', imageUrl: 'https://blog.enakliyat.com.tr/2016/05/erzuruma-evden-eve-nakliyat-sehri-kesfedin.html' },
    26: { name: 'ESKİŞEHİR', imageUrl: DEFAULT_BG },
    27: { name: 'GAZİANTEP', imageUrl: DEFAULT_BG },
    28: { name: 'GİRESUN', imageUrl: DEFAULT_BG },
    29: { name: 'GÜMÜŞHANE', imageUrl: DEFAULT_BG },
    30: { name: 'HAKKARİ', imageUrl: DEFAULT_BG },
    31: { name: 'HATAY', imageUrl: DEFAULT_BG },
    32: { name: 'ISPARTA', imageUrl: DEFAULT_BG },
    33: { name: 'MERSİN', imageUrl: DEFAULT_BG },
    34: { name: 'İSTANBUL', imageUrl: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1000' },
    35: { name: 'İZMİR', imageUrl: 'https://images.unsplash.com/photo-1563896088-823f5840b863?q=80&w=1000' },
    36: { name: 'KARS', imageUrl: DEFAULT_BG },
    37: { name: 'KASTAMONU', imageUrl: DEFAULT_BG },
    38: { name: 'KAYSERİ', imageUrl: DEFAULT_BG },
    39: { name: 'KIRKLARELİ', imageUrl: DEFAULT_BG },
    40: { name: 'KIRŞEHİR', imageUrl: DEFAULT_BG },
    41: { name: 'KOCAELİ', imageUrl: DEFAULT_BG },
    42: { name: 'KONYA', imageUrl: DEFAULT_BG },
    43: { name: 'KÜTAHYA', imageUrl: DEFAULT_BG },
    44: { name: 'MALATYA', imageUrl: DEFAULT_BG },
    45: { name: 'MANİSA', imageUrl: DEFAULT_BG },
    46: { name: 'KAHRAMANMARAŞ', imageUrl: DEFAULT_BG },
    47: { name: 'MARDİN', imageUrl: DEFAULT_BG },
    48: { name: 'MUĞLA', imageUrl: DEFAULT_BG },
    49: { name: 'MUŞ', imageUrl: DEFAULT_BG },
    50: { name: 'NEVŞEHİR', imageUrl: DEFAULT_BG },
    51: { name: 'NİĞDE', imageUrl: DEFAULT_BG },
    52: { name: 'ORDU', imageUrl: DEFAULT_BG },
    53: { name: 'RİZE', imageUrl: 'https://images.unsplash.com/photo-1600617610007-3b157129c210?q=80&w=1000' },
    54: { name: 'SAKARYA', imageUrl: DEFAULT_BG },
    55: { name: 'SAMSUN', imageUrl: DEFAULT_BG },
    56: { name: 'SİİRT', imageUrl: DEFAULT_BG },
    57: { name: 'SİNOP', imageUrl: DEFAULT_BG },
    58: { name: 'SİVAS', imageUrl: DEFAULT_BG },
    59: { name: 'TEKİRDAĞ', imageUrl: DEFAULT_BG },
    60: { name: 'TOKAT', imageUrl: DEFAULT_BG },
    61: { name: 'TRABZON', imageUrl: 'https://images.unsplash.com/photo-1589306491800-06343325610f?q=80&w=1000' },
    62: { name: 'TUNCELİ', imageUrl: DEFAULT_BG },
    63: { name: 'ŞANLIURFA', imageUrl: DEFAULT_BG },
    64: { name: 'UŞAK', imageUrl: DEFAULT_BG },
    65: { name: 'VAN', imageUrl: DEFAULT_BG },
    66: { name: 'YOZGAT', imageUrl: DEFAULT_BG },
    67: { name: 'ZONGULDAK', imageUrl: DEFAULT_BG },
    68: { name: 'AKSARAY', imageUrl: DEFAULT_BG },
    69: { name: 'BAYBURT', imageUrl: DEFAULT_BG },
    70: { name: 'KARAMAN', imageUrl: DEFAULT_BG },
    71: { name: 'KIRIKKALE', imageUrl: DEFAULT_BG },
    72: { name: 'BATMAN', imageUrl: DEFAULT_BG },
    73: { name: 'ŞIRNAK', imageUrl: DEFAULT_BG },
    74: { name: 'BARTIN', imageUrl: DEFAULT_BG },
    75: { name: 'ARDAHAN', imageUrl: DEFAULT_BG },
    76: { name: 'IĞDIR', imageUrl: DEFAULT_BG },
    77: { name: 'YALOVA', imageUrl: DEFAULT_BG },
    78: { name: 'KARABÜK', imageUrl: DEFAULT_BG },
    79: { name: 'KİLİS', imageUrl: DEFAULT_BG },
    80: { name: 'OSMANİYE', imageUrl: DEFAULT_BG },
    81: { name: 'DÜZCE', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Guzeldere_Waterfall_Nature_Park.jpg/1024px-Guzeldere_Waterfall_Nature_Park.jpg' }
};

// 81 dışındaki sayılar veya hatalı durumlar için varsayılan Türkiye verisi
export const DEFAULT_CITY: CityData = {
    name: 'TÜRKİYE',
    imageUrl: DEFAULT_BG
};

// Yardımcı fonksiyon: Verilen plaka numarasına göre şehir verisini getirir
export const getCityDataByPlate = (plate: number): CityData => {
    if (CITIES[plate]) {
        return CITIES[plate];
    }
    return { ...DEFAULT_CITY, name: `PLAKA ${plate}` };
};