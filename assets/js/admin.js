/* =========================================================
   MaisonPRO · admin.js — moderation panel
   Accept / reject / edit visitor submissions, publish to the
   public grid, track status by reference number.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = window.MPStore;

  const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const num = (n) => new Intl.NumberFormat('en-US').format(Math.round(n || 0));
  const img = (name, w = 480) => /^(data:|https?:)/.test(name) ? name : `assets/img/${name}-${w}.webp`;
  const lang = () => (window.getLang ? getLang() : 'ar');
  const loc = (o) => (o && (o[lang()] || o.ar || o.en || o.fr)) || '';

  let tab = 'pending';
  let editId = null;
  let editPhotos = [];
  let editAmens = new Set();

  const STATUS_LABEL = {
    pending: () => t('stPending'),
    published: () => t('stPublished'),
    rejected: () => t('stRejected')
  };

  /* ---------- helpers ---------- */
  function timeline(p) {
    const st = p.status || 'published';
    const s2 = st === 'pending' ? 'on' : 'on';
    const s3 = st === 'published' ? 'on' : st === 'rejected' ? 'rej' : '';
    return `
<div class="timeline" aria-hidden="true">
  <span class="tl on"><i>✓</i>${esc(t('adminStep1'))}</span>
  <span class="tl-link on"></span>
  <span class="tl ${s2}"><i>✓</i>${esc(t('adminStep2'))}</span>
  <span class="tl-link ${s3 ? 'on' : ''}"></span>
  <span class="tl ${s3}"><i>✓</i>${esc(st === 'rejected' ? t('adminStep3Rej') : t('adminStep3'))}</span>
</div>`;
  }
  function statusPill(s) {
    const label = STATUS_LABEL[s] ? STATUS_LABEL[s]() : s;
    return `<span class="st st--${esc(s)}"><i></i>${esc(label)}</span>`;
  }
  function dealWord(d) {
    return d === 'rent' ? t('tagRent') : d === 'daily' ? t('tagDaily') : t('tagSale');
  }
  function unitWord(d) {
    return d === 'rent' ? t('perMonth') : d === 'daily' ? t('perNight') : t('total');
  }
  /* the price that actually gets advertised for this deal type */
  function shownPrice(p) {
    return p.deal === 'daily' && p.nightly ? p.nightly : (p.price || 0);
  }
  function ago(iso) {
    if (!iso) return '';
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
    if (d <= 0) return t('today');
    if (d === 1) return t('yesterday');
    return t('daysAgo', { n: d });
  }
  function toast(msg, type = 'ok') {
    const box = $('#toasts');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML = `<span>${esc(msg)}</span>`;
    box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 220); }, 2600);
  }
  /* ---------- login ---------- */
  function showPanel(on) {
    $('#admin-login').hidden = on;
    $('#admin-panel').hidden = !on;
    if (on) { syncGuide(); render(); }
  }

  function bindLogin() {
    $('#admin-login-form').addEventListener('submit', e => {
      e.preventDefault();
      const code = $('#admin-code').value;
      if (store.checkCode(code)) {
        store.setAdmin(true);
        $('#admin-code').value = '';
        $('#admin-hint').classList.remove('is-err');
        showPanel(true);
        toast(t('adminWelcome'), 'ok');
      } else {
        $('#admin-hint').classList.add('is-err');
        toast(t('adminWrongCode'), 'err');
        $('#admin-code').select();
      }
    });
    $('#admin-logout').addEventListener('click', () => {
      store.setAdmin(false);
      showPanel(false);
      closeEditor();
    });
    $('#admin-settings-btn').addEventListener('click', openSettings);

    /* first-run guide: how the moderation flow works */
    const gx = $('#admin-guide-x');
    if (gx) gx.addEventListener('click', () => {
      const g = $('#admin-guide');
      if (g) g.hidden = true;
      try { localStorage.setItem('mp:guide:v1', '1'); } catch (e) {}
    });
  }

  function syncGuide() {
    const g = $('#admin-guide');
    if (!g) return;
    let done = null;
    try { done = localStorage.getItem('mp:guide:v1'); } catch (e) {}
    g.hidden = !!done;
  }

  /* ---------- list ---------- */
  const TOPIC = {
    general: () => t('cfTopicGeneral'),
    view: () => t('cfTopicView'),
    valuation: () => t('cfTopicVal'),
    other: () => t('cfTopicOther')
  };

  function msgRow(m) {
    return `
<article class="admin-row" data-msg-id="${esc(m.id)}">
  <div class="ar-thumb" style="display:grid;place-items:center">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:26px;height:26px;color:var(--coral)"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
  </div>
  <div class="ar-main">
    <div class="ar-top">
      <span class="ar-id" dir="ltr">${esc(m.id)}</span>
      <span class="ar-when">${esc(ago(m.createdAt))}</span>
      ${m.ref ? `<span class="ar-id" dir="ltr">${esc(m.ref)}</span>` : ''}
    </div>
    <h3>${esc(m.name)} · <span dir="ltr">${esc(m.phone)}</span></h3>
    <p class="msg-body">${esc(m.message)}</p>
    <div class="ar-meta">
      <span>${esc(TOPIC[m.topic] ? TOPIC[m.topic]() : m.topic || '')}</span>
      ${m.email ? `<span dir="ltr">${esc(m.email)}</span>` : ''}
    </div>
  </div>
  <div class="ar-actions">
    ${m.ref ? `<button class="btn btn--outline btn--sm" type="button" data-msg-open="${esc(m.ref)}">
      <span>${esc(t('msgOpen'))}</span></button>` : ''}
    <button class="icon-btn" type="button" data-msg-del="${esc(m.id)}" aria-label="${esc(t('msgDelete'))}" title="${esc(t('msgDelete'))}" style="color:var(--err)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/><path d="M10 11v5M14 11v5"/></svg>
    </button>
  </div>
</article>`;
  }

  function items() {
    const all = store.list();
    return all.filter(p => (p.status || 'published') === tab)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  function row(p) {
    const thumb = (p.images && p.images[0]) || 'villa-2';
    return `
<article class="admin-row" data-id="${esc(p.id)}">
  <div class="ar-thumb"><img src="${esc(img(thumb))}" alt="" loading="lazy" /></div>
  <div class="ar-main">
    <div class="ar-top">
      ${statusPill(p.status || 'published')}
      ${p.updatedAt ? `<span class="st st--updated"><i></i>${esc(t('adminUpdated'))}</span>` : ''}
      <span class="ar-id" dir="ltr">${esc(p.id)}</span>
      <span class="ar-when">${esc(ago(p.createdAt))}</span>
    </div>
    <h3>${esc(loc(p.title))}</h3>
    <div class="ar-meta">
      <span>${esc(districtName(p.district))}</span>
      <span>${esc(typeName(p.type))}</span>
      <span>${esc(dealWord(p.deal))}</span>
      <span>${esc(num(shownPrice(p)))} DJF ${esc(unitWord(p.deal))}</span>
      <span>${num(p.views || 0)} ${esc(t('ownViews'))}</span>
    </div>
    <div class="ar-owner">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
      ${esc(p.owner ? p.owner.name : '—')} · <span dir="ltr">${esc(p.owner ? p.owner.phone : '')}</span>
    </div>
  </div>
  <div class="ar-actions">
    <button class="btn btn--navy btn--sm" type="button" data-review="${esc(p.id)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
      <span>${esc(t('adminOpenReview'))}</span>
    </button>
    ${p.status !== 'published' ? `
    <button class="icon-btn" type="button" data-accept="${esc(p.id)}" aria-label="${esc(t('adminAcceptPublish'))}" title="${esc(t('adminAcceptPublish'))}" style="color:var(--ok);border-color:#BCE3CE">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>
    </button>` : ''}
    ${p.status !== 'rejected' ? `
    <button class="icon-btn" type="button" data-reject="${esc(p.id)}" aria-label="${esc(t('adminReject'))}" title="${esc(t('adminReject'))}" style="color:var(--err);border-color:#E9B5B5">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>` : ''}
  </div>
</article>`;
  }

  function render() {
    if (!store) return;
    const all = store.list();
    const counts = { pending: 0, published: 0, rejected: 0 };
    all.forEach(p => { const s = p.status || 'published'; if (counts[s] != null) counts[s]++; });
    ['pending', 'published', 'rejected'].forEach(k => {
      const el = $('#tab-' + k);
      if (el) el.textContent = counts[k];
    });

    const msgs = store.msgs ? store.msgs() : [];
    const mt = $('#tab-messages');
    if (mt) mt.textContent = msgs.length;
    const st = $('#admin-stats');
    if (st) {
      st.innerHTML = `
        <div class="ast"><b>${counts.pending}</b><span>${esc(t('adminTabPending'))}</span></div>
        <div class="ast"><b>${counts.published}</b><span>${esc(t('adminTabPublished'))}</span></div>
        <div class="ast"><b>${counts.rejected}</b><span>${esc(t('adminTabRejected'))}</span></div>
        <div class="ast ${msgs.length ? 'ast--warn' : ''}"><b>${msgs.length}</b><span>${esc(t('statMessages'))}</span></div>`;
    }

    $$('#admin-tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));

    const emptyEl = $('#admin-empty');
    const emptyTxt = emptyEl ? emptyEl.querySelector('p') : null;

    if (tab === 'messages') {
      const list = store.msgs ? store.msgs() : [];
      $('#admin-list').innerHTML = list.map(msgRow).join('');
      if (emptyEl) emptyEl.hidden = list.length > 0;
      if (emptyTxt) emptyTxt.textContent = t('msgEmpty');
    } else {
      const list = items();
      $('#admin-list').innerHTML = list.map(row).join('');
      if (emptyEl) emptyEl.hidden = list.length > 0;
      if (emptyTxt) emptyTxt.textContent = t('adminEmptyText');
    }
  }

  /* ---------- accept / reject ---------- */
  function accept(id) {
    const p = store.transition(id, 'published');
    if (!p) return;
    render();
    if (window.MPApp) MPApp.refresh();
    toast(t('adminAccepted', { id }), 'ok');
  }

  function rejectFlow(id) {
    const p = store.find(id);
    if (!p) return;
    const reasons = [t('rjPhotos'), t('rjPrice'), t('rjIncomplete'), t('rjContact'), t('rjDuplicate')];
    editId = id;
    $('#admin-modal-id').textContent = id;
    $('#admin-modal-title').textContent = t('adminRejectTitle');
    $('#admin-modal-body').innerHTML = `
      <div class="reject-form">
        <p class="reject-lead">${esc(t('adminRejectLead'))}</p>
        <div class="reject-chips">
          ${reasons.map(r => `<button type="button" class="chip" data-reason="${esc(r)}">${esc(r)}</button>`).join('')}
        </div>
        <label class="sr-only" for="reject-note">${esc(t('adminReason'))}</label>
        <textarea class="control" id="reject-note" rows="3" placeholder="${esc(t('adminReasonPh'))}"></textarea>
      </div>`;
    $('#admin-modal-foot').innerHTML = `
      <button class="btn btn--ghost" type="button" data-admin-close>${esc(t('cancel'))}</button>
      <div class="foot-gap"></div>
      <button class="btn btn--danger" type="button" data-do-reject>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        <span>${esc(t('adminReject'))}</span>
      </button>`;
    openEditor();

    $('#admin-modal-body').querySelectorAll('[data-reason]').forEach(b => b.addEventListener('click', () => {
      const ta = $('#reject-note');
      ta.value = ta.value ? ta.value + ' · ' + b.dataset.reason : b.dataset.reason;
      b.classList.add('is-on');
    }));

    $('#admin-modal-foot').querySelector('[data-do-reject]').addEventListener('click', () => {
      const reason = ($('#reject-note').value || '').trim() || t('rjIncomplete');
      store.transition(id, 'rejected', { rejectReason: reason });
      closeEditor();
      render();
      if (window.MPApp) MPApp.refresh();
      toast(t('adminRejectedToast'), 'info');
    });
  }

  /* ---------- editor shell ---------- */
  function openEditor() {
    const m = $('#admin-modal');
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#admin-modal-body').scrollTop = 0;
  }
  function closeEditor() {
    const m = $('#admin-modal');
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    if (!$('#modal').classList.contains('is-open')) document.body.style.overflow = '';
    editId = null;
  }

  const thumbHtml = (im, i) => `<div class="rev-thumb"><img src="${esc(img(im))}" alt="" /><button type="button" data-del-photo="${i}" aria-label="${esc(t('close'))}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>`;

  /* ---------- review editor ---------- */
  function review(id) {
    const p = store.find(id);
    if (!p) return;
    editId = id;
    editPhotos = (p.images || []).slice();
    editAmens = new Set(p.amenities || []);

    $('#admin-modal-id').textContent = p.id;
    $('#admin-modal-title').textContent = t('adminReview');

    const opt = (val, label, cur) => `<option value="${esc(val)}"${String(cur) === String(val) ? ' selected' : ''}>${esc(label)}</option>`;

    $('#admin-modal-body').innerHTML = `
      ${timeline(p)}
      <div class="rev-grid">
        <div class="rev-preview">
          <div class="rev-gal" id="rev-gal">
            ${editPhotos.length ? editPhotos.map((im, i) =>
              `<img src="${esc(img(im, 960))}" alt="" class="${i === 0 ? 'is-on' : ''}" data-gal-view="${i}" />`).join('') : `<div class="rev-noimg">${esc(t('noPhotos'))}</div>`}
          </div>
          <div class="rev-badges">
            ${statusPill(p.status || 'published')}
            <span class="ar-id" dir="ltr">${esc(p.id)}</span>
            <span class="ar-when">${esc(ago(p.createdAt))}</span>
          </div>
          <h4 class="rev-title">${esc(loc(p.title))}</h4>
          <div class="rev-specs">
            <span>${esc(typeName(p.type))}</span>
            <span>${esc(districtName(p.district))}</span>
            <span>${esc(p.rooms === 1 ? t('cRooms1') : t('cRooms', { n: num(p.rooms) }))}</span>
            <span>${esc(p.baths === 1 ? t('cBaths1') : t('cBaths', { n: num(p.baths) }))}</span>
            <span>${esc(num(p.area))} m²</span>
          </div>
          <p class="rev-desc">${esc(loc(p.description) || t('noDescription'))}</p>
          ${p.amenities && p.amenities.length ? `<div class="amen-list">${p.amenities.map(a => `<span class="amen">${esc(amenityName(a))}</span>`).join('')}</div>` : ''}
          ${p.adminNotes ? `<div class="rev-note"><b>${esc(t('adminNotes'))}</b>${esc(p.adminNotes)}</div>` : ''}
        </div>

        <div class="rev-form">
          <fieldset class="fset">
          <legend><span>1</span><b>${esc(t('adminFieldTitle'))}</b></legend>
          <div class="field">
            <label for="rv-title">${esc(t('adminFieldTitle'))} <span class="req">*</span></label>
            <input class="control" id="rv-title" value="${esc(loc(p.title))}" />
          </div>

          <div class="frow">
            <div class="field">
              <label for="rv-deal">${esc(t('dealType'))}</label>
              <select class="control" id="rv-deal">
                ${opt('rent', t('dealRent'), p.deal)}
                ${opt('daily', t('dealDaily'), p.deal)}
                ${opt('sale', t('dealSale'), p.deal)}
              </select>
            </div>
            <div class="field">
              <label for="rv-type">${esc(t('propertyType'))}</label>
              <select class="control" id="rv-type">
                ${window.TYPES.map(x => opt(x.id, loc(x), p.type)).join('')}
              </select>
            </div>
          </div>

          <div class="frow">
            <div class="field">
              <label for="rv-district">${esc(t('district'))}</label>
              <select class="control" id="rv-district">
                ${window.DISTRICTS.map(d => opt(d.id, loc(d), p.district)).join('')}
              </select>
            </div>
            <div class="field">
              <label for="rv-price">${esc(t('adminFieldPrice'))} <span class="req">*</span></label>
              <div class="unit-wrap">
                <input class="control" id="rv-price" type="number" min="0" step="1000" value="${esc(p.price || 0)}" dir="ltr" />
                <span class="unit">DJF</span>
              </div>
            </div>
          </div>

          <div class="frow frow--3">
            <div class="field">
              <label for="rv-nightly">${esc(t('nightlyLabel'))}</label>
              <input class="control" id="rv-nightly" type="number" min="0" step="500" value="${esc(p.nightly || '')}" dir="ltr" />
            </div>
            <div class="field">
              <label for="rv-rooms">${esc(t('sRooms'))}</label>
              <input class="control" id="rv-rooms" type="number" min="0" value="${esc(p.rooms || 0)}" dir="ltr" />
            </div>
            <div class="field">
              <label for="rv-baths">${esc(t('sBaths'))}</label>
              <input class="control" id="rv-baths" type="number" min="0" value="${esc(p.baths || 0)}" dir="ltr" />
            </div>
          </div>

          <div class="frow frow--3">
            <div class="field">
              <label for="rv-area">${esc(t('sArea'))}</label>
              <input class="control" id="rv-area" type="number" min="0" value="${esc(p.area || 0)}" dir="ltr" />
            </div>
            <div class="field">
              <label for="rv-floor">${esc(t('sFloor'))}</label>
              <input class="control" id="rv-floor" type="number" min="0" value="${esc(p.floor == null ? '' : p.floor)}" dir="ltr" />
            </div>
            <div class="field">
              <label for="rv-year">${esc(t('sYear'))}</label>
              <input class="control" id="rv-year" type="number" min="1950" max="2100" value="${esc(p.year || '')}" dir="ltr" />
            </div>
          </div>

          </fieldset>

          <fieldset class="fset">
          <legend><span>2</span><b>${esc(t('photosLabel'))} · ${esc(t('amenitiesH'))}</b></legend>
          <div class="field">
            <label for="rv-desc">${esc(t('adminFieldDesc'))}</label>
            <textarea class="control" id="rv-desc" rows="3">${esc(loc(p.description))}</textarea>
          </div>

          <div class="field">
            <label>${esc(t('amenitiesH'))}</label>
            <div class="amens" id="rv-amens">
              ${Object.keys(window.AMENITIES).map(k => `<button type="button" class="amen-chip${editAmens.has(k) ? ' is-on' : ''}" data-amen="${esc(k)}" aria-pressed="${editAmens.has(k)}">${esc(amenityName(k))}</button>`).join('')}
            </div>
          </div>

          <div class="field">
            <label>${esc(t('photosLabel'))}</label>
            <div class="rev-photos" id="rv-photos">${editPhotos.map(thumbHtml).join('')}</div>
            <label class="upload upload--sm" for="rv-add-photo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              <span>${esc(t('adminAddPhoto'))}</span>
              <input type="file" id="rv-add-photo" accept="image/*" multiple hidden />
            </label>
          </div>

          </fieldset>

          <fieldset class="fset">
          <legend><span>3</span><b>${esc(t('adminFieldOwner'))}</b></legend>
          <div class="frow">
            <div class="field">
              <label for="rv-owner">${esc(t('adminFieldOwner'))}</label>
              <input class="control" id="rv-owner" value="${esc(p.owner ? p.owner.name : '')}" />
            </div>
            <div class="field">
              <label for="rv-phone">${esc(t('adminFieldPhone'))}</label>
              <input class="control" id="rv-phone" value="${esc(p.owner ? p.owner.phone : '')}" dir="ltr" />
            </div>
          </div>

          <div class="field">
            <label for="rv-notes">${esc(t('adminNotes'))}</label>
            <textarea class="control" id="rv-notes" rows="2" placeholder="${esc(t('adminNotesPh'))}">${esc(p.adminNotes || '')}</textarea>
          </div>

          ${p.rejectReason ? `<div class="rev-note rev-note--err"><b>${esc(t('adminRejectedBecause'))}</b>${esc(p.rejectReason)}</div>` : ''}
          </fieldset>
        </div>
      </div>`;

    $('#admin-modal-foot').innerHTML = `
      <button class="btn btn--ghost" type="button" data-foot-save>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
        <span>${esc(t('adminSave'))}</span>
      </button>
      <div class="foot-gap"></div>
      <span class="foot-hint">${esc(t('adminDecideHint'))}</span>
      <button class="btn btn--danger" type="button" data-foot-reject>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        <span>${esc(t('adminReject'))}</span>
      </button>
      <button class="btn btn--ok" type="button" data-foot-accept>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>
        <span>${esc(t('adminAcceptPublish'))}</span>
      </button>`;

    openEditor();
    bindEditor(p);
  }

  function collect() {
    const p = store.find(editId);
    if (!p) return null;
    const titleV = $('#rv-title').value.trim();
    const descV = $('#rv-desc').value.trim();
    const price = Number($('#rv-price').value) || 0;
    if (!titleV) { toast(t('adminNeedTitle'), 'err'); $('#rv-title').focus(); return null; }
    if (!price) { toast(t('adminNeedPrice'), 'err'); $('#rv-price').focus(); return null; }

    const title = Object.assign({}, p.title || {});
    const desc = Object.assign({}, p.description || {});
    title[lang()] = titleV; desc[lang()] = descV;
    if (lang() !== 'ar') { title.ar = title.ar || titleV; desc.ar = desc.ar || descV; }

    return {
      id: p.id,
      title, description: desc,
      deal: $('#rv-deal').value,
      type: $('#rv-type').value,
      district: $('#rv-district').value,
      price,
      nightly: Number($('#rv-nightly').value) || 0,
      rooms: Number($('#rv-rooms').value) || 0,
      baths: Number($('#rv-baths').value) || 0,
      area: Number($('#rv-area').value) || 0,
      floor: $('#rv-floor').value === '' ? null : Number($('#rv-floor').value),
      year: Number($('#rv-year').value) || null,
      images: editPhotos,
      amenities: [...editAmens],
      owner: { name: $('#rv-owner').value.trim(), phone: $('#rv-phone').value.replace(/\D/g, '') },
      adminNotes: $('#rv-notes').value.trim()
    };
  }

  function bindEditor() {
    const body = $('#admin-modal-body');

    body.querySelectorAll('[data-gal-view]').forEach(im => im.addEventListener('click', () => {
      body.querySelectorAll('#rev-gal img').forEach(x => x.classList.remove('is-on'));
      im.classList.add('is-on');
    }));

    body.querySelectorAll('[data-amen]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.amen;
      if (editAmens.has(k)) { editAmens.delete(k); b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); }
      else { editAmens.add(k); b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true'); }
    }));

    body.querySelectorAll('[data-del-photo]').forEach(b => b.addEventListener('click', () => {
      editPhotos.splice(Number(b.dataset.delPhoto), 1);
      $('#rv-photos').innerHTML = editPhotos.map(thumbHtml).join('');
      bindEditor();
    }));

    const addPhoto = $('#rv-add-photo');
    if (addPhoto) addPhoto.addEventListener('change', async e => {
      for (const f of Array.from(e.target.files || [])) {
        if (editPhotos.length >= (window.SITE_CONFIG.maxImages || 6)) break;
        try { editPhotos.push(await compress(f)); } catch (err) { toast(t('toastImgErr'), 'err'); }
      }
      $('#rv-photos').innerHTML = editPhotos.map(thumbHtml).join('');
      bindEditor();
      e.target.value = '';
    });

    const foot = $('#admin-modal-foot');
    const save = foot.querySelector('[data-foot-save]');
    const pub = foot.querySelector('[data-foot-accept]');
    const rej = foot.querySelector('[data-foot-reject]');

    if (save) save.addEventListener('click', () => {
      const data = collect();
      if (!data) return;
      store.upsert(data);
      closeEditor();
      render();
      if (window.MPApp) MPApp.refresh();
      toast(t('adminSaved'), 'ok');
    });
    if (pub) pub.addEventListener('click', () => {
      const data = collect();
      if (!data) return;
      store.upsert(data);
      store.transition(data.id, 'published');
      closeEditor();
      render();
      if (window.MPApp) MPApp.refresh();
      toast(t('adminAccepted', { id: data.id }), 'ok');
    });
    if (rej) rej.addEventListener('click', () => {
      const id = editId;
      const data = collect();
      if (data) store.upsert(data);
      rejectFlow(id);
    });
  }

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

  /* ---------- settings ---------- */
  function openSettings() {
    const s = store.settings();
    $('#admin-modal-id').textContent = '';
    $('#admin-modal-title').textContent = t('adminSettings');
    $('#admin-modal-body').innerHTML = `
      <div class="settings-form">
        <div class="field">
          <label for="set-code">${esc(t('adminSetCode'))}</label>
          <input class="control" id="set-code" value="${esc(s.adminCode)}" dir="ltr" maxlength="12" />
          <span class="hint">${esc(t('adminSetCodeHint'))}</span>
        </div>
        <div class="field">
          <label for="set-lang">${esc(t('adminSetLang'))}</label>
          <select class="control" id="set-lang">
            <option value="">${esc(t('adminLangAuto'))}</option>
            <option value="ar"${s.lang === 'ar' ? ' selected' : ''}>العربية</option>
            <option value="fr"${s.lang === 'fr' ? ' selected' : ''}>Français</option>
            <option value="en"${s.lang === 'en' ? ' selected' : ''}>English</option>
          </select>
        </div>
        <div class="field">
          <label for="set-cur">${esc(t('currency'))}</label>
          <select class="control" id="set-cur">
            <option value="DJF"${s.currency === 'DJF' ? ' selected' : ''}>DJF</option>
            <option value="USD"${s.currency === 'USD' ? ' selected' : ''}>USD</option>
          </select>
        </div>
        <div class="settings-danger">
          <b>${esc(t('adminDanger'))}</b>
          <p>${esc(t('adminDangerText'))}</p>
          <button class="btn btn--ghost btn--danger btn--sm" type="button" id="reset-demo">${esc(t('adminReset'))}</button>
        </div>
      </div>`;
    $('#admin-modal-foot').innerHTML = `
      <button class="btn btn--ghost" type="button" data-admin-close>${esc(t('cancel'))}</button>
      <button class="btn" type="button" id="save-settings">${esc(t('adminSave'))}</button>`;
    openEditor();

    $('#save-settings').addEventListener('click', () => {
      const code = $('#set-code').value.trim();
      if (code.length < 4) { toast(t('adminCodeShort'), 'err'); return; }
      store.saveSettings({ adminCode: code, lang: $('#set-lang').value || null, currency: $('#set-cur').value });
      closeEditor();
      toast(t('adminSaved'), 'ok');
      if (window.MPApp) MPApp.refresh();
    });

    const reset = $('#reset-demo');
    if (reset) reset.addEventListener('click', () => {
      store.resetDemo();
      closeEditor();
      render();
      if (window.MPApp) MPApp.refresh();
      toast(t('adminResetDone'), 'info');
    });
  }

  /* ---------- public tracker ---------- */
  function track(code) {
    const out = $('#track-result');
    const c = String(code || '').trim().toUpperCase();
    if (!c) return;
    const p = store.list().find(x => String(x.id).toUpperCase() === c);
    if (!p) {
      out.innerHTML = `<div class="track-res track-res--err">${esc(t('trackNotFound'))}</div>`;
      return;
    }
    const s = p.status || 'published';
    const step = s === 'published' ? 3 : s === 'rejected' ? 2 : 1;
    out.innerHTML = `
      <div class="track-res">
        <div class="track-head">
          <img src="${esc(img((p.images && p.images[0]) || 'villa-2'))}" alt="" />
          <div>
            <strong>${esc(loc(p.title))}</strong>
            <span dir="ltr">${esc(p.id)}</span>
          </div>
          ${statusPill(s)}
        </div>
        <ol class="track-steps">
          <li class="on"><i></i><span>${esc(t('trackStep1'))}</span></li>
          <li class="${s === 'pending' ? '' : 'on'} ${s === 'rejected' ? 'rej' : ''}"><i></i><span>${esc(s === 'rejected' ? t('trackStep2Rej') : t('trackStep2'))}</span></li>
          <li class="${step >= 3 ? 'on' : ''}"><i></i><span>${esc(t('trackStep3'))}</span></li>
        </ol>
        ${s === 'rejected' && p.rejectReason ? `<p class="track-reason"><b>${esc(t('adminRejectedBecause'))}</b>${esc(p.rejectReason)}</p>` : ''}
        ${s === 'published' ? `<a class="btn btn--block" href="?property=${esc(p.id)}">${esc(t('trackOpen'))}</a>` : ''}
      </div>`;
  }

  /* ---------- boot ---------- */
  function init() {
    if (!store) return;
    bindLogin();
    showPanel(store.isAdmin());

    $$('#admin-tabs button').forEach(b => b.addEventListener('click', () => {
      tab = b.dataset.tab;
      render();
    }));

    $('#admin-list').addEventListener('click', e => {
      const mdel = e.target.closest('[data-msg-del]');
      if (mdel) {
        if (store.delMsg) store.delMsg(mdel.dataset.msgDel);
        render();
        toast(t('msgDeleted'), 'info');
        return;
      }
      const mopen = e.target.closest('[data-msg-open]');
      if (mopen) {
        const pid = mopen.dataset.msgOpen;
        if (window.MPApp && MPApp.openDetail) MPApp.openDetail(pid);
        return;
      }
      const acc = e.target.closest('[data-accept]');
      if (acc) { accept(acc.dataset.accept); return; }
      const rej = e.target.closest('[data-reject]');
      if (rej) { rejectFlow(rej.dataset.reject); return; }
      const rev = e.target.closest('[data-review]');
      if (rev) { review(rev.dataset.review); return; }
      const r = e.target.closest('.admin-row');
      if (r && !e.target.closest('button,a')) review(r.dataset.id);
    });

    $$('[data-admin-close]').forEach(el => el.addEventListener('click', closeEditor));
    $$('[data-track-close]').forEach(el => el.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('mp:close-track'));
    }));

    $('#track-form').addEventListener('submit', e => { e.preventDefault(); track($('#track-code').value); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && $('#admin-modal').classList.contains('is-open')) closeEditor();
    });

    document.addEventListener('langchange', () => { if (!$('#admin-panel').hidden) render(); });

    window.MPAdmin = { render, showPanel, accept };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
