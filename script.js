(function () {
  "use strict";

  // ---- data ----
  const rotatingWords = ["products", "brands", "businesses"];

  const projectData = {
    marketing: [
      { title: "Campus Launch Campaign", metric: "+42% signups", caption: "Multi-channel launch campaign for a student fintech app — social, email, on-ground.", hue: "#e8574a" },
      { title: "Instagram Growth Sprint", metric: "3.1x reach", caption: "90-day content + paid strategy for a D2C skincare brand.", hue: "#c8402f" },
    ],
    uiux: [
      { title: "Tracto — Managing Health, Simplified", metric: "Book a doctor in 3 taps", caption: "A health companion designed with and for older adults — walks, pills, and doctor visits without the maze.", hue: "#4a4640", href: "work/tracto.html", img: "work/tracto-cover.jpg" },
      { title: "Lens Checkout Redesign", metric: "0 incompatible selections", caption: "Rebuilt Specscart's lens checkout into a prescription-first flow — decision fatigue out, structural error-proofing in.", hue: "#16140f", href: "work/lens-checkout.html", img: "work/lens-checkout-cover.jpg" },
    ],
    content: [
      { title: "Brand Voice Guide", metric: "Guidelines", caption: "Tone-of-voice and content system for a fresh D2C brand.", hue: "#8a4030" },
      { title: "Product Launch Copy", metric: "Full campaign", caption: "End-to-end copywriting for a mobile app launch — landing page to push notifications.", hue: "#5c3d33" },
    ],
  };

  const tabDefs = [
    { key: "marketing", label: "Marketing" },
    { key: "uiux", label: "UI/UX" },
    { key: "content", label: "Content" },
  ];
  // each tab tints the whole work fold; new tabs added to projectData just
  // need a matching .work--<key> rule in the CSS
  const workSection = document.getElementById("work-fold");
  function applyWorkTheme(key) {
    workSection.classList.add("theme-switching");
    setTimeout(() => {
      tabDefs.forEach((t) => workSection.classList.remove("work--" + t.key));
      workSection.classList.add("work--" + key);
      workSection.classList.remove("theme-switching");
    }, 450);
  }

  const storySource = [
    { year: "BTech", title: "Computer Science Engineering", text: "C, C++, Java, Python, MERN — web dev, blockchain, AI. But I was always more drawn to the strategy behind what to build than the building itself." },
    { year: "Analyst", title: "Deloitte", text: "Built Salesforce Lightning apps — and got more curious about the people using them than the code running them." },
    { year: "Switch", title: "UX Design", text: "Learned it from scratch — and came out with a deep understanding of both the product and the person using it." },
    { year: "MBA", title: "Marketing", text: "Currently pursuing an MBA in Marketing to apply my user and product instincts to product strategy." },
  ];

  const skills = ["Figma", "User Research", "SEO", "Google Analytics", "Content Strategy", "Claude", "AI Workflows", "Python", "HTML/CSS", "Canva", "A/B Testing"];
  const interests = ["Brand storytelling", "Typography", "Sketching", "Why people buy what they buy"];

  const alternating = true; // storyAlign: 'alternating' | 'stacked'

  // ---- rotating hero word (crossfade + smooth width shift) ----
  // the word swaps while faded out, then the container's width transition
  // eases the sentence into its new position instead of jumping
  let wordIndex = 0;
  const wordEl = document.getElementById("rotating-word");
  const initWordWidth = () => {
    wordEl.style.width = "auto";
    wordEl.style.width = wordEl.getBoundingClientRect().width + "px";
  };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initWordWidth);
  } else {
    initWordWidth();
  }
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = window.matchMedia && window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  // ---- time-aware hero greeting ----
  // prepends a greeting to the hero-sub line based on the VISITOR'S local
  // time; the #rotating-word span (and everything after it) is untouched —
  // only the leading text node ("I study what makes ") is rewritten
  const heroSub = document.querySelector(".hero-sub");
  if (heroSub && wordEl) {
    const hour = new Date().getHours();
    let greeting;
    if (hour >= 5 && hour < 12) greeting = "GOOD MORNING. ";
    else if (hour >= 12 && hour < 17) greeting = "GOOD AFTERNOON. ";
    else if (hour >= 17 && hour < 22) greeting = "GOOD EVENING. ";
    else greeting = "UP LATE? ";
    const firstNode = heroSub.firstChild;
    if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
      firstNode.textContent = greeting + firstNode.textContent;
    }
  }

  // swapWordTo/advanceWord are shared by the ambient interval, the click
  // easter egg (#1) and the idle daydream swap (#2) so the fade + width-ease
  // logic only lives in one place
  let currentWordList = rotatingWords;
  function swapWordTo(text, instant) {
    const doSwap = () => {
      const prevWidth = wordEl.getBoundingClientRect().width;
      wordEl.textContent = text;
      wordEl.style.width = "auto";
      const nextWidth = wordEl.getBoundingClientRect().width;
      wordEl.style.width = prevWidth + "px";
      void wordEl.offsetWidth; // flush so the width change below transitions
      wordEl.style.width = nextWidth + "px";
      wordEl.classList.remove("swapping");
    };
    if (instant) {
      doSwap();
    } else {
      wordEl.classList.add("swapping");
      setTimeout(doSwap, 300);
    }
  }
  function advanceWord(instant) {
    wordIndex = (wordIndex + 1) % currentWordList.length;
    swapWordTo(currentWordList[wordIndex], instant);
  }

  let ambientWordTimer = null;
  function startAmbientRotation() {
    if (ambientWordTimer) clearInterval(ambientWordTimer);
    ambientWordTimer = setInterval(() => {
      if (wordFrozen) return; // easter egg #1 hold
      advanceWord();
    }, 2200);
  }
  if (!reducedMotion) startAmbientRotation();

  // ---- easter egg #1: click the rotating word to advance it ----
  // 5 clicks inside ~3s swaps to "everything." and freezes the rotation for
  // 2.5s before resuming the normal cycle
  let wordFrozen = false;
  let wordClickTimes = [];
  wordEl.style.cursor = "pointer";
  wordEl.addEventListener("click", () => {
    const now = Date.now();
    wordClickTimes.push(now);
    wordClickTimes = wordClickTimes.filter((t) => now - t <= 3000);
    advanceWord(reducedMotion); // no fade needed when motion is reduced
    if (!reducedMotion) startAmbientRotation(); // don't double-swap right after
    if (wordClickTimes.length >= 5) {
      wordClickTimes = [];
      wordFrozen = true;
      swapWordTo("everything.", reducedMotion);
      setTimeout(() => { wordFrozen = false; }, 2500);
    }
  });

  // ---- easter egg #2: idle daydream words ----
  // 30s with zero mousemove/scroll/keydown/pointerdown quietly swaps the
  // rotation list; any activity switches back (takes effect at the next
  // ambient/click swap, so nothing jumps mid-fade)
  const daydreamWords = ["chai", "naps", "you", "good type"];
  let idleTimer = null;
  function armIdleTimer() {
    currentWordList = rotatingWords;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      currentWordList = daydreamWords;
    }, 30000);
  }
  ["mousemove", "scroll", "keydown", "pointerdown"].forEach((ev) => {
    window.addEventListener(ev, armIdleTimer, { passive: true });
  });
  armIdleTimer();

  // ---- hero name scroll-reveal ----
  // the name bleeds off the right edge at rest; scrolling through the hero
  // slides it left so the cut-off tail comes into view
  const heroName = document.querySelector(".hero-name");
  if (heroName && !reducedMotion) {
    let nameShiftMax = 0;
    let nameRaf = null;
    const measureName = () => {
      heroName.style.transform = "";
      const rect = heroName.getBoundingClientRect();
      const fullRight = rect.left + heroName.scrollWidth;
      // land with a right-side gap mirroring the left composition
      const rightGap = Math.max(32, rect.left);
      nameShiftMax = Math.max(0, fullRight - (document.documentElement.clientWidth - rightGap));
    };
    const moveName = () => {
      nameRaf = null;
      if (!nameShiftMax) return;
      // fully readable by the time a third of the hero has scrolled away
      const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.33), 0), 1);
      heroName.style.transform = `translateX(${(-nameShiftMax * progress).toFixed(1)}px)`;
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureName);
    } else {
      measureName();
    }
    window.addEventListener("resize", () => { measureName(); moveName(); });
    window.addEventListener("scroll", () => {
      if (!nameRaf) nameRaf = requestAnimationFrame(moveName);
    }, { passive: true });
  }

  // ---- site nav: hide while scrolling, return after 500ms of stillness;
  // stays hidden while the work fold owns the viewport ----
  const siteNav = document.querySelector(".site-nav");
  let navIdleTimer = null;
  let lastNavY = window.scrollY;
  let workInFold = false;
  // dark exactly when the fold's top edge reaches the top of the screen —
  // whether the user scrolled there or a tab click brought them
  function updateFoldState() {
    const rect = workSection.getBoundingClientRect();
    workInFold = rect.top <= 8 && rect.bottom > 120;
    workSection.classList.toggle("fold-dark", workInFold);
    if (workInFold) siteNav.classList.add("nav-hidden");
  }
  // living brand: "N." picks up the current section's name as a suffix
  const navSec = document.getElementById("nav-sec");
  const navSecDefs = ["work", "about", "contact"]
    .map((id) => ({ label: id.toUpperCase(), el: document.getElementById(id) }))
    .filter((s) => s.el);
  function updateNavSection() {
    const probe = window.innerHeight * 0.4;
    let label = "";
    for (const s of navSecDefs) {
      const r = s.el.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { label = s.label; break; }
    }
    if (navSec.dataset.cur === label) return;
    navSec.dataset.cur = label;
    if (label) navSec.textContent = "· " + label;
    navSec.classList.toggle("on", !!label);
  }
  updateNavSection();

  updateFoldState();
  window.addEventListener("scroll", () => {
    updateFoldState();
    updateNavSection();
    const y = window.scrollY;
    const atTop = y < 10;
    siteNav.classList.toggle("scrolled", !atTop);
    if (atTop) {
      // at the very top the nav just sits in the hero — never hide it there
      siteNav.classList.remove("nav-hidden");
      clearTimeout(navIdleTimer);
      lastNavY = y;
      return;
    }
    // ignore jitter events that don't actually move the page, so the
    // reappear timer isn't endlessly reset after scrolling has stopped
    if (Math.abs(y - lastNavY) < 2) return;
    lastNavY = y;
    siteNav.classList.add("nav-hidden");
    clearTimeout(navIdleTimer);
    navIdleTimer = setTimeout(() => {
      if (!workInFold) siteNav.classList.remove("nav-hidden");
    }, 500);
  }, { passive: true });

  // ---- work tabs ----
  let activeTab = "marketing";
  const tabsEl = document.getElementById("tabs");
  const projectsEl = document.getElementById("projects");

  // ---- sliding tab underline ----
  // lives in .work-controls (NOT #tabs — renderTabs() wipes #tabs innerHTML
  // on every click, which would delete an indicator parked inside it) and is
  // repositioned/resized against the active button's rect after every render,
  // on resize, and once fonts finish swapping (font swap changes tab widths).
  const workControlsEl = document.querySelector(".work-controls");
  const tabIndicator = document.createElement("div");
  tabIndicator.className = "tab-indicator";
  tabIndicator.setAttribute("aria-hidden", "true");
  if (workControlsEl) workControlsEl.appendChild(tabIndicator);
  function positionTabIndicator(instant) {
    if (!workControlsEl) return;
    const activeBtn = tabsEl.querySelector(".tab-btn.active");
    if (!activeBtn) { tabIndicator.style.opacity = "0"; return; }
    const controlsRect = workControlsEl.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const jump = instant || reducedMotion;
    if (jump) tabIndicator.classList.add("no-transition");
    tabIndicator.style.top = (btnRect.bottom - controlsRect.top - 3) + "px";
    tabIndicator.style.width = btnRect.width + "px";
    tabIndicator.style.transform = `translateX(${btnRect.left - controlsRect.left}px)`;
    tabIndicator.style.opacity = "1";
    if (jump) {
      void tabIndicator.offsetWidth; // flush so later calls transition again
      tabIndicator.classList.remove("no-transition");
    }
  }
  window.addEventListener("resize", () => positionTabIndicator(true));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => positionTabIndicator(true));
  }

  // returning from a case study: restore the tab that was active when the
  // user left, so the scroll position lands on the same content
  const RETURN_KEY = "portfolio-return";
  let savedReturn = null;
  try {
    savedReturn = JSON.parse(sessionStorage.getItem(RETURN_KEY));
    sessionStorage.removeItem(RETURN_KEY);
  } catch (e) { /* ignore */ }
  if (savedReturn && projectData[savedReturn.tab]) {
    activeTab = savedReturn.tab;
  }

  function stripeStyle(hue) {
    return `background:repeating-linear-gradient(45deg, ${hue} 0 14px, ${hue}dd 14px 28px)`;
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    tabDefs.forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "tab-btn" + (t.key === activeTab ? " active" : "");
      btn.innerHTML = `${t.label}<sup class="tab-count">${projectData[t.key].length}</sup>`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", t.key === activeTab ? "true" : "false");
      btn.addEventListener("click", () => {
        activeTab = t.key;
        renderTabs();
        renderProjects();
        positionTabIndicator();
        applyWorkTheme(t.key);
        // snap the fold to the viewport — it goes dark the moment its top
        // docks at the top of the screen (updateFoldState watches position)
        workSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderProjects() {
    projectsEl.innerHTML = "";
    projectData[activeTab].forEach((p) => {
      // linked projects render as an <a> so the whole card is clickable
      const wrap = document.createElement(p.href ? "a" : "div");
      wrap.className = "project" + (p.href ? " project-link" : "") + (p.img ? " has-cover" : "");
      if (p.href) {
        wrap.href = p.href;
        wrap.addEventListener("click", () => {
          sessionStorage.setItem(RETURN_KEY, JSON.stringify({ tab: activeTab, y: window.scrollY }));
          // name the cover image so a supporting browser morphs it into the
          // case-study hero (see "CASE-STUDY VIEW TRANSITIONS" below) —
          // inert, harmless assignment on browsers without the API
          const img = wrap.querySelector("img");
          if (img) img.style.viewTransitionName = "case-cover";
        });
      }
      // list view shows project details ON the cover (hover); grid view keeps
      // the minimal pill — CSS decides which of the two blocks is visible
      const cover = p.img
        ? `<img src="${p.img}" alt="${p.title}" loading="lazy">` +
          (p.href
            ? `<div class="img-overlay">` +
              `<div class="ov-details">` +
              `<span class="ov-metric">${p.metric}</span>` +
              `<h3 class="ov-title">${p.title}</h3>` +
              `<p class="ov-caption">${p.caption}</p>` +
              `<span class="ov-read">Read case study <span class="arrow">→</span></span>` +
              `</div>` +
              `<span class="ov-pill">Read case study <span class="arrow">→</span></span>` +
              `</div>`
            : "")
        : `case study coming soon`;
      wrap.innerHTML = `
        <div class="project-img"${p.img ? "" : ` style="${stripeStyle(p.hue)}"`}>${cover}</div>
        <div class="project-meta">
          <h3>${p.title}</h3>
          <span class="project-metric">${p.metric}</span>
        </div>
        <p class="project-caption">${p.caption}</p>
      `;
      projectsEl.appendChild(wrap);
    });
  }

  // ---- list / grid view toggle ----
  const VIEW_KEY = "projects-view";
  let view = localStorage.getItem(VIEW_KEY) === "grid" ? "grid" : "list";
  const viewToggleEl = document.getElementById("view-toggle");
  const viewDefs = [
    { key: "list", label: "List view", icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="2" width="14" height="4.5"/><rect x="1" y="9.5" width="14" height="4.5"/></svg>' },
    { key: "grid", label: "Grid view", icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>' },
  ];
  function applyView() {
    projectsEl.classList.toggle("grid-view", view === "grid");
  }
  function renderViewToggle() {
    viewToggleEl.innerHTML = "";
    viewDefs.forEach((v) => {
      const btn = document.createElement("button");
      btn.className = "view-btn" + (v.key === view ? " active" : "");
      btn.innerHTML = v.icon;
      btn.setAttribute("aria-label", v.label);
      btn.setAttribute("aria-pressed", v.key === view ? "true" : "false");
      btn.title = v.label;
      btn.addEventListener("click", () => {
        view = v.key;
        localStorage.setItem(VIEW_KEY, view);
        renderViewToggle();
        applyView();
      });
      viewToggleEl.appendChild(btn);
    });
  }

  renderTabs();
  renderProjects();
  renderViewToggle();
  applyView();
  // initial paint: indicator appears already under the active tab, no
  // animate-in from 0 (also covers the "restored tab differs" case)
  positionTabIndicator(true);
  // sync the fold tint with the (possibly restored) active tab, no fade
  tabDefs.forEach((t) => workSection.classList.remove("work--" + t.key));
  workSection.classList.add("work--" + activeTab);

  // finish the return trip: jump back to where the user left off
  // (layout is already stable here — cards render synchronously above)
  if (savedReturn && typeof savedReturn.y === "number") {
    history.scrollRestoration = "manual";
    window.scrollTo({ top: savedReturn.y, behavior: "instant" });
  }

  // reverse view transition: if we arrived back from a case-study page,
  // name the matching card's cover image so a supporting browser morphs
  // the case-study hero back into this grid (best-effort — document.referrer
  // may be blank/cross-origin, in which case this is simply a no-op)
  if (document.referrer) {
    try {
      const refPath = new URL(document.referrer).pathname;
      for (const key in projectData) {
        const match = projectData[key].find((p) => p.href && refPath.endsWith(p.href.split("/").pop()));
        if (match) {
          const card = projectsEl.querySelector(`a[href="${match.href}"] img`);
          if (card) card.style.viewTransitionName = "case-cover";
          break;
        }
      }
    } catch (e) { /* ignore */ }
  }
  // if the browser restored this page from bfcache the saved entry wasn't
  // consumed — drop it so it can't fire on a later, unrelated visit
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) sessionStorage.removeItem(RETURN_KEY);
  });

  // ---- story timeline ----
  const timelineEl = document.getElementById("story-timeline");
  storySource.forEach((item, i) => {
    const side = alternating ? (i % 2 === 0 ? "left" : "right") : "left";
    const row = document.createElement("div");
    row.className = "story-row";
    row.innerHTML = `
      <div class="story-side left${side !== "left" ? " hidden" : ""}">
        <div class="story-year">${item.year}</div>
        <div class="story-title">${item.title}</div>
        <div class="story-text">${item.text}</div>
      </div>
      <div class="story-spine">
        <div class="story-dot"></div>
        <div class="story-line"></div>
      </div>
      <div class="story-side right${side !== "right" ? " hidden" : ""}">
        <div class="story-year">${item.year}</div>
        <div class="story-title">${item.title}</div>
        <div class="story-text">${item.text}</div>
      </div>
    `;
    timelineEl.appendChild(row);
  });

  // ---- skills / interests tickers ----
  // hovering a skill that has real receipts shows them under the ticker
  const skillProofs = {
    "Figma": "Tracto & Lens Checkout — designed end-to-end",
    "User Research": "Tracto — contextual inquiry with older adults",
    "Claude": "this site — built in conversation with it",
    "AI Workflows": "how this site got made",
    "HTML/CSS": "you're looking at it",
  };
  // track content is doubled so the -50% translate loops seamlessly
  function fillTicker(id, items, proofs) {
    const track = document.getElementById(id);
    const frag = document.createDocumentFragment();
    for (let pass = 0; pass < 2; pass++) {
      items.forEach((s) => {
        const item = document.createElement("span");
        item.className = "ticker-item";
        item.textContent = s;
        if (proofs && proofs[s]) {
          item.classList.add("has-proof");
          item.dataset.proof = proofs[s];
        }
        // second pass exists only for the seamless loop — hide it from AT
        if (pass === 1) item.setAttribute("aria-hidden", "true");
        frag.appendChild(item);
        const sep = document.createElement("span");
        sep.className = "ticker-sep";
        sep.textContent = "✦";
        sep.setAttribute("aria-hidden", "true");
        frag.appendChild(sep);
      });
    }
    track.appendChild(frag);
  }
  fillTicker("skills-ticker", skills, skillProofs);
  fillTicker("interests-ticker", interests);

  // proof line lives outside the ticker's overflow, so nothing gets clipped
  const proofEl = document.getElementById("ticker-proof");
  const skillsTrack = document.getElementById("skills-ticker");
  skillsTrack.addEventListener("mouseover", (e) => {
    const item = e.target.closest(".ticker-item.has-proof");
    if (!item) return;
    proofEl.textContent = item.textContent + " → " + item.dataset.proof;
    proofEl.classList.add("on");
  });
  skillsTrack.addEventListener("mouseout", (e) => {
    if (e.target.closest(".ticker-item.has-proof")) proofEl.classList.remove("on");
  });

  // ---- draggable tickers ----
  // grab either marquee band and fling it; the CSS ambient crawl (tickerScroll,
  // owned by the .ticker-track itself) is paused for the duration of the
  // interaction, and a SEPARATE wrapper div carries the manual drag/momentum
  // offset — that way the two transforms never fight over the same element.
  // On release the animation is simply un-paused from wherever it was frozen,
  // so the ambient crawl picks back up with no visible jump (the wrap's
  // residual offset just becomes a permanent extra shift, which is invisible
  // in an infinite loop). Pointer events also cover touch; touch-action:pan-y
  // (set in CSS) keeps vertical page scrolling free.
  (function initDraggableTickers() {
    Array.from(document.querySelectorAll(".ticker")).forEach((ticker) => {
      const track = ticker.querySelector(".ticker-track");
      if (!track) return;

      const wrap = document.createElement("div");
      wrap.className = "ticker-drag-wrap";
      track.parentNode.insertBefore(wrap, track);
      wrap.appendChild(track);

      let halfWidth = track.scrollWidth / 2 || 1;
      const remeasure = () => { halfWidth = track.scrollWidth / 2 || 1; };
      window.addEventListener("resize", remeasure);

      let offset = 0;
      let dragging = false;
      let hovering = false;
      let lastX = 0, lastT = 0, velocity = 0;
      let momentumRaf = null;

      const getAmbientAnim = () =>
        track.getAnimations().find((a) => a.animationName === "tickerScroll") || track.getAnimations()[0];

      function applyOffset() {
        wrap.style.transform = `translateX(${offset}px)`;
      }
      function pauseAmbient() {
        const a = getAmbientAnim();
        if (a) a.pause();
      }
      function playAmbient() {
        if (dragging) return; // still interacting — don't resume under our feet
        const a = getAmbientAnim();
        if (a) a.play();
      }

      // JS-managed hover-pause (replaces the old CSS :hover play-state rule,
      // which fought the imperative pause()/play() calls used for dragging)
      ticker.addEventListener("mouseenter", () => { hovering = true; if (!dragging) pauseAmbient(); });
      ticker.addEventListener("mouseleave", () => { hovering = false; if (!dragging) playAmbient(); });

      function cancelMomentum() {
        if (momentumRaf) { cancelAnimationFrame(momentumRaf); momentumRaf = null; }
      }

      function startMomentum() {
        let v = velocity * 16; // px/ms -> approx px/frame at 60fps
        const step = () => {
          if (Math.abs(v) < 0.05) { momentumRaf = null; if (!hovering) playAmbient(); return; }
          offset = (offset + v) % halfWidth;
          applyOffset();
          v *= 0.95;
          momentumRaf = requestAnimationFrame(step);
        };
        if (Math.abs(v) < 0.05) { if (!hovering) playAmbient(); return; }
        momentumRaf = requestAnimationFrame(step);
      }

      ticker.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        dragging = true;
        cancelMomentum();
        pauseAmbient();
        ticker.classList.add("dragging");
        try { ticker.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        lastX = e.clientX;
        lastT = performance.now();
        velocity = 0;
      });

      ticker.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const now = performance.now();
        const dx = e.clientX - lastX;
        const dt = Math.max(now - lastT, 1);
        velocity = dx / dt;
        offset = (offset + dx) % halfWidth;
        applyOffset();
        lastX = e.clientX;
        lastT = now;
      });

      function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        ticker.classList.remove("dragging");
        try { ticker.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        startMomentum();
      }
      ticker.addEventListener("pointerup", endDrag);
      ticker.addEventListener("pointercancel", endDrag);
    });
  })();

  // ---- suggestions form ----
  // with a Web3Forms access key set, suggestions land silently in the inbox;
  // without one, falls back to opening the visitor's mail client
  const WEB3FORMS_KEY = "441f4007-c90d-4b1b-8158-1f708925aec5";
  const suggestForm = document.getElementById("suggest-form");
  const suggestBtn = suggestForm.querySelector(".suggest-send");
  const suggestMain = document.getElementById("suggest-main");
  const suggestThanks = document.getElementById("suggest-thanks");

  function showThanks() {
    suggestMain.classList.add("fading");
    setTimeout(() => {
      suggestMain.hidden = true;
      suggestMain.classList.remove("fading");
      suggestThanks.hidden = false;
    }, 350);
  }
  document.getElementById("suggest-again").addEventListener("click", () => {
    suggestThanks.hidden = true;
    suggestMain.hidden = false;
    const input = document.getElementById("suggest-input");
    input.value = "";
    input.focus();
  });

  suggestForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("suggest-input");
    const text = input.value.trim();
    if (!text) return;

    if (!WEB3FORMS_KEY) {
      location.href =
        "mailto:nitraina2000@gmail.com" +
        "?subject=" + encodeURIComponent("Feedback from your portfolio") +
        "&body=" + encodeURIComponent(text);
      showThanks();
      return;
    }

    suggestBtn.textContent = "Sending…";
    suggestBtn.disabled = true;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Feedback from your portfolio",
          from_name: "Portfolio feedback loop",
          message: text,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      showThanks();
    } catch (err) {
      // network/service hiccup: fall back to the mail client so no
      // suggestion is ever silently lost
      location.href =
        "mailto:nitraina2000@gmail.com" +
        "?subject=" + encodeURIComponent("Feedback from your portfolio") +
        "&body=" + encodeURIComponent(text);
      showThanks();
    } finally {
      suggestBtn.disabled = false;
      suggestBtn.textContent = "Send";
    }
  });

  // ---- easter egg #4: heart sprint ----
  // double-clicking the thank-you heart makes its beat race for ~1.6s and
  // bursts small hearts outward from the heart's own viewport position.
  // Skipped under reduced motion (the whole gag is the racing animation).
  const thanksHeart = document.querySelector(".thanks-heart");
  if (thanksHeart && !reducedMotion) {
    thanksHeart.style.cursor = "pointer";
    let racingTimer = null;
    thanksHeart.addEventListener("dblclick", () => {
      thanksHeart.classList.add("racing");
      clearTimeout(racingTimer);
      racingTimer = setTimeout(() => thanksHeart.classList.remove("racing"), 1600);

      const rect = thanksHeart.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      for (let i = 0; i < 10; i++) {
        const burst = document.createElement("span");
        burst.className = "burst-heart";
        burst.textContent = "♥";
        burst.setAttribute("aria-hidden", "true");
        const angle = (-Math.PI / 2) + (Math.random() - 0.5) * (Math.PI * 0.9); // upward-ish cone
        const dist = 60 + Math.random() * 90;
        const duration = 0.6 + Math.random() * 0.5;
        burst.style.left = originX + "px";
        burst.style.top = originY + "px";
        burst.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(0) + "px");
        burst.style.setProperty("--dy", (Math.sin(angle) * dist).toFixed(0) + "px");
        burst.style.setProperty("--rot", ((Math.random() - 0.5) * 140).toFixed(0) + "deg");
        burst.style.setProperty("--duration", duration + "s");
        burst.style.setProperty("--size", (12 + Math.random() * 10).toFixed(0) + "px");
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), duration * 1000 + 100);
      }
    });
  }

  // ---- scroll reveals ----
  // if IntersectionObserver is unavailable, skip animations entirely so
  // nothing is ever left hidden
  if ("IntersectionObserver" in window) {
    const revealTargets = [
      // ".statement h2" intentionally omitted — the statement now runs its
      // own per-word scroll-scrub (see below), which would double up with
      // a parent-level fade
      ".work .section-header",
      ".about .section-header",
      ".headshot",
      ".intro-para",
      ".story-row",
      ".closing-line",
      ".ticker-zone",
      ".suggest-label",
      ".suggest-title",
      ".suggest-form",
      ".suggest-note",
      ".contact-kicker",
      ".contact-title",
      ".cta-row",
      ".social-row",
    ];
    revealTargets.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => el.classList.add("reveal"));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // toggle so elements animate out when scrolled away and replay
          // when they come back — in both scroll directions
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // stagger timeline rows
    document.querySelectorAll(".story-row").forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${i * 0.1}s`);
    });

    // projects re-render on tab switch, so re-apply reveals each time
    const markProjectsForReveal = () => {
      projectsEl.querySelectorAll(".project").forEach((el, i) => {
        el.classList.add("reveal");
        el.style.setProperty("--reveal-delay", `${i * 0.12}s`);
        observer.observe(el);
      });
    };
    markProjectsForReveal();
    tabsEl.addEventListener("click", () => {
      requestAnimationFrame(() => markProjectsForReveal());
    });
  }

  // ---- magnetic cursor (index.html only) ----
  // small terracotta dot that lerps toward the pointer and morphs into a
  // label/ring over interactive elements. Fine-pointer + hover-capable
  // devices only; fully disabled under reduced motion. Native cursor stays
  // on throughout — the dot is an accent, never a replacement.
  const cursorEl = document.getElementById("magnetic-cursor");
  if (cursorEl && fineHover && !reducedMotion) {
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0, shown = false;

    // breathing idle state: 4s without pointer movement starts a slow
    // scale breathe (CSS class, keyframes animate width/height/margin —
    // never transform, which the rAF lerp loop below owns every frame).
    // Only in the default dot state; any movement clears it instantly.
    const BREATHE_DELAY = 4000;
    let breatheTimer = null;
    function armBreathe() {
      clearTimeout(breatheTimer);
      cursorEl.classList.remove("breathing");
      breatheTimer = setTimeout(() => {
        if (!cursorEl.dataset.cursor) cursorEl.classList.add("breathing");
      }, BREATHE_DELAY);
    }

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      armBreathe();
      if (!shown) {
        shown = true;
        curX = mouseX;
        curY = mouseY;
        cursorEl.classList.add("visible");
      }
    }, { passive: true });

    // rAF lerp loop — transform only, no layout impact
    (function tickCursor() {
      curX += (mouseX - curX) * 0.2;
      curY += (mouseY - curY) * 0.2;
      cursorEl.style.transform = `translate(${curX}px, ${curY}px)`;
      requestAnimationFrame(tickCursor);
    })();

    const READ_SEL = "a.project-link";
    const SAY_SEL = "#suggest-input, .suggest-send";
    const RING_SEL = ".nav-links a, .tab-btn, .view-btn, .say-hello, .resume-btn, .social-row a";
    const ANY_SEL = `${READ_SEL}, ${SAY_SEL}, ${RING_SEL}`;

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(READ_SEL)) {
        cursorEl.dataset.cursor = "read";
        cursorEl.textContent = "READ";
      } else if (e.target.closest(SAY_SEL)) {
        cursorEl.dataset.cursor = "say";
        cursorEl.textContent = "SAY IT";
      } else if (e.target.closest(RING_SEL)) {
        cursorEl.dataset.cursor = "ring";
        cursorEl.textContent = "";
      }
    });
    document.addEventListener("mouseout", (e) => {
      const leaving = e.target.closest(ANY_SEL);
      const entering = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(ANY_SEL);
      if (leaving && !entering) {
        delete cursorEl.dataset.cursor;
        cursorEl.textContent = "";
      }
    });

    // gentle magnetize: the TARGET shifts up to ~4px toward the pointer,
    // springing back (via its own CSS transition) on leave. Handlers attach
    // lazily on first hover so re-rendered elements (tabs, view toggle)
    // keep working after every re-render.
    function magnetize(el) {
      if (el.__magnetized) return;
      el.__magnetized = true;
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        el.style.transform = `translate(${dx * 4}px, ${dy * 4}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    }
    document.addEventListener("mouseover", (e) => {
      const el = e.target.closest(RING_SEL);
      if (el) magnetize(el);
    });

    // spotlight on dark sections: a soft terracotta glow trails the pointer
    document.querySelectorAll(".statement, .contact").forEach((sec) => {
      sec.classList.add("spotlight");
      let spotRaf = null;
      sec.addEventListener("mousemove", (e) => {
        if (spotRaf) return;
        spotRaf = requestAnimationFrame(() => {
          spotRaf = null;
          const rect = sec.getBoundingClientRect();
          sec.style.setProperty("--spot-x", (e.clientX - rect.left) + "px");
          sec.style.setProperty("--spot-y", (e.clientY - rect.top) + "px");
          sec.classList.add("spot-on");
        });
      }, { passive: true });
      sec.addEventListener("mouseleave", () => sec.classList.remove("spot-on"));
    });
  }

  // ---- easter egg #3: ink drawing in the hero ----
  // press-and-hold + drag anywhere in the hero (except the clickable rotating
  // word) draws a terracotta marker stroke that fades ~2s after being drawn.
  // Fine-pointer/hover devices only, disabled under reduced motion — the
  // whole point is a soft rAF fade, which reduced motion asks us to skip.
  const heroEl = document.querySelector(".hero");
  if (heroEl && fineHover && !reducedMotion) {
    const inkCanvas = document.createElement("canvas");
    inkCanvas.className = "hero-ink";
    inkCanvas.setAttribute("aria-hidden", "true");
    heroEl.appendChild(inkCanvas);
    const inkCtx = inkCanvas.getContext("2d");

    let dpr = window.devicePixelRatio || 1;
    function sizeInkCanvas() {
      dpr = window.devicePixelRatio || 1;
      const rect = heroEl.getBoundingClientRect();
      inkCanvas.width = Math.round(rect.width * dpr);
      inkCanvas.height = Math.round(rect.height * dpr);
      inkCanvas.style.width = rect.width + "px";
      inkCanvas.style.height = rect.height + "px";
      inkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeInkCanvas();
    window.addEventListener("resize", sizeInkCanvas);

    const INK_LIFE = 2000; // ms until a point is fully faded
    let strokes = []; // each: array of {x, y, t}
    let activeStroke = null;
    let inkRaf = null;
    let drawing = false;

    function renderInk() {
      inkCtx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
      const now = performance.now();
      inkCtx.lineCap = "round";
      inkCtx.lineJoin = "round";
      inkCtx.strokeStyle = "#e8574a";
      inkCtx.lineWidth = 5;
      strokes.forEach((stroke) => {
        for (let i = 1; i < stroke.length; i++) {
          const a = stroke[i - 1];
          const b = stroke[i];
          const age = now - b.t;
          const alpha = Math.max(0, 1 - age / INK_LIFE);
          if (alpha <= 0) continue;
          inkCtx.globalAlpha = alpha;
          inkCtx.beginPath();
          inkCtx.moveTo(a.x, a.y);
          inkCtx.lineTo(b.x, b.y);
          inkCtx.stroke();
        }
      });
      inkCtx.globalAlpha = 1;
      // drop fully-faded strokes so the loop can eventually stop
      strokes = strokes.filter((stroke) => stroke.length && now - stroke[stroke.length - 1].t < INK_LIFE);
      if (strokes.length || drawing) {
        inkRaf = requestAnimationFrame(renderInk);
      } else {
        inkRaf = null;
      }
    }
    function ensureInkLoop() {
      if (!inkRaf) inkRaf = requestAnimationFrame(renderInk);
    }

    heroEl.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest(".hero-sub")) return; // rotating word owns clicks there
      drawing = true;
      document.body.style.userSelect = "none";
      const rect = heroEl.getBoundingClientRect();
      activeStroke = [{ x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() }];
      strokes.push(activeStroke);
      ensureInkLoop();
    });
    heroEl.addEventListener("pointermove", (e) => {
      if (!drawing || !activeStroke) return;
      const rect = heroEl.getBoundingClientRect();
      activeStroke.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() });
    });
    function endInkStroke() {
      drawing = false;
      activeStroke = null;
      document.body.style.userSelect = "";
    }
    heroEl.addEventListener("pointerup", endInkStroke);
    heroEl.addEventListener("pointerleave", endInkStroke);
    heroEl.addEventListener("pointercancel", endInkStroke);
  }

  // ---- statement scroll-scrub ----
  // wraps each word of the statement in a span, then scrubs its opacity
  // 0.12 -> 1 sequentially as the section (now ~180vh, sticky inner
  // viewport) scrolls past. Disabled under reduced motion, where the
  // section reverts to a plain, fully-visible 100vh block (CSS handles it).
  const statementSection = document.getElementById("statement");
  const statementH2 = statementSection && statementSection.querySelector("h2");
  if (statementSection && statementH2 && !reducedMotion) {
    // recursively wrap text nodes' words in spans, preserving <br> and the
    // .accent span (words simply inherit its color)
    function wrapWords(node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (part === "") return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              const span = document.createElement("span");
              span.className = "word";
              span.textContent = part;
              frag.appendChild(span);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          wrapWords(child);
        }
      });
    }
    wrapWords(statementH2);
    const words = Array.from(statementH2.querySelectorAll(".word"));
    statementSection.classList.add("scrub-enabled");

    let stTicking = false;
    function scrubStatement() {
      stTicking = false;
      const rect = statementSection.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 1;
      const scaled = Math.min(progress / 0.85, 1); // fully revealed by 85% progress
      const n = words.length || 1;
      words.forEach((w, i) => {
        const t = Math.min(Math.max(scaled * n - i, 0), 1);
        w.style.opacity = 0.12 + 0.88 * t;
      });
    }
    scrubStatement();
    window.addEventListener("scroll", () => {
      if (!stTicking) {
        stTicking = true;
        requestAnimationFrame(scrubStatement);
      }
    }, { passive: true });
  }

  // ---- timeline draw-on-scroll ----
  // each .story-line fills top-to-bottom (scaleY) as its row passes through
  // the viewport, and its .story-dot pops filled once the row crosses ~70%
  // of the viewport. The existing .reveal fade on .story-row is untouched.
  const storyRows = Array.from(document.querySelectorAll(".story-row"));
  if (storyRows.length) {
    if (reducedMotion) {
      storyRows.forEach((row) => {
        const line = row.querySelector(".story-line");
        const dot = row.querySelector(".story-dot");
        if (line) line.style.transform = "scaleY(1)";
        if (dot) dot.classList.add("popped");
      });
    } else {
      let tlTicking = false;
      function scrubTimeline() {
        tlTicking = false;
        const vh = window.innerHeight;
        storyRows.forEach((row) => {
          const line = row.querySelector(".story-line");
          const dot = row.querySelector(".story-dot");
          if (!line || !dot) return;
          const progress = Math.min(Math.max((vh * 0.85 - row.getBoundingClientRect().top) / row.getBoundingClientRect().height, 0), 1);
          line.style.transform = `scaleY(${progress})`;
          dot.classList.toggle("popped", row.getBoundingClientRect().top <= vh * 0.7);
        });
      }
      scrubTimeline();
      window.addEventListener("scroll", () => {
        if (!tlTicking) {
          tlTicking = true;
          requestAnimationFrame(scrubTimeline);
        }
      }, { passive: true });
    }
  }

  // ---- live India time (owner's clock, footer) ----
  // always IST regardless of visitor timezone — that's the point
  const localTimeEl = document.getElementById("local-time");
  if (localTimeEl) {
    const updateLocalTime = () => {
      try {
        const hhmm = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        localTimeEl.textContent = `INDIA — ${hhmm} IST`;
      } catch (e) {
        // Intl / timeZone data unavailable: leave the line blank rather
        // than show something wrong
      }
    };
    updateLocalTime();
    setInterval(updateLocalTime, 30000);
  }

  // ---- copy-email toast (footer "Gmail" link) ----
  const gmailLink = document.querySelector('.social-row a[href^="mailto:"]');
  if (gmailLink) {
    const EMAIL = "nitraina2000@gmail.com";
    const ORIGINAL_LABEL = gmailLink.textContent;
    const COPIED_LABEL = "COPIED ✓";
    gmailLink.classList.add("email-copy");
    // reserve width up front so the text swap never shifts layout
    const measureWidth = (text) => {
      const span = document.createElement("span");
      span.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;font:inherit";
      span.className = "social-row-measure";
      span.textContent = text;
      gmailLink.appendChild(span);
      const w = span.getBoundingClientRect().width;
      span.remove();
      return w;
    };
    gmailLink.style.minWidth = Math.ceil(Math.max(measureWidth(ORIGINAL_LABEL), measureWidth(COPIED_LABEL))) + "px";

    let copyTimer = null;
    const cursorEl2 = document.getElementById("magnetic-cursor");
    gmailLink.addEventListener("click", (e) => {
      if (!(navigator.clipboard && navigator.clipboard.writeText)) return; // no API: follow the mailto link
      e.preventDefault();
      navigator.clipboard.writeText(EMAIL).then(() => {
        gmailLink.textContent = COPIED_LABEL;
        if (cursorEl2 && cursorEl2.dataset.cursor) {
          cursorEl2.dataset.cursor = "say";
          cursorEl2.textContent = COPIED_LABEL;
        }
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          gmailLink.textContent = ORIGINAL_LABEL;
        }, 1800);
      }).catch(() => {
        location.href = gmailLink.href; // clipboard rejected: fall back to mailto
      });
    });
  }

  // ---- ticker reacts to scroll speed ----
  // scroll velocity maps to CSS animation playbackRate (never touches
  // animation-duration, so looped position is preserved); decays back to 1x.
  // Existing hover-pause still rules — playbackRate changes don't un-pause.
  if (!reducedMotion && window.Element && "getAnimations" in Element.prototype) {
    const tickerAnims = Array.from(document.querySelectorAll(".ticker-track"))
      .map((el) => el.getAnimations().find((a) => a.animationName === "tickerScroll") || el.getAnimations()[0])
      .filter(Boolean);
    if (tickerAnims.length) {
      let lastY = window.scrollY;
      let lastT = performance.now();
      let targetRate = 1;
      let curRate = 1;
      let tickerRaf = null;
      const decayTick = () => {
        curRate += (targetRate - curRate) * 0.3;
        tickerAnims.forEach((a) => { a.playbackRate = curRate; });
        targetRate = 1 + (targetRate - 1) * 0.94;
        if (Math.abs(curRate - 1) > 0.01 || Math.abs(targetRate - 1) > 0.01) {
          tickerRaf = requestAnimationFrame(decayTick);
        } else {
          curRate = 1;
          targetRate = 1;
          tickerAnims.forEach((a) => { a.playbackRate = 1; });
          tickerRaf = null;
        }
      };
      window.addEventListener("scroll", () => {
        const now = performance.now();
        const dt = Math.max(now - lastT, 1);
        const dy = Math.abs(window.scrollY - lastY);
        targetRate = Math.min(4, 1 + (dy / dt) * 18);
        lastY = window.scrollY;
        lastT = now;
        if (!tickerRaf) tickerRaf = requestAnimationFrame(decayTick);
      }, { passive: true });
    }
  }

  // ---- typing "hire" rains hearts ----
  // rolling 4-letter buffer of keydowns; ignores keystrokes inside form
  // fields / contenteditable so typing feedback text doesn't trigger it
  if (!reducedMotion) {
    let heartBuffer = "";
    let heartContainer = null;
    const rainHearts = () => {
      if (!heartContainer) {
        heartContainer = document.createElement("div");
        heartContainer.id = "heart-rain";
        heartContainer.setAttribute("aria-hidden", "true");
        document.body.appendChild(heartContainer);
      }
      for (let i = 0; i < 14; i++) {
        const heart = document.createElement("span");
        heart.className = "heart-drop";
        heart.textContent = "♥";
        const duration = 2 + Math.random() * 0.8;
        const delay = Math.random() * 0.4;
        heart.style.setProperty("--x", (Math.random() * 100) + "vw");
        heart.style.setProperty("--duration", duration + "s");
        heart.style.setProperty("--delay", delay + "s");
        heart.style.setProperty("--drift", ((Math.random() - 0.5) * 120).toFixed(0) + "px");
        heart.style.setProperty("--rotate", ((Math.random() - 0.5) * 90).toFixed(0) + "deg");
        heart.style.setProperty("--size", (14 + Math.random() * 14).toFixed(0) + "px");
        heartContainer.appendChild(heart);
        setTimeout(() => heart.remove(), (duration + delay) * 1000 + 150);
      }
    };
    document.addEventListener("keydown", (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (!/^[a-zA-Z]$/.test(e.key)) return;
      heartBuffer = (heartBuffer + e.key.toLowerCase()).slice(-4);
      if (heartBuffer === "hire") {
        heartBuffer = "";
        rainHearts();
      }
    });
  }

  // ---- easter egg #5: overscroll wink ----
  // trying to scroll past the very bottom of the page (wheel deltaY>0 at
  // max scroll, or a touch pull past it) reveals a small line under the
  // footnote. Appears once per page load and then just stays.
  const overscrollNote = document.getElementById("overscroll-note");
  if (overscrollNote) {
    let winkShown = false;
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    function showWink() {
      if (winkShown) return;
      winkShown = true;
      overscrollNote.classList.add("on");
    }
    window.addEventListener("wheel", (e) => {
      if (!winkShown && e.deltaY > 0 && atBottom()) showWink();
    }, { passive: true });
    let touchStartY = null;
    window.addEventListener("touchstart", (e) => {
      touchStartY = e.touches && e.touches.length ? e.touches[0].clientY : null;
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (winkShown || touchStartY === null || !atBottom()) return;
      const y = e.touches && e.touches.length ? e.touches[0].clientY : touchStartY;
      if (touchStartY - y > 0) showWink(); // finger dragging up = pulling past the bottom
    }, { passive: true });
  }

  // ---- easter egg #6: console note ----
  try {
    console.log(
      "%c N.\n" +
      "%cCurious enough to open DevTools? We'd get along.\n— nitraina2000@gmail.com",
      "font:900 20px/1.2 monospace;color:#e8574a;",
      "font:13px ui-monospace,monospace;color:#8a857c;"
    );
  } catch (e) { /* ignore */ }

  // ---- easter egg #7: arrow-key theme flip ----
  // → → ← ← toggles an inverted theme via CSS filter (see .flip in
  // styles.css). Rolling 4-key buffer, ignored while typing in a field.
  // Intentionally shifts the exact brand hues slightly under invert+hue-rotate
  // — that drift is the joke, not a bug.
  let arrowBuffer = [];
  const FLIP_SEQ = "ArrowRight,ArrowRight,ArrowLeft,ArrowLeft";
  document.addEventListener("keydown", (e) => {
    if (!e.key.startsWith("Arrow")) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    arrowBuffer = arrowBuffer.concat(e.key).slice(-4);
    if (arrowBuffer.join(",") === FLIP_SEQ) {
      arrowBuffer = [];
      document.documentElement.classList.toggle("flip");
    }
  });

})();
