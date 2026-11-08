#!/usr/bin/env node
/* =========================================================
   MaisonPRO · اختبار طبقة إرسال النماذج (بدون مكتبات، بدون إنترنت)
   node tools/test-forms.mjs   أو   npm run test:forms

   يشغّل assets/js/forms.js في بيئة معزولة مع fetch وهمي ويتحقق
   من صيغة الطلب لكل مزوّد ومن الرجوع الآمن عند الفشل.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = fs.readFileSync(path.join(ROOT, 'assets/js/forms.js'), 'utf8');

const ROW = {
  ref: 'MP-1234', title: 'فيلا测试', deal: 'sale', type: 'villa', district: 'heron',
  price_djf: 45000000, nightly_djf: 0, rooms: 4, baths: 3, area: 220,
  amenities: 'water, power, ac', description: 'وصف تجريبي',
  owner_name: 'أحمد', owner_phone: '25377123456', photo_count: 2,
  lang: 'ar', page_url: 'https://exemple.dj/', submitted_at: '2026-11-08T12:00:00.000Z'
};

let failures = 0;
function ok(name, cond, extra = '') {
  if (cond) console.log('  ✓ ' + name);
  else { console.error('  ✗ ' + name + (extra ? ' → ' + extra : '')); failures++; }
}

/* يشغّل forms.js بإعدادات معينة ويعيد { result, calls } */
async function run(forms, opts = {}) {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    if (opts.throwNetwork) throw new Error('network down');
    if (opts.status && opts.status >= 400) return { ok: false, status: opts.status };
    if (opts.abortOnSignal && init.signal && init.signal.aborted) throw new Error('aborted');
    return { ok: true, status: 200 };
  };
  const sandbox = {
    window: { SITE_CONFIG: { forms } },
    fetch: fetchMock,
    AbortController, URLSearchParams, String, Object, Error, JSON,
    setTimeout: opts.instantTimeout ? (cb) => { cb(); return 1; } : setTimeout,
    clearTimeout
  };
  vm.createContext(sandbox);
  vm.runInContext(SRC + '\n;globalThis.__MP = window.MPForms;', sandbox);
  let result, threw = null;
  try { result = await sandbox.__MP.send(ROW); } catch (e) { threw = e; }
  return { result, calls, api: sandbox.__MP, threw };
}

console.log('اختبار طبقة النماذج — MaisonPRO');

/* 1. الوضع المحلي */
{
  const { result, calls, api } = await run({ provider: 'none', endpoint: '', apiKey: '' });
  ok('none → حفظ محلي بلا طلب شبكة', result.mode === 'local' && result.ok === false && calls.length === 0);
  ok('none → enabled() = false', api.enabled() === false);
}

/* 2. Formspree */
{
  const { result, calls } = await run({ provider: 'formspree', endpoint: 'https://formspree.io/f/abc123', apiKey: '' });
  const c = calls[0];
  const body = c ? JSON.parse(c.init.body) : {};
  ok('formspree → POST للرابط الصحيح', result.ok && result.mode === 'formspree' && c.url === 'https://formspree.io/f/abc123' && c.init.method === 'POST');
  ok('formspree → JSON مع _subject ورقم الطلب', c.init.headers['Content-Type'] === 'application/json' && body.ref === 'MP-1234' && /MP-1234/.test(body._subject || ''));
  ok('formspree → كل الحقول مُرسلة', Object.keys(ROW).every(k => k in body));
}

/* 3. Supabase */
{
  const { result, calls } = await run({ provider: 'supabase', endpoint: 'https://x.supabase.co/rest/v1/submissions', apiKey: 'anon-key' });
  const c = calls[0];
  const body = c ? JSON.parse(c.init.body) : {};
  ok('supabase → ترويسات apikey / Bearer / Prefer', c.init.headers.apikey === 'anon-key' && /^Bearer /.test(c.init.headers.Authorization) && c.init.headers.Prefer === 'return=minimal');
  ok('supabase → جسم مطابق للأعمدة بلا _subject', result.ok && body.ref === 'MP-1234' && !('_subject' in body));
}

/* 4. Netlify Forms */
{
  const { result, calls, api } = await run({ provider: 'netlify', endpoint: '/', apiKey: '' });
  const c = calls[0];
  const params = c ? new URLSearchParams(c.init.body) : new URLSearchParams();
  ok('netlify → POST / بصيغة form-urlencoded', result.ok && result.mode === 'netlify' && c.url === '/' && c.init.headers['Content-Type'] === 'application/x-www-form-urlencoded');
  ok('netlify → form-name + حقل honeypot', params.get('form-name') === api.formName && params.get('bot-field') === '');
  ok('netlify → كل حقول الطلب موجودة', Object.keys(ROW).every(k => params.get(k) === String(ROW[k])));
}

/* 5. فشل الخادم لا يرمي استثناءً */
{
  const { result, threw } = await run({ provider: 'formspree', endpoint: 'https://formspree.io/f/x' }, { status: 500 });
  ok('HTTP 500 → mode=error بلا استثناء', result.mode === 'error' && result.ok === false && threw === null);
}

/* 6. انقطاع الشبكة */
{
  const { result, threw } = await run({ provider: 'formspree', endpoint: 'https://formspree.io/f/x' }, { throwNetwork: true });
  ok('انقطاع الشبكة → mode=error بلا استثناء', result.mode === 'error' && threw === null);
}

/* 7. انتهاء المهلة */
{
  const { result, threw } = await run({ provider: 'formspree', endpoint: 'https://formspree.io/f/x' }, { instantTimeout: true, abortOnSignal: true });
  ok('انتهاء المهلة → mode=error بلا استثناء', result.mode === 'error' && threw === null);
}

if (failures) {
  console.error('\n✖ ' + failures + ' اختبار فاشل');
  process.exit(1);
}
console.log('\n✓ كل اختبارات النماذج ناجحة (7 سيناريوهات)');
