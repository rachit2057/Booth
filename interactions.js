/* ============================================================
   BOOTH — GSAP interaction layer (progressive enhancement)
   Loaded after app.js. If GSAP is missing or reduced-motion is
   on, the site stays fully functional and visible.
   ============================================================ */
(function () {
  "use strict";

  // Tell the <head> fallback that the JS ran (so it won't force-show).
  window.__boothAnim = true;

  var g = window.gsap;
  if (!g) return; // head never added .anim in this case → content already visible

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal hero pieces immediately if motion is reduced, then bail on flourishes.
  if (reduce) {
    g.set(".hero [data-h]", { opacity: 1, y: 0, scale: 1 });
    return;
  }

  /* ---------------- Hero entrance ---------------- */
  var heroPanel = document.querySelector(".hero__panel");
  var heroBits = document.querySelectorAll(".hero [data-h]");

  if (heroPanel && heroBits.length) {
    g.set(".hero [data-h]", { y: 26 });
    g.set(".hero .device", { y: 40, scale: 0.96 });
    g.set(".hero__chip", { scale: 0.82 });

    var tl = g.timeline({ defaults: { ease: "power3.out" }, delay: 0.12 });
    tl.to(".hero .eyebrow", { opacity: 1, y: 0, duration: 0.5 })
      .to(".hero h1", { opacity: 1, y: 0, duration: 0.85 }, "-=0.25")
      .to(".hero__panel .lead", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
      .to(".hero__cta", { opacity: 1, y: 0, duration: 0.55 }, "-=0.4")
      .to(".hero .device", { opacity: 1, y: 0, scale: 1, duration: 0.9 }, "-=0.3")
      .to(".hero__chip", { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 }, "-=0.55")
      .add(startFloat);
  } else {
    startFloat();
  }

  function startFloat() {
    var dev = document.querySelector(".hero .device");
    if (dev) g.to(dev, { y: "+=14", duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    if (document.querySelector(".hero__chip")) {
      g.to(".hero__chip", {
        y: "+=10", duration: 2.6, ease: "sine.inOut",
        yoyo: true, repeat: -1, stagger: { each: 0.5, from: "random" }
      });
    }
  }

  /* ---------------- Hero phone: cursor 3D tilt ---------------- */
  var stage = document.querySelector(".hero__stage");
  var phone = document.querySelector(".hero .device");
  if (stage && phone && window.matchMedia("(pointer:fine)").matches) {
    g.set(phone, { transformPerspective: 1000, transformOrigin: "center" });
    var rotY = g.quickTo(phone, "rotationY", { duration: 0.6, ease: "power3" });
    var rotX = g.quickTo(phone, "rotationX", { duration: 0.6, ease: "power3" });
    stage.addEventListener("mousemove", function (e) {
      var r = stage.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 12);
      rotX(-py * 9);
    });
    stage.addEventListener("mouseleave", function () { rotY(0); rotX(0); });
  }

  /* ---------------- Card 3D tilt (phase cards) ---------------- */
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".phase").forEach(function (card) {
      g.set(card, { transformPerspective: 900, transformOrigin: "center" });
      var rY = g.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
      var rX = g.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        rY(((e.clientX - r.left) / r.width - 0.5) * 8);
        rX(-((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      card.addEventListener("mouseleave", function () { rY(0); rX(0); });
    });
  }
})();
