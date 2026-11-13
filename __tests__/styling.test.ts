import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');

/**
 * NativeWind, JSX'i sararak her Pressable'ın `style` değerini yeniden işler ve
 * fonksiyon biçimli stilleri (`style={({ pressed }) => ...}`) atar. Uygulama
 * yalnızca StyleSheet + token kullandığı için JSX sarmalayıcısı olmamalı.
 */
describe('stil altyapısı', () => {
  it('babel JSX sarmalayıcısı (nativewind) kullanılmaz', () => {
    const babel = fs.readFileSync(path.join(ROOT, 'babel.config.js'), 'utf8');
    expect(babel).not.toMatch(/nativewind/);
    expect(babel).not.toMatch(/jsxImportSource/);
  });

  it('metro yapılandırması nativewind ile sarılmaz', () => {
    const metro = fs.readFileSync(path.join(ROOT, 'metro.config.js'), 'utf8');
    expect(metro).not.toMatch(/nativewind/);
  });
});
