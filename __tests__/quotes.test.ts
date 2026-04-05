/**
 * quotes.ts util testleri
 *
 * Kurulum: npm install --save-dev jest jest-expo @types/jest
 * Çalıştır: npx jest
 */
import { MILITARY_QUOTES, getRandomQuote } from '../src/utils/quotes';

describe('MILITARY_QUOTES', () => {
    it('en az 30 söz içermelidir', () => {
        expect(MILITARY_QUOTES.length).toBeGreaterThanOrEqual(30);
    });

    it('her söz boş olmamalıdır', () => {
        MILITARY_QUOTES.forEach((q) => {
            expect(q.trim().length).toBeGreaterThan(0);
        });
    });

    it('duplicate söz olmamalıdır', () => {
        const unique = new Set(MILITARY_QUOTES);
        expect(unique.size).toBe(MILITARY_QUOTES.length);
    });
});

describe('getRandomQuote', () => {
    it('liste içinden bir söz döndürmelidir', () => {
        const quote = getRandomQuote();
        expect(MILITARY_QUOTES).toContain(quote);
    });

    it('birden fazla çağrıda farklı sözler döndürebilmelidir', () => {
        // 50 denemede en az 2 farklı söz çıkmalı (olasılık: ~%100)
        const results = new Set(Array.from({ length: 50 }, () => getRandomQuote()));
        expect(results.size).toBeGreaterThan(1);
    });
});
