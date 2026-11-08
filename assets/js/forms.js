/* =========================================================
   MaisonPRO · forms.js
   طبقة إرسال طلبات «أضف عقارك» إلى خدمة خارجية.

   لا يحتوي هذا الملف على أي مفتاح أو رابط حساس: يُقرأ الإعداد من
   SITE_CONFIG.forms (الذي يولّده tools/build.mjs وقت النشر).
   الصور لا تُرسل هنا (base64 قد يتجاوز حدود الخدمة) — تبقى في
   متصفح الزائر وتُرسل عبر واتساب. راجع LAUNCH.md.

   المزوّدون المدعومون:
     formspree : https://formspree.io/f/XXXXXX   (JSON بسيط)
     supabase  : https://XXXX.supabase.co/rest/v1/submissions + anon key
     none      : حفظ محلي فقط + واتساب (الوضع التجريبي)
   ========================================================= */
(() => {
  'use strict';

  const cfg = (window.SITE_CONFIG && window.SITE_CONFIG.forms) || {};
  const provider = cfg.provider || 'none';

  function enabled() {
    return provider !== 'none' && !!cfg.endpoint;
  }

  async function send(row) {
    if (!enabled()) return { ok: false, mode: 'local' };

    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 12000) : null;

    try {
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
      let body = Object.assign({ _subject: 'MaisonPRO · طلب إضافة عقار ' + row.ref }, row);

      if (provider === 'supabase') {
        headers.apikey = cfg.apiKey || '';
        headers.Authorization = 'Bearer ' + (cfg.apiKey || '');
        headers.Prefer = 'return=minimal';
        body = row; /* أعمدة الجدول مطابقة لمفاتيح الصف */
      }

      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        mode: 'cors',
        headers,
        body: JSON.stringify(body),
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

  window.MPForms = { enabled, send, provider };
})();
