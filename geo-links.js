/* US visitors get Amazon.com gear links (tag budgetbitec09-20); everyone else keeps Amazon.ca.
   Every gear link carries its Amazon.com version in data-us. The visitor's country comes from the
   Recipe Builder's Cloudflare Worker (/geo), checked once per visit. Testing: add ?geo=US to a page. */
(function () {
  var s = document.currentScript, W = s && s.getAttribute("data-worker");
  var cc = null, m = /[?&]geo=([A-Za-z]{2})/.exec(location.search);
  if (m) cc = m[1].toUpperCase();
  if (!cc) { try { cc = sessionStorage.getItem("bbc_cc"); } catch (e) {} }
  function swap(root) {
    if (cc !== "US") return;
    (root || document).querySelectorAll("a[data-us]").forEach(function (a) {
      if (a.getAttribute("data-us")) a.href = a.getAttribute("data-us");
    });
  }
  // Links the Recipe Builder adds later are swapped at the moment they're clicked.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-us]");
    if (a && cc === "US" && a.getAttribute("data-us")) a.href = a.getAttribute("data-us");
  }, true);
  window.bbcGeo = { swap: swap, country: function () { return cc; } };
  if (cc) { swap(); return; }
  if (!W) return;
  fetch(W + "/geo").then(function (r) { return r.json(); }).then(function (j) {
    cc = (j.country || "").toUpperCase();
    try { sessionStorage.setItem("bbc_cc", cc); } catch (e) {}
    swap();
  }).catch(function () {});
})();
