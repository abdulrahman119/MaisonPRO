# خطة إطلاق MaisonPRO — خطوة بخطوة حتى النشر

> وساطة عقارية في جيبوتي · آخر تحديث: **8 نوفمبر 2026**
> الفرع: `arena/fdde5b10-maisonpro` · الدليل الكامل للتقنية في [`README.md`](README.md)

---

## القرارات المتفق عليها

| البند | القرار |
|---|---|
| الأساس | إكمال وتطوير موقع MaisonPRO الموجود في المستودع (لا إعادة بناء) |
| الاستضافة | **Netlify** أولاً (مع `vercel.json` جاهز كبديل) — دومين مؤقت ثم `maisonpro.dj` لاحقاً |
| نطاق النسخة الأولى | MVP + استقبال طلبات «أضف عقارك» (Netlify Forms تلقائياً، وFormspree/Supabase كبديل) |
| المحتوى | بيانات تجريبية مؤقتاً، مع **شريط تنبيه واضح** وعدم فهرسة الإعلانات الوهمية |

---

## أين نحن الآن

| # | الخطوة | الحالة |
|---|---|---|
| 1 | فحص المستودع وتشغيل معاينة حيّة | ✅ تم |
| 2 | تجهيز أساس النشر (بناء، استضافة، SEO، أمان، صفحات قانونية، تنبيه تجريبي) | ✅ تم |
| 3 | استقبال طلبات «أضف عقارك» | ✅ تم — تلقائي عبر Netlify Forms، تحتاج منك فقط تفعيل إشعار البريد |
| 4 | استبدال البيانات التجريبية بالمحتوى الحقيقي | 👤 يحتاج منك |
| 5 | استكمال بيانات الشركة في الصفحات القانونية | 👤 يحتاج منك |
| 6 | النشر الفعلي على Netlify | 👤 يحتاج منك (الملفات جاهزة) |
| 7 | ربط الدومين الخاص `maisonpro.dj` | ⏳ اختياري / لاحقاً |
| 8 | قائمة فحص ما قبل الإطلاق | ⏳ قبل الضغط على «نشر» |
| 9 | يوم الإطلاق + ما بعده | ⏳ |

---

## الخطوة 1 — التشغيل المحلي والمعاينة ✅

```bash
cd MaisonPRO
python3 -m http.server 8080 --bind 0.0.0.0
# أو: npm run serve
```

المعاينة الحيّة في هذه الجلسة تعمل على المنفذ `8080`. لا توجد مكتبات ولا خطوة `build` إلزامية للتطوير المحلي.

---

## الخطوة 2 — ما تم تجهيزه للنشر ✅

| الملف | الوظيفة |
|---|---|
| `tools/build.mjs` | يبني `dist/` وينسخ الملفات العامة فقط، ويوحّد كل الروابط المطلقة مع عنوان النشر، ويولّد إعدادات التشغيل من متغيرات البيئة |
| `netlify.toml` | أمر البناء، مجلد النشر `dist`، ترويسات أمان + CSP، تخزين مؤقت للأصول، تحويلات مختصرة |
| `vercel.json` | نفس الفكرة كبديل جاهز على Vercel |
| `assets/js/runtime.js` | إعدادات وقت التشغيل (يُستبدل داخل `dist/` عند البناء — لا تضع أسراراً فيه) |
| `assets/js/forms.js` | طبقة إرسال الطلبات إلى Netlify Forms / Formspree / Supabase، مع مهلة 12 ثانية ورجوع آمن للحفظ المحلي |
| `index.html` (النموذج المخفي) | `data-netlify="true"` بنفس أسماء حقول الطلب لاكتشاف Netlify للنموذج وقت النشر |
| `assets/css/launch.css` | شريط النسخة التجريبية + تنسيق الصفحات القانونية وصفحة 404 |
| `privacy.html` / `terms.html` / `404.html` | صفحات الخصوصية والشروط وصفحة الخطأ (عربي + ملخّص FR/EN) |
| `tools/check.mjs` | فحص آلي: الترجمات، الملفات المفقودة، المعرّفات المكررة، وتطابق حقول Netlify Forms |
| `tools/test-forms.mjs` | 7 اختبارات لطبقة الإرسال لكل مزوّد + الفشل والمهلة (بدون مكتبات ولا إنترنت) |
| `package.json` | `npm run build` · `npm test` · `npm run check` · `npm run serve` |

**تحسينات على الملف الأصلي:** توحيد `canonical` / `hreflang` / JSON-LD / `og:image` / `sitemap.xml` / `robots.txt` على نطاق واحد، إضافة `og:url`، إزالة معرّف `top` المكرر، ربط «شروط الخدمة» بصفحة حقيقية، وإضافة روابط قانونية في الفوتر.

### متغيرات البيئة (تُضبط في لوحة الاستضافة)

| المتغير | الافتراضي | الاستخدام |
|---|---|---|
| `SITE_URL` | `URL` من Netlify / `VERCEL_PROJECT_PRODUCTION_URL` | عنوان الموقع في canonical و sitemap وروابط المشاركة |
| `DEMO_MODE` | `1` | `1` = شريط تنبيه + `noindex` للإعلانات الوهمية · `0` = إطلاق رسمي |
| `FORMS_PROVIDER` | `netlify` على Netlify · `none` محلياً/Vercel | `none` \| `netlify` \| `formspree` \| `supabase` (يُستنتج من الرابط إن لم يُضبط) |
| `FORMS_ENDPOINT` | `/` على Netlify · فارغ في غير ذلك | رابط استقبال الطلبات |
| `FORMS_API_KEY` | فارغ | مفتاح Supabase العام `anon` فقط |

> ⚠️ لا تضع أي مفتاح **سري** في هذه المتغيرات: كلها تُحقن في ملف JavaScript يصل للمتصفح. مفتاح Supabase `anon` عام ومصمّم لذلك، أما `service_role` فلا يُستخدم أبداً هنا.

---

## الخطوة 3 — استقبال طلبات «أضف عقارك» ✅

**تم التنفيذ بلا أي حساب خارجي.** بما أن الاستضافة المختارة هي Netlify، يكتشف `tools/build.mjs` بيئة Netlify ويضبط تلقائياً `FORMS_PROVIDER=netlify` و `FORMS_ENDPOINT=/`. في `index.html` يوجد نموذج ثابت مخفي `data-netlify="true"` بنفس أسماء حقول الطلب (18 حقلاً) ليكتشفه Netlify وقت النشر، و`forms.js` يرسل إليه بصيغة `form-urlencoded` مع `form-name` وحقل مكافحة السبام `bot-field`.

### ما يحدث عند إرسال طلب

1. `app.js` يبني الحمولة ويحفظ نسخة محلية (لمتابعة الحالة داخل نفس المتصفح).
2. `forms.js` ينفّذ `POST /` إلى Netlify Forms بمهلة 12 ثانية.
3. تظهر للمستخدم رسالة **«وصل الطلب إلى فريقنا بنجاح»** مع رقم الطلب وزر واتساب لمشاركة الصور.
4. عند أي فشل (شبكة، خادم، مهلة) **لا يتعطل النموذج**: يُظهر «تعذّر الإرسال — حُفظ الطلب محلياً، أكّده عبر واتساب» ويبقى واتساب متاحاً.

### ما تحتاجه منك بعد أول نشر (دقيقتان فقط)

1. في Netlify: **Forms** → تأكد ظهور النموذج باسم `add-property` بعد اكتمال النشر.
2. **Forms → Form notifications → Add notification → Email** واضبط بريد فريقك لتصلك الطلبات فوراً.
3. أرسل طلباً تجريبياً من الموقع، وتحقق من ظهوره في تبويب **Forms → Submissions** ووصول الإشعار للبريد.

> الحد المجاني لـ Netlify Forms هو **100 طلب/شهرياً لكل موقع**. إن تجاوزته أو أردت مزوّداً مستقلاً عن الاستضافة، استخدم أحد البديلين أدناه.

**الحقول المُرسلة:** `ref, title, deal, type, district, price_djf, nightly_djf, rooms, baths, area, amenities, description, owner_name, owner_phone, photo_count, lang, page_url, submitted_at`.

> **الصور لا تُرسل** عبر أي خدمة نماذج (حجم base64 كبير). تُضغط في متصفح الزائر وتبقى على جهازه، ويظهر له زر واتساب لمشاركتها مع الفريق. هذا موضّح في نص النموذج وسياسة الخصوصية.

### الخيار B — Formspree (مزوّد مستقل)

1. أنشئ حساباً على <https://formspree.io> → **New Form** → انسخ الرابط `https://formspree.io/f/abcdwxyz`.
2. في Netlify: **Site configuration → Environment variables** أضف:
   ```
   FORMS_PROVIDER = formspree
   FORMS_ENDPOINT = https://formspree.io/f/abcdwxyz
   ```
3. أعد النشر (**Deploys → Trigger deploy → Clear cache and deploy**) واختبر إرسال طلب.

> يمكن حذف `FORMS_PROVIDER`: البناء يستنتج `formspree` تلقائياً من أي رابط `https://` غير Supabase.

### الخيار C — Supabase (قاعدة بيانات لاحقاً)

```sql
create table public.submissions (
  id bigint generated always as identity primary key,
  ref text not null,
  title text, deal text, type text, district text,
  price_djf numeric, nightly_djf numeric,
  rooms int, baths int, area int,
  amenities text, description text,
  owner_name text, owner_phone text,
  photo_count int, lang text, page_url text,
  submitted_at timestamptz default now()
);
alter table public.submissions enable row level security;
create policy "anon insert" on public.submissions
  for insert to anon with check (true);
```

ثم اضبط:
```
FORMS_ENDPOINT = https://XXXX.supabase.co/rest/v1/submissions
FORMS_API_KEY  = <anon public key>
```

> البناء يستنتج `supabase` من الرابط. سياسة `insert` فقط: لا يمكن للزائر قراءة طلبات غيره. لا تضف سياسة `select` للـ `anon`، ولا تستخدم `service_role` أبداً في المتصفح.

### ⚠️ إن نشرت على Vercel بدلاً من Netlify

Netlify Forms يعمل على Netlify فقط. على Vercel يضبط البناء `FORMS_PROVIDER=none` تلقائياً، لذا **لا تنسَ** ضبط `FORMS_ENDPOINT` (Formspree أو Supabase) وإلا ستبقى الطلبات محلية فقط. البناء يطبع تحذيراً بذلك.

### التحقق الآلي (لا يحتاج إنترنت ولا مفاتيح)

```bash
npm test              # فحص ثابت + 7 اختبارات لكل مزوّد وفشل الشبكة والمهلة
npm run test:forms    # اختبارات طبقة الإرسال وحدها
```

`tools/check.mjs` يتأكد أيضاً أن كل حقل في `const row` موجود كـ `name` في النموذج المخفي، حتى لا يُسقط Netlify أي بيانات.

---

## الخطوة 4 — المحتوى الحقيقي 👤

كل الإعدادات في `assets/js/data.js`:

- **رقم واتساب الهاتف والبريد والعنوان** ← `SITE_CONFIG`. رقم الواتساب مكتوب أيضاً نصياً في `index.html` — ابحث عن `77 69 02 23` واستبدله في المواضع الستة، وحدّثه أيضاً في `privacy.html` و `terms.html` و JSON-LD في رأس `index.html`.
- **العقارات** ← مصفوفة `PROPERTIES` (السعر بـ DJF، `nightly` للإيجار اليومي، `deal`: `rent | daily | sale`).
- **الأحياء والأنواع والمرافق** ← `DISTRICTS` / `TYPES` / `AMENITIES`.
- **الصور** ← استبدل `assets/img/*.jpg` ونسخ `*-480.webp` / `*-960.webp` بصورك الحقيقية (ويب بي، 1200×900)، أو شغّل `python3 tools/build-images.py` بعد وضع الصور المصدريّة.

> جميع أسماء العقارات والأسعار وأرقام الملاك الحالية **توضيحية**. لا تنشرها كإعلانات حقيقية.

---

## الخطوة 5 — الصفحات القانونية والامتثال 👤

الصفحات جاهزة، لكن استبدل كل عنصر `[بين أقواس]` في `privacy.html` و `terms.html` قبل الإطلاق الرسمي:

- `[اسم الشركة / السجل التجاري]` والترخيص والعنوان والبريد الرسمي
- `[مدة حذف الطلبات]` و `[مدة الرد]` و `[المحكمة المختصة]`

ثم أطفئ جملة «هذا الموقع حالياً نسخة تجريبية» في مربع التنبيه أعلى الصفحتين.

---

## الخطوة 6 — النشر على Netlify 👤

1. تأكد أن العمل على الفرع الصحيح وادفع التغييرات:
   ```bash
   git status
   git push origin arena/fdde5b10-maisonpro
   ```
2. في Netlify: **Add new site → Import an existing project → GitHub → `abdulrahman119/MaisonPRO`**.
3. اختر الفرع `arena/fdde5b10-maisonpro`. لا تعدّل إعدادات البناء: `netlify.toml` يضبط `npm run build` و `publish = dist` تلقائياً.
4. **لا حاجة لأي متغير لاستقبال الطلبات** (الخطوة 3 تعمل تلقائياً). أضف فقط `DEMO_MODE=0` يوم الإطلاق و `SITE_URL` عند ربط الدومين، ثم **Deploy site**.
5. افتح الرابط الذي يعطيك إياه Netlify (مثل `https://maisonpro-dj.netlify.app`) وتحقق من:
   - شريط «نسخة تجريبية» يظهر أعلى الصفحة،
   - `view-source:` يحتوي على canonical و `og:image` بنفس رابط Netlify (لا `maisonpro.dj` ولا `github.io`)،
   - `/robots.txt` و `/sitemap.xml` يعملان،
   - `/admin` يحوّلك إلى `#admin`،
   - تبويب **Forms** في Netlify يعرض النموذج `add-property`،
   - طلب تجريبي من النموذج يظهر في **Forms → Submissions**.

**بديل Vercel:** استورد نفس المستودع؛ `vercel.json` يضبط `npm run build` و `outputDirectory: dist` — ولا تنسَ ضبط `FORMS_ENDPOINT` كما في نهاية الخطوة 3.

---

## الخطوة 7 — الدومين الخاص (لاحقاً) ⏳

1. اشترِ `maisonpro.dj` من مسجّل يدعم نطاق `.dj`.
2. في Netlify: **Domain management → Add custom domain**، ثم اضبط DNS كما يعرضه Netlify (`A` / `ANAME` أو `CNAME` للـ www).
3. فعّل شهادة SSL (تلقائية بعد انتشار DNS، قد يستغرق حتى 24 ساعة).
4. اضبط `SITE_URL = https://maisonpro.dj` في متغيرات البيئة وأعد النشر — سيُحدّث البناء canonical و hreflang و sitemap و og:image وحده، وينشئ `CNAME` تلقائياً.
5. اجعل `https://maisonpro.dj` هو الدومين الأساسي (Primary domain) لتفادي المحتوى المكرر.

---

## الخطوة 8 — قائمة فحص ما قبل الإطلاق

```bash
npm test          # فحص ثابت + اختبارات طبقة النماذج
npm run build     # بناء dist/ وطباعة تقرير الإعدادات
```

- [ ] `npm test` يخرج «✓ كل اختبارات النماذج ناجحة» و «✓ فحص ما قبل الإطلاق ناجح»
- [ ] تقرير البناء يعرض `SITE_URL` الصحيح و `FORMS_PROVIDER = netlify` و `FORMS_ENDPOINT = /`
- [ ] اللغات الثلاث (ar / fr / en) تعمل واتجاه RTL/LTR يتبدّل بشكل صحيح
- [ ] العرض على الجوال (390px) والتابلت والشاشة الكبيرة
- [ ] البحث والفلاتر والترتيب والمفضلة وتحويل العملة
- [ ] رابط `?property=MP-1041` يفتح تفاصيل العقار، و `?type=villa&deal=sale` يطبّق الفلترة
- [ ] كل أزرار واتساب تفتح `wa.me` برقمك الصحيح ورسالة معبّأة
- [ ] إرسال نموذج تجريبي يظهر في **Netlify Forms → Submissions** ويصل إشعار البريد (الخطوة 3)
- [ ] زر «تابع حالة طلبك» يعمل بعد الإرسال
- [ ] صفحات `privacy.html` و `terms.html` و `404.html` تفتح من الفوتر
- [ ] معاينة المشاركة (Facebook / LinkedIn / واتساب) تُظهر العنوان والصورة الصحيحة
- [ ] Lighthouse: أداء ≥ 90، وصولية ≥ 90، SEO ≥ 90 على الجوال
- [ ] **يوم الإطلاق:** `DEMO_MODE = 0` → شريط التنبيه يختفي و `robots` يعود `index,follow`
- [ ] **يوم الإطلاق:** الصفحات القانونية مكتملة البيانات ولا تحمل وسم «نسخة تجريبية»
- [ ] البيانات التجريبية مستبدلة أو مُعلّمة بوضوح

---

## الخطوة 9 — يوم الإطلاق

1. غيّر `DEMO_MODE` إلى `0` وأعد النشر، ثم افتح الموقع في نافذة خاصة وتأكد من اختفاء الشريط.
2. سجّل الموقع في **Google Search Console** وأرسل `https://<دومينك>/sitemap.xml`.
3. تحقق من `robots.txt` ومeta robots بعد النشر (`index,follow` لا `noindex`).
4. انشر الرابط على صفحة فيسبوك/إنستغرام وواتساب الأعمال، واجعل رقم واتساب جاهزاً للرد.
5. راقب أول 48 ساعة: طلبات «أضف عقارك»، أخطاء Console، وروابط معطوبة.

---

## الخطوة 10 — بعد الإطلاق

- جدّث الإعلانات أسبوعياً واحذف المؤجّر/المباع فوراً.
- أضف أداة تحليلات تحترم الخصوصية (Plausible / Umami) وحدّث `privacy.html` و CSP وفقاً لذلك.
- احتفظ بنسخة احتياطية من `data.js` والصور خارج المستودع.
- راقب عدد طلبات Netlify Forms (100/شهر مجاناً) وانتقل إلى Formspree/Supabase عند الاقتراب من الحد.
- **التطوير التالي** عند الحاجة: لوحة إدارة حقيقية على الخادم، رفع صور للسحابة، حسابات ملاك، خريطة أحياء جيبوتي، إشعارات العقارات الجديدة.

---

## قيود معروفة في هذه النسخة

| القيد | الأثر | الحل المقترح |
|---|---|---|
| لوحة الإدارة تعمل داخل متصفح الزائر فقط (الرمز التجريبي `2530`) | لا تُدار الإعلانات مركزياً، وأي زائر يفتحها يرى بياناته المحلية فقط | ربط `MPStore` بـ API حقيقي (الواجهة معزولة في `store.js`) |
| الطلبات تُحفظ محلياً + تُرسل لخدمة النماذج | لا توجد قاعدة بيانات مركزية للإعلانات | Supabase أو backend |
| Netlify Forms: 100 طلب/شهر مجاناً | قد تتوقف الطلبات عند تجاوز الحد | Formspree / Supabase (الخطوة 3) |
| الصور لا تُرفع للخادم | يحتاج الفريق استلامها عبر واتساب | رفع إلى Supabase Storage / Cloudinary |
| لا دفع، لا عقود، لا حسابات | الموقع عرض وتواصل فقط | مرحلة لاحقة |
| الوضع التجريبي يمنع الفهرسة | لا يظهر الموقع في نتائج البحث حتى `DEMO_MODE=0` | مقصود حتى استبدال البيانات |

---

## أوامر سريعة

| الأمر | الغرض |
|---|---|
| `npm run serve` | معاينة محلية على `8080` |
| `npm run check` | فحص ما قبل الإطلاق |
| `npm test` | الفحص الثابت + اختبارات النماذج |
| `npm run test:forms` | اختبارات طبقة الإرسال وحدها |
| `npm run build` | بناء `dist/` الجاهز للنشر |
| `node tools/build.mjs` | نفس البناء مباشرة |
| `git push origin arena/fdde5b10-maisonpro` | دفع التغييرات للفرع الحالي |
