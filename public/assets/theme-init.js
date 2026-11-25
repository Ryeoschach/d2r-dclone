/* Synchronous zero-flash Light / Dark / System Auto theme controller */
(function () {
  var STORAGE_KEY = "d2r-ui-theme-mode";
  var VALID_MODES = { auto: 1, dark: 1, light: 1 };
  var mql = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;

  function resolveTheme(mode) {
    if (mode === "light") return "light";
    if (mode === "dark") return "dark";
    return mql && mql.matches ? "light" : "dark";
  }

  function syncButtons(mode) {
    document.querySelectorAll("[data-theme-mode]").forEach(function (btn) {
      var on = btn.getAttribute("data-theme-mode") === mode;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function applyMode(rawMode) {
    var mode = VALID_MODES[rawMode] ? rawMode : "auto";
    var resolved = resolveTheme(mode);
    var root = document.documentElement;
    root.setAttribute("data-theme-mode", mode);
    root.setAttribute("data-theme", resolved);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolved === "light" ? "#f1e8d4" : "#090809");
    return mode;
  }

  var initialMode = "auto";
  try {
    initialMode = applyMode(localStorage.getItem(STORAGE_KEY) || "auto");
  } catch (e) {
    initialMode = applyMode("auto");
  }

  window.__d2rSetThemeMode = function (next) {
    var mode = applyMode(next);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
    syncButtons(mode);
    return mode;
  };

  if (mql) {
    var onSystemChange = function () {
      var curMode = document.documentElement.getAttribute("data-theme-mode") || "auto";
      if (curMode === "auto") applyMode("auto");
    };
    if (typeof mql.addEventListener === "function") mql.addEventListener("change", onSystemChange);
    else if (typeof mql.addListener === "function") mql.addListener(onSystemChange);
  }

  document.addEventListener("DOMContentLoaded", function () {
    syncButtons(document.documentElement.getAttribute("data-theme-mode") || initialMode);
  });

  window.__d2rThemeClickBound = true;
  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest("[data-theme-mode]") : null;
    if (!btn) return;
    window.__d2rSetThemeMode(btn.getAttribute("data-theme-mode") || "auto");
  });

  window.addEventListener("storage", function (e) {
    if (e && e.key === STORAGE_KEY) window.__d2rSetThemeMode(e.newValue || "auto");
  });
})();
