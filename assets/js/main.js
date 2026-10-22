/* Single place to edit site-wide values. */
window.SITE = {
  name: "Orakwe John, MBA",
  linkedin: "https://www.linkedin.com/in/orakwe",
  // Set these two and every "Book a discovery call" / enquiry will use them.
  calendly: "",          // e.g. "https://calendly.com/your-handle/discovery"
  email: "",             // e.g. "hello@orakwejohn.com"
  hoursTarget: 1000000,  // standing mission: 1,000,000 hours saved before 2028
  hoursSaved: 0          // update once the counting method is approved; 0 hides the progress bar
};

(function () {
  var S = window.SITE;
  var path = location.pathname.split("/").pop() || "index.html";
  var links = [
    ["about.html", "About"], ["services.html", "Services"], ["frameworks.html", "Frameworks"],
    ["impact.html", "Impact"], ["speaking.html", "Speaking"]
  ];
  var book = S.calendly || "contact.html";
  var bookAttrs = S.calendly ? ' target="_blank" rel="noopener"' : "";

  var header = document.getElementById("site-header");
  if (header && !document.querySelector(".skip")) {
    var first = document.querySelector("section");
    if (first) {
      if (!first.id) first.id = "main";
      var skip = document.createElement("a");
      skip.className = "skip"; skip.href = "#" + first.id; skip.textContent = "Skip to content";
      document.body.insertBefore(skip, header);
    }
  }
  if (header) {
    header.className = "site-header" + (document.body.dataset.solid ? " solid" : "");
    header.innerHTML =
      '<div class="wrap bar"><a class="brand" href="index.html" aria-label="Orakwe John home"><span class="mark">OJ</span>Orakwe John</a>' +
      '<button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '<nav class="nav" aria-label="Main">' +
      links.map(function (l) { return '<a href="' + l[0] + '"' + (path === l[0] ? ' class="active"' : "") + ">" + l[1] + "</a>"; }).join("") +
      '<a class="btn btn-primary" href="' + book + '"' + bookAttrs + ">Book a call</a></nav></div>";
    var nav = header.querySelector(".nav"), burger = header.querySelector(".burger");
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="wrap"><div class="cols"><div><a class="brand" href="index.html"><span class="mark">OJ</span>Orakwe John, MBA</a>' +
      "<p>AI Programs Lead and Global AI Advisor, Lagos, Nigeria. Executive AI programmes for central banks, ministries, banks and accelerators.</p></div>" +
      '<div><h4>Work</h4><a href="services.html">Services</a><a href="frameworks.html">Frameworks</a><a href="impact.html">Impact &amp; proof</a></div>' +
      '<div><h4>Engage</h4><a href="speaking.html">Speaking</a><a href="about.html">About</a><a href="contact.html">Contact</a></div>' +
      '<div><h4>Connect</h4><a href="' + S.linkedin + '" target="_blank" rel="noopener">LinkedIn</a><a href="contact.html#newsletter">Newsletter</a></div></div>' +
      '<div class="legal"><span>© ' + new Date().getFullYear() + " Orakwe John. All rights reserved.</span><span>Based in Lagos · Working worldwide</span></div></div>";
  }

  document.querySelectorAll("[data-book]").forEach(function (a) {
    a.setAttribute("href", book);
    if (S.calendly) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
  });


  /* scroll progress */
  var pg = document.createElement("div"); pg.className = "progress"; pg.setAttribute("aria-hidden", "true");
  document.body.prepend(pg);
  var ticking = false;
  function prog() {
    var h = document.documentElement.scrollHeight - innerHeight;
    pg.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")"; ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(prog); } }, { passive: true });

  /* card spotlight */
  document.addEventListener("pointermove", function (e) {
    var c = e.target.closest && e.target.closest(".card");
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  /* typewriter */
  var tw = document.querySelector("[data-type]");
  if (tw) {
    var text = tw.dataset.type;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { tw.textContent = text; }
    else {
      tw.innerHTML = '<span class="sr-only"></span><span class="tw-ghost" aria-hidden="true"></span><span class="tw-live" aria-hidden="true"></span>';
      tw.children[0].textContent = text; tw.children[1].textContent = text;
      var live = tw.children[2], i = 0;
      setTimeout(function type() {
        live.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(type, 14 + Math.random() * 18); else tw.classList.add("done");
      }, 350);
    }
  }

  /* reveal on scroll */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 }) : null;
  document.querySelectorAll(".reveal,.split,.ladder").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });

  /* animated counters */
  function fmt(n) { return Math.round(n).toLocaleString("en-US"); }
  var cio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || "", t0 = null;
      cio.unobserve(el);
      (function step(t) {
        t0 = t0 || t;
        var p = Math.min((t - t0) / 1600, 1), v = to * (1 - Math.pow(1 - p, 3));
        el.textContent = fmt(v) + (p === 1 ? suf : "");
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, { threshold: 0.5 }) : null;
  document.querySelectorAll("[data-count]").forEach(function (el) {
    if (el.dataset.count === "target") el.dataset.count = S.hoursTarget;
    cio ? cio.observe(el) : (el.textContent = fmt(+el.dataset.count) + (el.dataset.suffix || ""));
  });
  var bar = document.querySelector("[data-progress]");
  if (bar) {
    if (S.hoursSaved > 0) { bar.firstElementChild.style.width = Math.min(100, S.hoursSaved / S.hoursTarget * 100) + "%"; }
    else bar.style.display = "none";
  }

  /* enquiry form: no backend yet, so compose a structured brief */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = new FormData(form), status = document.getElementById("status");
      if (d.get("website")) return; // honeypot
      var body = ["Name: " + d.get("name"), "Organisation: " + d.get("org"), "Role: " + d.get("role"),
        "Organisation type: " + d.get("type"), "Interest: " + d.get("interest"), "Team size: " + d.get("size"),
        "Timeline: " + d.get("timeline"), "Reply to: " + d.get("email"), "", d.get("message")].join("\n");
      if (S.email) {
        location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Enquiry: " + d.get("interest") + " (" + d.get("org") + ")") + "&body=" + encodeURIComponent(body);
        status.textContent = "Opening your email app with your brief. If nothing opens, email " + S.email + " directly.";
      } else {
        (navigator.clipboard ? navigator.clipboard.writeText(body) : Promise.reject()).catch(function () {});
        status.innerHTML = 'Thank you. Your brief is copied. Please paste it into a message on <a href="' + S.linkedin + '" target="_blank" rel="noopener">LinkedIn</a> and John will reply within two working days.';
      }
      status.classList.add("show");
    });
  }
  var news = document.getElementById("news");
  if (news) news.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var em = news.querySelector("input").value;
    if (S.email) {
      location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Newsletter signup") + "&body=" + encodeURIComponent("Please add me: " + em);
      news.innerHTML = '<p style="color:#fff;font-weight:600">Almost done: send the email that just opened to join the list.</p>';
    } else {
      news.innerHTML = '<p style="color:#fff;font-weight:600">Newsletter sign-up opens soon. Follow on <a style="color:#c6f432" href="' + S.linkedin + '" target="_blank" rel="noopener">LinkedIn</a> for daily insights meanwhile.</p>';
    }
  });
})();
