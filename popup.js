const _api = typeof browser !== 'undefined' ? browser : chrome;

const verseUrlEl   = document.getElementById('verseUrl');
const autoOpenEl   = document.getElementById('autoOpen');
const salesNavEl   = document.getElementById('salesNav');
const shortcutEl   = document.getElementById('shortcutEnabled');
const darkModeEl   = document.getElementById('darkMode');
const languageEl   = document.getElementById('language');
const statusEl     = document.getElementById('status');
const tmplList     = document.getElementById('templates-list');

let templates = [];

_api.storage.local.get(['verseUrl','autoOpen','salesNav','shortcutEnabled','darkMode','language','customTemplates'], s => {
  if (s.verseUrl)  verseUrlEl.value  = s.verseUrl;
  if (!s.verseUrl) inheritVerseUrl(verseUrlEl);
  autoOpenEl.checked  = !!s.autoOpen;
  salesNavEl.checked  = !!s.salesNav;
  shortcutEl.checked  = s.shortcutEnabled !== false;
  darkModeEl.value    = s.darkMode || 'light';
  languageEl.value    = s.language || '';
  templates = s.customTemplates || [];
  renderTemplates();
});

function inheritVerseUrl(inputEl) {
  _api.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) return;
    _api.tabs.sendMessage(tab.id, { type: 'GET_SHARED_VERSE_URL' }, res => {
      if (chrome.runtime.lastError) return;
      if (res?.url && !inputEl.value) inputEl.value = res.url;
    });
  });
}

function renderTemplates() {
  tmplList.innerHTML = '';
  templates.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'template-row';
    row.innerHTML = `
      <input type="text" placeholder="Name" value="${escHtml(t.name||'')}" data-idx="${i}" data-field="name">
      <input type="text" placeholder="https://…/{name}" value="${escHtml(t.url||'')}" data-idx="${i}" data-field="url">
      <button class="tmpl-del" data-idx="${i}" title="Remove">✕</button>
    `;
    row.querySelectorAll('input').forEach(inp => inp.addEventListener('input', e => {
      templates[+e.target.dataset.idx][e.target.dataset.field] = e.target.value;
      debouncedSave();
    }));
    row.querySelector('.tmpl-del').onclick = e => {
      templates.splice(+e.target.dataset.idx, 1);
      renderTemplates();
      saveAll();
    };
    tmplList.appendChild(row);
  });
}

document.getElementById('add-template').onclick = () => {
  templates.push({ name: '', url: '' });
  renderTemplates();
  // Focus the new name input
  const rows = tmplList.querySelectorAll('.template-row');
  rows[rows.length - 1]?.querySelector('input')?.focus();
};

function saveAll() {
  const url = verseUrlEl.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!url) { showStatus('Please enter your Verse URL', false); return; }
  _api.storage.local.set({
    verseUrl:        url,
    autoOpen:        autoOpenEl.checked,
    salesNav:        salesNavEl.checked,
    shortcutEnabled: shortcutEl.checked,
    darkMode:        darkModeEl.value,
    language:        languageEl.value,
    customTemplates: templates.filter(t => t.name && t.url && /^https?:\/\//.test(t.url)),
  }, () => showStatus('Saved', true));
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
const debouncedSave = debounce(saveAll, 800);

verseUrlEl.addEventListener('input', debouncedSave);
[autoOpenEl, salesNavEl, shortcutEl].forEach(el => el.addEventListener('change', saveAll));
[darkModeEl, languageEl].forEach(el => el.addEventListener('change', saveAll));

function showStatus(msg, ok) {
  statusEl.textContent = msg;
  statusEl.className = ok ? 'ok' : 'err';
  if (ok) setTimeout(() => { statusEl.textContent = ''; statusEl.className = ''; }, 2000);
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
