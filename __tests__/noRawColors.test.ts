import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..', 'src');
const SCANNED = ['screens', 'components', 'navigation', 'assets'];
const HEX = /#[0-9a-fA-F]{3,8}\b/g;

function filesIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return filesIn(p);
    return /\.(tsx?|jsx?)$/.test(e.name) ? [p] : [];
  });
}

describe('tasarım token kuralı', () => {
  it('ekran, bileşen ve navigasyon kodunda ham hex renk yok (yalnızca src/theme)', () => {
    const offenders: string[] = [];
    for (const dir of SCANNED) {
      for (const file of filesIn(path.join(ROOT, dir))) {
        const src = fs.readFileSync(file, 'utf8');
        const hits = src.match(HEX);
        if (hits) offenders.push(`${path.relative(ROOT, file)}: ${hits.join(', ')}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
