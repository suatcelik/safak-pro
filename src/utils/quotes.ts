// src/utils/quotes.ts
export const MILITARY_QUOTES = [
    // Klasik askerlik sözleri
    "Şafak ne kadar karanlık olsa da güneş doğacaktır.",
    "Vatan borcu biter, sevda borcu bitmez.",
    "Sabır, en büyük zaferin anahtarıdır.",
    "Bugün de bitti, bir gün daha eksildi.",
    "Zorluklar seni yıldırmasın, onlar seni güçlendirir.",
    "Gerçek kahramanlar asla pes etmez.",

    // Motivasyon
    "Her yeni şafak, eve bir adım daha yakın demektir.",
    "Güçlü olman için buradaki her zorluğu bir ders say.",
    "Sabah güneşi doğduğunda, bir gün daha geride kaldığını bil.",
    "Bugünün zorlukları yarının gücüne dönüşür.",
    "Yolun sonunda seni bekleyenler için devam et.",
    "Asker olmak, ruhunu çeliğe çevirmektir.",
    "Her gün bir adım; sonunda hedef.",
    "Güçlü zihin, zor şartları bile gülümserek aşar.",
    "Kalan günler azaldıkça, umut büyür.",
    "Vatan için her fedakarlık bir şereftir.",
    "Bulunduğun yerde en iyi ver kendini; bu da geçer.",
    "Sabırla göğüslenen her zorluk, bir onur madalyasıdır.",
    "Karanlık ne kadar uzun sürerse sürsün, şafak mutlaka söker.",
    "Evde seni bekleyenler için en güçlü asker ol.",

    // Türk atasözleri / özlü sözler
    "Taşıma su ile değirmen dönmez; azimle her engel aşılır.",
    "Damlaya damlaya göl olur; günler de birikerek biter.",
    "Bugünün işini yarına bırakma; kalan günlerin de öyle.",
    "Sabreden derviş muradına ermiş.",
    "Yılmak yok, durmak yok; şafağa kadar.",

    // Askeri esprit
    "En büyük zafer kendi nefsini yenmektir.",
    "Disiplin, başarının temelidir.",
    "Birlik içinde güç, güç içinde zafer vardır.",
    "Zorluk karakteri ortaya çıkarır; sen de bu fırçayla şekilleniyorsun.",
    "Askerden dönenler hayatın her zorluğuna güler.",

    // Umut ve eve dönüş
    "Her sabah kalktığında rakamdan bir çıkar; yaklaşıyorsun.",
    "Eve döndüğünde bu günler en güzel anıların olacak.",
    "Sevin ki şafak söküyor; her şafak bir gün daha eksilmiş demek.",
    "Memleket güzel, ama en güzel geri dönüşte görünür.",
    "Buradaki her an seni daha güçlü biri yapıyor.",
    "Aile seni bekliyor; o bekleyiş sana güç vermeli.",
    "Şafak sayarken umudu da say; sayısı hiç bitmez.",
    "Bugün bitiren gün yarın anlatacağın gün olur.",
    "Buradan geçen her er daha olgun döner.",
    "Kalan günler azaldıkça, gülümseme büyüsün.",

    // Kısa ve vurucu
    "Dayanmak da bir sanattır.",
    "Bugün de geçer.",
    "Kararlılık, koşullardan güçlüdür.",
    "İlerle; geri adım yok.",
    "Her gün bir zaferdir.",
    "Güçlü ol, geri döneceksin.",
    "Dur, nefes al, devam et.",
    "Sayılar azalır, güç artar.",
    "Azim her engeli ezer.",
    "Şafak herkese doğar; seninkini bekle.",
];

export const getRandomQuote = () => {
    const index = Math.floor(Math.random() * MILITARY_QUOTES.length);
    return MILITARY_QUOTES[index];
};
