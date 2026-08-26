// Vivelo i18n engine
// Same file on every page. Reads TRANSLATIONS from translations.js.
// Usage on a page:
//   1. Tag any text element with data-i18n="namespace.key"
//      e.g. <p data-i18n="index.hero.subtitle">...</p>
//   2. Add a language switcher with data-lang-toggle="en" / "fr"
//   3. Include translations.js THEN this file, before </body>.

(function () {
  const SUPPORTED_LANGS = Object.keys(window.TRANSLATIONS);
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "vivelo_lang";

  function detectLang() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

    // No browser-locale auto-detection — new visitors always start on
    // English (DEFAULT_LANG) and only switch via the toggle, a saved
    // preference, or an explicit ?lang= link.
    return DEFAULT_LANG;
  }

  function applyTranslations(lang) {
    const dict = window.TRANSLATIONS[lang] || window.TRANSLATIONS[DEFAULT_LANG];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (typeof dict[key] === "string") el.textContent = dict[key];
    });

    // For <input placeholder="...">, <textarea placeholder="...">, etc.
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (typeof dict[key] === "string") el.placeholder = dict[key];
    });

    // Each page can declare its own title via <body data-i18n-title="key">.
    // Pages that don't (index.html) fall back to the shared "meta.title" key.
    const titleKey = (document.body && document.body.getAttribute('data-i18n-title')) || 'meta.title';
    if (dict[titleKey]) document.title = dict[titleKey];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-lang-toggle]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-lang-toggle") === lang);
    });

    // Lets pages with dynamically-generated content (e.g. onboarding.html,
    // which builds question text via JS rather than static data-i18n tags)
    // hook in and re-render themselves in the new language.
    document.dispatchEvent(new CustomEvent("vivelo:langchange", { detail: { lang: lang } }));
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
  }

  // Exposed in case you want to trigger a language switch from elsewhere
  // (e.g. a settings page, or after reading a user's saved preference from Supabase).
  window.viveloI18n = { setLang: setLang, currentLang: detectLang };

  document.addEventListener("DOMContentLoaded", function () {
    applyTranslations(detectLang());
    document.querySelectorAll("[data-lang-toggle]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        setLang(el.getAttribute("data-lang-toggle"));
      });
    });
  });
})();
