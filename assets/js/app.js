/* =========================================================
   MaisonPRO — Application logic
   Pure vanilla JS · no build step · no dependencies
   ========================================================= */
(function () {
  'use strict';

  const CFG = window.SITE_CONFIG;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const nf = new Intl.NumberFormat('en-US');
  const RATE = CFG.djfPerUsd || 177.721;
  const SUB_KEY = 'maisonpro:submissions:v1';
  const FAV_KEY = 'maisonpro:favorites:v1';
  const LANG_KEY = 'maisonpro:lang';

  /* ---------------------------------------------------------
     Utils
     --------------------------------------------------------- */
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const imgUrl = (name) => /^(data:|https?:|assets\/)/.test(name) ? name : `assets/img/${name}.jpg`;

  const money = (n) => nf.format(Math.round(n));

  function safeGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) {
      /* quota exceeded — retry without heavy image payloads */
      try {
        const slim = JSON.parse(JSON.stringify(value));
        if (Array.isArray(slim)) slim.forEach(p => { p.images = ['villa-2']; });
        localStorage.setItem(key, JSON.stringify(slim));
        return true;
      } catch (e2) { return false; }
    }
  }

  /* ---------------------------------------------------------
     State
     --------------------------------------------------------- */
  const state = {
    deal: 'all',
    type: 'all',
    district: 'all',
    budget: 100,          // 0..100 slider position
    query: '',
    sort: 'newest',
    currency: 'DJF',
    favoritesOnly: false,
    visible: CFG.pageSize || 6
  };

  let PROPERTIES = [];        // base + user submissions
  let favorites = safeGet(FAV_KEY, []);
  let lastFocused = null;
  let activeDetailId = null;
  let detailImages = [];
  let detailIndex = 0;

  /* ---------------------------------------------------------
     Prices
     --------------------------------------------------------- */
  function budgetCeiling() {
    if (state.deal === 'rent') return 1000000;       // loyer mensuel max
    if (state.deal === 'sale') return 100000000;     // prix de vente max
    return 100000000;
  }
  function budgetValue() {
    return Math.round((state.budget / 100) * budgetCeiling());
  }
  function budgetIsActive() { return state.budget < 100; }

  function moneyDJF(n) { return money(n) + ' DJF'; }
  function moneyUSD(n) { return '$' + money(n / RATE); }

  function priceText(p, currency) {
    const cur = currency || state.currency;
    return cur === 'USD' ? moneyUSD(p.price) : moneyDJF(p.price);
  }
  function priceAlt(p, currency) {
    const cur = currency || state.currency;
    return cur === 'USD' ? moneyDJF(p.price) : moneyUSD(p.price);
  }
  function dealLabel(deal) {
    return deal === 'rent' ? t('dealRentShort') : t('dealSaleShort');
  }

  /* ---------------------------------------------------------
     WhatsApp
     --------------------------------------------------------- */
  function waHref(message) {
    const phone = String(CFG.whatsapp || '').replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
  function generalWaMessage() { return t('waGeneralMsg'); }

  function propertyWaMessage(p) {
    return t('waPropertyMsg', {
      title: loc(p.title),
      id: p.id,
      district: districtName(p.district),
      deal: (p.deal === 'rent' ? t('rentWord') : t('saleWord')) + (p.deal === 'rent' ? ' — ' + t('perMonthWord') : ''),
      price: priceText(p)
    });
  }

  function hydrateGeneralWa() {
    const href = waHref(generalWaMessage());
    $$('.js-wa-general').forEach(a => {
      a.setAttribute('href', href);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* ---------------------------------------------------------
     Toasts
     --------------------------------------------------------- */
  const ICONS = {
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>',
    err: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.01"/></svg>'
  };

  function toast(message, type = 'ok') {
    const stack = $('#toast-stack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.setAttribute('role', 'status');
    el.innerHTML = `${ICONS[type] || ICONS.ok}<span>${esc(message)}</span>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 320);
    }, 3200);
  }

  /* ---------------------------------------------------------
     Populate dynamic options
     --------------------------------------------------------- */
  function fillSelect(select, items, allLabel, current) {
    if (!select) return;
    const head = allLabel !== null
      ? `<option value="all">${esc(allLabel)}</option>` : '';
    select.innerHTML = head + items
      .map(o => `<option value="${esc(o.value)}">${esc(o.label)}</option>`)
      .join('');
    if (current && [...select.options].some(o => o.value === current)) select.value = current;
  }

  function populateOptions() {
    fillSelect($('#f-type'), TYPES.map(x => ({ value: x.id, label: loc(x) })), t('typeAll'), state.type);
    fillSelect($('#f-district'), DISTRICTS.map(d => ({ value: d.id, label: loc(d) })), t('districtAll'), state.district);

    fillSelect($('#f-sort'), [
      { value: 'newest', label: t('sortNewest') },
      { value: 'price-asc', label: t('sortPriceAsc') },
      { value: 'price-desc', label: t('sortPriceDesc') },
      { value: 'area-desc', label: t('sortArea') }
    ], null, state.sort);

    /* add-property form selects */
    fillSelect($('#o-type'), TYPES.map(x => ({ value: x.id, label: loc(x) })), null, null);
    fillSelect($('#o-district'), DISTRICTS.map(d => ({ value: d.id, label: loc(d) })), null, null);

    /* footer type quick links */
    const ft = $('#footer-types');
    if (ft) {
      ft.innerHTML = TYPES.map(ty =>
        `<li><a href="#properties" data-type-link="${esc(ty.id)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span>${esc(loc(ty))}</span>
        </a></li>`).join('');
    }

    /* coverage areas */
    const areas = $('#areas-list');
    if (areas) {
      areas.innerHTML = DISTRICTS.map(d => {
        const count = PROPERTIES.filter(p => p.district === d.id).length;
        return `<button type="button" class="chip" data-area="${esc(d.id)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${esc(loc(d))}<b style="font-family:var(--font-en);font-weight:800;opacity:.6">${count}</b>
        </button>`;
      }).join('');
    }

    /* drawer: popular areas */
    const drawerAreas = $('#drawer-areas');
    if (drawerAreas) {
      const ranked = DISTRICTS
        .map(d => ({ d, n: PROPERTIES.filter(p => p.district === d.id).length }))
        .sort((x, y) => y.n - x.n || 0)
        .slice(0, 6);
      drawerAreas.innerHTML = ranked.map(({ d, n }) =>
        `<button type="button" class="chip" data-area="${esc(d.id)}">${esc(loc(d))}<b>${n}</b></button>`
      ).join('');
    }

    /* amenity picker (form) */
    const ap = $('#amenity-picker');
    if (ap) {
      ap.innerHTML = Object.keys(AMENITIES).map(key =>
        `<button type="button" class="chip" data-amenity="${esc(key)}" aria-pressed="false">${esc(amenityName(key))}</button>`
      ).join('');
    }
  }

  /* ---------------------------------------------------------
     Filtering + sorting
     --------------------------------------------------------- */
  function matches(p) {
    if (state.deal !== 'all' && p.deal !== state.deal) return false;
    if (state.type !== 'all' && p.type !== state.type) return false;
    if (state.district !== 'all' && p.district !== state.district) return false;
    if (budgetIsActive() && p.price > budgetValue()) return false;
    if (state.favoritesOnly && !favorites.includes(p.id)) return false;

    const q = state.query.trim().toLowerCase();
    if (q) {
      const hay = [
        p.id,
        loc(p.title), p.title.ar, p.title.fr, p.title.en,
        p.description ? loc(p.description) : '',
        districtName(p.district), typeName(p.type),
        p.owner ? p.owner.name : ''
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  function sortList(list) {
    const arr = list.slice();
    switch (state.sort) {
      case 'price-asc':  return arr.sort((a, b) => a.price - b.price);
      case 'price-desc': return arr.sort((a, b) => b.price - a.price);
      case 'area-desc':  return arr.sort((a, b) => (b.area || 0) - (a.area || 0));
      default:           return arr.sort((a, b) => (a.postedDays || 0) - (b.postedDays || 0));
    }
  }

  function filtered() { return sortList(PROPERTIES.filter(matches)); }

  /* ---------------------------------------------------------
     Card rendering
     --------------------------------------------------------- */
  function roomsLabel(n) { return n === 1 ? t('cardRoomsOne') : t('cardRooms', { n }); }
  function bathsLabel(n) { return n === 1 ? t('cardBathsOne') : t('cardBaths', { n }); }

  function cardHTML(p) {
    const imgs = (p.images && p.images.length) ? p.images : ['villa-2'];
    const isFav = favorites.includes(p.id);
    const badges = [];
    if (p.deal === 'rent') badges.push(`<span class="badge badge--rent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>${esc(t('badgeRent'))}</span>`);
    else badges.push(`<span class="badge badge--sale"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>${esc(t('badgeSale'))}</span>`);
    if (p.isNew) badges.push(`<span class="badge badge--new">${esc(t('badgeNew'))}</span>`);
    if (p.featured) badges.push(`<span class="badge badge--gold">${esc(t('badgeFeatured'))}</span>`);

    return `
    <article class="card" data-id="${esc(p.id)}">
      <div class="card-media">
        <img src="${esc(imgUrl(imgs[0]))}" alt="${esc(loc(p.title))}" loading="lazy" decoding="async" />
        <div class="card-badges">${badges.join('')}</div>
        <button class="card-fav${isFav ? ' is-on' : ''}" type="button"
                data-fav="${esc(p.id)}"
                aria-pressed="${isFav}"
                aria-label="${esc(isFav ? t('toastFavRemove') : t('toastFavAdd'))}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        ${imgs.length > 1 ? `<span class="card-photos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="m21 7-4 4"/></svg>${nf.format(imgs.length)}</span>` : ''}
      </div>

      <div class="card-body">
        <span class="card-loc">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${esc(districtName(p.district))} · ${esc(typeName(p.type))}
        </span>

        <h3 class="card-title">${esc(loc(p.title))}</h3>

        <div class="card-specs">
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/></svg>${esc(roomsLabel(p.rooms))}</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M6 19v2M18 19v2"/></svg>${esc(bathsLabel(p.baths))}</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M9 4v16M4 9h16"/></svg>${esc(t('cardArea', { n: nf.format(p.area || 0) }))}</span>
        </div>

        <div class="card-price">
          <div>
            <div class="price-main">${esc(priceText(p).replace(/ ?DJF$/, ''))}${state.currency === 'USD' ? '' : '<span class="cur">&nbsp;DJF</span>'}</div>
            <div class="price-sub">${esc(p.deal === 'rent' ? t('perMonth') : t('perYear'))}</div>
          </div>
          <div class="price-alt">${esc(priceAlt(p))}</div>
        </div>

        <div class="card-actions">
          <button class="btn btn-navy" type="button" data-detail="${esc(p.id)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></svg>
            <span>${esc(t('cardDetails'))}</span>
          </button>
          <a class="btn btn-wa" href="${esc(waHref(propertyWaMessage(p)))}" target="_blank" rel="noopener noreferrer"
             aria-label="${esc(t('cardWhatsapp') + ' — ' + loc(p.title))}" data-wa-property="${esc(p.id)}">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.41Z"/></svg>
            <span>${esc(t('cardWhatsapp'))}</span>
          </a>
        </div>
      </div>
    </article>`;
  }

  function emptyHTML() {
    const favMode = state.favoritesOnly;
    return `
    <div class="empty">
      <div class="empty-ic">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          ${favMode ? '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.8 1.1-1.1a5.5 5.5 0 0 0-.1-7.7Z"/>'
                     : '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'}
        </svg>
      </div>
      <h3>${esc(favMode ? t('favEmpty') : t('noResults'))}</h3>
      <p>${esc(favMode ? t('favEmptyDesc') : t('noResultsDesc'))}</p>
      <button class="btn btn-outline" type="button" data-clear-all>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2v6h6"/><path d="M3.5 13a9 9 0 1 0 2.1-7.2L3 8"/></svg>
        <span>${esc(t('clearFilters'))}</span>
      </button>
    </div>`;
  }

  /* ---------------------------------------------------------
     Render list
     --------------------------------------------------------- */
  function renderList() {
    const grid = $('#properties-grid');
    if (!grid) return;
    const all = filtered();
    const shown = all.slice(0, state.visible);

    grid.innerHTML = shown.length ? shown.map(cardHTML).join('') : emptyHTML();

    /* count line */
    const countEl = $('#listings-count');
    if (countEl) {
      let html = all.length === 0 ? t('resultsNone')
        : all.length === 1 ? t('resultsCountOne')
        : t('resultsCount', { n: nf.format(all.length) });
      if (all.length > shown.length) {
        html += ` <span style="opacity:.75">· ${esc(t('showingOf', { a: shown.length, b: all.length }))}</span>`;
      }
      countEl.innerHTML = html;
    }

    /* load more */
    const wrap = $('#load-more-wrap');
    if (wrap) wrap.hidden = all.length <= state.visible;

    /* favourites counter */
    const favCount = $('#fav-count');
    if (favCount) favCount.textContent = favorites.length;

    /* hero stat */
    const stat = $('#stat-listed');
    if (stat) stat.textContent = PROPERTIES.length;
  }

  /* ---------------------------------------------------------
     Active filter pills
     --------------------------------------------------------- */
  function renderActiveFilters() {
    const box = $('#active-filters');
    if (!box) return;
    const pills = [];

    const pill = (label, action) =>
      `<span class="filter-pill">${esc(label)}
        <button type="button" data-clear-filter="${action}" aria-label="${esc(t('clearFilters'))}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </span>`;

    if (state.deal !== 'all') pills.push(pill(t(state.deal === 'rent' ? 'dealRent' : 'dealSale'), 'deal'));
    if (state.type !== 'all') pills.push(pill(typeName(state.type), 'type'));
    if (state.district !== 'all') pills.push(pill(districtName(state.district), 'district'));
    if (budgetIsActive()) pills.push(pill(t('budget') + ': ' + priceText({ price: budgetValue() }, state.currency), 'budget'));
    if (state.query.trim()) pills.push(pill('“' + state.query.trim() + '”', 'query'));
    if (state.favoritesOnly) pills.push(pill(t('favorites'), 'favorites'));

    box.innerHTML = pills.join('');
  }

  /* ---------------------------------------------------------
     Filters sync (UI → state)
     --------------------------------------------------------- */
  function syncFilterUI() {
    $$('[data-deal]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.deal === state.deal)));

    const ty = $('#f-type'); if (ty) ty.value = state.type;
    const di = $('#f-district'); if (di) di.value = state.district;
    const so = $('#f-sort'); if (so) so.value = state.sort;

    const budget = $('#f-budget');
    if (budget) {
      budget.value = state.budget;
      budget.style.setProperty('--fill', state.budget + '%');
      budget.setAttribute('aria-valuetext', budgetIsActive() ? priceText({ price: budgetValue() }) : t('budgetAny'));
    }
    const bv = $('#budget-value');
    if (bv) bv.textContent = budgetIsActive() ? priceText({ price: budgetValue() }) : t('budgetAny');

    $$('[data-currency]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.currency === state.currency)));

    const favBtn = $('#fav-toggle');
    if (favBtn) {
      favBtn.classList.toggle('is-on', state.favoritesOnly);
      favBtn.setAttribute('aria-pressed', String(state.favoritesOnly));
    }
    $$('.chip[data-quick]').forEach(c => c.classList.remove('is-on'));
    $$('.chip[data-amenity]').forEach(c => {});
  }

  function refresh() {
    renderList();
    renderActiveFilters();
    syncFilterUI();
  }

  function resetFilters(silent) {
    state.deal = 'all';
    state.type = 'all';
    state.district = 'all';
    state.budget = 100;
    state.query = '';
    state.favoritesOnly = false;
    state.sort = 'newest';
    state.visible = CFG.pageSize || 6;
    const s = $('#f-search'); if (s) s.value = '';
    refresh();
    if (!silent) toast(t('toastFiltersReset'), 'info');
  }

  /* ---------------------------------------------------------
     Detail modal
     --------------------------------------------------------- */
  function findProperty(id) { return PROPERTIES.find(p => p.id === id); }

  function specBlock(icon, label, value, ltr) {
    return `<div class="spec"><span class="ic">${icon}</span><span><small>${esc(label)}</small><strong${ltr ? ' dir="ltr" style="display:inline-block"' : ''}>${esc(value)}</strong></span></div>`;
  }

  function renderDetail(p) {
    const box = $('#detail-content');
    if (!box) return;
    if (!p) {
      box.innerHTML = `<div class="detail-body"><p>${esc(t('propertyNotFound'))}</p></div>`;
      return;
    }
    const imgs = (p.images && p.images.length) ? p.images : ['villa-2'];
    detailImages = imgs;
    detailIndex = 0;
    activeDetailId = p.id;

    const badges = [
      `<span class="badge ${p.deal === 'rent' ? 'badge--rent' : 'badge--sale'}">${esc(p.deal === 'rent' ? t('badgeRent') : t('badgeSale'))}</span>`,
      p.isNew ? `<span class="badge badge--new">${esc(t('badgeNew'))}</span>` : '',
      p.featured ? `<span class="badge badge--gold">${esc(t('badgeFeatured'))}</span>` : ''
    ].filter(Boolean).join('');

    const amen = (p.amenities || []).map(a =>
      `<span class="amenity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>${esc(amenityName(a))}</span>`
    ).join('') || `<span class="amenity">—</span>`;

    const specs = [
      specBlock('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/></svg>', t('detailRooms'), nf.format(p.rooms || 0)),
      specBlock('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M6 19v2M18 19v2"/></svg>', t('detailBaths'), nf.format(p.baths || 0)),
      specBlock('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 4v16M4 9h16"/></svg>', t('detailArea'), (p.area || 0) + ' m²', true),
      p.floor ? specBlock('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M4 4h16v16"/><path d="M8 16v-4h4"/></svg>', t('detailFloor'), String(p.floor), true) : '',
      p.year ? specBlock('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>', t('detailYear'), String(p.year), true) : '',
      specBlock('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/></svg>', t('detailType'), typeName(p.type))
    ].filter(Boolean).join('');

    const ownerInitial = (p.owner && p.owner.name ? p.owner.name.trim()[0] : 'M');

    box.innerHTML = `
      <div class="detail-gallery">
        <div class="gallery-main">
          <img id="detail-img" src="${esc(imgUrl(imgs[0]))}" alt="${esc(loc(p.title))}" />
          ${imgs.length > 1 ? `
            <button class="gallery-nav prev" type="button" data-gal="-1" aria-label="prev">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button class="gallery-nav next" type="button" data-gal="1" aria-label="next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>` : ''}
          <span class="gallery-counter" id="gallery-counter" dir="ltr">1 / ${nf.format(imgs.length)}</span>
        </div>
        ${imgs.length > 1 ? `<div class="gallery-thumbs" id="gallery-thumbs">
          ${imgs.map((im, i) => `<button type="button" data-thumb="${i}" class="${i === 0 ? 'is-active' : ''}" aria-label="${esc(t('detailPhotos', { n: i + 1 }))}"><img src="${esc(imgUrl(im))}" alt="" loading="lazy" /></button>`).join('')}
        </div>` : ''}
      </div>

      <div class="detail-body">
        <div class="detail-head">
          <div style="min-width:0">
            <div class="detail-badges">${badges}</div>
            <h2 id="detail-title">${esc(loc(p.title))}</h2>
            <span class="detail-loc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              ${esc(districtName(p.district))} · ${esc(typeName(p.type))} · ${esc(t('detailId'))} ${esc(p.id)}
            </span>
          </div>
          <div class="detail-price">
            <div class="p">${esc(priceText(p).replace(/ ?DJF$/, ''))}${state.currency === 'USD' ? '' : '<span class="cur">&nbsp;DJF</span>'}</div>
            <div class="ps">${esc(p.deal === 'rent' ? t('perMonth') : t('perYear'))}</div>
            <div class="alt">${esc(priceAlt(p))}</div>
          </div>
        </div>

        <div class="spec-grid">${specs}</div>

        <div class="detail-section">
          <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>${esc(t('detailOverview'))}</h4>
          <p>${esc(p.description ? loc(p.description) : '')}</p>
        </div>

        <div class="detail-section">
          <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>${esc(t('detailAmenities'))}</h4>
          <div class="amenities">${amen}</div>
        </div>

        <div class="detail-section">
          <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>${esc(t('detailLocation'))}</h4>
          <p>${esc(districtName(p.district))}, ${esc(currentLang === 'ar' ? CFG.addressAr : CFG.addressFr)}</p>
        </div>

        <div class="agent-card">
          <span class="agent-avatar">${esc(ownerInitial.toUpperCase())}</span>
          <span>
            <strong>${esc(p.owner ? p.owner.name : CFG.brand)}</strong>
            <small>${esc(t('detailAgentRole'))}</small>
          </span>
          <span class="status"><span class="dot"></span>${esc(t('detailOnline'))}</span>
        </div>

        <div class="detail-actions">
          <a class="btn btn-wa" href="${esc(waHref(propertyWaMessage(p)))}" target="_blank" rel="noopener noreferrer" data-wa-property="${esc(p.id)}">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.41Z"/></svg>
            <span>${esc(t('detailWa'))}</span>
          </a>
          <a class="btn btn-outline" href="tel:${esc(String(p.owner ? p.owner.phone : CFG.whatsapp).replace(/\D/g, ''))}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2Z"/></svg>
            <span>${esc(t('detailCall'))}</span>
          </a>
          <button class="btn btn-ghost" type="button" id="copy-link" style="border:1px solid var(--line)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
          </button>
        </div>
      </div>`;
  }

  function setGallery(index) {
    if (!detailImages.length) return;
    detailIndex = (index + detailImages.length) % detailImages.length;
    const img = $('#detail-img');
    if (img) {
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = imgUrl(detailImages[detailIndex]);
        img.style.opacity = '1';
      }, 120);
    }
    const counter = $('#gallery-counter');
    if (counter) { counter.setAttribute('dir', 'ltr'); counter.textContent = `${detailIndex + 1} / ${detailImages.length}`; }
    $$('#gallery-thumbs button').forEach((b, i) => b.classList.toggle('is-active', i === detailIndex));
  }

  function openDetail(id) {
    const p = findProperty(id);
    if (!p) return;
    lastFocused = document.activeElement;
    renderDetail(p);
    openModal('#detail-modal');
    try {
      const url = new URL(location.href);
      url.searchParams.set('property', id);
      history.replaceState({}, '', url);
    } catch (e) {}
  }

  function closeDetail() {
    closeModal('#detail-modal');
    activeDetailId = null;
    try {
      const url = new URL(location.href);
      if (url.searchParams.has('property')) {
        url.searchParams.delete('property');
        history.replaceState({}, '', url);
      }
    } catch (e) {}
  }

  /* ---------------------------------------------------------
     Modal helpers
     --------------------------------------------------------- */
  function openModal(sel) {
    const m = $(sel);
    if (!m) return;
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    /* focus the dialog itself so no button shows a focus ring on open */
    const box = m.querySelector('.modal-box');
    if (box) {
      if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
      setTimeout(() => box.focus({ preventScroll: true }), 120);
    }
  }
  function closeModal(sel) {
    const m = $(sel);
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
      lastFocused = null;
    }
  }

  /* ---------------------------------------------------------
     Favourites
     --------------------------------------------------------- */
  function toggleFav(id) {
    const i = favorites.indexOf(id);
    if (i > -1) { favorites.splice(i, 1); toast(t('toastFavRemove'), 'info'); }
    else { favorites.push(id); toast(t('toastFavAdd'), 'ok'); }
    safeSet(FAV_KEY, favorites);
    refresh();
  }

  /* ---------------------------------------------------------
     Add-property form
     --------------------------------------------------------- */
  const formImages = [];
  let selectedAmenities = new Set();

  function compressImage(file, maxW = 1100, quality = 0.72) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) return reject(new Error('not-image'));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('decode'));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderThumbs() {
    const box = $('#thumbs');
    if (!box) return;
    box.innerHTML = formImages.map((src, i) => `
      <div class="thumb">
        <img src="${esc(src)}" alt="" />
        ${i === 0 ? `<span class="cover-tag">${esc(t('uploadCover'))}</span>` : ''}
        <button type="button" data-remove-img="${i}" aria-label="${esc(t('close'))}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>`).join('');
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    for (const f of files) {
      if (formImages.length >= (CFG.maxImages || 6)) { toast(t('toastMaxImages'), 'err'); break; }
      try {
        const data = await compressImage(f);
        formImages.push(data);
      } catch (e) { toast(t('toastImageErr'), 'err'); }
    }
    renderThumbs();
  }

  function showFieldError(id, show) {
    const input = document.getElementById(id);
    if (!input) return;
    const field = input.closest('.field') || input.closest('.checkline');
    if (field) field.classList.toggle('has-error', !!show);
    input.setAttribute('aria-invalid', show ? 'true' : 'false');
  }

  function validateForm() {
    const name = $('#o-name');
    const phone = $('#o-phone');
    const price = $('#o-price');
    const title = $('#o-title');
    const terms = $('#o-terms');
    let firstBad = null;

    const checks = [
      [name, !!name.value.trim()],
      [phone, (phone.value.replace(/\D/g, '').length >= 8)],
      [price, price.value !== '' && Number(price.value) > 0],
      [title, !!title.value.trim()],
      [terms, terms.checked]
    ];

    checks.forEach(([el, ok]) => {
      const target = el === terms ? 'o-terms' : el.id;
      showFieldError(target, !ok);
      if (!ok && !firstBad) firstBad = el;
    });

    /* phone / price use custom messages */
    const phoneField = phone.closest('.field');
    const priceField = price.closest('.field');
    if (!checks[1][1] && phoneField) {
      phoneField.querySelectorAll('.error-msg').forEach(m => m.textContent = t('errPhone'));
    } else if (phoneField) {
      phoneField.querySelectorAll('.error-msg').forEach(m => m.textContent = t('errRequired'));
    }
    if (!checks[2][1] && priceField) {
      priceField.querySelectorAll('.error-msg').forEach(m => m.textContent = t('errPrice'));
    }

    if (firstBad) firstBad.focus({ preventScroll: true });
    return !firstBad;
  }

  function resetForm() {
    const form = $('#property-form');
    if (form) form.reset();
    formImages.length = 0;
    selectedAmenities = new Set();
    $$('.chip[data-amenity]').forEach(c => { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
    renderThumbs();
    $$('.has-error').forEach(el => el.classList.remove('has-error'));
    const usd = $('#o-price-usd'); if (usd) usd.value = '';
  }

  function submitProperty(e) {
    e.preventDefault();
    if (!validateForm()) { toast(t('toastFormErr'), 'err'); return; }

    const titleVal = $('#o-title').value.trim();
    const type = $('#o-type').value;
    const district = $('#o-district').value;
    const priceVal = Number($('#o-price').value) || 0;
    const deal = $('#o-deal').value;
    const rooms = Number($('#o-rooms').value) || 1;
    const baths = Number($('#o-baths').value) || 1;
    const area = Number($('#o-area').value) || 0;
    const desc = $('#o-desc').value.trim();

    const ownerName = $('#o-name').value.trim();
    const ownerPhone = $('#o-phone').value.trim();

    const property = {
      id: 'MP-' + (2000 + Math.floor(Math.random() * 7999)),
      title: { ar: titleVal, fr: titleVal, en: titleVal },
      description: { ar: desc, fr: desc, en: desc },
      type, deal, district,
      price: priceVal,
      rooms, baths, area,
      floor: null,
      year: new Date().getFullYear(),
      featured: false,
      isNew: true,
      postedDays: 0,
      views: 0,
      images: formImages.length ? formImages.slice() : ['villa-2'],
      amenities: [...selectedAmenities],
      owner: { name: ownerName, phone: ownerPhone.replace(/\D/g, '') },
      submitted: true
    };

    /* persist */
    const submissions = safeGet(SUB_KEY, []);
    const slim = Object.assign({}, property, { images: formImages.slice(0, 4) });
    submissions.unshift(slim);
    safeSet(SUB_KEY, submissions.slice(0, 20));

    PROPERTIES.unshift(property);
    populateOptions();
    refresh();

    /* success view */
    const form = $('#property-form');
    const success = $('#form-success');
    if (form) form.style.display = 'none';
    if (success) success.classList.add('is-shown');
    toast(t('toastFormOk'), 'ok');

    /* WhatsApp copy of the request */
    const msg = [
      currentLang === 'ar' ? 'طلب إضافة عقار جديد' : 'Nouvelle annonce',
      '',
      `🏠 ${titleVal}`,
      `🔖 ${property.id}`,
      `📍 ${districtName(district)} — ${dealLabel(deal)}`,
      `💰 ${priceText(property)}`,
      `🛏 ${rooms} · 🚿 ${baths} · 📐 ${area} m²`,
      `👤 ${ownerName} — ${ownerPhone}`
    ].join('\n');
    $$('[data-wa-source="success"]').forEach(a => {
      a.setAttribute('href', waHref(msg));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });

    $('#add-property')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------------------------------------------------
     Wiring
     --------------------------------------------------------- */
  function bind() {
    /* --- header scroll --- */
    const header = $('#site-header');
    const fabTop = $('#fab-top');
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (header) header.classList.toggle('is-stuck', y > 8);
      if (fabTop) fabTop.classList.toggle('is-shown', y > 620);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (fabTop) fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* --- drawer --- */
    const drawer = $('#drawer');
    const burger = $('#burger');
    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      if (burger) burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      if (burger) burger.setAttribute('aria-expanded', 'false');
      if (!$('.modal.is-open')) document.body.style.overflow = '';
    }
    burger?.addEventListener('click', openDrawer);
    $$('[data-close-drawer]').forEach(el => el.addEventListener('click', closeDrawer));
    $$('#drawer a[href^="#"]').forEach(a => a.addEventListener('click', closeDrawer));

    /* --- language --- */
    $$('[data-lang-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.dataset.langBtn);
        populateOptions();
        refresh();
        hydrateGeneralWa();
        if (activeDetailId) setGallery(detailIndex);
        closeDrawer();
        closeLangMenu();
      });
    });

    /* header language dropdown */
    const langSwitch = $('#lang-switch');
    const langBtn = $('#lang-btn');
    function closeLangMenu() {
      if (!langSwitch) return;
      langSwitch.classList.remove('is-open');
      if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
    }
    langBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = langSwitch.classList.toggle('is-open');
      langBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (langSwitch && !e.target.closest('#lang-switch')) closeLangMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLangMenu();
    });

    /* --- segmented deal filter --- */
    $$('[data-deal]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.deal = btn.dataset.deal;
        state.budget = 100;                    // scales differ between rent & sale
        state.visible = CFG.pageSize || 6;
        refresh();
        document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    $('#f-type')?.addEventListener('change', e => { state.type = e.target.value; state.visible = CFG.pageSize || 6; refresh(); });
    $('#f-district')?.addEventListener('change', e => { state.district = e.target.value; state.visible = CFG.pageSize || 6; refresh(); });
    $('#f-sort')?.addEventListener('change', e => { state.sort = e.target.value; refresh(); });

    $('#f-budget')?.addEventListener('input', e => {
      state.budget = Number(e.target.value);
      state.visible = CFG.pageSize || 6;
      refresh();
    });

    $('#f-search')?.addEventListener('input', e => {
      state.query = e.target.value;
      state.visible = CFG.pageSize || 6;
      refresh();
    });

    $('#search-form')?.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#reset-filters')?.addEventListener('click', () => resetFilters());

    /* quick chips */
    $$('[data-quick]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [a, b] = btn.dataset.quick.split('|');
        const isType = TYPES.some(x => x.id === a);
        state.deal = b === 'sale' || b === 'rent' ? b : 'all';
        if (isType) { state.type = a; state.district = 'all'; }
        else { state.district = a; state.type = 'all'; }
        state.budget = 100;
        state.favoritesOnly = false;
        state.visible = CFG.pageSize || 6;
        $$('.chip[data-quick]').forEach(c => c.classList.remove('is-on'));
        btn.classList.add('is-on');
        refresh();
        document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* area chips */
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-area]');
      if (a) {
        closeDrawer();
        state.district = a.dataset.area;
        state.visible = CFG.pageSize || 6;
        refresh();
        document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      /* footer type links */
      const ty = e.target.closest('[data-type-link]');
      if (ty) {
        state.type = ty.dataset.typeLink;
        state.deal = 'all';
        state.budget = 100;
        state.visible = CFG.pageSize || 6;
        refresh();
      }
    });

    /* currency */
    $$('[data-currency]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currency = btn.dataset.currency;
        refresh();
        if (activeDetailId) { const p = findProperty(activeDetailId); if (p) renderDetail(p); }
      });
    });

    /* favourites toggle */
    $('#fav-toggle')?.addEventListener('click', () => {
      state.favoritesOnly = !state.favoritesOnly;
      state.visible = CFG.pageSize || 6;
      refresh();
      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* clear pill */
    $('#active-filters')?.addEventListener('click', (e) => {
      const b = e.target.closest('[data-clear-filter]');
      if (!b) return;
      const what = b.dataset.clearFilter;
      if (what === 'deal') state.deal = 'all';
      if (what === 'type') state.type = 'all';
      if (what === 'district') state.district = 'all';
      if (what === 'budget') state.budget = 100;
      if (what === 'query') { state.query = ''; const s = $('#f-search'); if (s) s.value = ''; }
      if (what === 'favorites') state.favoritesOnly = false;
      refresh();
    });

    /* grid interactions */
    $('#properties-grid')?.addEventListener('click', (e) => {
      const fav = e.target.closest('[data-fav]');
      if (fav) { toggleFav(fav.dataset.fav); return; }
      const det = e.target.closest('[data-detail]');
      if (det) { openDetail(det.dataset.detail); return; }
      const clearAll = e.target.closest('[data-clear-all]');
      if (clearAll) { resetFilters(true); return; }
      const card = e.target.closest('.card');
      if (card && !e.target.closest('a,button')) openDetail(card.dataset.id);
    });

    /* keyboard access on cards */
    $('#properties-grid')?.addEventListener('keydown', (e) => {
      const card = e.target.closest('.card');
      if (card && (e.key === 'Enter' || e.key === ' ') && e.target === card) {
        e.preventDefault();
        openDetail(card.dataset.id);
      }
    });

    /* load more */
    $('#load-more')?.addEventListener('click', () => {
      state.visible += CFG.pageSize || 6;
      renderList();
    });

    /* detail modal interactions */
    $('#detail-modal')?.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-close-modal]');
      if (closeBtn) { closeDetail(); return; }
      const gal = e.target.closest('[data-gal]');
      if (gal) { setGallery(detailIndex + Number(gal.dataset.gal)); return; }
      const thumb = e.target.closest('[data-thumb]');
      if (thumb) { setGallery(Number(thumb.dataset.thumb)); return; }
      if (e.target.closest('#copy-link')) {
        const url = location.href;
        const done = () => toast(t('toastLinkCopied'), 'ok');
        const fail = () => toast(t('toastLinkFail'), 'err');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done).catch(fail);
        } else {
          const ta = document.createElement('textarea');
          ta.value = url; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); done(); } catch (err) { fail(); }
          ta.remove();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if ($('.modal.is-open')) closeDetail();
        else closeDrawer();
      }
      if ($('#detail-modal')?.classList.contains('is-open')) {
        if (e.key === 'ArrowLeft') setGallery(detailIndex + (document.documentElement.dir === 'rtl' ? 1 : -1));
        if (e.key === 'ArrowRight') setGallery(detailIndex + (document.documentElement.dir === 'rtl' ? -1 : 1));
      }
    });

    /* --- add property form --- */
    $('#o-photos')?.addEventListener('change', e => { handleFiles(e.target.files); e.target.value = ''; });

    const zone = $('#upload-zone');
    if (zone) {
      ['dragenter', 'dragover'].forEach(ev => zone.addEventListener(ev, e => {
        e.preventDefault(); zone.classList.add('is-drag');
      }));
      ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => {
        e.preventDefault(); zone.classList.remove('is-drag');
      }));
      zone.addEventListener('drop', e => {
        if (e.dataTransfer && e.dataTransfer.files) handleFiles(e.dataTransfer.files);
      });
    }

    $('#thumbs')?.addEventListener('click', e => {
      const b = e.target.closest('[data-remove-img]');
      if (!b) return;
      formImages.splice(Number(b.dataset.removeImg), 1);
      renderThumbs();
    });

    $('#amenity-picker')?.addEventListener('click', e => {
      const b = e.target.closest('[data-amenity]');
      if (!b) return;
      const key = b.dataset.amenity;
      if (selectedAmenities.has(key)) { selectedAmenities.delete(key); b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); }
      else { selectedAmenities.add(key); b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true'); }
    });

    /* price auto-conversion */
    $('#o-price')?.addEventListener('input', e => {
      const v = Number(e.target.value) || 0;
      const usd = $('#o-price-usd');
      if (usd) usd.value = v > 0 ? Math.round(v / RATE) : '';
    });
    $('#o-price-usd')?.addEventListener('input', e => {
      const v = Number(e.target.value) || 0;
      const djf = $('#o-price');
      if (djf) djf.value = v > 0 ? Math.round(v * RATE) : '';
    });

    /* clear errors as user types */
    ['o-name', 'o-phone', 'o-price', 'o-title', 'o-terms'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const ev = el.type === 'checkbox' ? 'change' : 'input';
      el.addEventListener(ev, () => showFieldError(id, false));
    });

    $('#property-form')?.addEventListener('submit', submitProperty);

    $('#add-another')?.addEventListener('click', () => {
      resetForm();
      const form = $('#property-form');
      const success = $('#form-success');
      if (form) form.style.display = '';
      if (success) success.classList.remove('is-shown');
      $('#o-name')?.focus();
    });

    /* --- active nav on scroll --- */
    const sections = ['properties', 'services', 'add-property', 'contact']
      .map(id => document.getElementById(id)).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const id = en.target.id;
          $$('.nav a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(s => io.observe(s));
    }

    /* --- reveal on scroll --- */
    const revealAll = () => $$('.reveal:not(.is-visible)').forEach(el => el.classList.add('is-visible'));
    if ('IntersectionObserver' in window) {
      const rev = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      $$('.reveal').forEach(el => rev.observe(el));
      /* safety net: never leave content invisible (printing, find-in-page, odd viewports) */
      setTimeout(revealAll, 3000);
      window.addEventListener('beforeprint', revealAll);
    } else {
      revealAll();
    }
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function init() {
    /* load user submissions */
    const subs = safeGet(SUB_KEY, []);
    PROPERTIES = (Array.isArray(subs) ? subs : []).concat(window.PROPERTIES || []);

    /* restore language */
    let lang = 'ar';
    try { lang = localStorage.getItem(LANG_KEY) || 'ar'; } catch (e) {}
    if (!['ar', 'fr', 'en'].includes(lang)) lang = 'ar';
    applyLanguage(lang);

    populateOptions();
    refresh();
    hydrateGeneralWa();
    bind();
    renderThumbs();

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    /* deep link ?property=MP-1041 */
    try {
      const pid = new URL(location.href).searchParams.get('property');
      if (pid && findProperty(pid)) setTimeout(() => openDetail(pid), 300);
    } catch (e) {}

    /* re-translate dynamic parts on language change */
    document.addEventListener('langchange', () => {
      populateOptions();
      refresh();
      hydrateGeneralWa();
      renderThumbs();
      if (activeDetailId) {
        const p = findProperty(activeDetailId);
        if (p) { renderDetail(p); setGallery(detailIndex); }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
