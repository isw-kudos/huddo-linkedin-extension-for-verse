// Guard against double-injection
if (typeof window.__hllLoaded === 'undefined') {
window.__hllLoaded = true;

const _api = typeof browser !== 'undefined' ? browser : chrome;

// ── Settings cache ────────────────────────────────────────────────────────────
let _settings = {};
function loadSettings() {
  return new Promise(resolve => {
    _api.storage.local.get(['verseUrl','autoOpen','salesNav','shortcutEnabled','darkMode','language','customTemplates'], s => {
      _settings = s;
      applyDarkMode();
      resolve(s);
    });
  });
}

// ── Dark mode ─────────────────────────────────────────────────────────────────
function applyDarkMode() {
  const panel = document.getElementById('hll-panel');
  if (!panel) return;
  const dark = _settings.darkMode === 'dark' ||
    (_settings.darkMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  panel.classList.toggle('hll-dark', dark);
}

// ── Multi-language UI strings ─────────────────────────────────────────────────
const UI = {
  'en-AU': { searchAs:'Search LinkedIn as:', searchCompany:'Search LinkedIn company:', orSearch:'Or search manually:', nameComp:'Name or company…', compName:'Company name…', loading:'Loading…', noEmail:'No email or invite selected', noEmailSub:'Open an email or calendar invite in Verse, then click the LinkedIn button to look up the sender.', noAttendees:'No external attendees found', noAttendeesSub:'This invite only has internal attendees or the attendee list could not be read.', organisation:'Organisation', emailsFrom:n=>`${n} emails from this sender`, aiHandoff:'Ask AI about this email', sharedConn:'Find shared connections', timezone:t=>`Local time: ${t}` },
  'en-GB': { searchAs:'Search LinkedIn as:', searchCompany:'Search LinkedIn company:', orSearch:'Or search manually:', nameComp:'Name or company…', compName:'Company name…', loading:'Loading…', noEmail:'No email or invite selected', noEmailSub:'Open an email or calendar invite in Verse, then click the LinkedIn button to look up the sender.', noAttendees:'No external attendees found', noAttendeesSub:'This invite only has internal attendees or the attendee list could not be read.', organisation:'Organisation', emailsFrom:n=>`${n} emails from this sender`, aiHandoff:'Ask AI about this email', sharedConn:'Find shared connections', timezone:t=>`Local time: ${t}` },
  'en':    { searchAs:'Search LinkedIn as:', searchCompany:'Search LinkedIn company:', orSearch:'Or search manually:', nameComp:'Name or company…', compName:'Company name…', loading:'Loading…', noEmail:'No email or invite selected', noEmailSub:'Open an email or calendar invite in Verse, then click the LinkedIn button to look up the sender.', noAttendees:'No external attendees found', noAttendeesSub:'This invite only has internal attendees or the attendee list could not be read.', organisation:'Organization', emailsFrom:n=>`${n} emails from this sender`, aiHandoff:'Ask AI about this email', sharedConn:'Find shared connections', timezone:t=>`Local time: ${t}` },
  'de':    { searchAs:'LinkedIn-Suche:', searchCompany:'LinkedIn-Unternehmenssuche:', orSearch:'Oder manuell suchen:', nameComp:'Name oder Unternehmen…', compName:'Unternehmensname…', loading:'Lädt…', noEmail:'Keine E-Mail ausgewählt', noEmailSub:'Öffnen Sie eine E-Mail oder Kalendereinladung in Verse.', noAttendees:'Keine externen Teilnehmer', noAttendeesSub:'Nur interne Teilnehmer oder Liste nicht lesbar.', organisation:'Organisation', emailsFrom:n=>`${n} E-Mails von diesem Absender`, aiHandoff:'KI zu dieser E-Mail befragen', sharedConn:'Gemeinsame Kontakte finden', timezone:t=>`Ortszeit: ${t}` },
  'fr':    { searchAs:'Rechercher sur LinkedIn :', searchCompany:'Recherche entreprise LinkedIn :', orSearch:'Ou rechercher manuellement :', nameComp:'Nom ou entreprise…', compName:'Nom de l\'entreprise…', loading:'Chargement…', noEmail:'Aucun e-mail sélectionné', noEmailSub:'Ouvrez un e-mail ou une invitation dans Verse.', noAttendees:'Aucun participant externe', noAttendeesSub:'Uniquement des participants internes ou liste illisible.', organisation:'Organisation', emailsFrom:n=>`${n} e-mails de cet expéditeur`, aiHandoff:'Demander à l\'IA', sharedConn:'Trouver des relations communes', timezone:t=>`Heure locale : ${t}` },
  'it':    { searchAs:'Cerca su LinkedIn:', searchCompany:'Cerca azienda LinkedIn:', orSearch:'O cerca manualmente:', nameComp:'Nome o azienda…', compName:'Nome azienda…', loading:'Caricamento…', noEmail:'Nessuna email selezionata', noEmailSub:'Apri un\'email o un invito in Verse.', noAttendees:'Nessun partecipante esterno', noAttendeesSub:'Solo partecipanti interni o elenco non leggibile.', organisation:'Organizzazione', emailsFrom:n=>`${n} email da questo mittente`, aiHandoff:'Chiedi all\'AI', sharedConn:'Trova connessioni condivise', timezone:t=>`Ora locale: ${t}` },
  'es':    { searchAs:'Buscar en LinkedIn:', searchCompany:'Buscar empresa en LinkedIn:', orSearch:'O buscar manualmente:', nameComp:'Nombre o empresa…', compName:'Nombre de empresa…', loading:'Cargando…', noEmail:'Ningún correo seleccionado', noEmailSub:'Abre un correo o invitación en Verse.', noAttendees:'Sin asistentes externos', noAttendeesSub:'Solo asistentes internos o lista no legible.', organisation:'Organización', emailsFrom:n=>`${n} correos de este remitente`, aiHandoff:'Preguntar a la IA', sharedConn:'Encontrar conexiones compartidas', timezone:t=>`Hora local: ${t}` },
  'pt-BR': { searchAs:'Pesquisar no LinkedIn:', searchCompany:'Pesquisar empresa no LinkedIn:', orSearch:'Ou pesquisar manualmente:', nameComp:'Nome ou empresa…', compName:'Nome da empresa…', loading:'Carregando…', noEmail:'Nenhum e-mail selecionado', noEmailSub:'Abra um e-mail ou convite no Verse.', noAttendees:'Sem participantes externos', noAttendeesSub:'Apenas participantes internos ou lista ilegível.', organisation:'Organização', emailsFrom:n=>`${n} e-mails deste remetente`, aiHandoff:'Perguntar à IA', sharedConn:'Encontrar conexões em comum', timezone:t=>`Hora local: ${t}` },
  'nl':    { searchAs:'Zoeken op LinkedIn:', searchCompany:'Bedrijf zoeken op LinkedIn:', orSearch:'Of handmatig zoeken:', nameComp:'Naam of bedrijf…', compName:'Bedrijfsnaam…', loading:'Laden…', noEmail:'Geen e-mail geselecteerd', noEmailSub:'Open een e-mail of uitnodiging in Verse.', noAttendees:'Geen externe deelnemers', noAttendeesSub:'Alleen interne deelnemers of lijst niet leesbaar.', organisation:'Organisatie', emailsFrom:n=>`${n} e-mails van deze afzender`, aiHandoff:'AI over deze e-mail vragen', sharedConn:'Gedeelde connecties vinden', timezone:t=>`Lokale tijd: ${t}` },
  'ru':    { searchAs:'Поиск в LinkedIn:', searchCompany:'Поиск компании в LinkedIn:', orSearch:'Или поиск вручную:', nameComp:'Имя или компания…', compName:'Название компании…', loading:'Загрузка…', noEmail:'Письмо не выбрано', noEmailSub:'Откройте письмо или приглашение в Verse.', noAttendees:'Нет внешних участников', noAttendeesSub:'Только внутренние участники или список недоступен.', organisation:'Организация', emailsFrom:n=>`${n} писем от этого отправителя`, aiHandoff:'Спросить ИИ', sharedConn:'Найти общие связи', timezone:t=>`Местное время: ${t}` },
  'pl':    { searchAs:'Szukaj na LinkedIn:', searchCompany:'Szukaj firmy na LinkedIn:', orSearch:'Lub szukaj ręcznie:', nameComp:'Imię lub firma…', compName:'Nazwa firmy…', loading:'Ładowanie…', noEmail:'Nie wybrano wiadomości', noEmailSub:'Otwórz e-mail lub zaproszenie w Verse.', noAttendees:'Brak zewnętrznych uczestników', noAttendeesSub:'Tylko wewnętrzni uczestnicy lub lista niedostępna.', organisation:'Organizacja', emailsFrom:n=>`${n} wiadomości od tego nadawcy`, aiHandoff:'Zapytaj AI', sharedConn:'Znajdź wspólne kontakty', timezone:t=>`Czas lokalny: ${t}` },
  'cs':    { searchAs:'Hledat na LinkedIn:', searchCompany:'Hledat firmu na LinkedIn:', orSearch:'Nebo hledat ručně:', nameComp:'Jméno nebo firma…', compName:'Název firmy…', loading:'Načítání…', noEmail:'Žádný e-mail nevybrán', noEmailSub:'Otevřete e-mail nebo pozvánku ve Verse.', noAttendees:'Žádní externí účastníci', noAttendeesSub:'Pouze interní účastníci nebo seznam nelze přečíst.', organisation:'Organizace', emailsFrom:n=>`${n} e-mailů od tohoto odesílatele`, aiHandoff:'Zeptat se AI', sharedConn:'Najít společné kontakty', timezone:t=>`Místní čas: ${t}` },
  'hu':    { searchAs:'Keresés a LinkedIn-en:', searchCompany:'Cég keresése LinkedIn-en:', orSearch:'Vagy keresés kézzel:', nameComp:'Név vagy cég…', compName:'Cég neve…', loading:'Betöltés…', noEmail:'Nincs kiválasztott e-mail', noEmailSub:'Nyisson meg egy e-mailt vagy meghívót a Verse-ben.', noAttendees:'Nincsenek külső résztvevők', noAttendeesSub:'Csak belső résztvevők vagy a lista nem olvasható.', organisation:'Szervezet', emailsFrom:n=>`${n} e-mail ettől a feladótól`, aiHandoff:'AI kérdezése', sharedConn:'Közös kapcsolatok keresése', timezone:t=>`Helyi idő: ${t}` },
  'ja':    { searchAs:'LinkedInで検索:', searchCompany:'LinkedIn企業検索:', orSearch:'または手動で検索:', nameComp:'名前または会社…', compName:'会社名…', loading:'読み込み中…', noEmail:'メールが選択されていません', noEmailSub:'Verseでメールまたは招待状を開いてください。', noAttendees:'外部参加者なし', noAttendeesSub:'内部参加者のみか、リストが読み取れません。', organisation:'組織', emailsFrom:n=>`この送信者から${n}通のメール`, aiHandoff:'AIに質問する', sharedConn:'共通のつながりを探す', timezone:t=>`現地時間: ${t}` },
  'ko':    { searchAs:'LinkedIn 검색:', searchCompany:'LinkedIn 회사 검색:', orSearch:'또는 직접 검색:', nameComp:'이름 또는 회사…', compName:'회사 이름…', loading:'로딩 중…', noEmail:'이메일이 선택되지 않았습니다', noEmailSub:'Verse에서 이메일 또는 초대장을 여세요.', noAttendees:'외부 참석자 없음', noAttendeesSub:'내부 참석자만 있거나 목록을 읽을 수 없습니다.', organisation:'조직', emailsFrom:n=>`이 발신자로부터 ${n}개의 이메일`, aiHandoff:'AI에게 질문하기', sharedConn:'공통 연결 찾기', timezone:t=>`현지 시간: ${t}` },
  'zh':    { searchAs:'在LinkedIn搜索:', searchCompany:'搜索LinkedIn公司:', orSearch:'或手动搜索:', nameComp:'姓名或公司…', compName:'公司名称…', loading:'加载中…', noEmail:'未选择邮件', noEmailSub:'请在Verse中打开邮件或日历邀请。', noAttendees:'没有外部与会者', noAttendeesSub:'仅有内部与会者或无法读取列表。', organisation:'组织', emailsFrom:n=>`来自此发件人的${n}封邮件`, aiHandoff:'向AI提问', sharedConn:'查找共同联系人', timezone:t=>`当地时间: ${t}` },
  'zh-TW': { searchAs:'在LinkedIn搜尋:', searchCompany:'搜尋LinkedIn公司:', orSearch:'或手動搜尋:', nameComp:'姓名或公司…', compName:'公司名稱…', loading:'載入中…', noEmail:'未選取郵件', noEmailSub:'請在Verse中開啟郵件或行事曆邀請。', noAttendees:'沒有外部與會者', noAttendeesSub:'僅有內部與會者或無法讀取列表。', organisation:'組織', emailsFrom:n=>`來自此寄件人的${n}封郵件`, aiHandoff:'向AI提問', sharedConn:'尋找共同連結', timezone:t=>`當地時間: ${t}` },
  'eu':    { searchAs:'LinkedIn-en bilatu:', searchCompany:'LinkedIn enpresa bilaketa:', orSearch:'Edo eskuz bilatu:', nameComp:'Izena edo enpresa…', compName:'Enpresa izena…', loading:'Kargatzen…', noEmail:'Ez dago mezurik hautatuta', noEmailSub:'Ireki mezu bat edo gonbidapen bat Verse-n.', noAttendees:'Ez dago kanpoko parte-hartzailerik', noAttendeesSub:'Barneko parte-hartzaileak soilik edo zerrenda ezin da irakurri.', organisation:'Erakundea', emailsFrom:n=>`${n} mezu bidaltzaile honetatik`, aiHandoff:'Galdetu AIari mezu honi buruz', sharedConn:'Aurkitu konexio partekatuak', timezone:t=>`Tokiko ordua: ${t}` },
  'ca':    { searchAs:'Cerca a LinkedIn:', searchCompany:'Cerca empresa a LinkedIn:', orSearch:'O cerca manualment:', nameComp:'Nom o empresa…', compName:'Nom de l\'empresa…', loading:'Carregant…', noEmail:'Cap correu seleccionat', noEmailSub:'Obre un correu o una invitació a Verse.', noAttendees:'No hi ha assistents externs', noAttendeesSub:'Només assistents interns o la llista no es pot llegir.', organisation:'Organització', emailsFrom:n=>`${n} correus d\'aquest remitent`, aiHandoff:'Pregunta a la IA sobre aquest correu', sharedConn:'Troba connexions compartides', timezone:t=>`Hora local: ${t}` },
};

function getStrings() {
  const lang = _settings.language || navigator.language || 'en';
  return UI[lang] || UI[lang.split('-')[0]] || UI['en-AU'];
}

// ── Timezone detection ────────────────────────────────────────────────────────
// Maps common TLDs and known domains to IANA timezones
const TLD_TZ = {
  'au':'Australia/Sydney','nz':'Pacific/Auckland','jp':'Asia/Tokyo','kr':'Asia/Seoul',
  'cn':'Asia/Shanghai','tw':'Asia/Taipei','hk':'Asia/Hong_Kong','sg':'Asia/Singapore',
  'in':'Asia/Kolkata','ae':'Asia/Dubai','sa':'Asia/Riyadh','il':'Asia/Jerusalem',
  'de':'Europe/Berlin','fr':'Europe/Paris','it':'Europe/Rome','es':'Europe/Madrid',
  'pt':'Europe/Lisbon','nl':'Europe/Amsterdam','be':'Europe/Brussels','ch':'Europe/Zurich',
  'at':'Europe/Vienna','se':'Europe/Stockholm','no':'Europe/Oslo','dk':'Europe/Copenhagen',
  'fi':'Europe/Helsinki','pl':'Europe/Warsaw','cz':'Europe/Prague','hu':'Europe/Budapest',
  'ru':'Europe/Moscow','ua':'Europe/Kiev','tr':'Europe/Istanbul','za':'Africa/Johannesburg',
  'ng':'Africa/Lagos','ke':'Africa/Nairobi','eg':'Africa/Cairo','br':'America/Sao_Paulo',
  'mx':'America/Mexico_City','ar':'America/Argentina/Buenos_Aires','cl':'America/Santiago',
  'co':'America/Bogota','ca':'America/Toronto','uk':'Europe/London','gb':'Europe/London',
  'ie':'Europe/Dublin','io':'Indian/Chagos','id':'Asia/Jakarta','th':'Asia/Bangkok',
  'vn':'Asia/Ho_Chi_Minh','ph':'Asia/Manila','my':'Asia/Kuala_Lumpur','pk':'Asia/Karachi',
};
const DOMAIN_TZ = {
  'isw.net.au':'Australia/Sydney','gov.au':'Australia/Sydney','edu.au':'Australia/Sydney',
  'co.uk':'Europe/London','gov.uk':'Europe/London','ac.uk':'Europe/London',
  'co.nz':'Pacific/Auckland','govt.nz':'Pacific/Auckland',
  'co.jp':'Asia/Tokyo','co.kr':'Asia/Seoul','com.cn':'Asia/Shanghai',
  'com.br':'America/Sao_Paulo','com.au':'Australia/Sydney','com.sg':'Asia/Singapore',
  'com.hk':'Asia/Hong_Kong','com.tw':'Asia/Taipei','co.za':'Africa/Johannesburg',
};

function detectTimezone(domain) {
  if (!domain) return null;
  const lower = domain.toLowerCase();
  // Try full domain first (e.g. isw.net.au)
  for (const [pattern, tz] of Object.entries(DOMAIN_TZ)) {
    if (lower.endsWith('.' + pattern) || lower === pattern) return tz;
  }
  // Try TLD (e.g. .au, .de)
  const tld = lower.split('.').pop();
  return TLD_TZ[tld] || null;
}

function formatLocalTime(tz) {
  try {
    return new Date().toLocaleTimeString([], { timeZone: tz, hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  } catch (e) { return null; }
}

// ── Pronouns & pronunciation ──────────────────────────────────────────────────
function extractPronounsAndPronunciation(bodyText) {
  let pronouns = '';
  let pronunciation = '';

  // Pronouns — common patterns in signatures
  const pronounPatterns = [
    /\bpronouns?:?\s*([\w/]+(?:\s*\/\s*[\w]+)*)/i,
    /\((she\/her|he\/him|they\/them|she\/they|he\/they|ze\/zir|xe\/xem)[^)]*\)/i,
    /\b(she\/her|he\/him|they\/them|she\/they|he\/they)\b/i,
  ];
  for (const re of pronounPatterns) {
    const m = (bodyText || '').match(re);
    if (m) { pronouns = m[1] || m[0].replace(/[()]/g,'').trim(); break; }
  }

  // Name pronunciation — patterns like "pronounced: JON", "(pron. ka-MAL-a)"
  const pronPatterns = [
    /pronounced?:?\s*["']?([^"'\n,]{2,30})["']?/i,
    /\(pron\.?\s+([^)]{2,30})\)/i,
    /name is pronounced\s+([^\n,]{2,30})/i,
  ];
  for (const re of pronPatterns) {
    const m = (bodyText || '').match(re);
    if (m) { pronunciation = m[1].trim(); break; }
  }

  return { pronouns, pronunciation };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function shouldActivate() {
  return new Promise(resolve => {
    _api.storage.local.get("verseUrl", ({ verseUrl }) => {
      if (!verseUrl) { resolve(false); return; }
      try {
        const configured = new URL(verseUrl.startsWith('http') ? verseUrl : 'https://' + verseUrl);
        resolve(window.location.hostname === configured.hostname);
      } catch (e) { resolve(false); }
    });
  });
}

const VERSE_NOISE = [
  /\bto\s+me\s*[,(]?\s*cc\s*[)]?/gi, /[,(]\s*cc\s*[)]/gi, /\bto\s+me\b/gi, /\bcc\b/gi,
  /\breply[- ]to\b/gi, /\bvia\b.*/gi, /\bon behalf of\b.*/gi,
  /\d{1,2}[\/:.]\d{2}/g, /\b(mon|tue|wed|thu|fri|sat|sun)\b/gi, /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi,
];

function cleanName(raw) {
  let s = (raw || '').split(/[\n\r]/)[0];
  s = s.replace(/[\w.+-]+@[\w.-]+\.\w+/g, '').replace(/[<>()]/g, '');
  VERSE_NOISE.forEach(re => { s = s.replace(re, ''); });
  return s.replace(/[,;:\-–—|]+$/g, '').trim();
}

// ── Sender history ────────────────────────────────────────────────────────────
async function recordSenderSeen(email) {
  if (!email) return;
  const key = 'hll_hist_' + email.toLowerCase();
  try {
    const stored = await _api.storage.local.get(key);
    _api.storage.local.set({ [key]: (stored[key] || 0) + 1 });
  } catch (e) {}
}

async function getSenderCount(email) {
  if (!email) return 0;
  const key = 'hll_hist_' + email.toLowerCase();
  try { const s = await _api.storage.local.get(key); return s[key] || 0; } catch (e) { return 0; }
}

// ── Panel position persistence ────────────────────────────────────────────────
function savePanelPosition(panel) {
  const { left, top, width, height } = panel.style;
  _api.storage.local.set({ hll_pos: { left, top, width, height } }).catch(() => {});
}

async function restorePanelPosition(panel) {
  try {
    const stored = await _api.storage.local.get('hll_pos');
    const pos = stored.hll_pos;
    if (pos && pos.left) {
      panel.style.left = pos.left; panel.style.top = pos.top;
      panel.style.right = 'auto'; panel.style.bottom = 'auto';
      if (pos.width)  panel.style.width  = pos.width;
      if (pos.height) panel.style.height = pos.height;
    } else {
      const btns = Array.from(document.querySelectorAll('[data-huddo-ext-btn]'));
      const maxSlot = Math.max(0, btns.length - 1);
      panel.style.bottom = (90 + maxSlot * 56 + 48 + 10) + 'px';
      panel.style.right  = '7px';
      panel.style.top    = 'auto';
      panel.style.left   = 'auto';
    }
  } catch (e) {}
}

// ── Signature parsing ─────────────────────────────────────────────────────────
function extractSignatureInfo() {
  let bodyText = '';
  document.querySelectorAll('.pim-mailread-mailcontent').forEach(el => {
    if (el.classList.contains('collapsed-mailcontent')) return;
    const t = el.innerText?.trim() || '';
    if (t.length > bodyText.length) bodyText = t;
  });
  if (!bodyText) return { sigName: '', jobTitle: '', pronouns: '', pronunciation: '' };

  const signOffPattern = /(?:^|\n)(?:kind regards|regards|thanks|thank you|cheers|best|sincerely|warm regards|yours|with thanks)[,.]?\s*\n([\s\S]{0,400})/i;
  const dashPattern = /(?:^|\n)--\s*\n([\s\S]{0,400})/;
  const match = bodyText.match(signOffPattern) || bodyText.match(dashPattern);
  let sigBlock = match ? match[1] : bodyText.slice(-400);

  const lines = sigBlock.split('\n').map(l => l.trim()).filter(l => l.length > 1 && l.length < 80);
  let sigName = '', jobTitle = '';

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (line.includes('@') || line.match(/^[+\d\s().-]{7,}$/) || line.match(/^https?:\/\//)) continue;
    if (line.match(/\b(pty|ltd|inc|llc|corp|abn|acn)\b/i)) continue;
    if (!sigName && line.match(/^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/)) { sigName = line; continue; }
    if (!jobTitle && sigName && (
      line.match(/\b(manager|director|head|lead|officer|executive|president|founder|owner|consultant|engineer|developer|analyst|designer|coordinator|administrator|specialist|advisor|partner|associate)\b/i) ||
      line.includes('|') || (line.length > 5 && line.length < 60 && !line.match(/\d{3,}/))
    )) { jobTitle = line; break; }
  }

  const { pronouns, pronunciation } = extractPronounsAndPronunciation(sigBlock);
  return { sigName, jobTitle, pronouns, pronunciation };
}

// ── Clearbit enrichment ───────────────────────────────────────────────────────
const _clearbitCache = {};

async function enrichWithClearbit(domain) {
  if (!domain) return null;
  const genericDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','me.com','live.com','msn.com','aol.com'];
  if (genericDomains.includes(domain.toLowerCase())) return null;
  if (_clearbitCache[domain]) return _clearbitCache[domain];
  try {
    const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(domain)}`, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const match = data.find(c => c.domain === domain) || data.find(c => domain.includes(c.domain)) || data[0];
    if (!match) return null;
    const result = {
      name:     match.name   || '',
      domain:   match.domain || domain,
      logo:     match.logo   || `https://logo.clearbit.com/${domain}`,
      industry: match.category?.industry || match.category?.sector || '',
      employees:match.metrics?.employees || match.metrics?.employeesRange || '',
    };
    _clearbitCache[domain] = result;
    return result;
  } catch (e) { return null; }
}

// ── Email recipient parsing ───────────────────────────────────────────────────
function parseEmailRecipients(senderEmail) {
  const people = [];
  const seen = new Set();
  if (senderEmail) seen.add(senderEmail.toLowerCase());
  const genericDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','me.com','live.com','msn.com','aol.com'];
  document.querySelectorAll('.socpimCombinedList .socpimNameBtn[socpimnameemail]').forEach(el => {
    const email = (el.getAttribute('socpimnameemail') || '').trim().toLowerCase();
    if (!email || !email.includes('@') || seen.has(email)) return;
    seen.add(email);
    const name = el.getAttribute('aria-label') || el.innerText?.trim() || '';
    const domain = email.split('@')[1] || '';
    let company = '';
    if (domain && !genericDomains.includes(domain)) {
      company = domain.split('.')[0]; company = company.charAt(0).toUpperCase() + company.slice(1);
    }
    people.push({ name, email, company, domain, jobTitle:'', pronouns:'', pronunciation:'' });
  });
  return people;
}

// ── getSenderInfo ─────────────────────────────────────────────────────────────
function getSenderInfo() {
  const senderEl = document.querySelector(
    '.socpimMailingList.pim-mailread-recipient, .pim-mailread-from .lotusSprite + span, ' +
    '.pim-mailread-from [title], .pim-mailread-header .pim-mailread-from'
  );
  let name = '', email = '';
  if (senderEl) {
    const raw = senderEl.getAttribute('title') || senderEl.innerText?.trim() || '';
    const emailMatch = raw.match(/[\w.+-]+@[\w.-]+\.\w+/);
    if (emailMatch) { email = emailMatch[0]; name = cleanName(raw.replace(emailMatch[0], '')); }
    else { name = cleanName(raw); }
  }
  if (!email) {
    for (const el of document.querySelectorAll('.pim-mailread-container *')) {
      const m = (el.innerText?.trim() || '').match(/[\w.+-]+@[\w.-]+\.\w+/);
      if (m && el.children.length === 0) { email = m[0]; break; }
    }
  }
  const { sigName, jobTitle, pronouns, pronunciation } = extractSignatureInfo();
  if (sigName && !name) name = sigName;
  if (!name && email) name = email.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());

  let company = '';
  for (const sel of ['.pim-mailread-from .pim-org','.pim-mailread-from .org','.pim-mailread-from [class*="org"]','.pim-mailread-from [class*="company"]','.lotusCardFrame .org','.pimContactCard [class*="company"]']) {
    const txt = document.querySelector(sel)?.innerText?.trim();
    if (txt && txt.length > 1 && txt.length < 80) { company = txt; break; }
  }

  const genericDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','me.com','live.com','msn.com','aol.com'];
  const domain = email.split('@')[1] || '';
  if (!company && domain && !genericDomains.includes(domain.toLowerCase())) {
    company = domain.split('.')[0]; company = company.charAt(0).toUpperCase() + company.slice(1);
  }

  const subject = document.querySelector('.pimMailSubject, h2.idw-label')?.innerText?.trim() || '';
  const recipients = parseEmailRecipients(email);
  return { name, email, company, jobTitle, pronouns, pronunciation, domain, subject, type: 'email', recipients };
}

// ── Calendar ──────────────────────────────────────────────────────────────────
function isCalendarInvite() { return !!document.querySelector('.pimEventChair'); }

function buildNameEmailMap() {
  const map = {};
  document.querySelectorAll('[itemprop="attendee"], [itemprop="organizer"]').forEach(el => {
    const name = el.querySelector('[itemprop="name"]')?.innerText?.trim();
    const email = el.querySelector('a[href*="mailto"]')?.getAttribute('href')?.replace('mailto:','').trim().toLowerCase();
    if (name && email && !name.includes('@')) map[email] = name;
  });
  return map;
}

function getCalendarInfo() {
  const genericDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','me.com','live.com','msn.com','aol.com'];
  const skipEmails = ['calendar-notification@google.com'];
  const nameMap = buildNameEmailMap();

  function domainToCompany(email) {
    const d = (email||'').split('@')[1]||'';
    if (!d||genericDomains.includes(d.toLowerCase())) return '';
    const co = d.split('.')[0]; return co.charAt(0).toUpperCase()+co.slice(1);
  }

  function parsePimPerson(el) {
    if (!el) return null;
    let email = el.getAttribute('socpimnameemail')||'';
    if (email.startsWith('CN=')||skipEmails.includes(email.toLowerCase())) return null;
    if (email && !email.includes('@')) email = '';
    const rawName = el.innerText?.trim()||'';
    const name = nameMap[email.toLowerCase()] || cleanName(rawName.includes('@')?'':rawName) ||
      (email ? email.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) : '');
    if (!name && !email) return null;
    const domain = email.split('@')[1]||'';
    return { name, email, company: domainToCompany(email), domain, jobTitle:'', pronouns:'', pronunciation:'' };
  }

  let organiser = null;
  organiser = parsePimPerson(document.querySelector('.pimEventChair .pimPerson'));
  const attendees = [], seenEmails = new Set();
  if (organiser?.email) seenEmails.add(organiser.email.toLowerCase());
  document.querySelectorAll('.pimRequiredInvitees .pimRecipient, .pimOptionalInvitees .pimRecipient').forEach(el => {
    const p = parsePimPerson(el); if (!p) return;
    const key = (p.email||p.name||'').toLowerCase(); if (seenEmails.has(key)) return;
    seenEmails.add(key); attendees.push(p);
  });
  return { type:'calendar', organiser, attendees, meetingTitle: document.querySelector('h2')?.innerText?.trim()||'' };
}

function getContext() {
  if (isCalendarInvite()) return getCalendarInfo();
  const info = getSenderInfo();
  if (!info.name && !info.email) return { type:'empty' };
  return info;
}

// ── Org detection ─────────────────────────────────────────────────────────────
const ORG_EMAIL_PREFIXES = ['noreply','no-reply','donotreply','do-not-reply','notifications','notification','info','hello','hi','hey','support','help','contact','enquiries','enquiry','mail','email','marketing','newsletter','news','updates','update','alerts','admin','team','office','sales','billing','accounts','invoice','receipts','service','services','care','feedback','reply','bounce','mailer','postmaster'];

function isOrgSender({ name, email }) {
  const prefix = (email||'').split('@')[0].toLowerCase().replace(/[._+-]/g,'');
  if (ORG_EMAIL_PREFIXES.some(p => prefix===p||prefix.startsWith(p))) return true;
  if (!name) return true;
  if (/\b(pty|ltd|inc|llc|corp|co\.|group|team|support|noreply|newsletter|update|alert|notification|communications|solutions|services|consulting|technologies|systems|digital|media|agency|studio|ventures|holdings|foundation|association|society|council|department)\b/i.test(name)) return true;
  const words = name.trim().split(/\s+/);
  if (words.length >= 4 && words.every(w => /^[A-Z]/.test(w))) return true;
  if (/[&|]/.test(name)) return true;
  if (words.length <= 2 && /^[A-Z][a-z]/.test(name)) return false;
  return false;
}

// ── Build search URLs ─────────────────────────────────────────────────────────
function buildSearchUrls(senderInfo, clearbitData) {
  const { name, email, company, jobTitle } = senderInfo;
  const companyName = clearbitData?.name || company || '';
  const urls = [], isOrg = isOrgSender(senderInfo);
  const showSalesNav = _settings.salesNav;
  const templates = _settings.customTemplates || [];

  if (isOrg) {
    const orgName = name||companyName||email?.split('@')[1]?.split('.')[0]||'';
    if (orgName) {
      urls.push({ label:`${orgName} on LinkedIn`, icon:'company', url:`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(orgName)}` });
      if (showSalesNav) urls.push({ label:`${orgName} in Sales Navigator`, icon:'salenav', url:`https://www.linkedin.com/sales/search/company?query=(keywords:${encodeURIComponent(orgName)})` });
      urls.push({ label:`Google → LinkedIn company`, icon:'google', url:`https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/company "${orgName}"`)}` });
      // Custom templates for org
      templates.forEach(t => {
        if (!t.name || !t.url) return;
        const u = t.url.replace('{name}', encodeURIComponent(orgName)).replace('{company}', encodeURIComponent(orgName));
        urls.push({ label: t.name, icon:'custom', url: u });
      });
    }
  } else {
    const q = jobTitle ? `${name} ${jobTitle} ${companyName}` : name+(companyName?` ${companyName}`:'');
    if (name && companyName) urls.push({ label:`${name} at ${companyName}`, icon:'person', url:`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q)}` });
    if (name) urls.push({ label:`${name} (name only)`, icon:'person', url:`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}` });
    if (showSalesNav && name) urls.push({ label:`Open in Sales Navigator`, icon:'salenav', url:`https://www.linkedin.com/sales/search/people?query=(keywords:${encodeURIComponent(name+(companyName?` ${companyName}`:``))})` });
    if (name) {
      const gq = companyName ? `site:linkedin.com/in "${name}" "${companyName}"` : `site:linkedin.com/in "${name}"`;
      urls.push({ label:`Google → LinkedIn`, icon:'google', url:`https://www.google.com/search?q=${encodeURIComponent(gq)}` });
    }
    // Shared connections
    if (name) {
      const scQ = companyName ? `${name} ${companyName}` : name;
      urls.push({ label: getStrings().sharedConn, icon:'shared', url:`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(scQ)}&network=%5B%22F%22%2C%22S%22%5D` });
    }
    // Custom templates for person
    templates.forEach(t => {
      if (!t.name || !t.url) return;
      const u = t.url.replace('{name}', encodeURIComponent(name||'')).replace('{company}', encodeURIComponent(companyName||''));
      urls.push({ label: t.name, icon:'custom', url: u });
    });
  }
  return { urls, isOrg };
}

// ── Panel UI ──────────────────────────────────────────────────────────────────
let _panelCleanup = null;
function removePanel() {
  if (_panelCleanup) { _panelCleanup(); _panelCleanup = null; }
  document.getElementById('hll-panel')?.remove();
}

function renderPersonSection(person, clearbitData) {
  const { name, email, company, jobTitle, pronouns, pronunciation, senderCount, domain } = person;
  const { urls, isOrg } = buildSearchUrls(person, clearbitData);
  const s = getStrings();
  const displayName = name || email || 'Unknown';
  const displayCompany = clearbitData?.name || company || '';
  const tz = detectTimezone(domain);
  const localTime = tz ? formatLocalTime(tz) : null;

  // Industry/size from Clearbit
  const industry  = clearbitData?.industry || '';
  const employees = clearbitData?.employees || '';

  const INDUSTRY_ICONS = { 'Software':'💻','Technology':'💻','Internet':'🌐','Finance':'🏦','Banking':'🏦','Healthcare':'🏥','Medical':'🏥','Education':'🎓','Government':'🏛️','Manufacturing':'🏭','Retail':'🛍️','Media':'📺','Marketing':'📢','Consulting':'💼','Legal':'⚖️','Real Estate':'🏠','Transportation':'🚚','Energy':'⚡','Hospitality':'🏨','Food':'🍽️','Construction':'🏗️' };
  const industryIcon = industry ? (Object.entries(INDUSTRY_ICONS).find(([k]) => industry.toLowerCase().includes(k.toLowerCase()))?.[1] || '🏢') : '';

  const iconHtml = u => {
    if (u.icon==='google')  return '🔍';
    if (u.icon==='company') return '🏢';
    if (u.icon==='salenav') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2" style="width:14px;height:14px"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.8-1.38-1.8A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>';
    if (u.icon==='shared')  return '🤝';
    if (u.icon==='custom')  return '⭐';
    return '🔗';
  };

  const logoHtml = clearbitData?.logo ? `<img src="${escHtml(clearbitData.logo)}" width="16" height="16" style="border-radius:3px;object-fit:contain;vertical-align:middle;margin-right:4px" onerror="this.style.display='none'">` : '';
  const avatarHtml = isOrg
    ? `<div id="hll-avatar" class="hll-avatar-org">${clearbitData?.logo ? `<img src="${escHtml(clearbitData.logo)}" width="28" height="28" style="border-radius:4px;object-fit:contain" onerror="this.remove()">` : '🏢'}</div>`
    : `<div id="hll-avatar">${getInitials(displayName)}</div>`;

  // Verse AI handoff button — only show if the AI assistant panel button exists
  const aiToggleExists = !!document.getElementById('cvp-toggle');
  const aiHandoffHtml = aiToggleExists ? `
    <button class="hll-ai-handoff" id="hll-ai-handoff">
      <span>✦</span> ${escHtml(s.aiHandoff)}
    </button>` : '';

  return `
    <div class="hll-person-card">
      <div id="hll-sender">
        ${avatarHtml}
        <div id="hll-sender-info">
          <div id="hll-sender-name">${escHtml(displayName)}</div>
          ${jobTitle     ? `<div id="hll-sender-title">${escHtml(jobTitle)}</div>` : ''}
          ${pronouns     ? `<div class="hll-meta-badge hll-pronouns">${escHtml(pronouns)}</div>` : ''}
          ${pronunciation? `<div class="hll-meta-badge hll-pronunciation">🔊 ${escHtml(pronunciation)}</div>` : ''}
          ${email        ? `<div id="hll-sender-email">${escHtml(email)}</div>` : ''}
          ${displayCompany ? `<div id="hll-sender-company">${logoHtml}${escHtml(displayCompany)}</div>` : ''}
          ${(industry || employees) ? `<div class="hll-company-meta">${industryIcon ? `<span>${industryIcon} ${escHtml(industry)}</span>` : ''}${employees ? `<span class="hll-emp-badge">👥 ${escHtml(String(employees))}</span>` : ''}</div>` : ''}
          ${localTime    ? `<div class="hll-timezone">${escHtml(s.timezone(localTime))}</div>` : ''}
          ${isOrg        ? `<div class="hll-org-badge">🏢 ${escHtml(s.organisation)}</div>` : ''}
          ${senderCount > 1 ? `<div class="hll-history-badge">${escHtml(s.emailsFrom(senderCount))}</div>` : ''}
        </div>
      </div>
      <div id="hll-search-label">${isOrg ? s.searchCompany : s.searchAs}</div>
      <div id="hll-links">
        ${urls.map(u => `
          <div class="hll-link-row">
            <button class="hll-link-btn" data-url="${escHtml(u.url)}">
              <span class="hll-link-icon">${iconHtml(u)}</span>
              <span class="hll-link-label">${escHtml(u.label)}</span>
              <span class="hll-link-arrow">→</span>
            </button>
            <button class="hll-copy-btn" data-url="${escHtml(u.url)}" title="Copy link">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
      ${aiHandoffHtml}
      <div id="hll-manual">
        <div id="hll-manual-label">${s.orSearch}</div>
        <div id="hll-manual-row">
          <input class="hll-manual-input" type="text" placeholder="${isOrg ? s.compName : s.nameComp}" value="${escHtml(isOrg?(name||displayCompany||''):name)}">
          <button class="hll-manual-btn">Go</button>
        </div>
      </div>
    </div>
  `;
}

async function createPanel(context) {
  removePanel();
  const panel = document.createElement('div');
  panel.id = 'hll-panel';

  // Apply dark mode class immediately
  const dark = _settings.darkMode === 'dark' || (_settings.darkMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) panel.classList.add('hll-dark');

  const isEmpty = context.type==='empty', isCalendar = context.type==='calendar';
  const s = getStrings();
  const people = [];
  if (!isEmpty) {
    if (isCalendar) {
      if (context.organiser) people.push({...context.organiser, role:'Organiser'});
      (context.attendees||[]).forEach(a => people.push({...a, role:'Attendee'}));
    } else {
      people.push({...context, role:'Sender'});
      (context.recipients||[]).forEach(r => people.push({...r, role:'Recipient'}));
    }
  }

  const showTabs = people.length > 1;
  const tabsHtml = showTabs ? `<div id="hll-tabs">${people.map((p,i)=>`
    <button class="hll-tab${i===0?' active':''}" data-tab="${i}">
      <span class="hll-tab-avatar">${getInitials(p.name||p.email||'?')}</span>
      <span class="hll-tab-name">${escHtml((p.name||p.email||'Unknown').split(' ')[0])}</span>
      ${p.role==='Organiser'?'<span class="hll-tab-role">org</span>':''}
      ${p.role==='Recipient'?'<span class="hll-tab-role hll-tab-role-to">to</span>':''}
    </button>`).join('')}</div>` : '';

  const subtitleHtml = isCalendar && context.meetingTitle
    ? `<div id="hll-cal-title"><span id="hll-cal-icon">📅</span><span>${escHtml(context.meetingTitle)}</span></div>`
    : (!isCalendar && !isEmpty && context.subject && people.length > 1)
      ? `<div id="hll-cal-title"><span id="hll-cal-icon">✉️</span><span>${escHtml(context.subject)}</span></div>`
      : '';
  const emptyHtml = isCalendar
    ? `<div id="hll-empty"><div id="hll-empty-icon">📅</div><div id="hll-empty-title">${s.noAttendees}</div><div id="hll-empty-sub">${s.noAttendeesSub}</div></div>`
    : `<div id="hll-empty"><div id="hll-empty-icon">✉️</div><div id="hll-empty-title">${s.noEmail}</div><div id="hll-empty-sub">${s.noEmailSub}</div></div>`;

  panel.innerHTML = `
    <div id="hll-header">
      <div id="hll-title">
        <svg width="22" height="22" viewBox="0 0 32 32" style="flex-shrink:0;border-radius:6px;background:#0A66C2">
          <text x="16" y="16" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central" letter-spacing="-0.5">in</text>
        </svg>
        <span>LinkedIn Extension for HCL Verse</span>
      </div>
      <button id="hll-close" title="Close">✕</button>
    </div>
    ${subtitleHtml}${tabsHtml}
    <div id="hll-person-body" style="overflow-y:auto;flex:1">
      ${people.length > 0 ? `<div class="hll-loading">${s.loading}</div>` : emptyHtml}
    </div>
    <div class="hll-resizer n" data-dir="n"></div><div class="hll-resizer s" data-dir="s"></div>
    <div class="hll-resizer e" data-dir="e"></div><div class="hll-resizer w" data-dir="w"></div>
    <div class="hll-resizer nw" data-dir="nw"></div><div class="hll-resizer ne" data-dir="ne"></div>
    <div class="hll-resizer sw" data-dir="sw"></div><div class="hll-resizer se" data-dir="se"></div>
  `;

  document.body.appendChild(panel);
  await restorePanelPosition(panel);
  document.getElementById('hll-close').onclick = () => { savePanelPosition(panel); removePanel(); };

  if (people.length > 0) {
    const fp = people[0];
    // Fetch first person's clearbit + all sender counts in parallel
    const [clearbit, ...counts] = await Promise.all([
      enrichWithClearbit(fp.domain||fp.email?.split('@')[1]),
      ...people.map(p => getSenderCount(p.email))
    ]);
    people.forEach((p, i) => { p.senderCount = counts[i]; });

    recordSenderSeen(fp.email);
    document.getElementById('hll-person-body').innerHTML = renderPersonSection(fp, clearbit);
    wirePanel(panel);

    if (showTabs) {
      // Show count badge on tabs where the person has sent emails before
      panel.querySelectorAll('.hll-tab').forEach((tab, i) => {
        if (people[i].senderCount > 1) {
          const badge = document.createElement('span');
          badge.className = 'hll-tab-count';
          badge.textContent = people[i].senderCount;
          tab.appendChild(badge);
        }
      });

      const cbCache = { [fp.email||'']: clearbit };
      panel.querySelectorAll('.hll-tab').forEach(tab => {
        tab.onclick = async () => {
          panel.querySelectorAll('.hll-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const idx = parseInt(tab.dataset.tab), person = people[idx];
          document.getElementById('hll-person-body').innerHTML = `<div class="hll-loading">${s.loading}</div>`;
          const ek = person.email||'';
          if (!cbCache[ek]) cbCache[ek] = await enrichWithClearbit(person.domain||person.email?.split('@')[1]);
          document.getElementById('hll-person-body').innerHTML = renderPersonSection(person, cbCache[ek]);
          wirePanel(panel);
        };
      });
    }
  }
  const cleanDrag = makeDraggable(panel);
  const cleanResize = makeResizable(panel);
  _panelCleanup = () => { cleanDrag(); cleanResize(); };
}

function wirePanel(panel) {
  // Search links
  panel.querySelectorAll('.hll-link-btn').forEach(btn => {
    btn.onclick = () => _api.runtime.sendMessage({ type:'OPEN_LINKEDIN', url:btn.dataset.url });
  });
  // Copy buttons
  panel.querySelectorAll('.hll-copy-btn').forEach(btn => {
    btn.onclick = () => {
      navigator.clipboard.writeText(btn.dataset.url).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="#0F6E56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        btn.style.color = '#0F6E56';
        setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1800);
      });
    };
  });
  // Manual search
  const input = panel.querySelector('.hll-manual-input'), mbtn = panel.querySelector('.hll-manual-btn');
  if (input && mbtn) {
    const doSearch = () => {
      const q = input.value.trim(); if (!q) return;
      const s = getStrings();
      const url = input.placeholder === s.compName
        ? `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(q)}`
        : `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q)}`;
      _api.runtime.sendMessage({ type:'OPEN_LINKEDIN', url });
    };
    mbtn.onclick = doSearch;
    input.addEventListener('keydown', e => { if (e.key==='Enter') doSearch(); });
  }
  // Verse AI handoff
  const aiBtn = panel.querySelector('#hll-ai-handoff');
  if (aiBtn) {
    aiBtn.onclick = () => {
      const cvp = document.getElementById('cvp-toggle');
      if (cvp) cvp.click();
    };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length === 1 ? (parts[0][0]?.toUpperCase()||'?') : (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
}
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Drag & Resize ─────────────────────────────────────────────────────────────
function makeDraggable(panel) {
  const header = panel.querySelector('#hll-header');
  let dragging=false, startX, startY, startLeft, startTop;
  header.addEventListener('mousedown', e => {
    if (e.target.id==='hll-close') return;
    dragging=true; startX=e.clientX; startY=e.clientY;
    const r=panel.getBoundingClientRect(); startLeft=r.left; startTop=r.top;
    panel.style.right='auto'; panel.style.bottom='auto';
    panel.style.left=startLeft+'px'; panel.style.top=startTop+'px';
    panel.style.maxHeight='none'; e.preventDefault();
  });
  const onMove=e=>{ if(!dragging)return; panel.style.left=Math.max(0,startLeft+(e.clientX-startX))+'px'; panel.style.top=Math.max(0,startTop+(e.clientY-startY))+'px'; };
  const onUp=()=>{ if(dragging){dragging=false;savePanelPosition(panel);} };
  document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
  return () => { document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); };
}
function makeResizable(panel) {
  let resizing=false, dir='', startX, startY, startW, startH, startLeft, startTop;
  panel.querySelectorAll('.hll-resizer').forEach(h => {
    h.addEventListener('mousedown', e => {
      resizing=true; dir=h.dataset.dir; startX=e.clientX; startY=e.clientY;
      startW=panel.offsetWidth; startH=panel.offsetHeight;
      const r=panel.getBoundingClientRect(); startLeft=r.left; startTop=r.top;
      panel.style.right='auto'; panel.style.bottom='auto';
      panel.style.left=startLeft+'px'; panel.style.top=startTop+'px';
      panel.style.maxHeight='none'; e.preventDefault(); e.stopPropagation();
    });
  });
  const onMove=e=>{ if(!resizing)return; const dx=e.clientX-startX, dy=e.clientY-startY, minW=280, minH=200;
    if(dir.includes('e')) panel.style.width=Math.max(minW,startW+dx)+'px';
    if(dir.includes('w')){const nW=Math.max(minW,startW-dx);panel.style.width=nW+'px';panel.style.left=(startLeft+startW-nW)+'px';}
    if(dir.includes('s')) panel.style.height=Math.max(minH,startH+dy)+'px';
    if(dir.includes('n')){const nH=Math.max(minH,startH-dy);panel.style.height=nH+'px';panel.style.top=(startTop+startH-nH)+'px';}
  };
  const onUp=()=>{ if(resizing){resizing=false;savePanelPosition(panel);} };
  document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
  return () => { document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); };
}

// ── Toggle button ─────────────────────────────────────────────────────────────
function addToggleButton() {
  if (document.getElementById('hll-toggle')) return;
  const btn = document.createElement('button');
  btn.id='hll-toggle'; btn.title='Huddo LinkedIn Extension (Alt+L)';
  btn.innerHTML=`<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><text x="16" y="16" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central" letter-spacing="-0.5">in</text></svg>`;
  btn.onclick = () => togglePanel();
  document.body.appendChild(btn);

  // ── Huddo extension stacking ────────────────────────────────────────────────
  // Uses a DOM attribute as shared state so Huddo extensions coordinate
  // across Chrome's content-script isolated worlds (window is not shared).
  const HUDDO_BTN_ATTR = 'data-huddo-ext-btn';
  btn.setAttribute(HUDDO_BTN_ATTR, String(Date.now()));
  const reposition = () => {
    const btns = Array.from(document.querySelectorAll(`[${HUDDO_BTN_ATTR}]`));
    btns.sort((a, b) => Number(a.getAttribute(HUDDO_BTN_ATTR)) - Number(b.getAttribute(HUDDO_BTN_ATTR)));
    const slot = Math.max(0, btns.findIndex(b => b.id === 'hll-toggle'));
    btn.style.bottom = (90 + slot * 56) + 'px';
  };
  reposition();
  const obs = new MutationObserver(mutations => {
    const relevant = mutations.some(m =>
      m.type === 'attributes' ||
      Array.from(m.addedNodes).some(n => n.hasAttribute?.(HUDDO_BTN_ATTR)) ||
      Array.from(m.removedNodes).some(n => n.hasAttribute?.(HUDDO_BTN_ATTR))
    );
    if (relevant) reposition();
  });
  obs.observe(document.body, {
    subtree: true, childList: true,
    attributes: true, attributeFilter: [HUDDO_BTN_ATTR]
  });
}
function togglePanel() {
  const ex = document.getElementById('hll-panel');
  if (ex) { savePanelPosition(ex); removePanel(); return; }
  createPanel(getContext());
}
window.__hllToggle = togglePanel;

// ── Email change detection ────────────────────────────────────────────────────
function watchForEmailChanges() {
  let lastSubject = '', changeTimer = null;
  const obs = new MutationObserver(() => {
    const subjectEl = document.querySelector('.pimMailSubject, h2.idw-label, .pim-mailread-subject, .pim-mailread-header h2');
    const cur = subjectEl?.innerText?.trim() || '';
    const panelOpen = !!document.getElementById('hll-panel');
    if (!panelOpen && _settings.autoOpen && cur && cur !== lastSubject) {
      lastSubject = cur; clearTimeout(changeTimer); changeTimer = setTimeout(() => createPanel(getContext()), 600); return;
    }
    if (panelOpen && cur && cur !== lastSubject) {
      lastSubject = cur; clearTimeout(changeTimer);
      changeTimer = setTimeout(async () => {
        const panel = document.getElementById('hll-panel'); if (!panel) return;
        const { left, top, width, height } = panel.style;
        await createPanel(getContext());
        const np = document.getElementById('hll-panel');
        if (np && left) { np.style.left=left; np.style.top=top; np.style.right='auto'; np.style.bottom='auto'; if(width)np.style.width=width; if(height)np.style.height=height; }
      }, 600);
    }
  });
  const target = document.querySelector('.pim-mailread-container, .lotusShell, #lsMainFrame, body');
  obs.observe(target||document.body, { childList:true, subtree:true });
}

// ── Init ──────────────────────────────────────────────────────────────────────
shouldActivate().then(async active => {
  if (!active) return;
  await loadSettings();

  // Share the configured URL via page localStorage so other Huddo extensions
  // can inherit it if they haven't been configured yet.
  try { if (_settings.verseUrl) localStorage.setItem('__huddo_verse_url', _settings.verseUrl); } catch(e) {}

  // Show the button immediately — it doesn't need the Verse shell to exist
  addToggleButton();

  // Defer email watching until the Verse shell is in the DOM
  const VERSE_SELECTOR = '.lotusShell, #lsMainFrame, .verse-app, .pim-mailread-container, .socpimComposeView';
  if (document.querySelector(VERSE_SELECTOR)) {
    watchForEmailChanges();
  } else {
    const observer = new MutationObserver(() => {
      if (document.querySelector(VERSE_SELECTOR)) { observer.disconnect(); clearTimeout(fallbackTimer); watchForEmailChanges(); }
    });
    observer.observe(document.body, { childList:true, subtree:true });
    const fallbackTimer = setTimeout(() => { observer.disconnect(); watchForEmailChanges(); }, 10000);
  }
  _api.storage.onChanged.addListener(changes => {
    if (changes.autoOpen||changes.salesNav||changes.shortcutEnabled||changes.darkMode||changes.language||changes.customTemplates) loadSettings();
  });
  // Re-apply dark mode if OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyDarkMode);
});

// Allow the popup to retrieve the shared Verse URL written by any Huddo extension
_api.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (msg.type === 'GET_SHARED_VERSE_URL') {
    try { respond({ url: localStorage.getItem('__huddo_verse_url') || '' }); }
    catch(e) { respond({ url: '' }); }
    return true;
  }
});

} // end double-injection guard
