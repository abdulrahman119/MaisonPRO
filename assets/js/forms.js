/* =========================================================
   MaisonPRO · forms.js
   طبقة إرسال طلبات «أضف عقارك» إلى خدمة استقبال.

   لا يحتوي هذا الملف على أي مفتاح أو رابط حساس: يُقرأ الإعداد من
   SITE_CONFIG.forms (الذي يولّده tools/build.mjs وقت النشر).
   الصور لا تُرسل هنا (base64 قد يتجاوز حدود الخدمة) — تبقى في
   متصفح الزائر وتُرسل عبر واتساب. راجع LAUNCH.md.

   المزوّدون المدعومون:
     netlify   : POST / بصيغة form-urlencoded + form-name  (مدمج في الاستضافة، بلا حساب خارجي)
     formspree : https://formspree.io/f/XXXXXX             (JSON بسيط)
     supabase  : https://XXXX.supabase.co/rest/v1/... + anon key
     none      : حفظ محلي فقط + واتساب (التطوير المحلي / Vercel بدون إعداد)

   في كل الحالات تُرجع الدالة نتيجة ولا ترمي استثناءً، كي لا يتعطل
   النموذج عند انقطاع الشبكة: يعود إلى الحفظ المحلي + واتساب.
   ========================================================= */
(() => {
  'use strict';

  const cfg = (window.SITE_CONFIG && window.SITE_CONFIG.forms) || {};
  const provider = cfg.provider || 'none';
  const FORM_NAME = 'add-property'; /* يجب أن يطابق name في النموذج المخفي بـ index.html */

  function enabled() {
    return provider !== 'none' && !!cfg.endpoint;
  }

  async function send(row) {
    if (!enabled()) return { ok: false, mode: 'local' };

    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 12000) : null;

    try {
      const headers = { Accept: 'application/json' };
      let payload;
      let body;

      if (provider === 'netlify') {
        /* Netlify Forms: يكتشف الحقول من HTML الثابت، ويحتاج form-name */
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        const params = new URLSearchParams();
        params.set('form-name', FORM_NAME);
        params.set('bot-field', '');
        Object.keys(row).forEach(k => params.set(k, row[k] == null ? '' : String(row[k])));
        body = params.toString();
      } else if (provider === 'supabase') {
        headers['Content-Type'] = 'application/json';
        headers.apikey = cfg.apiKey || '';
        headers.Authorization = 'Bearer ' + (cfg.apiKey || '');
        headers.Prefer = 'return=minimal';
        payload = row; /* أعمدة الجدول مطابقة لمفاتيح الصف */
        body = JSON.stringify(payload);
      } else {
        /* formspree / أي خدمة تقبل JSON */
        headers['Content-Type'] = 'application/json';
        payload = Object.assign(
          { _subject: 'MaisonPRO · طلب إضافة عقار ' + row.ref },
          row
        );
        body = JSON.stringify(payload);
      }

      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        mode: 'cors',
        headers,
        body,
        signal: ctrl ? ctrl.signal : undefined
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      return { ok: true, mode: provider };
    } catch (e) {
      return { ok: false, mode: 'error', error: String((e && e.message) || e) };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  window.MPForms = { enabled, send, provider, formName: FORM_NAME };
})();
