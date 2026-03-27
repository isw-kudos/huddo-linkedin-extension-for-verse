# Huddo LinkedIn Extension for HCL Verse

Look up LinkedIn profiles for email senders, recipients, and calendar attendees — directly inside HCL Verse. One click, no copy-pasting, no tab switching.

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Firefox%20%7C%20Edge-yellow)
![HCL Verse](https://img.shields.io/badge/HCL%20Verse-compatible-blueviolet)

---

## What it does

Open an email or calendar invite in HCL Verse, click the **LinkedIn** button, and the panel appears with instant search links for the sender — and every recipient or attendee — without leaving your inbox.

---

## Features

### Email lookup
- **Sender detection** — automatically extracts name, email, company, and job title from the open email
- **To & CC recipients as tabs** — all recipients appear as switchable tabs alongside the sender, so you can look up anyone in the thread
- **Email history badge** — shows how many emails you've previously received from each person, visible on the tab before you click
- **Signature parsing** — extracts job title, pronouns, and name pronunciation from email signatures

### Calendar lookup
- **Attendee tabs** — every required and optional attendee appears as a tab, with the organiser clearly marked
- **Meeting title** — shown above the tabs for context

### Search options
- **Name + Company** — most targeted, uses both name and inferred company
- **Name only** — broader fallback
- **Google → LinkedIn** — searches Google for the LinkedIn profile directly (often most reliable)
- **Find shared connections** — searches LinkedIn for mutual connections
- **Sales Navigator** — optional, toggle in settings
- **Custom search templates** — define your own URL patterns with `{name}` and `{company}` placeholders

### Enrichment
- **Company logo & industry** — fetched automatically from Clearbit (optional, domain-based)
- **Employee count** — shown in the person card when available
- **Timezone** — infers the contact's local time from their email domain

### Panel
- **Draggable & resizable** — position and size it wherever suits your workflow
- **Position memory** — remembers where you left the panel between emails
- **Auto-open** — optionally opens automatically when you switch to a new email
- **Keyboard shortcut** — `Alt+L` toggles the panel
- **Copy link** — copy any search URL to clipboard with one click
- **Dark mode** — light, dark, or follow OS preference

### Multi-language
Interface strings are localised in 19 languages with automatic browser language detection. Override in settings if needed.

> Supported: English (AU/GB/US), German, French, Italian, Spanish, Portuguese (BR), Dutch, Russian, Polish, Czech, Hungarian, Japanese, Korean, Chinese (Simplified & Traditional)

---

## Works great alongside

[Huddo AI Assistant for HCL Verse](https://github.com/isw-kudos/huddo-ai-assistant-for-verse) — the two extensions are designed to run side by side. When both are active, a one-click **Ask AI about this email** button appears inside the LinkedIn panel, letting you hand off context to the AI assistant without closing the lookup.

---

## Installation

### Chrome, Edge, Brave, Arc, or any Chromium browser

1. Download this repository — click the green **Code** button → **Download ZIP**, then unzip
2. Go to `chrome://extensions`
3. Enable **Developer mode** (toggle, top-right)
4. Click **Load unpacked** and select the unzipped folder
5. Click the extension icon in the toolbar → enter your Verse URL → **Save**
6. Refresh your Verse tab

### Firefox

1. Download and unzip the repository (same as above)
2. Go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select the `manifest.json` file inside the unzipped folder
5. Click the extension icon → enter your Verse URL → **Save**
6. Refresh your Verse tab

> **Note:** Firefox requires re-loading the temporary add-on each browser restart. For a permanent install, the extension would need to be signed via [addons.mozilla.org](https://addons.mozilla.org).

### Configuration

| Setting | Description |
|---|---|
| **Verse URL** | Your HCL Verse hostname, e.g. `mail.yourcompany.com/verse` |
| **Auto-open panel** | Automatically open the panel when switching to a new email |
| **Sales Navigator** | Add a Sales Navigator search link to every person card |
| **Keyboard shortcut** | Enable/disable the `Alt+L` toggle |
| **Theme** | Light, Dark, or Auto (follows OS preference) |
| **Language** | Override the auto-detected interface language |
| **Custom templates** | Add your own search buttons with `{name}` and `{company}` tokens |

---

## How it works

1. Open an email or calendar invite in HCL Verse
2. Click the **in** button (bottom-right corner of the page)
3. The panel opens, showing a tab for the sender and each To/CC recipient (or each calendar attendee)
4. Click a tab to switch people — company info, timezone, and history badge load automatically
5. Click any search link to open it in a new tab, pre-filled with the person's details

---

## Privacy

- **No data leaves your browser automatically.** The extension only makes two types of outbound requests:
  - **Clearbit** — a company logo and industry lookup based on the sender's email *domain* (not their personal details). This can be disabled by forking and removing the `enrichWithClearbit` call.
  - **LinkedIn / Google searches** — only triggered when you explicitly click a search button
- The extension activates **only on the Verse domain you configure** — it does not run on any other site
- Sender history counts are stored locally in browser extension storage and never transmitted
- No analytics, no tracking, no telemetry of any kind

> It is your responsibility to ensure use of this extension complies with your organisation's data handling and acceptable use policies.

---

## Compatibility

| Browser | Status |
|---|---|
| Chrome 120+ | ✅ Tested |
| Edge (Chromium) | ✅ Compatible |
| Brave / Arc | ✅ Compatible |
| Firefox 128+ | ✅ Compatible |

| HCL Verse version | Status |
|---|---|
| Verse 3.2.x | ✅ Tested |
| Verse On-Premises 2.x | ✅ Compatible |
| Earlier versions | ⚠️ May work — DOM structure can vary |

> HCL Verse's DOM structure varies between versions and deployments. If sender or recipient detection isn't working on your instance, please [open an issue](https://github.com/adambrownaus/huddo-linkedin-extension-for-verse/issues) with your Verse version and a description of the problem.

---

## Contributing

Pull requests are welcome. For significant changes, please open an issue first to discuss what you'd like to change.

---

## Disclaimer

This is an independent, open-source community project. It is not affiliated with, endorsed by, or supported by HCL Technologies, LinkedIn, or Microsoft. All trademarks are the property of their respective owners.

---

## License

MIT License — Copyright (c) 2026 ISW Development Pty Ltd
See [LICENSE](LICENSE) for full details.

---

## Author

Created by **Adam Brown** at [ISW Development Pty Ltd](https://isw.net.au)

- 🌐 [isw.net.au](https://isw.net.au)
- 🐙 [huddo.com](https://huddo.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/adambrownaus/)
