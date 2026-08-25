// Vivelo i18n engine
// Same file on every page. Reads TRANSLATIONS from translations.js.
// Usage on a page:
//   1. Tag any text element with data-i18n="namespace.key"
//      e.g. <p data-i18n="index.hero.subtitle">...</p>
//   2. Add a language switcher with data-lang-toggle="en" / "fr"
//   3. Include translations.js THEN this file, before </body>.

(function () {
  const SUPPORTED_LANGS = Object.keys(TRANSLATIONS);
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "vivelo_lang";

  function detectLang() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

    const browserLang = (navigator.language || "").slice(0, 2);
    if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

    return DEFAULT_LANG;
  }

  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    if (dict["meta.title"]) document.title = dict["meta.title"];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-lang-toggle]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-lang-toggle") === lang);
    });
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
