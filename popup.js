const _api = typeof browser !== 'undefined' ? browser : chrome;

// Footer link — tabs.create is needed because anchor hrefs don't work in extension popups
document.getElementById('huddo-link').addEventListener('click', e => {
  e.preventDefault();
  _api.tabs.create({ url: 'https://www.huddo.com', active: true });
});

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
  autoOpenEl.checked  = !!s.autoOpen;
  salesNavEl.checked  = !!s.salesNav;
  shortcutEl.checked  = s.shortcutEnabled !== false;
  darkModeEl.value    = s.darkMode || 'light';
  languageEl.value    = s.language || '';
  templates = s.customTemplates || [];
  renderTemplates();
});

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
    }));
    row.querySelector('.tmpl-del').onclick = e => {
      templates.splice(+e.target.dataset.idx, 1); renderTemplates();
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

document.getElementById('save').onclick = () => {
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
  }, () => showStatus('Settings saved!', true));
};

function showStatus(msg, ok) {
  statusEl.textContent = msg;
  statusEl.className = ok ? 'ok' : 'err';
  if (ok) setTimeout(() => { statusEl.textContent = ''; statusEl.className = ''; }, 4000);
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
