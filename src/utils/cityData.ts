export interface CityData {
    name: string;
    imageUrl: string;
    famousFor?: string;
    historicalPlace?: string;
    description?: string;
}

// Varsayılan arka plan resmi (Özel resmi olmayan şehirler için kullanılacak)
const DEFAULT_BG = 'https://images.unsplash.com/photo-1588846326573-d20af2427f4f?q=80&w=1000';

// 81 İlin Tam Listesi, Plaka Kodları ve Kültürel Bilgileri
export const CITIES: { [key: number]: CityData } = {
    1: {
        name: 'ADANA',
        imageUrl: 'https://images.unsplash.com/photo-1576502200270-6c5bd1003329?q=80&w=1000',
        famousFor: 'Acılı Adana Kebap ve Şalgam',
        historicalPlace: 'Taş Köprü ve Merkez Park',
        description: 'Güneşe ateş edenlerin şehri Adana! Bitiyor bu şafak.'
    },
    2: {
        name: 'ADIYAMAN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Etsiz Çiğ Köfte',
        historicalPlace: 'Nemrut Dağı Heykelleri',
        description: 'Güneşin en güzel doğup battığı zirveye selam olsun.'
    },
    3: {
        name: 'AFYONKARAHİSAR',
        imageUrl: DEFAULT_BG,
        famousFor: 'Sucuk, Kaymak ve Lokum',
        historicalPlace: 'Afyon Kalesi ve Frig Vadisi',
        description: 'Cumhuriyetin kazanıldığı topraklardasın.'
    },
    4: {
        name: 'AĞRI',
        imageUrl: DEFAULT_BG,
        famousFor: 'Abdigör Köftesi',
        historicalPlace: 'İshak Paşa Sarayı',
        description: 'Türkiye\'nin çatısı, efsaneler diyarı Ağrı.'
    },
    5: {
        name: 'AMASYA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Amasya Elması',
        historicalPlace: 'Kral Kaya Mezarları',
        description: 'Şehzadeler şehri, Ferhat ile Şirin\'in diyarı.'
    },
    6: {
        name: 'ANKARA',
        imageUrl: 'https://images.unsplash.com/photo-1568632234155-933d77207b14?q=80&w=1000',
        famousFor: 'Ankara Simidi ve Döneri',
        historicalPlace: 'Anıtkabir ve Ankara Kalesi',
        description: 'Milli mücadelenin ve Cumhuriyetin kalbi.'
    },
    7: {
        name: 'ANTALYA',
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000',
        famousFor: 'Piyaz ve Narenciye',
        historicalPlace: 'Kaleiçi ve Düden Şelalesi',
        description: 'Turizmin ve sıcak güneşin başkenti Antalya.'
    },
    8: {
        name: 'ARTVİN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Kuymak ve Laz Böreği',
        historicalPlace: 'Karagöl ve Çoruh Nehri',
        description: 'Yeşilin ve doğanın eşsiz uyumu Artvin.'
    },
    9: {
        name: 'AYDIN',
        imageUrl: DEFAULT_BG,
        famousFor: 'İncir ve Zeytinyağı',
        historicalPlace: 'Aphrodisias ve Apollon Tapınağı',
        description: 'Efeler diyarı Aydın, dağlarından yağ, ovalarından bal akar.'
    },
    10: {
        name: 'BALIKESİR',
        imageUrl: DEFAULT_BG,
        famousFor: 'Höşmerim ve Susurluk Ayranı',
        historicalPlace: 'Kaz Dağları ve Cunda Adası',
        description: 'İki denize komşu güzel şehir.'
    },
    11: {
        name: 'BİLECİK',
        imageUrl: DEFAULT_BG,
        famousFor: 'Ayva Lokumu',
        historicalPlace: 'Söğüt Ertuğrul Gazi Türbesi',
        description: 'Osmanlı\'nın doğduğu topraklara geldik.'
    },
    12: {
        name: 'BİNGÖL',
        imageUrl: DEFAULT_BG,
        famousFor: 'Çapakçur Kavurması ve Bal',
        historicalPlace: 'Yüzen Adalar',
        description: 'Doğunun saklı cenneti, güneşin diyarı.'
    },
    13: {
        name: 'BİTLİS',
        imageUrl: DEFAULT_BG,
        famousFor: 'Büryan Kebabı',
        historicalPlace: 'Ahlat Selçuklu Mezarlığı',
        description: 'Bitlis\'te beş minare, beri gel oğlan beri gel.'
    },
    14: {
        name: 'BOLU',
        imageUrl: DEFAULT_BG,
        famousFor: 'Mengen Aşçıları ve Abant Kebabı',
        historicalPlace: 'Yedigöller ve Abant',
        description: 'Doğanın dört mevsim çizdiği tablo Bolu.'
    },
    15: {
        name: 'BURDUR',
        imageUrl: DEFAULT_BG,
        famousFor: 'Ceviz Ezmesi',
        historicalPlace: 'Salda Gölü ve Sagalassos',
        description: 'Türkiye\'nin Maldivleri\'ne ve göller yöresine selam.'
    },
    16: {
        name: 'BURSA',
        imageUrl: 'https://images.unsplash.com/photo-1623168885165-66b3fb5125c3?q=80&w=1000',
        famousFor: 'İskender Kebap ve Kestane Şekeri',
        historicalPlace: 'Ulu Cami ve Uludağ',
        description: 'Osmanlı\'nın ilk başkenti, Yeşil Bursa.'
    },
    17: {
        name: 'ÇANAKKALE',
        imageUrl: DEFAULT_BG,
        famousFor: 'Peynir Tatlısı ve Ezine Peyniri',
        historicalPlace: 'Gelibolu Şehitliği ve Truva',
        description: 'Geçilmez destanının yazıldığı kutsal topraklar.'
    },
    18: {
        name: 'ÇANKIRI',
        imageUrl: DEFAULT_BG,
        famousFor: 'Yumurta Tatlısı ve Kaya Tuzu',
        historicalPlace: 'Tuz Mağarası',
        description: 'Yarenler diyarı Çankırı.'
    },
    19: {
        name: 'ÇORUM',
        imageUrl: DEFAULT_BG,
        famousFor: 'Leblebi',
        historicalPlace: 'Hattuşaş Antik Kenti',
        description: 'Hititlerin başkenti, dünyanın merkezi.'
    },
    20: {
        name: 'DENİZLİ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Denizli Horozu ve Kebabı',
        historicalPlace: 'Pamukkale Travertenleri',
        description: 'Beyaz cennetin bulunduğu tekstil diyarı.'
    },
    21: {
        name: 'DİYARBAKIR',
        imageUrl: DEFAULT_BG,
        famousFor: 'Karpuz ve Ciğer Kebabı',
        historicalPlace: 'Diyarbakır Surları ve Hevsel Bahçeleri',
        description: 'Tarihin taşa yazıldığı kadim şehir.'
    },
    22: {
        name: 'EDİRNE',
        imageUrl: DEFAULT_BG,
        famousFor: 'Tava Ciğeri ve Badem Ezmesi',
        historicalPlace: 'Selimiye Camii',
        description: 'Mimar Sinan\'ın ustalık eseri, serhat şehri Edirne.'
    },
    23: {
        name: 'ELAZIĞ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Örcik ve Çedene Kahvesi',
        historicalPlace: 'Harput Kalesi',
        description: 'Gakgoşlar diyarı Elaziz.'
    },
    24: {
        name: 'ERZİNCAN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Tulum Peyniri ve Döner',
        historicalPlace: 'Girlevik Şelalesi',
        description: 'Can Erzincan! Doğanın ve kardeşliğin şehri.'
    },
    25: {
        name: 'ERZURUM',
        imageUrl: 'https://blog.enakliyat.com.tr/2016/05/erzuruma-evden-eve-nakliyat-sehri-kesfedin.html', // Mevcut link korundu
        famousFor: 'Cağ Kebabı ve Kadayıf Dolması',
        historicalPlace: 'Çifte Minareli Medrese ve Palandöken',
        description: 'Dadaş diyarı Erzurum! Soğuğuna inat yüreği sıcak insanların şehri.'
    },
    26: {
        name: 'ESKİŞEHİR',
        imageUrl: DEFAULT_BG,
        famousFor: 'Çibörek ve Met Helvası',
        historicalPlace: 'Odunpazarı Evleri ve Porsuk Çayı',
        description: 'Anadolu\'nun ortasındaki Avrupa, öğrenci şehri.'
    },
    27: {
        name: 'GAZİANTEP',
        imageUrl: DEFAULT_BG,
        famousFor: 'Baklava ve Lahmacun',
        historicalPlace: 'Zeugma ve Gaziantep Kalesi',
        description: 'Lezzetin ve gazi unvanının başkenti.'
    },
    28: {
        name: 'GİRESUN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Fındık',
        historicalPlace: 'Giresun Kalesi ve Kümbet Yaylası',
        description: 'Kirazın anavatanı, fındığın başkenti.'
    },
    29: {
        name: 'GÜMÜŞHANE',
        imageUrl: DEFAULT_BG,
        famousFor: 'Pestil ve Köme',
        historicalPlace: 'Karaca Mağarası',
        description: 'Doğa ile tarihin buluştuğu dağların şehri.'
    },
    30: {
        name: 'HAKKARİ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Meydan Kayağı ve Bal',
        historicalPlace: 'Zap Suyu ve Sümbül Dağı',
        description: 'Dağların gizemli ve sarp şehri.'
    },
    31: {
        name: 'HATAY',
        imageUrl: DEFAULT_BG,
        famousFor: 'Künefe ve Tepsi Kebabı',
        historicalPlace: 'Titus Tüneli ve Habib-i Neccar Camii',
        description: 'Medeniyetlerin ve hoşgörünün beşiği.'
    },
    32: {
        name: 'ISPARTA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Gül ve Göller',
        historicalPlace: 'Lavanta Bahçeleri ve Eğirdir Gölü',
        description: 'Güllerin ve göllerin şehri Isparta.'
    },
    33: {
        name: 'MERSİN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Tantuni ve Cezerye',
        historicalPlace: 'Kızkalesi ve Cennet-Cehennem Obrukları',
        description: 'Akdeniz\'in incisi, palmiyeler şehri.'
    },
    34: {
        name: 'İSTANBUL',
        imageUrl: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1000',
        famousFor: 'Boğaz, Simit ve Balık Ekmek',
        historicalPlace: 'Ayasofya ve Galata Kulesi',
        description: 'İki kıtayı birbirine bağlayan dünya şehri.'
    },
    35: {
        name: 'İZMİR',
        imageUrl: 'https://images.unsplash.com/photo-1563896088-823f5840b863?q=80&w=1000',
        famousFor: 'Boyoz ve Kumru',
        historicalPlace: 'Saat Kulesi ve Efes Antik Kenti',
        description: 'Ege\'nin incisi, dağlarında çiçekler açan İzmir.'
    },
    36: {
        name: 'KARS',
        imageUrl: DEFAULT_BG,
        famousFor: 'Kaşar Peyniri ve Kaz Eti',
        historicalPlace: 'Ani Harabeleri ve Sarıkamış',
        description: 'Doğu Ekspresi\'nin son durağı, beyaz şehir.'
    },
    37: {
        name: 'KASTAMONU',
        imageUrl: DEFAULT_BG,
        famousFor: 'Kuyu Kebabı ve Sarımsak',
        historicalPlace: 'Ilgaz Dağları ve Valla Kanyonu',
        description: 'İstiklal Yolu\'nun kahraman şehri Kastamonu.'
    },
    38: {
        name: 'KAYSERİ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Mantı, Pastırma ve Sucuk',
        historicalPlace: 'Erciyes Dağı',
        description: 'Ticaretin kalbi ve Erciyes\'in eteklerindeki şehir.'
    },
    39: {
        name: 'KIRKLARELİ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Hardaliye ve Köfte',
        historicalPlace: 'İğneada Longoz Ormanları',
        description: 'Doğanın ve huzurun Trakya\'daki adresi.'
    },
    40: {
        name: 'KIRŞEHİR',
        imageUrl: DEFAULT_BG,
        famousFor: 'Ceviz',
        historicalPlace: 'Ahi Evran Külliyesi',
        description: 'Ahiliğin merkezi, bozkırın tezenesi.'
    },
    41: {
        name: 'KOCAELİ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Pişmaniye',
        historicalPlace: 'Kartepe ve Seka Park',
        description: 'Sanayi ve doğanın birleştiği körfez kenti.'
    },
    42: {
        name: 'KONYA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Etliekmek ve Mevlana Şekeri',
        historicalPlace: 'Mevlana Müzesi',
        description: 'Hoşgörü diyarı, Şeb-i Arus\'un şehri.'
    },
    43: {
        name: 'KÜTAHYA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Çini ve Porselen',
        historicalPlace: 'Aizanoi Antik Kenti',
        description: 'Çininin ve sanatın başkenti Kütahya.'
    },
    44: {
        name: 'MALATYA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Kayısı ve Kağıt Kebabı',
        historicalPlace: 'Arslantepe Höyüğü',
        description: 'Dünyanın kayısı başkenti Battalgazi diyarı.'
    },
    45: {
        name: 'MANİSA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Mesir Macunu ve Sultaniye Üzümü',
        historicalPlace: 'Spil Dağı',
        description: 'Şehzadeler şehri Manisa.'
    },
    46: {
        name: 'KAHRAMANMARAŞ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Dövme Dondurma ve Tarhana',
        historicalPlace: 'Yedi Güzel Adam Müzesi',
        description: 'İstiklal madalyalı kahraman şehir.'
    },
    47: {
        name: 'MARDİN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Kaburga Dolması ve Süryani Şarabı',
        historicalPlace: 'Dara Antik Kenti ve Tarihi Taş Evler',
        description: 'Gündüz seyranlık, gece gerdanlık Mardin.'
    },
    48: {
        name: 'MUĞLA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Çam Balı',
        historicalPlace: 'Ölüdeniz ve Bodrum Kalesi',
        description: 'Ege ile Akdeniz\'in kucaklaştığı tatil cenneti.'
    },
    49: {
        name: 'MUŞ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Muş Lalesi',
        historicalPlace: 'Malazgirt Meydanı',
        description: 'Anadolu\'nun kapılarının açıldığı yer.'
    },
    50: {
        name: 'NEVŞEHİR',
        imageUrl: DEFAULT_BG,
        famousFor: 'Testi Kebabı',
        historicalPlace: 'Kapadokya ve Peri Bacaları',
        description: 'Güzel atlar diyarı, masalsı şehir.'
    },
    51: {
        name: 'NİĞDE',
        imageUrl: DEFAULT_BG,
        famousFor: 'Elma ve Gazoz',
        historicalPlace: 'Niğde Kalesi',
        description: 'Kapadokya\'nın gizli bahçesi Niğde.'
    },
    52: {
        name: 'ORDU',
        imageUrl: DEFAULT_BG,
        famousFor: 'Fındık ve Pide',
        historicalPlace: 'Boztepe',
        description: 'Karadeniz\'in oksijen deposu.'
    },
    53: {
        name: 'RİZE',
        imageUrl: 'https://images.unsplash.com/photo-1600617610007-3b157129c210?q=80&w=1000',
        famousFor: 'Çay ve Muhlama',
        historicalPlace: 'Ayder Yaylası ve Zilkale',
        description: 'Yeşil ile mavinin en güzel tonu Rize.'
    },
    54: {
        name: 'SAKARYA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Islama Köfte',
        historicalPlace: 'Sapanca Gölü',
        description: 'Yeşilin her tonunu barındıran şehir.'
    },
    55: {
        name: 'SAMSUN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Pide ve Simit',
        historicalPlace: 'Bandırma Vapuru',
        description: 'Kurtuluş meşalesinin yakıldığı yer Samsun.'
    },
    56: {
        name: 'SİİRT',
        imageUrl: DEFAULT_BG,
        famousFor: 'Büryan ve Fıstık',
        historicalPlace: 'Veysel Karani Türbesi',
        description: 'Evliyalar diyarı Siirt.'
    },
    57: {
        name: 'SİNOP',
        imageUrl: DEFAULT_BG,
        famousFor: 'Sinop Mantısı',
        historicalPlace: 'Tarihi Cezaevi ve Erfelek Şelaleleri',
        description: 'Türkiye\'nin en mutlu ve en kuzey şehri.'
    },
    58: {
        name: 'SİVAS',
        imageUrl: DEFAULT_BG,
        famousFor: 'Sivas Köftesi ve Kangal Köpeği',
        historicalPlace: 'Çifte Minareli Medrese ve Divriği Ulu Camii',
        description: 'Cumhuriyetin temellerinin atıldığı Yiğidolar diyarı.'
    },
    59: {
        name: 'TEKİRDAĞ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Tekirdağ Köftesi',
        historicalPlace: 'Uçmakdere',
        description: 'Marmara\'nın gülen yüzü Tekirdağ.'
    },
    60: {
        name: 'TOKAT',
        imageUrl: DEFAULT_BG,
        famousFor: 'Tokat Kebabı ve Yaprak',
        historicalPlace: 'Ballıca Mağarası',
        description: 'Tarihin ve doğanın kucaklaştığı yer.'
    },
    61: {
        name: 'TRABZON',
        imageUrl: 'https://images.unsplash.com/photo-1589306491800-06343325610f?q=80&w=1000',
        famousFor: 'Akçaabat Köftesi ve Kuymak',
        historicalPlace: 'Sümela Manastırı ve Uzungöl',
        description: 'Karadeniz\'in incisi, fırtınalar şehri.'
    },
    62: {
        name: 'TUNCELİ',
        imageUrl: DEFAULT_BG,
        famousFor: 'Munzur Sarımsağı',
        historicalPlace: 'Munzur Vadisi Millî Parkı',
        description: 'Doğanın kalbi, suların başkenti.'
    },
    63: {
        name: 'ŞANLIURFA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Çiğ Köfte ve Ciğer Kebabı',
        historicalPlace: 'Göbeklitepe ve Balıklıgöl',
        description: 'Tarihin sıfır noktası, Peygamberler şehri Şanlıurfa.'
    },
    64: {
        name: 'UŞAK',
        imageUrl: DEFAULT_BG,
        famousFor: 'Tarhana ve Halı',
        historicalPlace: 'Ulubey Kanyonu',
        description: 'İlkler şehri Uşak.'
    },
    65: {
        name: 'VAN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Van Kahvaltısı ve İnci Kefali',
        historicalPlace: 'Van Gölü ve Akdamar Adası',
        description: 'Güneşin şehri, Doğu\'nun incisi Van.'
    },
    66: {
        name: 'YOZGAT',
        imageUrl: DEFAULT_BG,
        famousFor: 'Testi Kebabı',
        historicalPlace: 'Çamlık Milli Parkı',
        description: 'Bozok yaylasının yiğit şehri.'
    },
    67: {
        name: 'ZONGULDAK',
        imageUrl: DEFAULT_BG,
        famousFor: 'Devrek Bastonu',
        historicalPlace: 'Gökgöl Mağarası',
        description: 'Emeğin ve kömürün başkenti.'
    },
    68: {
        name: 'AKSARAY',
        imageUrl: DEFAULT_BG,
        famousFor: 'Malaklı Köpeği',
        historicalPlace: 'Ihlara Vadisi',
        description: 'Kapadokya\'nın batı kapısı Aksaray.'
    },
    69: {
        name: 'BAYBURT',
        imageUrl: DEFAULT_BG,
        famousFor: 'Lor Dolması',
        historicalPlace: 'Bayburt Kalesi ve Baksı Müzesi',
        description: 'Çoruh\'un can verdiği şehir.'
    },
    70: {
        name: 'KARAMAN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Karaman Elması',
        historicalPlace: 'Karaman Kalesi',
        description: 'Türkçenin başkenti Karaman.'
    },
    71: {
        name: 'KIRIKKALE',
        imageUrl: DEFAULT_BG,
        famousFor: 'Silah Sanayisi',
        historicalPlace: 'Çeşnigir Köprüsü',
        description: 'Cumhuriyetin sanayi kenti.'
    },
    72: {
        name: 'BATMAN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Sason Çileği',
        historicalPlace: 'Hasankeyf',
        description: 'Tarih ve enerjinin buluştuğu yer.'
    },
    73: {
        name: 'ŞIRNAK',
        imageUrl: DEFAULT_BG,
        famousFor: 'Bıttım',
        historicalPlace: 'Cudi Dağı ve Mem u Zin Türbesi',
        description: 'Nuh\'un Gemisi\'nin efsanevi durağı.'
    },
    74: {
        name: 'BARTIN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Amasra Salatası',
        historicalPlace: 'Amasra',
        description: 'Çeşm-i Cihan (Dünyanın Gözü) Bartın.'
    },
    75: {
        name: 'ARDAHAN',
        imageUrl: DEFAULT_BG,
        famousFor: 'Kaşar Peyniri',
        historicalPlace: 'Çıldır Gölü',
        description: 'Güneşin en erken doğduğu sınır şehri.'
    },
    76: {
        name: 'IĞDIR',
        imageUrl: DEFAULT_BG,
        famousFor: 'Kayısı',
        historicalPlace: 'Ağrı Dağı (Kuzey Yamacı)',
        description: 'Doğu\'nun Çukurovası Iğdır.'
    },
    77: {
        name: 'YALOVA',
        imageUrl: DEFAULT_BG,
        famousFor: 'Termal Kaplıcalar',
        historicalPlace: 'Yürüyen Köşk',
        description: 'Marmara\'nın yeşil vahası.'
    },
    78: {
        name: 'KARABÜK',
        imageUrl: DEFAULT_BG,
        famousFor: 'Safranbolu Lokumu',
        historicalPlace: 'Safranbolu Evleri',
        description: 'UNESCO mirası, demir çelik kenti.'
    },
    79: {
        name: 'KİLİS',
        imageUrl: DEFAULT_BG,
        famousFor: 'Kilis Tavası',
        historicalPlace: 'Ravanda Kalesi',
        description: 'Sınırın lezzet ve hoşgörü şehri.'
    },
    80: {
        name: 'OSMANİYE',
        imageUrl: DEFAULT_BG,
        famousFor: 'Yer Fıstığı',
        historicalPlace: 'Karatepe Aslantaş',
        description: 'Çukurova\'nın fıstık diyarı.'
    },
    81: {
        name: 'DÜZCE',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Guzeldere_Waterfall_Nature_Park.jpg/1024px-Guzeldere_Waterfall_Nature_Park.jpg',
        famousFor: 'Düzce Köftesi',
        historicalPlace: 'Güzeldere Şelalesi',
        description: 'Batı Karadeniz\'in doğa cenneti.'
    }
};

// 81 dışındaki sayılar veya hatalı durumlar için varsayılan Türkiye verisi
export const DEFAULT_CITY: CityData = {
    name: 'TÜRKİYE',
    imageUrl: DEFAULT_BG,
    description: 'Vatan borcu ödeniyor...'
};

// Yardımcı fonksiyon: Verilen plaka numarasına göre şehir verisini getirir
export const getCityDataByPlate = (plate: number): CityData => {
    if (CITIES[plate]) {
        return CITIES[plate];
    }
    return { ...DEFAULT_CITY, name: `PLAKA ${plate}` };
};