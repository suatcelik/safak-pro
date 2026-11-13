import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Her testte store'u temiz bir modül olarak yükle
async function loadStore() {
  let mod: typeof import('../src/store/useStore');
  jest.isolateModules(() => {
    mod = require('../src/store/useStore');
  });
  await mod!.useStore.persist.rehydrate();
  return mod!.useStore;
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('useStore', () => {
  it('ilk kurulumda boş başlar', async () => {
    const store = await loadStore();
    expect(store.getState().hasOnboarded).toBe(false);
    expect(store.getState().setup).toBeNull();
    expect(store.getState().paintedDays).toEqual({});
  });

  it('eski sürümün anahtarlarından veriyi taşır', async () => {
    await AsyncStorage.multiSet([
      ['isFirstLaunch', 'false'],
      [
        'userSetupInfo',
        JSON.stringify({
          militaryType: 'long',
          startDate: '2026-02-01',
          totalDays: 365,
          hometown: 'KAHRAMANMARAŞ',
          militaryCity: 'İZMİR',
        }),
      ],
      ['paintedDaysInfo', JSON.stringify([1, 2])],
      ['lastSelectedColor', '#3b82f6'],
    ]);
    const store = await loadStore();
    const s = store.getState();
    expect(s.hasOnboarded).toBe(true);
    expect(s.setup?.startDate).toBe('2026-02-01');
    expect(s.setup?.hometown).toBe('Kahramanmaraş');
    expect(s.setup?.militaryCity).toBe('İzmir');
    expect(Object.keys(s.paintedDays)).toEqual(['1', '2']);
    expect(s.lastColor).toBe('#3b82f6');
  });

  it('değişiklikler kalıcıdır', async () => {
    const store = await loadStore();
    store.getState().completeOnboarding();
    store.getState().saveSetup({ militaryType: 'short', startDate: '2026-01-01', totalDays: 180 });
    store.getState().togglePaintedDay(5, '#fff');
    const again = await loadStore();
    expect(again.getState().hasOnboarded).toBe(true);
    expect(again.getState().setup?.totalDays).toBe(180);
    expect(again.getState().paintedDays[5]).toBe('#fff');
  });

  it('aynı renkle tekrar dokunmak boyayı kaldırır', async () => {
    const store = await loadStore();
    store.getState().togglePaintedDay(3, '#aaa');
    store.getState().togglePaintedDay(3, '#aaa');
    expect(store.getState().paintedDays[3]).toBeUndefined();
  });

  it('askerlik türü değişirse boyalı günler sıfırlanır', async () => {
    const store = await loadStore();
    store.getState().saveSetup({ militaryType: 'short', startDate: '2026-01-01', totalDays: 180 });
    store.getState().togglePaintedDay(1, '#aaa');
    store.getState().saveSetup({ militaryType: 'long', startDate: '2026-01-01', totalDays: 365 });
    expect(store.getState().paintedDays).toEqual({});
  });

  it('reset her şeyi temizler, eski anahtarlar geri gelmez', async () => {
    await AsyncStorage.setItem('userSetupInfo', JSON.stringify({ startDate: '2026-01-01' }));
    const store = await loadStore();
    store.getState().reset();
    await new Promise((r) => setTimeout(r, 0));
    const again = await loadStore();
    expect(again.getState().setup).toBeNull();
    expect(again.getState().hasOnboarded).toBe(false);
  });
});
