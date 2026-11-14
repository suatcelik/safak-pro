// App Store ekran görüntüleri: web paketini Chrome'da (headless) açıp örnek veriyle
// iPhone 6.9" (1320×2868) ve iPad 13" (2064×2752) görüntüleri alır.
// Kullanım: npm run screenshots  (Chrome kurulu olmalı)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const [dist, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(dist, p);
  if (
    !file.startsWith(path.resolve(dist)) ||
    !fs.existsSync(file) ||
    fs.statSync(file).isDirectory()
  )
    file = path.join(dist, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(4319, r));
const URL = 'http://127.0.0.1:4319/';

// --- örnek veri: kısa dönem, şafak 64 (Uşak), 117 gün boyalı ---
const dayKey = (d) => d.toISOString().slice(0, 10);
const today = new Date();
today.setHours(12, 0, 0, 0);
const start = new Date(today);
start.setDate(start.getDate() - 117);
const palette = ['#C6F432', '#FFE14D', '#4DA3FF', '#FF5C8A'];
const painted = {};
for (let d = 1; d <= 117; d++) painted[d] = palette[Math.floor((d - 1) / 30) % palette.length];
const setup = {
  militaryType: 'short',
  startDate: dayKey(start),
  totalDays: 180,
  userName: 'Mehmet',
  hometown: 'Trabzon',
  militaryCity: 'Uşak',
  roadLeave: 2,
  usedLeave: 0,
  penalty: 3,
};
const persisted = (state) =>
  JSON.stringify({
    state: {
      hasOnboarded: false,
      setup: null,
      paintedDays: {},
      lastColor: '#C6F432',
      notificationsEnabled: true,
      celebratedMilestones: 99,
      ...state,
    },
    version: 1,
  });
const FULL = persisted({ hasOnboarded: true, setup, paintedDays: painted, lastColor: '#FF5C8A' });
const ONBOARDED = persisted({ hasOnboarded: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu'],
});

async function shot({ name, width, height, scale, state, steps }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
  });
  if (state)
    await ctx.addInitScript((v) => {
      try {
        localStorage.setItem('safak-sayar-store', v);
      } catch {}
    }, state);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  [${name}] page error:`, e.message));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  if (steps) await steps(page);
  await page.waitForTimeout(1500); // halka animasyonu, geçişler
  const file = path.join(out, `${name}.png`);
  await page.screenshot({ path: file });
  console.log('  wrote', path.basename(file));
  await ctx.close();
}

const devices = {
  iphone: { width: 440, height: 956, scale: 3 }, // 6.9" → 1320×2868
  iphone65: { width: 428, height: 926, scale: 3 }, // 6.5" → 1284×2778
  ipad: { width: 1032, height: 1376, scale: 2 }, // 13"  → 2064×2752
};
// SHOT_DEVICES=iphone65 gibi virgüllü liste ile yalnızca seçilen cihazlar çekilir
const only = process.env.SHOT_DEVICES?.split(',');

for (const [dev, d] of Object.entries(devices)) {
  if (only && !only.includes(dev)) continue;
  console.log(dev);
  await shot({ name: `${dev}-1-home`, ...d, state: FULL });
  await shot({
    name: `${dev}-2-milestones`,
    ...d,
    state: FULL,
    steps: async (p) => {
      await p.mouse.move(d.width / 2, d.height / 2);
      await p.mouse.wheel(0, 900);
    },
  });
  await shot({
    name: `${dev}-3-calendar`,
    width: d.height,
    height: d.width,
    scale: d.scale,
    state: FULL,
    steps: async (p) => {
      await p.getByRole('tab', { name: 'Takvim' }).click();
    },
  });
  await shot({
    name: `${dev}-4-setup-type`,
    ...d,
    state: ONBOARDED,
    steps: async (p) => {
      await p.getByLabel('Adın').fill('Mehmet');
      await p.getByRole('button', { name: 'Devam' }).click();
    },
  });
  await shot({
    name: `${dev}-5-share`,
    ...d,
    state: FULL,
    steps: async (p) => {
      await p.getByLabel('Durumunu paylaş').click();
    },
  });
  await shot({ name: `${dev}-6-onboarding`, ...d });
}

await browser.close();
server.close();
