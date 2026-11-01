(function () {
  var GA_ID = "G-PYEB181EHX";
  var KEY = "rb_cookie_consent";
  var loaded = false;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function loadGA() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  function removeBanner() {
    var b = document.getElementById("rb-cookie-banner");
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function showBanner() {
    if (document.getElementById("rb-cookie-banner")) return;
    var b = document.createElement("div");
    b.id = "rb-cookie-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Aviso de cookies");
    b.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#0b1220;color:#EAF3FF;border-top:2px solid #E8622C;padding:12px 14px calc(12px + env(safe-area-inset-bottom,0px));font:13px/1.4 system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;box-shadow:0 -4px 16px rgba(0,0,0,.5)";
    var t = document.createElement("div");
    t.style.cssText = "flex:1 1 260px;min-width:0";
    t.innerHTML = 'Usamos cookies para medir o uso do site (Google Analytics). Você pode aceitar ou recusar. <a href="/privacidade.html" style="color:#E3A73B;text-decoration:underline">Política de Privacidade</a>';
    var w = document.createElement("div");
    w.style.cssText = "display:flex;gap:8px;flex:0 0 auto";
    function btn(label, bg, fg, border) {
      var x = document.createElement("button");
      x.type = "button";
      x.textContent = label;
      x.style.cssText = "min-height:40px;padding:0 16px;border-radius:999px;font:700 13px system-ui,sans-serif;cursor:pointer;background:" + bg + ";color:" + fg + ";border:1px solid " + border;
      return x;
    }
    var no = btn("Recusar", "transparent", "#EAF3FF", "#6F87A6");
    var yes = btn("Aceitar", "#E8622C", "#1A0D06", "#E8622C");
    no.onclick = function () { save("denied"); removeBanner(); };
    yes.onclick = function () { save("granted"); removeBanner(); loadGA(); };
    w.appendChild(no); w.appendChild(yes);
    b.appendChild(t); b.appendChild(w);
    document.body.appendChild(b);
  }

  var inFrame = false;
  try { inFrame = window.self !== window.top; } catch (e) { inFrame = true; }

  function start() {
    var c = read();
    if (c === "granted") { loadGA(); return; }
    if (c === "denied") return;
    if (!inFrame) showBanner();
  }

  window.addEventListener("storage", function (e) {
    if (e.key !== KEY) return;
    if (e.newValue === "granted") { removeBanner(); loadGA(); }
    else if (e.newValue === "denied" || e.newValue === null) { removeBanner(); }
  });

  window.rbCookiePrefs = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    showBanner();
  };

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();