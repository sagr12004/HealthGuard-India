var currentTheme = localStorage.getItem("hg_theme") || "dark";
var currentLang  = localStorage.getItem("hg_lang")  || "en";

function applyTheme() {
  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
  var btn = document.getElementById("themeBtn");
  if (btn) {
    if (typeof window.LANG !== "undefined") {
      btn.textContent = currentTheme === "light"
        ? (window.LANG[currentLang] && window.LANG[currentLang].theme_dark  || "Dark Mode")
        : (window.LANG[currentLang] && window.LANG[currentLang].theme_light || "Light Mode");
    } else {
      btn.textContent = currentTheme === "light" ? "Dark Mode" : "Light Mode";
    }
  }
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("hg_theme", currentTheme);
  applyTheme();
}

function applyLang() {
  if (typeof window.LANG === "undefined") return;
  var dict = window.LANG[currentLang] || window.LANG["en"];

  // Replace innerHTML for data-lang elements
  document.querySelectorAll("[data-lang]").forEach(function(el) {
    var key = el.getAttribute("data-lang");
    if (dict[key] !== undefined) {
      // Check if this element has data-lang-attr too
      var attr = el.getAttribute("data-lang-attr");
      if (attr) {
        el.setAttribute(attr, dict[key]);
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // Update lang button active states
  var hiBtn = document.getElementById("langHi");
  var enBtn = document.getElementById("langEn");
  if (hiBtn) hiBtn.classList.toggle("active", currentLang === "hi");
  if (enBtn) enBtn.classList.toggle("active", currentLang === "en");

  // Update html lang attribute
  document.documentElement.lang = currentLang;

  // Update theme button text
  applyTheme();
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("hg_lang", lang);
  applyLang();
}

// Auto-apply on page load
document.addEventListener("DOMContentLoaded", function() {
  applyTheme();
  applyLang();
});

// Also apply immediately in case DOMContentLoaded already fired
applyTheme();
if (document.readyState === "complete" || document.readyState === "interactive") {
  applyLang();
}