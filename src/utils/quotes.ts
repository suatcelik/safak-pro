// src/utils/quotes.ts
export const MILITARY_QUOTES = [
    "Şafak ne kadar karanlık olsa da güneş doğacaktır.",
    "Vatan borcu biter, sevda borcu bitmez.",
    "Sabır, en büyük zaferin anahtarıdır.",
    "Bugün de bitti, bir gün daha eksildi.",
    "Zorluklar seni yıldırmasın, onlar seni güçlendirir.",
    "Gerçek kahramanlar asla pes etmez.",
    // Buraya daha fazla söz ekleyebilirsin
];

export const getRandomQuote = () => {
    const index = Math.floor(Math.random() * MILITARY_QUOTES.length);
    return MILITARY_QUOTES[index];
};