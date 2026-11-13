import { execFileSync } from 'child_process';
import path from 'path';

const ROOT = path.join(__dirname, '..');

/**
 * EAS, projeyi derlemeye yüklerken .gitignore'a uyar. Takip edilen bir kaynak
 * dosyası bir ignore kuralına takılırsa (ör. kökü kastedip `store/` yazmak
 * src/store'u da dışlar) derleme "Unable to resolve module" ile düşer.
 */
describe('EAS yüklemesi', () => {
  it('takip edilen kaynak dosyalarının hiçbiri .gitignore tarafından dışlanmaz', () => {
    const tracked = execFileSync(
      'git',
      ['ls-files', 'src', 'App.tsx', 'index.ts', 'plugins', 'assets'],
      {
        cwd: ROOT,
        encoding: 'utf8',
      },
    )
      .split('\n')
      .filter(Boolean);
    expect(tracked.length).toBeGreaterThan(0);

    let ignored = '';
    try {
      ignored = execFileSync('git', ['check-ignore', '--no-index', '--stdin'], {
        cwd: ROOT,
        input: tracked.join('\n'),
        encoding: 'utf8',
      });
    } catch (e) {
      // check-ignore hiçbir yol dışlanmadığında 1 ile çıkar: beklenen durum
      ignored = (e as { stdout?: string }).stdout ?? '';
    }
    expect(ignored.split('\n').filter(Boolean)).toEqual([]);
  });
});
