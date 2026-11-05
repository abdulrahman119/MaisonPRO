/* =========================================================
   MaisonPRO · owner.js — owner dashboard
   Track your submission and edit its details using the
   property reference + the phone number it was posted with.
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
  const lang = () => (window.getLang ? getLang() : 'ar');
  const loc = (o) => (o && (o[lang()] || o.ar || o.en || o.fr)) || '';
  const norm = (v) => String(v == null ? '' : v).replace(/\D/g, '');

  let current = null;

  function toast(msg, type = 'ok') {
    const box = $('#toasts');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML = `<span>${esc(msg)}</span>`;
    box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 220); }, 2600);
  }

  /* ---------- modal shell ---------- */
  function open() {
    const m = $('#owner-modal');
    if (!m) return;
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const i = $('#owner-ref'); if (i && !current) i.focus(); }, 120);
    if (current) renderPanel();
  }

  function close() {
    const m = $('#owner-modal');
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    if (!$('#modal').classList.contains('is-open') && !$('#admin-modal').classList.contains('is-open') && !$('#track-modal').classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  }

  /* ---------- login ---------- */
  function login(e) {
    e.preventDefault();
    const ref = ($('#owner-ref').value || '').trim().toUpperCase();
    const phone = norm($('#owner-phone').value);
    const p = ref && store ? store.find(ref) : null;
    if (!p || !p.owner || norm(p.owner.phone) !== phone || phone.length < 6) {
      toast(t('ownNotFound'), 'err');
      return;
    }
    current = p.id;
    $('#owner-panel').hidden = false;
    renderPanel();
    toast(t('ownTitle'), 'ok');
  }

  /* ---------- panel ---------- */
  function timeline(p) {
    const st = p.status || 'published';
    const s3 = st === 'published' ? 'on' : st === 'rejected' ? 'rej' : '';
    return `
<ol class="track-steps">
  <li class="on"><i></i>${esc(t('adminStep1'))}</li>
  <li class="on"><i></i>${esc(t('adminStep2'))}</li>
  <li class="${s3}"><i></i>${esc(st === 'rejected' ? t('adminStep3Rej') : t('adminStep3'))}</li>
</ol>`;
  }

  function renderPanel() {
    const p = store.find(current);
    const box = $('#owner-body');
    if (!p || !box) return;

    const st = p.status || 'published';
    const label = st === 'published' ? t('stPublished') : st === 'rejected' ? t('stRejected') : t('stPending');

    box.innerHTML = `
      <div class="track-head">
        <img src="assets/img/${esc((p.images && p.images[0]) || 'villa-2')}.jpg" alt="" width="56" height="56" />
        <div>
          <strong>${esc(loc(p.title))}</strong>
          <span dir="ltr">${esc(p.id)}</span>
        </div>
        <span class="st st--${esc(st)}"><i></i>${esc(label)}</span>
      </div>

      ${timeline(p)}

      <div class="owner-stat">
        <div class="ast"><b>${num(p.views || 0)}</b><span>${esc(t('ownViews'))}</span></div>
        <div class="ast"><b>${esc(t('ownPhoneLabel'))}</b><span dir="ltr">${esc(p.owner ? p.owner.phone : '')}</span></div>
      </div>

      ${st === 'published' ? `<p class="owner-views"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>${esc(t('ownLive'))}</p>` : ''}
      ${p.rejectReason ? `<div class="rev-note rev-note--err"><b>${esc(t('adminRejectedBecause'))}</b>${esc(p.rejectReason)}</div>` : ''}
      ${p.adminNotes ? `<div class="rev-note"><b>${esc(t('adminNotes'))}</b>${esc(p.adminNotes)}</div>` : ''}

      <form class="owner-edit" id="owner-edit">
        <h4>${esc(t('ownEdit'))}</h4>
        <div class="field">
          <label for="ow-title">${esc(t('adminFieldTitle'))}</label>
          <input class="control" id="ow-title" value="${esc(loc(p.title))}" />
        </div>
        <div class="frow">
          <div class="field">
            <label for="ow-price">${esc(t('adminFieldPrice'))}</label>
            <div class="unit-wrap">
              <input class="control" id="ow-price" type="number" min="0" step="1000" value="${esc(p.price || 0)}" dir="ltr" />
              <span class="unit">DJF</span>
            </div>
          </div>
          <div class="field">
            <label for="ow-nightly">${esc(t('nightlyLabel'))}</label>
            <div class="unit-wrap">
              <input class="control" id="ow-nightly" type="number" min="0" step="500" value="${esc(p.nightly || '')}" dir="ltr" />
              <span class="unit">DJF</span>
            </div>
          </div>
        </div>
        <div class="field">
          <label for="ow-desc">${esc(t('adminFieldDesc'))}</label>
          <textarea class="control" id="ow-desc" rows="3">${esc(loc(p.description))}</textarea>
        </div>
        <div class="field">
          <label for="ow-phone">${esc(t('ownPhoneLabel'))}</label>
          <input class="control" id="ow-phone" type="tel" dir="ltr" inputmode="tel" value="${esc(p.owner ? p.owner.phone : '')}" />
        </div>
        <button class="btn btn--primary btn--block" type="submit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
          <span>${esc(t('ownSave'))}</span>
        </button>
      </form>`;

    const form = $('#owner-edit');
    if (form) form.addEventListener('submit', save);
  }

  function save(e) {
    e.preventDefault();
    const p = store.find(current);
    if (!p) return;
    const titleV = ($('#ow-title').value || '').trim();
    const price = Number($('#ow-price').value) || 0;
    if (!titleV || !price) { toast(t('adminNeedTitle'), 'err'); return; }

    const title = Object.assign({}, p.title || {});
    const desc = Object.assign({}, p.description || {});
    title[lang()] = titleV;
    desc[lang()] = ($('#ow-desc').value || '').trim();
    if (lang() !== 'ar') { title.ar = title.ar || titleV; desc.ar = desc.ar || desc[lang()]; }

    p.title = title;
    p.description = desc;
    p.price = price;
    p.nightly = Number($('#ow-nightly').value) || 0;
    p.owner = { name: (p.owner && p.owner.name) || '', phone: norm($('#ow-phone').value) || (p.owner && p.owner.phone) || '' };
    p.updatedAt = new Date().toISOString();

    store.upsert(p);
    renderPanel();
    toast(t('ownSaved'), 'ok');
    if (window.MPApp) MPApp.refresh();
    if (window.MPAdmin) MPAdmin.render();
  }

  /* ---------- wiring ---------- */
  function init() {
    if (!store) return;

    const form = $('#owner-form');
    if (form) form.addEventListener('submit', login);

    $$('[data-owner-close]').forEach(el => el.addEventListener('click', close));

    ['#own-link', '#own-link-2', '#own-link-3', '#own-link-4'].forEach(sel => {
      const b = $(sel);
      if (b) b.addEventListener('click', e => {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('mp:close-track'));
        open();
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && $('#owner-modal').classList.contains('is-open')) close();
    });

    document.addEventListener('langchange', () => {
      if (current && $('#owner-modal').classList.contains('is-open')) renderPanel();
    });

    window.MPOwner = { open, close, renderPanel };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
