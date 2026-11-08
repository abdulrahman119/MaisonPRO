/* =========================================================
   MaisonPRO · runtime.js
   إعدادات وقت التشغيل. القيم هنا هي الافتراضية للتطوير المحلي.
   عند النشر، يستبدل tools/build.mjs هذا الملف داخل dist/
   بالقيم القادمة من متغيرات البيئة:
   SITE_URL · DEMO_MODE · FORMS_PROVIDER · FORMS_ENDPOINT · FORMS_API_KEY
   لا تضع أي مفاتيح سرية هنا: هذا ملف يُحمّل في المتصفح.
   ========================================================= */
window.MP_RUNTIME_CONFIG = {
  demoMode: true,
  forms: { provider: 'none', endpoint: '', apiKey: '' }
};
