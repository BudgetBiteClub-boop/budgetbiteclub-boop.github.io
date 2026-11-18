/* Newsletter sign-up box. Fills every <div class="nl-box"> with a Kit sign-up form that offers the free
   "7 Dinners Under $5" PDF. After signing up, the download link appears right away (the form is sent to Kit
   in the background; if that can't run, the normal Kit page takes over).
   Stays hidden until newsletter.json has a Kit form id, so visitors never see a broken form. */
(function () {
  var base = (document.currentScript && document.currentScript.src || "").replace(/newsletter\.js.*$/, "");
  var boxes = document.querySelectorAll(".nl-box");
  if (!boxes.length) return;
  var PDF = base + "7-dinners-under-5.pdf";
  fetch(base + "newsletter.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (cfg) {
      if (!cfg || !cfg.kit_form_id) return;
      var action = "https://app.kit.com/forms/" + encodeURIComponent(cfg.kit_form_id) + "/subscriptions";
      boxes.forEach(function (box) {
        var id = "nl-email-" + Math.random().toString(36).slice(2);
        box.innerHTML =
          '<div style="background:#14532d;color:#fff;border-radius:20px;padding:26px 22px;margin:28px auto;max-width:640px;text-align:center">' +
          '<div style="display:inline-block;background:#ffd34d;color:#14532d;font:800 .75rem Inter,Arial,sans-serif;letter-spacing:.08em;border-radius:999px;padding:5px 12px;margin-bottom:10px">FREE PDF</div>' +
          '<h2 style="margin:0 0 6px;color:#ffd34d;font-size:clamp(1.35rem,4vw,1.6rem)">Get "7 Dinners Under $5" free</h2>' +
          '<p style="margin:0 0 16px;opacity:.9">Our best recipes with a shopping list for each, plus a new week of $5 recipes every Monday. Unsubscribe anytime.</p>' +
          '<form action="' + action + '" method="post" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">' +
          '<label for="' + id + '" style="position:absolute;left:-9999px">Email address</label>' +
          '<input id="' + id + '" type="email" name="email_address" required placeholder="Your email" autocomplete="email" ' +
          'style="flex:1 1 220px;max-width:340px;padding:13px 16px;border-radius:999px;border:0;font:inherit;font-size:1rem">' +
          '<button type="submit" style="padding:13px 22px;border-radius:999px;border:0;background:#ffd34d;color:#14532d;font:800 1rem Poppins,Inter,sans-serif;cursor:pointer">Send me the PDF</button>' +
          "</form>" +
          '<p style="margin:12px 0 0;font-size:.8rem;opacity:.75">We only use your email to send the newsletter. See our <a href="' + base + 'privacy.html" style="color:#ffd34d">Privacy Policy</a>.</p>' +
          "</div>";
        var form = box.querySelector("form"), card = box.firstChild;
        form.addEventListener("submit", function (e) {
          if (!window.fetch || !window.FormData) return;  // old browser: the normal form post happens
          e.preventDefault();
          var btn = form.querySelector("button");
          btn.disabled = true; btn.textContent = "Sending...";
          fetch(action, { method: "POST", mode: "no-cors", body: new FormData(form) })
            .then(function () {
              card.innerHTML =
                '<h2 style="margin:0 0 8px;color:#ffd34d;font-size:1.5rem">You\'re in! Here\'s your PDF</h2>' +
                '<p style="margin:0 0 18px;opacity:.9">Check your inbox too: if Kit asks you to confirm your email, tap the button so the Monday recipes reach you.</p>' +
                '<a href="' + PDF + '" download style="display:inline-block;background:#ffd34d;color:#14532d;font:800 1.05rem Poppins,Inter,sans-serif;text-decoration:none;border-radius:999px;padding:14px 26px">Download 7 Dinners Under $5 (PDF)</a>';
            })
            .catch(function () { form.submit(); });
        });
      });
    })
    .catch(function () {});
})();
