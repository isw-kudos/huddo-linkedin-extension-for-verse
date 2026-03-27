// Cross-browser compatibility shim — Firefox uses browser.*, Chrome uses chrome.*
const api = typeof browser !== 'undefined' ? browser : chrome;

// Re-inject content scripts into matching tabs when extension reloads/updates
api.runtime.onInstalled.addListener(reInjectAll);
api.runtime.onStartup.addListener(reInjectAll);

async function reInjectAll() {
  const { verseUrl } = await api.storage.local.get("verseUrl");
  if (!verseUrl) return;
  let hostname;
  try {
    const u = new URL(verseUrl.startsWith('http') ? verseUrl : 'https://' + verseUrl);
    hostname = u.hostname;
  } catch (e) { return; }

  const tabs = await api.tabs.query({ url: `https://${hostname}/*` });
  for (const tab of tabs) {
    try {
      await api.scripting.insertCSS({ target: { tabId: tab.id }, files: ["styles.css"] });
      await api.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    } catch (e) { console.warn('[HLL] Re-inject failed for tab', tab.id, e.message); }
  }
}

// Keyboard shortcut command — forward to the active Verse tab
api.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-panel') return;
  const { verseUrl } = await api.storage.local.get("verseUrl");
  if (!verseUrl) return;
  let hostname;
  try {
    const u = new URL(verseUrl.startsWith('http') ? verseUrl : 'https://' + verseUrl);
    hostname = u.hostname;
  } catch (e) { return; }
  const tabs = await api.tabs.query({ active: true, url: `https://${hostname}/*` });
  for (const tab of tabs) {
    try {
      await api.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => { window.__hllToggle && window.__hllToggle(); }
      });
    } catch (e) {}
  }
});

// Messages from content script
api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "OPEN_LINKEDIN") {
    const url = msg.url || '';
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      sendResponse({ ok: false }); return false;
    }
    api.tabs.create({ url, active: true });
    sendResponse({ ok: true });
    return false;
  }
});
