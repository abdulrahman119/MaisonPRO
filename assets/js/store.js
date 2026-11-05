/* =========================================================
   MaisonPRO · store.js
   Single data layer for the whole site.

   Every read/write of listings and submissions goes through
   here. Today it is backed by localStorage; to move to a real
   database later, replace ONLY the four core methods below
   (list, upsert, transition, remove) with fetch() calls — no
   other file needs to change.
   ========================================================= */
(() => {
  'use strict';

  const K_LIST = 'mp:listings:v3';
  const K_SUBS = 'mp:subs:v3';
  const K_FAVS = 'mp:favs:v2';
  const K_SET = 'mp:settings:v1';
  const K_SESS = 'mp:admin:v1';

  /* default moderation code — changeable from the admin panel */
  const DEFAULT_ADMIN_CODE = '2530';

  const read = (k, d) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
  };
  const write = (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
  };

  /* ---------- settings ---------- */
  function settings() {
    const s = read(K_SET, {});
    return {
      adminCode: s.adminCode || DEFAULT_ADMIN_CODE,
      currency: s.currency || 'DJF',
      lang: s.lang || null,
      autoLang: s.autoLang !== false
    };
  }
  function saveSettings(patch) {
    const next = Object.assign(settings(), patch || {});
    write(K_SET, next);
    return next;
  }

  /* ---------- seeds ---------- */
  function seed() {
    const props = (window.PROPERTIES || []).map(p => Object.assign({}, p, {
      status: 'published',
      source: 'seed',
      createdAt: p.createdAt || new Date(Date.now() - (p.postedDays || 0) * 864e5).toISOString(),
      updatedAt: null,
      adminNotes: '',
      rejectReason: ''
    }));

    /* one example submission so the queue is never empty on first open */
    props.push({
      id: 'MP-2001',
      title: { ar: 'استوديو مفروش قرب الشاطئ', fr: 'Studio meublé près de la plage', en: 'Furnished studio near the beach' },
      description: {
        ar: 'استوديو صغير مفروش بالكامل، مناسب لشخص أو شخصين، قريب من الشاطئ ومحطة النقل.',
        fr: 'Petit studio entièrement meublé, idéal pour une ou deux personnes, proche de la plage.',
        en: 'Small fully furnished studio, ideal for one or two people, close to the beach.'
      },
      type: 'studio', deal: 'daily', district: 'heron',
      price: 180000, nightly: 14000,
      rooms: 1, baths: 1, area: 48,
      floor: 2, year: 2021,
      featured: false, isNew: true, postedDays: 0,
      images: ['apt-4', 'kitchen-3'],
      amenities: ['water', 'power', 'ac', 'wifi', 'furnished'],
      owner: { name: 'عبدالله حسن', phone: '25377889900' },
      status: 'pending', source: 'visitor',
      createdAt: new Date().toISOString(), updatedAt: null,
      adminNotes: '', rejectReason: ''
    });

    write(K_LIST, props);
    write(K_SUBS, read(K_SUBS, []));
    return props;
  }

  /* ---------- core API (swap these for a real backend later) ---------- */
  function list() {
    let all = read(K_LIST, null);
    if (!Array.isArray(all)) all = seed();
    return all;
  }
  function save(next) {
    write(K_LIST, next);
    return next;
  }
  function find(id) {
    return list().find(p => p.id === id) || null;
  }
  function upsert(item) {
    const all = list();
    const i = all.findIndex(p => p.id === item.id);
    if (i > -1) all[i] = Object.assign({}, all[i], item, { updatedAt: new Date().toISOString() });
    else all.unshift(item);
    return save(all);
  }
  function transition(id, status, extra) {
    const all = list();
    const p = all.find(x => x.id === id);
    if (!p) return null;
    p.status = status;
    p.updatedAt = new Date().toISOString();
    if (status === 'published') {
      p.publishedAt = p.publishedAt || new Date().toISOString();
      p.isNew = true;
      p.postedDays = 0;
      if (p.rejectReason) p.rejectReason = '';
    }
    if (extra) Object.assign(p, extra);
    save(all);
    return p;
  }
  function remove(id) {
    return save(list().filter(p => p.id !== id));
  }
  function resetDemo() {
    localStorage.removeItem(K_LIST);
    localStorage.removeItem(K_SUBS);
    return list();
  }

  /* ---------- favourites ---------- */
  const favs = () => read(K_FAVS, []);
  const setFavs = (v) => write(K_FAVS, v);

  /* ---------- admin session ---------- */
  const isAdmin = () => read(K_SESS, false) === true;
  const setAdmin = (on) => write(K_SESS, !!on);
  function checkCode(code) {
    return String(code || '').trim() === String(settings().adminCode);
  }

  window.MPStore = {
    list, find, upsert, save, transition, remove, resetDemo,
    favs, setFavs, isAdmin, setAdmin, checkCode,
    settings, saveSettings,
    STATUS: { pending: 'pending', published: 'published', rejected: 'rejected' }
  };
})();
