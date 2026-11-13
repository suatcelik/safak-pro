import { buildNotificationPlan } from '../src/domain/notificationPlan';
import { SetupInfo } from '../src/domain/service';

const setup: SetupInfo = { militaryType: 'short', startDate: '2026-01-01', totalDays: 180 };
const quote = () => 'söz';

describe('buildNotificationPlan', () => {
  it('yarından itibaren 30 gün, her sabah 08:00 günün sözü', () => {
    const now = new Date(2026, 0, 10, 15, 0);
    const quotes = buildNotificationPlan(setup, now, quote).filter((n) => n.kind === 'quote');
    expect(quotes).toHaveLength(30);
    expect(quotes[0].date).toEqual(new Date(2026, 0, 11, 8, 0));
    expect(quotes[29].date).toEqual(new Date(2026, 1, 9, 8, 0));
  });

  it('her çağrıda pencere bugüne göre yeniden kurulur (30 gün sonra bitmez)', () => {
    const later = new Date(2026, 1, 20, 9, 0);
    const quotes = buildNotificationPlan(setup, later, quote).filter((n) => n.kind === 'quote');
    expect(quotes).toHaveLength(30);
    expect(quotes[0].date).toEqual(new Date(2026, 1, 21, 8, 0));
  });

  it('terhis gününden sonra söz planlanmaz', () => {
    const now = new Date(2026, 5, 20, 12, 0); // terhis 30 Haziran
    const quotes = buildNotificationPlan(setup, now, quote).filter((n) => n.kind === 'quote');
    expect(quotes[quotes.length - 1].date).toEqual(new Date(2026, 5, 30, 8, 0));
    expect(quotes).toHaveLength(10);
  });

  it('kilometre taşları 09:00, yalnızca gelecekteyse', () => {
    const now = new Date(2026, 3, 10, 10, 0); // 81 kaldı, 09:00 geçti
    const ms = buildNotificationPlan(setup, now, quote).filter((n) => n.kind === 'milestone');
    expect(ms.map((m) => m.date)).toEqual([new Date(2026, 5, 30, 9, 0)]);
  });

  it('başlangıçta 100, 81 ve 0 taşlarının üçü de planlanır', () => {
    const ms = buildNotificationPlan(setup, new Date(2026, 0, 1, 7, 0), quote).filter(
      (n) => n.kind === 'milestone',
    );
    expect(ms.map((m) => m.date)).toEqual([
      new Date(2026, 2, 22, 9, 0),
      new Date(2026, 3, 10, 9, 0),
      new Date(2026, 5, 30, 9, 0),
    ]);
  });
});
