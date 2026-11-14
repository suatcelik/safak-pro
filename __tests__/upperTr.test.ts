import { upperTr } from '../src/domain/text';

/**
 * CSS/RN `textTransform: 'uppercase'` Türkçe kuralını uygulamaz: "Terhis" →
 * "TERHIS" olur (doğrusu "TERHİS"). Etiketler upperTr ile büyütülür.
 */
describe('upperTr', () => {
  it('i harfini İ yapar', () => {
    expect(upperTr('Terhis')).toBe('TERHİS');
    expect(upperTr('Ekstra · ceza ve izin')).toBe('EKSTRA · CEZA VE İZİN');
    expect(upperTr('Günün sözü')).toBe('GÜNÜN SÖZÜ');
  });

  it('ı harfini I yapar', () => {
    expect(upperTr('Sıradaki')).toBe('SIRADAKİ');
  });

  it('JSX çocuk dizilerindeki metinleri büyütür, sayıları ve diğerlerini korur', () => {
    expect(upperTr([117, ' / ', 183, ' boyandı'])).toEqual([117, ' / ', 183, ' BOYANDI']);
    expect(upperTr(null)).toBeNull();
  });
});
