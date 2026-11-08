/* =========================================================
   MaisonPRO · app.js — vanilla JS, no dependencies
   ========================================================= */
(() => {
  'use strict';

  const CFG = window.SITE_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const RATE = CFG.djfPerUsd || 177.721;
  const RATE_EUR = CFG.djfPerEur || 192.5;
  const nf = new Intl.NumberFormat('en-US');
  const KEY_FAV = 'mp:favs:v2';
  const ST = window.MPStore;

  /* ---------- helpers ---------- */
  const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const num = (n) => nf.format(Math.round(n || 0));
  const img = (name, w = 480) => /^(data:|https?:)/.test(name) ? name : `assets/img/${name}-${w}.webp`;
  const imgSet = (name) => `${img(name, 480)} 480w, ${img(name, 960)} 960w`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  /* ---------- state ---------- */
  const S = {
    deal: 'all', type: 'all', district: 'all',
    budget: 0, beds: 0, q: '', sort: 'newest',
    cur: 'DJF', favsOnly: false, shown: CFG.pageSize || 6
  };

  let LIST = [];
  let FAVS = store.get(KEY_FAV, []);
  let lastFocus = null;
  let openId = null;
  let galIdx = 0;
  let galImgs = [];

  /* ---------- prices ---------- */
  function priceOf(p) {
    if (S.deal === 'daily' && p.nightly) return p.nightly;
    return p.price;
  }
  function fmt(n) {
    return S.cur === 'USD' ? '$' + num(n / RATE) : num(n) + ' DJF';
  }
  function money(n) {
    if (S.cur === 'USD') return { v: '$' + nf.format(Math.round(n / RATE)), c: '' };
    if (S.cur === 'EUR') return { v: '\u20ac' + nf.format(Math.round(n / RATE_EUR)), c: '' };
    return { v: num(n), c: 'DJF' };
  }
  function alt(n) {
    if (S.cur === 'USD') return '\u20ac' + nf.format(Math.round(n / RATE_EUR)) + ' \u00b7 ' + num(n) + ' DJF';
    if (S.cur === 'EUR') return '$' + nf.format(Math.round(n / RATE)) + ' \u00b7 ' + num(n) + ' DJF';
    return '$' + nf.format(Math.round(n / RATE)) + ' \u00b7 \u20ac' + nf.format(Math.round(n / RATE_EUR));
  }
  function unitLabel(p) {
    if (p.deal === 'rent') return t('perMonth');
    if (p.deal === 'daily') return t('perNight');
    return t('total');
  }
  function dealWord(p) {
    return p.deal === 'rent' ? t('tagRent') : p.deal === 'daily' ? t('tagDaily') : t('tagSale');
  }

  /* ---------- whatsapp ---------- */
  function waLink(msg) {
    const phone = String(CFG.whatsapp || '').replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }
  function propertyMsg(p) {
    return t('waProperty', {
      title: loc(p.title),
      id: p.id,
      district: districtName(p.district),
      deal: dealWord(p),
      price: fmt(priceOf(p)) + (p.deal === 'sale' ? '' : ' ' + unitLabel(p))
    });
  }
  function hydrateWa() {
    $$('.js-wa').forEach(a => {
      a.href = waLink(t('waGeneral'));
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }

  /* ---------- toast ---------- */
  const ICONS = {
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>',
    err: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.01"/></svg>'
  };
  function toast(msg, type = 'ok') {
    const box = $('#toasts');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML = (ICONS[type] || ICONS.ok) + '<span>' + esc(msg) + '</span>';
    box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 220); }, 2800);
  }

  /* ---------- options ---------- */
  function fill(sel, items, headValue, headLabel, current) {
    if (!sel) return;
    sel.innerHTML = (headLabel !== null ? `<option value="${headValue}">${esc(headLabel)}</option>` : '')
      + items.map(o => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('');
    if (current != null && [...sel.options].some(o => o.value === String(current))) sel.value = String(current);
  }

  function fillOptions() {
    fill($('#f-type'), TYPES.map(x => ({ value: x.id, label: loc(x) })), 'all', t('typeAll'), S.type);
    fill($('#f-district'), DISTRICTS.map(d => ({ value: d.id, label: loc(d) })), 'all', t('districtAll'), S.district);
    fill($('#f-sort'), [
      { value: 'newest', label: t('sortNew') },
      { value: 'price-asc', label: t('sortLow') },
      { value: 'price-desc', label: t('sortHigh') },
      { value: 'area', label: t('sortArea') }
    ], null, null, S.sort);
    fill($('#o-type'), TYPES.map(x => ({ value: x.id, label: loc(x) })), null, null, null);
    fill($('#o-district'), DISTRICTS.map(d => ({ value: d.id, label: loc(d) })), null, null, null);

    /* budget presets adapt to the deal type */
    const presets = S.deal === 'sale'
      ? [20000000, 40000000, 60000000, 80000000]
      : S.deal === 'daily'
        ? [8000, 15000, 25000, 40000]
        : [150000, 300000, 500000, 800000];
    const sel = $('#f-budget');
    if (sel) {
      const cur = S.budget;
      sel.innerHTML = `<option value="0">${esc(t('budgetAll'))}</option>`
        + presets.map(v => `<option value="${v}">\u2264 ${esc(money(v).c ? num(v) + ' DJF' : money(v).v)}</option>`).join('');
      sel.value = String(cur);
      if (!sel.value) sel.value = '0';
    }

    /* footer types + areas */
    const ft = $('#footer-types');
    if (ft) ft.innerHTML = TYPES.map(x =>
      `<li><a href="#properties" data-type-link="${esc(x.id)}">${esc(loc(x))}</a></li>`).join('');

    const areas = $('#areas-list');
    if (areas) areas.innerHTML = DISTRICTS.map(d => {
      const n = LIST.filter(p => p.district === d.id).length;
      return `<button type="button" class="chip" data-area="${esc(d.id)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        ${esc(loc(d))}<b>${n}</b></button>`;
    }).join('');

    /* amenity picker */
    const am = $('#amens');
    if (am) am.innerHTML = Object.keys(AMENITIES).map(k => {
      const on = selectedAmens.has(k);
      return `<button type="button" class="amen-chip${on ? ' is-on' : ''}" data-amen="${esc(k)}" aria-pressed="${on}">${esc(amenityName(k))}</button>`;
    }).join('');
  }

  /* ---------- filtering ---------- */
  function match(p) {
    if (S.favsOnly && !FAVS.includes(p.id)) return false;
    if (S.deal !== 'all') {
      if (S.deal === 'daily' ? !(p.deal === 'daily' || (p.deal === 'rent' && p.nightly)) : p.deal !== S.deal) return false;
    }
    if (S.type !== 'all' && p.type !== S.type) return false;
    if (S.district !== 'all' && p.district !== S.district) return false;
    if (S.beds && (p.rooms || 0) < S.beds) return false;
    if (S.budget) {
      if ((S.deal === 'daily' ? (p.nightly || p.price) : p.price) > S.budget) return false;
    }
    if (S.q) {
      const hay = [
        p.id, loc(p.title), p.title.ar, p.title.fr, p.title.en,
        p.description ? loc(p.description) : '',
        districtName(p.district), typeName(p.type)
      ].join(' ').toLowerCase();
      if (!hay.includes(S.q.toLowerCase())) return false;
    }
    return true;
  }
  function sortList(a) {
    const arr = a.slice();
    if (S.sort === 'price-asc') return arr.sort((x, y) => priceOf(x) - priceOf(y));
    if (S.sort === 'price-desc') return arr.sort((x, y) => priceOf(y) - priceOf(x));
    if (S.sort === 'area') return arr.sort((x, y) => (y.area || 0) - (x.area || 0));
    return arr.sort((x, y) => (x.postedDays || 0) - (y.postedDays || 0));
  }
  const filtered = () => sortList(LIST.filter(match));

  /* ---------- card ---------- */
  function card(p) {
    const imgs = p.images && p.images.length ? p.images : ['villa-2'];
    const fav = FAVS.includes(p.id);
    const tags = [
      `<span class="tag tag--${p.deal}">${esc(dealWord(p))}</span>`,
      p.isNew ? `<span class="tag tag--new">${esc(t('tagNew'))}</span>` : '',
      p.featured ? `<span class="tag tag--feat">${esc(t('tagFeat'))}</span>` : ''
    ].join('');

    return `
<article class="card" data-id="${esc(p.id)}">
  <div class="card-media">
    <img src="${esc(img(imgs[0]))}" srcset="${esc(imgSet(imgs[0]))}" sizes="(max-width:640px) 160px, (max-width:1080px) 46vw, 340px"
         alt="${esc(loc(p.title))}" loading="lazy" decoding="async" width="480" height="360" />
    <div class="card-tags">${tags}</div>
    <button class="card-fav${fav ? ' is-on' : ''}" type="button" data-fav="${esc(p.id)}"
            aria-pressed="${fav}" aria-label="${esc(fav ? t('toastFavRemove') : t('toastFavAdd'))}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.8 1.1-1.1a5.5 5.5 0 0 0-.1-7.7Z"/></svg>
    </button>
  </div>
  <div class="card-body">
    <span class="card-loc">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      ${esc(districtName(p.district))}
    </span>
    <h3 class="card-title">${esc(loc(p.title))}</h3>
    <div class="card-specs">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/></svg>${esc(p.rooms === 1 ? t('cRooms1') : t('cRooms', { n: p.rooms }))}</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M6 19v2M18 19v2"/></svg>${esc(p.baths === 1 ? t('cBaths1') : t('cBaths', { n: p.baths }))}</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M9 4v16M4 9h16"/></svg>${esc(t('cArea', { n: num(p.area) }))}</span>
    </div>
    <div class="card-foot">
      <div class="price">
        <div class="p">${esc(money(priceOf(p)).v)}<small>${esc(money(priceOf(p)).c)}</small></div>
        <div class="s">${esc(unitLabel(p))}</div>
      </div>
      <div class="card-cta">
        <button class="btn btn--ghost" type="button" data-detail="${esc(p.id)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></svg>
          <span>${esc(t('details'))}</span>
        </button>
        <a class="btn btn--wa" href="${esc(waLink(propertyMsg(p)))}" target="_blank" rel="noopener noreferrer"
           aria-label="WhatsApp — ${esc(loc(p.title))}">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.41Z"/></svg>
        </a>
      </div>
    </div>
  </div>
</article>`;
  }

  function emptyBox() {
    const favMode = S.favsOnly;
    return `<div class="empty">
      <div class="empty-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        ${favMode ? '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.8 1.1-1.1a5.5 5.5 0 0 0-.1-7.7Z"/>' : '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'}
      </svg></div>
      <h3>${esc(favMode ? t('favEmptyTitle') : t('emptyTitle'))}</h3>
      <p>${esc(favMode ? t('favEmptyText') : t('emptyText'))}</p>
      <button class="btn btn--ghost" type="button" data-reset>${esc(t('emptyBtn'))}</button>
    </div>`;
  }

  /* ---------- render ---------- */
  function render() {
    const grid = $('#grid');
    if (!grid) return;
    const all = filtered();
    const list = all.slice(0, S.shown);

    grid.innerHTML = list.length ? list.map(card).join('') : emptyBox();

    const rc = $('#result-count');
    if (rc) {
      let s = all.length === 0 ? t('countNone')
        : all.length === 1 ? t('countOne')
        : t('countAll', { n: num(all.length) });
      if (all.length > list.length) s += ` · ${esc(t('countShown', { a: list.length, b: all.length }))}`;
      rc.innerHTML = s;
    }

    const more = $('#more-wrap');
    if (more) more.hidden = all.length <= S.shown;

    const fc = $('#fav-count');
    if (fc) fc.textContent = FAVS.length;

    const sc = $('#stat-count');
    if (sc) sc.textContent = LIST.length;

    renderPills();
    syncUI();
  }

  function renderPills() {
    const box = $('#pills');
    if (!box) return;
    const out = [];
    const pill = (label, key) => `<span class="pill">${esc(label)}
      <button type="button" data-pill="${key}" aria-label="${esc(t('resetAll'))}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button></span>`;

    if (S.deal !== 'all') out.push(pill(t(S.deal === 'rent' ? 'dealRent' : S.deal === 'daily' ? 'dealDaily' : 'dealSale'), 'deal'));
    if (S.type !== 'all') out.push(pill(typeName(S.type), 'type'));
    if (S.district !== 'all') out.push(pill(districtName(S.district), 'district'));
    if (S.beds) out.push(pill(S.beds + '+ ' + t('roomsLabel'), 'beds'));
    if (S.budget) out.push(pill('≤ ' + fmt(S.budget), 'budget'));
    if (S.q) out.push(pill('“' + S.q + '”', 'q'));
    if (S.favsOnly) out.push(pill(t('favorites'), 'favs'));
    box.innerHTML = out.join('');
  }

  function syncUI() {
    $$('[data-deal]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.deal === S.deal)));
    const set = (sel, v) => { const el = $(sel); if (el && el.value !== String(v)) el.value = String(v); };
    set('#f-type', S.type);
    set('#f-district', S.district);
    set('#f-sort', S.sort);
    set('#f-budget', S.budget);
    set('#f-beds', S.beds);
    $$('[data-cur]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cur === S.cur)));
    const ft = $('#fav-toggle');
    if (ft) { ft.classList.toggle('is-on', S.favsOnly); ft.setAttribute('aria-pressed', String(S.favsOnly)); }
    $$('.chip[data-quick]').forEach(c => c.classList.remove('is-on'));
  }

  function reset(silent) {
    Object.assign(S, { deal: 'all', type: 'all', district: 'all', budget: 0, beds: 0, q: '', sort: 'newest', favsOnly: false, shown: CFG.pageSize || 6 });
    const s = $('#f-search'); if (s) s.value = '';
    fillOptions();
    render();
    if (!silent) toast(t('toastReset'), 'info');
  }

  /* ---------- detail modal ---------- */
  const find = (id) => LIST.find(p => p.id === id);

  function spec(icon, label, value, ltr) {
    return `<div class="spec"><span class="ic">${icon}</span><span>
      <small>${esc(label)}</small>
      <strong${ltr ? ' dir="ltr" style="display:inline-block"' : ''}>${esc(value)}</strong>
    </span></div>`;
  }

  function renderDetail(p) {
    const box = $('#modal-body');
    if (!box) return;
    if (!p) { box.innerHTML = `<div class="detail"><p>${esc(t('notFound'))}</p></div>`; return; }

    galImgs = p.images && p.images.length ? p.images : ['villa-2'];
    galIdx = 0;
    openId = p.id;

    const all = p.amenities || [];
    const keys = all.filter(a => AMENITIES[a] && AMENITIES[a].key);
    const rest = all.filter(a => !keys.includes(a));
    const amenHtml = (arr, cls) => arr.map(a =>
      `<span class="amen ${cls || ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>${esc(amenityName(a))}</span>`).join('');

    const specs = [
      spec('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/></svg>', t('sRooms'), num(p.rooms)),
      spec('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M6 19v2M18 19v2"/></svg>', t('sBaths'), num(p.baths)),
      spec('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 4v16M4 9h16"/></svg>', t('sArea'), num(p.area) + ' m²', true),
      p.floor ? spec('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M4 4h16v16"/><path d="M8 16v-4h4"/></svg>', t('sFloor'), String(p.floor), true) : '',
      p.year ? spec('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>', t('sYear'), String(p.year), true) : '',
      spec('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/></svg>', t('sType'), typeName(p.type))
    ].filter(Boolean).join('');

    const tags = `<span class="tag tag--${p.deal}">${esc(dealWord(p))}</span>`
      + (p.isNew ? `<span class="tag tag--new">${esc(t('tagNew'))}</span>` : '')
      + (p.featured ? `<span class="tag tag--feat">${esc(t('tagFeat'))}</span>` : '');

    const initial = (p.owner && p.owner.name ? p.owner.name.trim()[0] : 'M').toUpperCase();

    box.innerHTML = `
<div class="gal">
  <div class="gal-main">
    <img id="gal-img" src="${esc(img(galImgs[0], 960))}" alt="${esc(loc(p.title))}" />
    ${galImgs.length > 1 ? `
      <button class="gal-nav prev" type="button" data-gal="-1" aria-label="prev">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
      <button class="gal-nav next" type="button" data-gal="1" aria-label="next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>` : ''}
    <span class="gal-count" id="gal-count" dir="ltr">1 / ${galImgs.length}</span>
  </div>
  ${galImgs.length > 1 ? `<div class="gal-thumbs" id="gal-thumbs">${galImgs.map((im, i) =>
    `<button type="button" data-thumb="${i}" class="${i === 0 ? 'is-on' : ''}" aria-label="${esc(t('photos', { n: i + 1 }))}"><img src="${esc(img(im, 480))}" alt="" loading="lazy" /></button>`).join('')}</div>` : ''}
</div>

<div class="detail">
  <div class="detail-top">
    <div style="min-width:0">
      <div class="detail-tags">${tags}</div>
      <h2 id="modal-title">${esc(loc(p.title))}</h2>
      <span class="detail-loc">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        ${esc(districtName(p.district))} · ${esc(t('sRef'))} ${esc(p.id)}
      </span>
    </div>
    <div class="detail-price">
      <div class="p">${esc(money(priceOf(p)).v)}<small>${esc(money(priceOf(p)).c)}</small></div>
      <div class="s">${esc(unitLabel(p))}</div>
      <div class="s">${esc(alt(priceOf(p)))}</div>
    </div>
  </div>

  <div class="specs">${specs}</div>

  <div class="d-block">
    <h4>${esc(t('overview'))}</h4>
    <p>${esc(loc(p.description))}</p>
  </div>

  ${keys.length ? `<div class="d-block">
    <h4>${esc(t('essentials'))}</h4>
    <div class="amen-list">${amenHtml(keys, 'amen--key')}</div>
  </div>` : ''}

  ${rest.length ? `<div class="d-block">
    <h4>${esc(t('amenitiesH'))}</h4>
    <div class="amen-list">${amenHtml(rest)}</div>
  </div>` : ''}

  <div class="d-block">
    <h4>${esc(t('location'))}</h4>
    <p>${esc(districtName(p.district))}, ${esc(getLang() === 'ar' ? CFG.addressAr : CFG.addressFr)}</p>
  </div>

  <div class="agent">
    <span class="av">${esc(initial)}</span>
    <span>
      <strong>${esc(p.owner ? p.owner.name : CFG.brand)}</strong>
      <small>${esc(t('agentRole'))} · MaisonPRO</small>
    </span>
    <span class="on"><i></i>${esc(t('available'))}</span>
  </div>

  <div class="d-actions">
    <a class="btn btn--wa" href="${esc(waLink(propertyMsg(p)))}" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.41Z"/></svg>
      <span>${esc(t('contactWhatsapp'))}</span>
    </a>
    <a class="btn btn--ghost" href="tel:${esc(String(p.owner ? p.owner.phone : CFG.whatsapp).replace(/\D/g, ''))}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 1 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2Z"/></svg>
      <span>${esc(t('call'))}</span>
    </a>
    <button class="btn btn--ghost" type="button" id="share-btn" aria-label="${esc(t('share'))}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
    </button>
  </div>
</div>`;
  }

  function galTo(i) {
    if (!galImgs.length) return;
    galIdx = (i + galImgs.length) % galImgs.length;
    const im = $('#gal-img');
    if (im) im.src = img(galImgs[galIdx], 960);
    const c = $('#gal-count');
    if (c) { c.dir = 'ltr'; c.textContent = `${galIdx + 1} / ${galImgs.length}`; }
    $$('#gal-thumbs button').forEach((b, i2) => b.classList.toggle('is-on', i2 === galIdx));
  }

  function openDetail(id) {
    const p = find(id);
    if (!p) return;
    lastFocus = document.activeElement;
    renderDetail(p);
    const m = $('#modal');
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const boxEl = m.querySelector('.modal-box');
    if (!boxEl.hasAttribute('tabindex')) boxEl.setAttribute('tabindex', '-1');
    setTimeout(() => boxEl.focus({ preventScroll: true }), 80);
    try { history.replaceState({}, '', '?property=' + id); } catch (e) {}
  }
  function closeDetail() {
    const m = $('#modal');
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    openId = null;
    if (lastFocus && lastFocus.focus) { lastFocus.focus({ preventScroll: true }); lastFocus = null; }
    try {
      const u = new URL(location.href);
      if (u.searchParams.has('property')) { u.searchParams.delete('property'); history.replaceState({}, '', u); }
    } catch (e) {}
  }

  /* ---------- favourites ---------- */
  function toggleFav(id) {
    const i = FAVS.indexOf(id);
    if (i > -1) { FAVS.splice(i, 1); toast(t('toastFavRemove'), 'info'); }
    else { FAVS.push(id); toast(t('toastFavAdd'), 'ok'); }
    store.set(KEY_FAV, FAVS);
    render();
  }

  /* ---------- add form ---------- */
  let photos = [];
  const selectedAmens = new Set();

  function compress(file, maxW = 1000, q = 0.72) {
    return new Promise((res, rej) => {
      if (!file.type.startsWith('image/')) return rej(new Error('type'));
      const r = new FileReader();
      r.onerror = () => rej(new Error('read'));
      r.onload = e => {
        const im = new Image();
        im.onerror = () => rej(new Error('decode'));
        im.onload = () => {
          let { width: w, height: h } = im;
          if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
          ctx.drawImage(im, 0, 0, w, h);
          res(c.toDataURL('image/jpeg', q));
        };
        im.src = e.target.result;
      };
      r.readAsDataURL(file);
    });
  }

  function renderThumbs() {
    const box = $('#thumbs');
    if (!box) return;
    box.innerHTML = photos.map((src, i) => `
      <div class="thumb">
        <img src="${esc(src)}" alt="" />
        <button type="button" data-del="${i}" aria-label="${esc(t('close'))}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>`).join('');
  }

  async function addFiles(files) {
    for (const f of Array.from(files || [])) {
      if (photos.length >= (CFG.maxImages || 6)) { toast(t('toastMaxImg'), 'err'); break; }
      try { photos.push(await compress(f)); } catch (e) { toast(t('toastImgErr'), 'err'); }
    }
    renderThumbs();
  }

  function fieldErr(id, on) {
    const el = document.getElementById(id);
    if (!el) return;
    const wrap = id === 'o-terms' ? el.closest('.check') : (el.closest('.field') || el.parentElement);
    if (wrap) wrap.classList.toggle('has-err', !!on);
    el.setAttribute('aria-invalid', on ? 'true' : 'false');
  }

  function validate() {
    const checks = [
      ['o-name', $('#o-name').value.trim() !== ''],
      ['o-phone', $('#o-phone').value.replace(/\D/g, '').length >= 8],
      ['o-title', $('#o-title').value.trim() !== ''],
      ['o-price', Number($('#o-price').value) > 0],
      ['o-terms', $('#o-terms').checked]
    ];
    let first = null;
    checks.forEach(([id, ok]) => {
      fieldErr(id, !ok);
      if (!ok && !first) first = document.getElementById(id);
    });
    if (first) { first.focus({ preventScroll: true }); first.scrollIntoView({ block: 'center' }); }
    return !first;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) { toast(t('toastFix'), 'err'); return; }

    const deal = $('#o-deal').value;
    const title = $('#o-title').value.trim();
    const price = Number($('#o-price').value) || 0;
    const nightly = Number($('#o-nightly').value) || 0;
    const district = $('#o-district').value;
    const p = {
      id: 'MP-' + (2000 + Math.floor(Math.random() * 7999)),
      title: { ar: title, fr: title, en: title },
      description: { ar: $('#o-desc').value.trim(), fr: $('#o-desc').value.trim(), en: $('#o-desc').value.trim() },
      type: $('#o-type').value, deal, district,
      price, nightly,
      rooms: Number($('#o-rooms').value) || 1,
      baths: Number($('#o-baths').value) || 1,
      area: Number($('#o-area').value) || 0,
      floor: null, year: new Date().getFullYear(),
      featured: false, isNew: true, postedDays: 0,
      images: photos.length ? photos.slice(0, 4) : ['villa-2'],
      amenities: [...selectedAmens],
      owner: { name: $('#o-name').value.trim(), phone: $('#o-phone').value.replace(/\D/g, '') },
      submitted: true
    };

    p.status = 'pending';
    p.source = 'visitor';
    p.createdAt = new Date().toISOString();
    p.updatedAt = null;
    p.adminNotes = '';
    p.rejectReason = '';

    /* ----- إرسال الطلب إلى خدمة النماذج (إن ضُبطت) -----
       الصور لا تُرسل: تبقى في المتصفح وتُشارك عبر واتساب. */
    const btn = $('#submit-btn');
    const btnLabel = btn ? btn.querySelector('[data-i18n="submit"]') : null;
    if (btn) { btn.disabled = true; if (btnLabel) btnLabel.textContent = t('formSending'); }

    const row = {
      ref: p.id,
      title,
      deal,
      type: p.type,
      district,
      price_djf: price,
      nightly_djf: nightly,
      rooms: p.rooms,
      baths: p.baths,
      area: p.area,
      amenities: p.amenities.join(', '),
      description: p.description.ar,
      owner_name: p.owner.name,
      owner_phone: p.owner.phone,
      photo_count: photos.length,
      lang: window.getLang ? window.getLang() : 'ar',
      page_url: location.href.split('#')[0],
      submitted_at: p.createdAt
    };
    const delivery = window.MPForms
      ? await window.MPForms.send(row)
      : { ok: false, mode: 'local' };

    if (btn) { btn.disabled = false; if (btnLabel) btnLabel.textContent = t('submit'); }
    p.delivery = delivery.mode;

    /* نسخة محلية دائماً: تسمح بمتابعة الطلب داخل نفس المتصفح */
    if (ST) ST.upsert(p);
    fillOptions();
    render();

    $('#add-form').style.display = 'none';
    $('#success').classList.add('is-on');
    const refEl = $('#success-ref');
    if (refEl) refEl.textContent = p.id;
    if (window.MPAdmin) MPAdmin.render();
    if (delivery.ok) toast(t('toastSentRemote'), 'ok');
    else if (delivery.mode === 'local') toast(t('toastSentLocal'), 'ok');
    else toast(t('toastSendFail'), 'err');

    const msg = [
      'طلب إضافة عقار / Nouvelle annonce',
      '',
      '🏠 ' + title,
      '🔖 ' + p.id,
      '📍 ' + districtName(district) + ' — ' + dealWord(p),
      '💰 ' + fmt(price) + (deal === 'sale' ? '' : ' ' + unitLabel(p)),
      nightly ? '🌙 ' + num(nightly) + ' DJF' : '',
      '👤 ' + p.owner.name + ' — ' + $('#o-phone').value.trim()
    ].filter(Boolean).join('\n');

    $$('[data-wa="success"]').forEach(a => { a.href = waLink(msg); a.target = '_blank'; a.rel = 'noopener noreferrer'; });
    $('#add-property').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetForm() {
    $('#add-form').reset();
    photos = [];
    selectedAmens.clear();
    $$('#amens .amen-chip').forEach(c => { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
    $$('.has-err').forEach(el => el.classList.remove('has-err'));
    renderThumbs();
    $('#add-form').style.display = '';
    $('#success').classList.remove('is-on');
    $('#o-price-usd').value = '';
  }

  /* ---------- modal / drawer helpers ---------- */
  function openDrawer() {
    const d = $('#drawer');
    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    $('#burger').setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    const d = $('#drawer');
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    const b = $('#burger');
    if (b) b.setAttribute('aria-expanded', 'false');
    if (!$('#modal').classList.contains('is-open')) document.body.style.overflow = '';
  }

  /* ---------- bind ---------- */
  function bind() {
    /* header shadow */
    const header = $('#header');
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        header.classList.toggle('is-stuck', window.scrollY > 4);
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* language */
    const langBtn = $('#lang-btn');
    const langMenu = $('#lang-menu');
    const closeLang = () => { langMenu.hidden = true; langBtn.setAttribute('aria-expanded', 'false'); };
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = langMenu.hidden;
      langMenu.hidden = !open;
      langBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => { if (!e.target.closest('#lang-btn, #lang-menu')) closeLang(); });

    $$('[data-lang]').forEach(b => b.addEventListener('click', () => {
      if (!b.classList.contains('lang-opt')) return;   /* ignore body[data-lang] inheritance */
      applyLang(b.dataset.lang);
      closeLang();
      closeDrawer();
    }));

    /* drawer */
    $('#burger').addEventListener('click', openDrawer);
    $$('[data-close-drawer]').forEach(el => el.addEventListener('click', closeDrawer));
    $$('#drawer a[href^="#"]').forEach(a => a.addEventListener('click', closeDrawer));

    /* search panel */
    $$('[data-deal]').forEach(b => b.addEventListener('click', () => {
      S.deal = b.dataset.deal;
      S.budget = 0;
      S.shown = CFG.pageSize || 6;
      fillOptions();
      render();
      $('#properties').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

    $('#f-type').addEventListener('change', e => { S.type = e.target.value; S.shown = CFG.pageSize || 6; render(); });
    $('#f-district').addEventListener('change', e => { S.district = e.target.value; S.shown = CFG.pageSize || 6; render(); });
    $('#f-budget').addEventListener('change', e => { S.budget = Number(e.target.value) || 0; S.shown = CFG.pageSize || 6; render(); });
    $('#f-beds').addEventListener('change', e => { S.beds = Number(e.target.value) || 0; S.shown = CFG.pageSize || 6; render(); });
    $('#f-sort').addEventListener('change', e => { S.sort = e.target.value; render(); });
    $('#f-search').addEventListener('input', e => { S.q = e.target.value; S.shown = CFG.pageSize || 6; render(); });

    $('#search-form').addEventListener('submit', e => {
      e.preventDefault();
      $('#properties').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#toggle-extra').addEventListener('click', e => {
      const extra = $('#search-extra');
      const open = extra.hidden;
      extra.hidden = !open;
      e.currentTarget.setAttribute('aria-expanded', String(open));
    });

    $$('[data-quick]').forEach(b => b.addEventListener('click', () => {
      const [a, deal] = b.dataset.quick.split('|');
      S.deal = deal; S.budget = 0; S.beds = 0;
      if (TYPES.some(x => x.id === a)) { S.type = a; S.district = 'all'; }
      else { S.district = a; S.type = 'all'; }
      S.favsOnly = false;
      S.shown = CFG.pageSize || 6;
      fillOptions(); render();
      $$('.chip[data-quick]').forEach(c => c.classList.remove('is-on'));
      b.classList.add('is-on');
      $('#properties').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

    /* toolbar */
    $$('[data-cur]').forEach(b => b.addEventListener('click', () => {
      S.cur = b.dataset.cur;
      try { localStorage.setItem('mp:cur', S.cur); } catch (e) {}
      document.documentElement.dataset.currency = S.cur;
      fillOptions();
      render();
      if (openId) { const p = find(openId); if (p) renderDetail(p); }
    }));

    $('#fav-toggle').addEventListener('click', () => {
      S.favsOnly = !S.favsOnly;
      S.shown = CFG.pageSize || 6;
      render();
      $('#properties').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#reset-all').addEventListener('click', () => reset());
    $('#load-more').addEventListener('click', () => { S.shown += CFG.pageSize || 6; render(); });

    /* delegation */
    document.addEventListener('click', e => {
      const pill = e.target.closest('[data-pill]');
      if (pill) {
        const k = pill.dataset.pill;
        if (k === 'deal') S.deal = 'all';
        if (k === 'type') S.type = 'all';
        if (k === 'district') S.district = 'all';
        if (k === 'beds') S.beds = 0;
        if (k === 'budget') S.budget = 0;
        if (k === 'q') { S.q = ''; $('#f-search').value = ''; }
        if (k === 'favs') S.favsOnly = false;
        fillOptions(); render();
        return;
      }
      const area = e.target.closest('[data-area]');
      if (area) {
        S.district = area.dataset.area;
        S.shown = CFG.pageSize || 6;
        fillOptions(); render();
        $('#properties').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const tlink = e.target.closest('[data-type-link]');
      if (tlink) {
        S.type = tlink.dataset.typeLink; S.deal = 'all'; S.budget = 0; S.beds = 0;
        S.shown = CFG.pageSize || 6;
        fillOptions(); render();
        return;
      }
      if (e.target.closest('[data-reset]')) { reset(true); return; }

      const fav = e.target.closest('[data-fav]');
      if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); return; }

      const det = e.target.closest('[data-detail]');
      if (det) { openDetail(det.dataset.detail); return; }

      const cardEl = e.target.closest('.card');
      if (cardEl && !e.target.closest('a,button')) { openDetail(cardEl.dataset.id); }
    });

    /* modal */
    $('#modal').addEventListener('click', e => {
      if (e.target.closest('[data-close]')) { closeDetail(); return; }
      const g = e.target.closest('[data-gal]');
      if (g) { galTo(galIdx + Number(g.dataset.gal)); return; }
      const th = e.target.closest('[data-thumb]');
      if (th) { galTo(Number(th.dataset.thumb)); return; }
      if (e.target.closest('#share-btn')) {
        const url = location.href;
        if (navigator.share) {
          navigator.share({ title: document.title, url }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => toast(t('toastCopied'), 'ok')).catch(() => toast(t('toastNoShare'), 'err'));
        } else {
          toast(t('toastNoShare'), 'err');
        }
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if ($('#modal').classList.contains('is-open')) closeDetail();
        closeDrawer();
        closeLang();
      }
      if (openId) {
        const rtl = document.documentElement.dir === 'rtl';
        if (e.key === 'ArrowLeft') galTo(galIdx + (rtl ? 1 : -1));
        if (e.key === 'ArrowRight') galTo(galIdx + (rtl ? -1 : 1));
      }
    });

    /* add form */
    $('#o-photos').addEventListener('change', e => { addFiles(e.target.files); e.target.value = ''; });
    const up = $('#upload');
    ['dragenter', 'dragover'].forEach(ev => up.addEventListener(ev, e => { e.preventDefault(); up.classList.add('is-drag'); }));
    ['dragleave', 'drop'].forEach(ev => up.addEventListener(ev, e => { e.preventDefault(); up.classList.remove('is-drag'); }));
    up.addEventListener('drop', e => { if (e.dataTransfer) addFiles(e.dataTransfer.files); });

    $('#thumbs').addEventListener('click', e => {
      const b = e.target.closest('[data-del]');
      if (b) { photos.splice(Number(b.dataset.del), 1); renderThumbs(); }
    });

    $('#amens').addEventListener('click', e => {
      const b = e.target.closest('[data-amen]');
      if (!b) return;
      const k = b.dataset.amen;
      if (selectedAmens.has(k)) { selectedAmens.delete(k); b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); }
      else { selectedAmens.add(k); b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true'); }
    });

    $('#o-price').addEventListener('input', e => {
      const v = Number(e.target.value) || 0;
      $('#o-price-usd').value = v > 0 ? Math.round(v / RATE) : '';
    });
    $('#o-price-usd').addEventListener('input', e => {
      const v = Number(e.target.value) || 0;
      $('#o-price').value = v > 0 ? Math.round(v * RATE) : '';
    });

    ['o-name', 'o-phone', 'o-title', 'o-price', 'o-terms'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => fieldErr(id, false));
    });

    $('#add-form').addEventListener('submit', submit);
    $('#add-another').addEventListener('click', resetForm);

    /* active nav */
    const secs = ['properties', 'services', 'add-property', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
    if ('IntersectionObserver' in window && secs.length) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          $$('.nav a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(s => io.observe(s));
    }

    /* re-render on language change */
    document.addEventListener('langchange', () => {
      fillOptions();
      render();
      hydrateWa();
      renderThumbs();
      if (openId) {
        const i = galIdx;
        const p = find(openId);
        if (p) { renderDetail(p); galTo(i); }
      }
    });
  }


  /* ---------- admin & tracker wiring ---------- */
  function closeTrack() {
    const m = $('#track-modal');
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    if (!$('#modal').classList.contains('is-open') && !$('#admin-modal').classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  }

  function showAdmin(on) {
    const sec = $('#admin');
    if (!sec) return;
    if (on) closeTrack();
    sec.hidden = !on;
    document.body.classList.toggle('is-admin', !!on);
    if (on) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      if (window.MPAdmin) MPAdmin.render();
    }
  }

  function bindAdminRoutes() {
    $$('a[href="#admin"]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      closeDrawer();
      if (location.hash !== '#admin') history.pushState({}, '', '#admin');
      showAdmin(true);
    }));

    const sync = () => showAdmin(location.hash === '#admin');
    window.addEventListener('hashchange', sync);
    if (location.hash === '#admin') showAdmin(true);

    const openTrack = e => {
      if (e) e.preventDefault();
      const m = $('#track-modal');
      m.classList.add('is-open');
      m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => { const i = $('#track-code'); if (i) i.focus(); }, 120);
    };
    ['#track-open', '#track-open-2'].forEach(sel => {
      const b = $(sel);
      if (b) b.addEventListener('click', openTrack);
    });

    document.addEventListener('mp:close-track', closeTrack);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && $('#track-modal').classList.contains('is-open')) closeTrack();
    });
  }

  /* called by the admin panel after any moderation change */
  window.MPApp = {
    refresh() {
      loadListings();
      fillOptions();
      render();
      hydrateWa();
      if (openId) {
        const p = find(openId);
        if (p) renderDetail(p); else closeDetail();
      }
    }
  };

  /* ---------- boot ---------- */
  /* روابط قابلة للمشاركة: ?type=villa&deal=sale&district=heron&q=... */
  function applyUrlFilters() {
    try {
      const q = new URL(location.href).searchParams;
      const type = q.get('type');
      const deal = q.get('deal');
      const district = q.get('district');
      const text = q.get('q');
      if (type && (type === 'all' || TYPES.some(x => x.id === type))) S.type = type;
      if (deal && ['all', 'rent', 'daily', 'sale'].indexOf(deal) > -1) S.deal = deal;
      if (district && (district === 'all' || DISTRICTS.some(d => d.id === district))) S.district = district;
      if (text) {
        S.q = text.slice(0, 80);
        const el = $('#f-search');
        if (el) el.value = S.q;
      }
    } catch (e) { /* روابط غير صالحة تُتجاهل */ }
  }

  function loadListings() {
    const all = ST ? ST.list() : (window.PROPERTIES || []);
    LIST = all.filter(p => (p.status || 'published') === 'published');
  }

  function init() {
    loadListings();

    /* شريط النسخة التجريبية — يظهر فقط حين يكون demoMode مفعّلاً */
    const demoBar = $('#demo-bar');
    if (demoBar) {
      demoBar.hidden = CFG.demoMode === false;
      document.documentElement.classList.toggle('is-demo', CFG.demoMode !== false);
    }

    /* a fresh load must never inherit an open overlay */
    ['#track-modal', '#admin-modal', '#modal'].forEach(sel => {
      const m = $(sel);
      if (m) { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); }
    });
    document.body.style.overflow = '';

    /* ?lang= wins (shareable links), then the saved choice, then the browser */
    let lang = null;
    try { lang = new URL(location.href).searchParams.get('lang'); } catch (e) {}
    if (!lang || ['ar', 'fr', 'en'].indexOf(lang) < 0) {
      try { lang = (window.detectLang && detectLang()) || 'ar'; } catch (e) { lang = 'ar'; }
    }
    applyLang(lang);
    applyUrlFilters();

    try { S.cur = localStorage.getItem('mp:cur') || 'DJF'; } catch (e) {}
    document.documentElement.dataset.currency = S.cur;

    fillOptions();
    render();
    hydrateWa();
    bind();
    bindAdminRoutes();

    try {
      const pid = new URL(location.href).searchParams.get('property');
      if (pid && find(pid)) setTimeout(() => openDetail(pid), 250);
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
