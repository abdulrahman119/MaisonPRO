#!/usr/bin/env node
/* =========================================================
   MaisonPRO · فحص ما قبل الإطلاق (بدون مكتبات)
   node tools/check.mjs   أو   npm run check

   يتحقق من:
    - وجود مفاتيح الترجمة لكل data-i18n / t() في اللغات الثلاث
    - وجود كل الروابط والملفات المحلية (صور، CSS، JS، صفحات)
    - عدم تكرار معرّفات id داخل صفحات HTML
    - وجود ملفات الإطلاق الأساسية
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const errors = [];
const notes = [];

/* ---------- 1. مفاتيح الترجمة ---------- */
const sandbox = {
  window: {}, document: {}, navigator: { languages: ['ar'], language: 'ar' },
  localStorage: { getItem: () => null, setItem: () => {} },
  console, Intl, Date, URL, setTimeout, clearTimeout
};
vm.createContext(sandbox);
vm.runInContext(read('assets/js/i18n.js') + '\n;globalThis.__DICT = STRINGS;', sandbox);
const dict = sandbox.__DICT;

const htmlFiles = ['index.html', 'privacy.html', 'terms.html', '404.html'];
const jsFiles = ['app.js', 'admin.js', 'store.js', 'forms.js'];
const used = new Set();
for (const f of htmlFiles) {
  for (const m of read(f).matchAll(/data-i18n(?:-html|-placeholder|-aria)?="([^"]+)"/g)) used.add(m[1]);
}
for (const f of jsFiles) {
  for (const m of read('assets/js/' + f).matchAll(/\bt\('([A-Za-z][A-Za-z0-9]*)'/g)) used.add(m[1]);
}
for (const lang of ['ar', 'fr', 'en']) {
  const have = new Set(Object.keys(dict[lang] || {}));
  const missing = [...used].filter(k => !have.has(k));
  if (missing.length) errors.push(`i18n/${lang}: مفاتيح ناقصة → ${missing.join(', ')}`);
  notes.push(`i18n/${lang}: ${have.size} مفتاح، ${used.size} مستخدم`);
}

/* ---------- 2. الروابط والملفات المحلية ---------- */
for (const f of htmlFiles) {
  const s = read(f);
  for (const m of s.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(#|https?:|mailto:|tel:|data:|\/\/)/.test(ref)) continue;
    const clean = ref.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (!fs.existsSync(path.join(ROOT, clean))) errors.push(`${f}: ملف مفقود → ${clean}`);
  }
  const ids = [...s.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dup = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  if (dup.length) errors.push(`${f}: معرّفات مكررة → ${dup.join(', ')}`);
}

/* ---------- 2.5 تطابق حقول Netlify Forms مع حمولة النموذج ---------- */
{
  const app = read('assets/js/app.js');
  const rowMatch = app.match(/const row = \{([\s\S]*?)\n    \};/);
  const rowKeys = rowMatch
    ? [...rowMatch[1].matchAll(/^\s*([a-z][a-z0-9_]*)\s*[:,]/gm)].map(m => m[1])
    : [];
  if (!rowKeys.length) errors.push('app.js: لم أستطع قراءة حقول الطلب (const row)');

  const html = read('index.html');
  const formMatch = html.match(/<form name="add-property"[^>]*>([\s\S]*?)<\/form>/);
  if (!formMatch) {
    errors.push('index.html: النموذج المخفي name="add-property" مفقود (لن يكتشف Netlify الطلبات)');
  } else {
    const tag = html.slice(html.indexOf('<form name="add-property"'), html.indexOf('>', html.indexOf('<form name="add-property"')));
    if (!/data-netlify="true"/.test(tag)) errors.push('index.html: data-netlify="true" مفقود');
    if (!/data-netlify-honeypot="bot-field"/.test(tag)) errors.push('index.html: حقل مكافحة السبام مفقود');
    const names = new Set([...formMatch[1].matchAll(/name="([^"]+)"/g)].map(m => m[1]));
    const missing = [...rowKeys, 'form-name', 'bot-field'].filter(k => !names.has(k));
    if (missing.length) errors.push('index.html: حقول ناقصة في نموذج Netlify → ' + missing.join(', '));
    notes.push(`Netlify Forms: ${names.size} حقلاً، ${rowKeys.length} حقلاً في الطلب`);
  }
  const formsSrc = read('assets/js/forms.js');
  if (!/const FORM_NAME = 'add-property'/.test(formsSrc)) {
    errors.push('forms.js: FORM_NAME لا يطابق اسم النموذج في index.html');
  }
}

/* ---------- 3. ملفات أساسية ---------- */
for (const f of ['index.html', 'privacy.html', 'terms.html', '404.html', 'robots.txt',
                 'sitemap.xml', 'netlify.toml', 'vercel.json', 'README.md', 'LAUNCH.md', 'tools/test-forms.mjs']) {
  if (!fs.existsSync(path.join(ROOT, f))) errors.push(`ملف أساسي مفقود: ${f}`);
}

/* ---------- النتيجة ---------- */
notes.forEach(n => console.log('  • ' + n));
if (errors.length) {
  console.error('\n✖ فحص ما قبل الإطلاق: ' + errors.length + ' مشكلة');
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('\n✓ فحص ما قبل الإطلاق ناجح — لا ملفات مفقودة ولا ترجمات ناقصة');
