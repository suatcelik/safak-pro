import fs from 'fs';
import path from 'path';

const app = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app.json'), 'utf8')).expo;

/**
 * Xcode hedef adı `expo.name`'den türetilir. "Ş" gibi harfleri EAS sunucusundaki
 * araç siler ("afakSayar"), SDK 58 prebuild ise çevirir ("SafakSayar"); adlar
 * tutmayınca iOS derlemesi "Could not find target" ile düşer. İç ad ASCII kalır,
 * görünen ad platform ayarlarıyla Türkçe verilir.
 */
describe('app.json', () => {
  it('iç ad yalnızca ASCII harf, rakam ve boşluk içerir', () => {
    expect(app.name).toMatch(/^[A-Za-z0-9 ]+$/);
  });

  it('iOS ana ekranda Türkçe adı gösterir', () => {
    expect(app.ios.infoPlist.CFBundleDisplayName).toBe('Şafak Sayar');
  });

  it('Android etiketi Türkçe ad eklentisiyle verilir', () => {
    const plugin = app.plugins.find(
      (p: unknown) => Array.isArray(p) && p[0] === './plugins/withAndroidAppName',
    );
    expect(plugin?.[1]).toEqual({ name: 'Şafak Sayar' });
  });
});
