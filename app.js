/* ============================================================
   BOOTH — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sticky nav + now-voting bar on scroll ---- */
  const nav = document.getElementById("nav");
  const nowbar = document.getElementById("nowbar");
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
    if (nowbar) {
      // reveal the player-style bar once the hero has scrolled away,
      // hide it again at the very bottom so it never covers the footer wordmark
      const past = window.scrollY > window.innerHeight * 0.55;
      const nearEnd =
        window.innerHeight + window.scrollY >
        document.body.scrollHeight - 200;
      nowbar.classList.toggle("show", past && !nearEnd);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile burger: smooth-scroll the links exist already; toggle simple jump menu ---- */
  const burger = document.getElementById("burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const links = document.querySelector(".nav__links");
      const open = links.style.display === "flex";
      links.style.display = open ? "" : "flex";
      links.style.flexDirection = "column";
      links.style.position = "absolute";
      links.style.top = "100%";
      links.style.left = "0";
      links.style.right = "0";
      links.style.background = "rgba(1,1,32,.96)";
      links.style.padding = open ? "" : "18px 24px";
      links.style.gap = "14px";
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---- Animated counters ---- */
  const fmt = (val, dec, suffix) => {
    const n = dec ? val.toFixed(dec) : Math.round(val).toLocaleString("en-IN");
    return n + (suffix || "");
  };
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = el.dataset.dec ? parseInt(el.dataset.dec, 10) : 0;
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, dec, suffix);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target, dec, suffix);
    };
    requestAnimationFrame(tick);
  };
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runCounter(e.target);
          counterIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

  /* ---- Benchmark progress bars (green, functional) ---- */
  const barIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.bar + "%";
          barIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-bar]").forEach((el) => barIO.observe(el));

  /* ---- Features: switch device screen ---- */
  const feats = document.querySelectorAll(".feat");
  const featDevice = document.getElementById("featDevice");
  if (featDevice) {
    const screens = featDevice.querySelectorAll(".scr");
    feats.forEach((f) => {
      f.addEventListener("click", () => {
        feats.forEach((x) => x.classList.remove("is-active"));
        f.classList.add("is-active");
        const target = f.dataset.screen;
        screens.forEach((s) =>
          s.classList.toggle("active", s.dataset.scr === target)
        );
      });
    });
  }

  /* ============================================================
     The Digital Curtain — interactive demo
     ============================================================ */
  const curtainScreen = document.getElementById("curtainScreen");
  if (curtainScreen) {
    const scrs = curtainScreen.querySelectorAll(".scr");
    const csteps = document.querySelectorAll(".cstep");
    const enterBtn = document.getElementById("enterBooth");
    const resetBtn = document.getElementById("resetBooth");
    const lockRows = curtainScreen.querySelectorAll("[data-lc]");
    const lockProgress = document.getElementById("lockProgress");
    const ringFill = document.getElementById("ringFill");
    const ringNum = document.getElementById("ringNum");
    const confirmBtn = document.getElementById("confirmBtn");
    const confirmCount = document.getElementById("confirmCount");
    const overrideBtn = document.getElementById("overrideBtn");
    const CIRC = 414.7;
    let timers = [];

    const clearTimers = () => {
      timers.forEach((t) => clearTimeout(t));
      timers.forEach((t) => clearInterval(t));
      timers = [];
    };
    const show = (name) =>
      scrs.forEach((s) => s.classList.toggle("active", s.dataset.cscr === name));
    const liveStep = (n) =>
      csteps.forEach((s) => s.classList.toggle("is-live", s.dataset.step === String(n)));

    const reset = () => {
      clearTimers();
      show("intro");
      liveStep(0);
      lockRows.forEach((r) => {
        const ic = r.querySelector(".ic");
        ic.className = "ic wait";
        ic.textContent = "○";
      });
      if (lockProgress) {
        lockProgress.textContent = "0 of 4 checks complete";
        lockProgress.style.background = "rgba(255,255,255,.08)";
        lockProgress.style.color = "rgba(255,255,255,.6)";
      }
      ringFill.style.strokeDashoffset = "0";
      ringNum.textContent = "10";
      confirmCount.textContent = "10";
      confirmBtn.style.opacity = ".5";
      confirmBtn.style.pointerEvents = "none";
      confirmBtn.innerHTML = 'Confirm in <span id="confirmCount">10</span>s';
      if (enterBtn) { enterBtn.disabled = false; enterBtn.textContent = "Enter the booth →"; }
    };

    const runLock = () => {
      liveStep(1);
      let i = 0;
      const step = () => {
        if (i < lockRows.length) {
          const ic = lockRows[i].querySelector(".ic");
          ic.className = "ic ok";
          ic.textContent = "✓";
          lockProgress.textContent = `${i + 1} of 4 checks complete`;
          i++;
          timers.push(setTimeout(step, 620));
        } else {
          lockProgress.textContent = "Environment secured";
          lockProgress.style.background = "rgba(200,246,249,.16)";
          lockProgress.style.color = "var(--accent-mint)";
          timers.push(setTimeout(runCountdown, 700));
        }
      };
      timers.push(setTimeout(step, 500));
    };

    const runCountdown = () => {
      show("confirm");
      liveStep(2);
      let t = 10;
      const cc = document.getElementById("confirmCount");
      ringNum.textContent = t;
      if (cc) cc.textContent = t;
      const iv = setInterval(() => {
        t--;
        const offset = CIRC * ((10 - t) / 10);
        ringFill.style.strokeDashoffset = offset;
        ringFill.style.transition = "stroke-dashoffset 1s linear";
        ringNum.textContent = Math.max(t, 0);
        const cc2 = document.getElementById("confirmCount");
        if (cc2) cc2.textContent = Math.max(t, 0);
        if (t <= 0) {
          clearInterval(iv);
          ringNum.innerHTML = '✓';
          confirmBtn.style.opacity = "1";
          confirmBtn.style.pointerEvents = "auto";
          confirmBtn.textContent = "Confirm vote";
        }
      }, 1000);
      timers.push(iv);
    };

    const finish = () => {
      clearTimers();
      liveStep(3);
      show("done");
      if (navigator.vibrate) navigator.vibrate([18, 40, 18]);
    };

    if (enterBtn)
      enterBtn.addEventListener("click", () => {
        clearTimers();
        enterBtn.disabled = true;
        enterBtn.textContent = "In the booth…";
        show("lock");
        runLock();
      });
    if (resetBtn) resetBtn.addEventListener("click", reset);
    if (confirmBtn) confirmBtn.addEventListener("click", finish);
    if (overrideBtn)
      overrideBtn.addEventListener("click", () => {
        show("confirm");
        liveStep(2);
        ringFill.style.strokeDashoffset = "0";
        const cc = document.getElementById("confirmCount") || confirmCount;
        confirmBtn.style.opacity = ".5";
        confirmBtn.style.pointerEvents = "none";
        confirmBtn.innerHTML = 'Confirm in <span id="confirmCount">10</span>s';
        runCountdown();
      });

    reset();
  }

  /* ---- Footer year guard handled in markup; current year stamp optional ---- */
})();
