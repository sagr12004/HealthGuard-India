var currentTheme = localStorage.getItem("hg_theme") || "dark";
var currentLang  = localStorage.getItem("hg_lang")  || "en";

function applyTheme() {
  if (currentTheme === "light") { document.body.classList.add("light-mode"); }
  else { document.body.classList.remove("light-mode"); }
  var btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = t(currentTheme === "light" ? "theme_dark" : "theme_light");
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("hg_theme", currentTheme);
  applyTheme();
}

function t(key) {
  var langs = window.LANG || {};
  return (langs[currentLang] && langs[currentLang][key]) || (langs["en"] && langs["en"][key]) || key;
}

function applyLang() {
  document.querySelectorAll("[data-lang]").forEach(function(el) {
    var key  = el.getAttribute("data-lang");
    var attr = el.getAttribute("data-lang-attr");
    var val  = t(key);
    if (attr) { el.setAttribute(attr, val); }
    else { el.innerHTML = val; }
  });
  var hi = document.getElementById("langHi");
  var en = document.getElementById("langEn");
  if (hi) hi.classList.toggle("active", currentLang === "hi");
  if (en) en.classList.toggle("active", currentLang === "en");
  var btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = t(currentTheme === "light" ? "theme_dark" : "theme_light");
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("hg_lang", lang);
  applyLang();
}

document.addEventListener("DOMContentLoaded", function() {
  applyTheme();
  applyLang();
});