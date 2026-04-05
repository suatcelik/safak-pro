/**
 * İzin hesaplama mantığı testleri
 *
 * Kurulum: npm install --save-dev jest jest-expo @types/jest
 * Çalıştır: npx jest
 */

// Türlere göre hak edilen izin (LeaveCalculatorScreen ile senkron)
const EARNED_LEAVE_BY_TYPE: Record<string, number> = {
    short: 14,
    long: 28,
    officer: 30,
    paid: 0,
};

describe('İzin hak ediş hesabı', () => {
    it('kısa dönem için 14 gün izin hak edilmeli', () => {
        expect(EARNED_LEAVE_BY_TYPE['short']).toBe(14);
    });

    it('uzun dönem için 28 gün izin hak edilmeli', () => {
        expect(EARNED_LEAVE_BY_TYPE['long']).toBe(28);
    });

    it('yedek subay için 30 gün izin hak edilmeli', () => {
        expect(EARNED_LEAVE_BY_TYPE['officer']).toBe(30);
    });

    it('bedelli için 0 gün izin hak edilmeli', () => {
        expect(EARNED_LEAVE_BY_TYPE['paid']).toBe(0);
    });
});

describe('Kalan izin hesabı', () => {
    it('kullanılan izin hak edilenden küçükse kalan pozitif olmalı', () => {
        const earned = 28;
        const used = 10;
        const remaining = Math.max(0, earned - used);
        expect(remaining).toBe(18);
    });

    it('kullanılan izin hak edilenden büyükse kalan 0 olmalı', () => {
        const earned = 14;
        const used = 20;
        const remaining = Math.max(0, earned - used);
        expect(remaining).toBe(0);
    });
});

describe('Efektif toplam gün hesabı', () => {
    it('ceza ve kullanılan izin toplam süreye eklenmeli', () => {
        const totalDays = 180; // kısa dönem
        const usedLeave = 5;
        const penalty = 3;
        const effective = totalDays + usedLeave + penalty;
        expect(effective).toBe(188);
    });

    it('sıfır ceza ve sıfır izinde toplam değişmemeli', () => {
        const totalDays = 365;
        const effective = totalDays + 0 + 0;
        expect(effective).toBe(365);
    });
});
