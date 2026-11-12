/* Newsletter sign-up box. Fills every <div class="nl-box"> with a Kit sign-up form.
   Stays hidden until newsletter.json has a Kit form id, so visitors never see a broken form. */
(function () {
  var base = (document.currentScript && document.currentScript.src || "").replace(/newsletter\.js.*$/, "");
  var boxes = document.querySelectorAll(".nl-box");
  if (!boxes.length) return;
  fetch(base + "newsletter.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (cfg) {
      if (!cfg || !cfg.kit_form_id) return;
      var action = "https://app.kit.com/forms/" + encodeURIComponent(cfg.kit_form_id) + "/subscriptions";
      boxes.forEach(function (box) {
        box.innerHTML =
          '<div style="background:#14532d;color:#fff;border-radius:20px;padding:26px 22px;margin:28px auto;max-width:640px;text-align:center">' +
          '<h2 style="margin:0 0 6px;color:#ffd34d;font-size:1.6rem">This week\'s 7 recipes + shopping list, free</h2>' +
          '<p style="margin:0 0 16px;opacity:.9">One email every Monday. Restaurant food for $5 or less. Unsubscribe anytime.</p>' +
          '<form action="' + action + '" method="post" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">' +
          '<label for="nl-email-' + Math.random().toString(36).slice(2) + '" style="position:absolute;left:-9999px">Email address</label>' +
          '<input type="email" name="email_address" required placeholder="Your email" ' +
          'style="flex:1 1 220px;max-width:340px;padding:13px 16px;border-radius:999px;border:0;font-size:1rem">' +
          '<button type="submit" style="padding:13px 22px;border-radius:999px;border:0;background:#ffd34d;color:#14532d;font-weight:800;font-size:1rem;cursor:pointer">Send me the recipes</button>' +
          "</form>" +
          '<p style="margin:12px 0 0;font-size:.8rem;opacity:.75">We only use your email to send the newsletter. See our <a href="' + base + 'privacy.html" style="color:#ffd34d">Privacy Policy</a>.</p>' +
          "</div>";
      });
    })
    .catch(function () {});
})();
