<!-- [Attributes by Finsweet] CMS Combine 
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmscombine@1/cmscombine.js"></script> -->

<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<!--<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollSmoother.min.js"></script>-->


<script src="https://unpkg.com/@barba/core"></script>
<!-- <script src="https://cdn.jsdelivr.net/npm/@barba/core@2.9.7/dist/barba.umd/min.js"></script> -->

<!-- GSAP GSAP -->

<!-- <script defer src="https://cdn.jsdelivr.net/gh/prdvicky/10amspace-dev/gsap-script.js" crossorigin="anonymous"></script> -->
<!-- <script defer src="http://127.0.0.1:5500/gsap-script.js"></script> -->


<script>
 // --- NAVBAR ANIMATION ---
function navbarAnimation() {
  const menuButton = document.querySelector('.menu-button');
  const menuOverlay = document.querySelector('.w-nav-overlay');
  const menuLinks = document.querySelectorAll('.c-menu__links');

  if (menuButton && menuOverlay) {
    menuButton.replaceWith(menuButton.cloneNode(true)); // reset listener
    const menuButtonNew = document.querySelector('.menu-button');

    let menuOpen = false;
    const tl = gsap.timeline({ paused: true });

    tl.to(menuOverlay, {
      duration: 0.8,
      autoAlpha: 1,
      yPercent: 0,
      ease: "expo.out"
    }).to(menuLinks, {
      duration: 0.6,
      y: 0,
      autoAlpha: 1,
      stagger: 0.08,
      ease: "expo.out"
    }, "<0.2");

    menuButtonNew.addEventListener('click', () => {
      if (menuOpen) tl.reverse();
      else tl.play();
      menuOpen = !menuOpen;
    });
  }
}
  
window.HomeClassicCode = async function() {
  const colListWrapper = document.querySelector(".w-dyn-items");
  if (!colListWrapper) return;

  // --- PORTFOLIO GRID ---
  const totalItems = [...colListWrapper.children];

  function assignArea() {
    totalItems.forEach((item, idx) => {
      item.style.gridArea = `Area-${idx + 1}`;
    });
  }

  function setGrid() {
    colListWrapper.classList.add("c-homecl-showcase__item");
    assignArea();
  }

  setGrid();
  // --- HERO ON SCROLL ---
  gsap.to(".c-homecl-hero", {
    opacity: 0,
    y: 0,
    scrollTrigger: {
      trigger: ".c-homecl-showcase",
      start: 0,
      end: "top +=180px",
      pin: ".c-homecl-hero",
      pinSpacing: false,
      scrub: true,
    },
  });

  // --- SCROLL SPEED FEATURED PORTFOLIO ---
  const featuredPortfolio = gsap.utils.toArray(".c-homecl-showcase > .c-homecl-showcase__item");
  if (window.smoother) smoother.effects(featuredPortfolio);

  // Assign data-speed
  [1.3,1.5,1,1.1].forEach((speed, i) => {
    if (featuredPortfolio[i]) featuredPortfolio[i].setAttribute("data-speed", speed);
  });

  navbarAnimation();

  ScrollTrigger.refresh();
};
  
  // =======================================
  // HOME PAGE
  // =======================================
  function resetGridHome() {
    const colListWrapper = document.querySelector('[data-barba-namespace="home"] .w-dyn-items');
    if (!colListWrapper) return;
    [...colListWrapper.children].forEach(item => item.style.gridArea = '');
  }

  function setupGridHome() {
    const colListWrapper = document.querySelector('[data-barba-namespace="home"] .w-dyn-items');
    if (!colListWrapper) {
        console.warn("⚠️ No .w-dyn-items found on Home");
        return;
      }

      const items = colListWrapper.querySelectorAll(":scope > *");
      if (!items.length) return;

      items.forEach((item, idx) => {
        item.style.gridArea = `Area-${idx + 1}`;
      });

      colListWrapper.classList.add("c-home-portfolio");
      console.log("✅ Home grid siap global");
  }
  
  async function shuffleCombine() {
    const wrapper = document.querySelector('[data-barba-namespace="home"] .w-dyn-items');
    if (!wrapper) {
      console.warn("⚠️ Combine list belum siap, tunggu sedikit...");
      await new Promise((r) => setTimeout(r, 300)); // tunggu 0.3 detik
      return shuffleCombine();
    }

    const items = Array.from(wrapper.children);
    if (!items.length) return;

    // Fisher-Yates Shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      wrapper.appendChild(items[j]);
    }

    console.log("🎲 Combine diacak di Home global!");
  }
		
  
//---Niatnya Scroll Smoother Global
window.initScrollSmoother = function({ wrapperSelector, contentSelector, smooth = 1.2 } = {}) {
  try {
    // matikan smoother lama jika ada
    if (window.smoother?.kill) {
      window.smoother.kill();
    }
    const wrapper = document.querySelector(wrapperSelector || "#smooth-wrapper");
    const content = document.querySelector(contentSelector || "#smooth-content");

    if (!wrapper || !content) {
      console.warn("ScrollSmoother wrapper/content belum ada di DOM!");
      return;
    }

    window.smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth,
      effects: true,
      normalizeScroll: true,
      smoothTouch: 0.1,
    });
  } catch (err) {
    console.error("Gagal inisialisasi ScrollSmoother:", err);
  }
};
  
window.Webflow ||= [];
window.Webflow.push(() => {

  // =======================================
  // 🔥 PRELOADER DENGAN GAMBAR + CMS COMBINE
  // =======================================
  const loader = document.getElementById("preloader");
  const percentText = loader?.querySelector(".percent");
  const progressBar = loader?.querySelector(".progress-bar");

  async function runPreloader() {
    if (!loader) return;

    const images = Array.from(document.images);
    const total = images.length || 1;
    let loaded = 0, progress = 0;

    const updateVisual = (target) => {
      if (percentText) percentText.textContent = `${Math.round(target)}%`;
      if (progressBar) progressBar.style.width = `${target}%`;
    };

    const smoothUpdate = (target) => {
      if (progress < target) {
        progress += 1;
        updateVisual(progress);
        requestAnimationFrame(() => smoothUpdate(target));
      }
    };

    const waitImages = new Promise((resolve) => {
      if (images.length === 0) return resolve();
      images.forEach((img) => {
        const clone = new Image();
        clone.onload = clone.onerror = () => {
          loaded++;
          const targetProgress = Math.round((loaded / total) * 100);
          smoothUpdate(targetProgress);
          if (loaded === total) resolve();
        };
        clone.src = img.src;
      });
    });

    await Promise.all([waitImages, waitForFinsweetReady()]);

    updateVisual(100);
    await new Promise(r => setTimeout(r, 400));

    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => loader.remove(),
    });
  }

  // =======================================
  // 🔧 CEK FINSWEET CMS COMBINE
  // =======================================
  async function waitForFinsweetReady() {
    let tries = 0;
    while (!window.FinsweetAttributes?.modules?.list && tries < 80) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }

    const fsList = window.FinsweetAttributes?.modules?.list;
    if (!fsList) {
      console.warn("[FS] Tidak menemukan modul list setelah 8 detik");
      return;
    }

    if (fsList.loading) await fsList.loading;
    await fsList.restart();

    console.log("[FS] CMS Combine siap!");
  }

  async function restartFinsweet() {
    try {
      await waitForFinsweetReady();
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(" [FS] Gagal restart Finsweet CMS Combine:", err);
    }
  }

  async function waitForElement(selector) {
    return new Promise(resolve => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const observer = new MutationObserver(() => {
        const elNow = document.querySelector(selector);
        if (elNow) {
          observer.disconnect();
          resolve(elNow);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  async function waitForItems(selector) {
    return new Promise(resolve => {
      const checkItems = () => {
        const items = document.querySelectorAll(selector);
        if (items.length > 0) return resolve(items);
        requestAnimationFrame(checkItems);
      };
      checkItems();
    });
  }

  async function waitForHomeClassicCode(timeout = 3000) {
  const interval = 50;
  let waited = 0;

  return new Promise((resolve) => {
    const check = async () => {
      if (typeof window.HomeClassicCode === "function") {
        console.log("✅ HomeClassicCode siap, menjalankan...");
        await window.HomeClassicCode();
        resolve();
      } else if (waited >= timeout) {
        console.warn("⚠️ HomeClassicCode tidak muncul setelah timeout");
        resolve();
      } else {
        waited += interval;
        setTimeout(check, interval);
      }
    };
    check();
  });
}
  
  async function runHomeCode({ skipFSRestart=false } = {}) {
    const containerSelector = '[data-barba-namespace="home"] .w-dyn-items';
    const itemSelector = '[data-barba-namespace="home"] .w-dyn-item';

    await waitForElement(containerSelector);
    if (!skipFSRestart && window.FinsweetAttributes?.modules?.list?.restart) {
      console.log("🔁 Restart FS List (Home)...");
      await window.FinsweetAttributes.modules.list.restart();
      await waitForFinsweetReady();
      await waitForItems(itemSelector);
    }

    if (typeof window.HomeCode === "function") {
      console.log("🚀 Menjalankan HomeCode...");
      await window.HomeCode();
    }
    
    //resetGridHome();
    await shuffleCombine();
    setupGridHome();
    
  }
  
  async function runClassicCode({ skipFSRestart=false } = {}) {
    const containerSelector = '[data-barba-namespace="home-cl"] .w-dyn-items';
    const itemSelector = '[data-barba-namespace="home-cl"] .w-dyn-item';

    await waitForElement(containerSelector);

    if (!skipFSRestart && window.FinsweetAttributes?.modules?.list?.restart) {
      console.log("🔁 Restart FS List (Homeclassic)...");
      await window.FinsweetAttributes.modules.list.restart();
      await waitForItems(itemSelector);
    }

    await waitForHomeClassicCode(); 
  }

  // =======================================
  // 🔧 WORKS PAGE
  // =======================================
  let smoother;

  function initScrollSmoother() {
    try {
      if (window.smoother?.kill) {
        window.smoother.kill();
        console.log("♻️ ScrollSmoother direset");
      }

      const wrapper = document.querySelector("#smooth-wrapper");
      const content = document.querySelector("#smooth-content");

      if (!wrapper || !content) {
        console.warn("⚠️ ScrollSmoother wrapper belum ditemukan!");
        return;
      }

      window.smoother = ScrollSmoother.create({
        wrapper,
        content,
        smooth: 1.2,
        effects: true,
        normalizeScroll: true,
        smoothTouch: 0.1,
      });

      console.log("✨ ScrollSmoother aktif di Works page");
    } catch(e) {
      console.error("❌ Gagal mengaktifkan ScrollSmoother:", e);
    }
  }

  async function runWorksCode({ skipFSRestart = false } = {}) {
    const containerSelector = '[data-barba-namespace="works"] .w-dyn-items';
    const itemSelector = '[data-barba-namespace="works"] .w-dyn-item';

    await waitForElement(containerSelector);

    if (!skipFSRestart && window.FinsweetAttributes?.modules?.list?.restart) {
      console.log("🔁 Restart FS List (Works)...");
      await window.FinsweetAttributes.modules.list.restart();
      await waitForItems(itemSelector);
    }

    initScrollSmoother();

    if (typeof window.WorksCode === "function") {
      console.log("🚀 Menjalankan WorksCode...");
      await window.WorksCode();
    }
  }

  // =======================================
  // 🔄 BARBA.JS
  // =======================================
if (typeof barba !== 'undefined') {
  barba.init({
    transitions: [
      {
        name: "overlay-fade",

        async leave(data) {
          // Data.current.container → halaman lama
          await gsap.to(data.current.container, {
            opacity: 0,
            yPercent: -5,
            duration: 0.6,
            ease: "power2.inOut"
          });
        },

        async enter(data) {
          // Data.next.container → halaman baru
          await gsap.from(data.next.container, {
            opacity: 0,
            yPercent: 5,
            duration: 1.2,
            ease: "power2.inOut"
          });
        },

        async once(data) {
          // Animasi saat pertama load halaman
          await gsap.from(data.next.container, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.out"
          });
        }
      }
    ],
    views: [
      {
        namespace: "home",
        async afterEnter() {
          console.log("💻 AfterEnter Home");
          await runHomeCode({ skipFSRestart:false });
        }
      },
      {
        namespace: "works",
        async afterEnter() {
          console.log("💼 AfterEnter Works");
          await runWorksCode({ skipFSRestart: false });
        }
      },
      {
        namespace: "home-cl",
        async afterEnter() {
          console.log("💼 AfterEnter classic");

          // 🟢 Reinit Webflow IX3
          if (window.Webflow && window.Webflow.require) {
            const ix3 = window.Webflow.require('ix3');
            ix3?.ready?.();
            console.log("✅ Webflow IX3 reinit berhasil");
          }

          await runClassicCode({ skipFSRestart: false });
        }
      }
    ]
  });
        
  barba.hooks.afterEnter((data) => {
    if (data.next.namespace === 'home') {
      const colListWrapper = document.querySelector('.w-dyn-items[fs-list-combine="content"]');
      if (colListWrapper && !colListWrapper.classList.contains('c-home-portfolio')) {
        colListWrapper.classList.add('c-home-portfolio');
        console.log("c-home-portfolio ditambahkan ulang");
      }
    }
    
  });
  // 🔹 BARBA AFTER ENTER HOOK
barba.hooks.after((data) => {
  console.log("AFTER HOOK TRIGGERED, namespace:", data.next.namespace);
  const ns = data.next.namespace;

  // ===== WORKS PAGE =====
  if (ns === "works") {
    console.log("💼 AfterEnter Works page");

    // Inisialisasi ScrollSmoother global
    window.initScrollSmoother({
        smooth: 1.5,
        effects: true,
        normalizeScroll: true
    });

    // Jika ada WorksCode global
    if (typeof window.WorksCode === "function") {
      window.WorksCode();
      console.log("🚀 WorksCode dijalankan via aftertok hook");
    }

    // Reinit Webflow IX3 (jika ada animasi IX3)
    if (window.Webflow?.require) {
      const ix3 = window.Webflow.require("ix3");
      ix3?.ready?.();
      console.log("✨ IX3 Webflow reinit after");
    }
  }
  if (ns === "home") {
    console.log("💼 AfterEnter home page");

    // Inisialisasi ScrollSmoother global
    window.initScrollSmoother({
        smooth: 1.5,
        effects: true,
        normalizeScroll: true
    });

    // Jika ada WorksCode global
    if (typeof window.HomeCode === "function") {
      window.HomeCode();
      console.log("🚀 Home dijalankan via aftertok hook");
    }

    // Reinit Webflow IX3 (jika ada animasi IX3)
    if (window.Webflow?.require) {
      const ix3 = window.Webflow.require("ix3");
      ix3?.ready?.();
      console.log("✨ IX3 Webflow reinit after");
    }
  }
  if (ns === "home-cl") {
    console.log("💼 AfterEnter Works page");

    // Inisialisasi ScrollSmoother global
    window.initScrollSmoother({
        smooth: 2,
        effects: true,
        normalizeScroll: true
    });
    if (typeof window.runClassicCode === "function") {
      console.log("jalannniih");
      window.runClassicCode();
    }
    // Reinit Webflow IX3 (jika ada animasi IX3)
    if (window.Webflow?.require) {
      const ix3 = window.Webflow.require("ix3");
      ix3?.ready?.();
      console.log("✨ IX3 Webflow reinit after");
    }
  }
});
}
  // =======================================
  // 🚀 STARTUP
  // =======================================
  (async () => {
    await runPreloader();
    //await runHomeCode({ skipFSRestart:false });
  })();

});
</script>







<script>  
  window.scrollTo(0, 0);
  //GSAP
  
//function init() {
  // SCROLL SMOOTHER
  const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.5, // how long (in seconds) it takes to "catch up" to the native scroll position
    effects: true, // looks for data-speed and data-lag attributes on elements
    smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
  });
  console.log("After ScrollSmoother.create()");
  console.log("ScrollSmoother instance:", smoother);

  // Test apakah ScrollSmoother berhasil dibuat
  if (smoother) {
    console.log("✅ ScrollSmoother created successfully");
    console.log("Wrapper element:", smoother.wrapper());
    console.log("Content element:", smoother.content());
  } else {
    console.log("❌ ScrollSmoother failed to create");
  }
  
  // footer back to top
  document.getElementById('back-to-top')?.addEventListener('click', () => {
  	if (smoother) {
      smoother.scrollTo(0, { smooth: 1 });
    } else {
      window.scrollTo(0, 0);
    }
  });

//} //function init()

//window.addEventListener("preloaderDone", function(event) {
//	init();
//});



  
// GET ELEMENT HEIGHT
//  document.documentElement.style.setProperty('--navbar-height', document.getElementById("navbar").offsetHeight + 'px');
//  document.documentElement.style.setProperty('--separator-text', document.getElementById("c-separator-text").offsetHeight + 'px');

function initNavbarInteraction() {
  const mobileNavIconWrapper = document.querySelector('.c-mobile-nav__icons');

  if (!mobileNavIconWrapper) {
    return;
  }

  const mobileNavPanel = document.querySelector('.c-mobile-nav__panel');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const xIcon = document.getElementById('x-icon');
  const menuLinks = document.querySelectorAll('.mobile-nav__link');

  mobileNavIconWrapper.style.width = '24px';
  mobileNavIconWrapper.style.height = '24px';

  // Set initial state for the X icon (hidden and rotated)
  gsap.set(xIcon, { autoAlpha: 0, rotation: -90 });
  //gsap.set(mobileNavPanel, { y: '100%' }); // Ensure initial state is set with GSAP
  gsap.set('.navbar-info-details .navbar-info-item', { opacity: 0, y: '100%' });

  // --- GSAP Animation Timeline ---
  const tl = gsap.timeline({ paused: true });

  // Animation for the mobile menu panel sliding in
  tl.to(mobileNavPanel, {
    y: 0,
    duration: 0.4,
    ease: 'power3.out'
  });

  // This starts 0.2 seconds *after* the panel animation begins.
  tl.to('.navbar-time-wrapper', {
    height: 0,
    opacity: 0,
    duration: 0.2,
    ease: 'power3.out'
  }, '<0.3');

  tl.to('.navbar-info-details', {
    height: 'auto',
    opacity: 1,
    duration: 0.2,
    ease: 'power3.out'
  }, '<0.1');

  tl.to('.navbar-info-details .navbar-info-item', {
    opacity: 1,
    y: 0,
    duration: 0.2,
    stagger: 0.1,
    ease: 'power3.out'
  }, '<');

  // Animate the menu links in with a stagger effect.
  tl.fromTo(menuLinks, 
            { y: 30, autoAlpha: 0 }, // from state
            {
    y: 0,
    autoAlpha: 1,
    duration: 0.2,
    ease: 'power3.out',
    stagger: 0.1
  }, 
            "<0.2" // The fix: Position parameter adjusted for timing
           );

  // Animate the hamburger icon out
  tl.to(hamburgerIcon, {
    autoAlpha: 0,
    rotation: 90,
    duration: 0.4,
    ease: 'power2.inOut'
  }, "<");

  // Animate the X icon in
  tl.to(xIcon, {
    autoAlpha: 1,
    rotation: 0,
    duration: 0.4,
    ease: 'power2.inOut'
  }, "<");

  // Menu click event handler
  let isOpen = false;
  mobileNavIconWrapper?.addEventListener('click', () => {
    if (isOpen) {
      tl.reverse();
    } else {
      tl.restart();
    }
    isOpen = !isOpen;
  });
}  

document.addEventListener("DOMContentLoaded", () => {
  // -- JAM DAN LIBUR -- //

  function parseCMSDate(str) {
    // Coba langsung ke Date
    let d = new Date(str);
    if (!isNaN(d)) {
      d.setHours(12, 0, 0, 0); // 🔑 normalisasi
      return d;
    }

    // Kalau format Inggris: "September 26, 2025"
    const parts = str.replace(",", "").split(" ");
    if (parts.length === 3) {
      const months = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
      };
      const month = months[parts[0]];
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        d = new Date(year, month, day);
        d.setHours(12, 0, 0, 0); // 🔑 normalisasi
        return d;
      }
    }

    return null; // fallback kalau gagal total
  }
  
  function isOnline() {
    const nowJakarta = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    const todayStr = nowJakarta.toISOString().split("T")[0];
    const isWeekend = [0, 6].includes(nowJakarta.getDay());
    
    // Ambil libur dari CMS
    const holidayEls = document.querySelectorAll(".holiday-date");
    const holidayDates = Array.from(holidayEls)
      .map(el => parseCMSDate(el.textContent.trim()))
      .filter(Boolean); // buang null
    const isHoliday = holidayDates.some(
      d => d.toISOString().split("T")[0] === todayStr
    );

    const hourWIB = nowJakarta.getHours();

  	return !isWeekend && !isHoliday && hourWIB >= 8 && hourWIB < 17;
  }


  function updateJam() {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const nowJakarta = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    const jamJakarta = nowJakarta.toLocaleTimeString("en-US", options);

    const nowLocal = new Date();
    const diffHrs = Math.round((nowLocal - nowJakarta) / (1000 * 60 * 60));
    const sign = diffHrs >= 0 ? "+" : "-";

    const jamEl = document.getElementById("jam");
    if (jamEl) {
      jamEl.textContent = `${jamJakarta} JKT (${sign}${Math.abs(diffHrs)}H DIFF)`;
    }
    
    const navbarDescShort = document.querySelector('.navbar-desc-short');
    if (navbarDescShort) {
      navbarDescShort.textContent = `${jamJakarta} JKT (${isOnline() ? 'ONLINE' : 'OFFLINE'})`;
    }
    
    const mobileNavbarOpen = document.querySelector('.c-navbar__info-open');
    if (mobileNavbarOpen) {
      document.getElementById('navbar-desc-top').textContent = `${jamJakarta} JKT`;
      document.getElementById('navbar-desc-mid').textContent = `${sign}${Math.abs(diffHrs)}H DIFF WITH YOURS`;
      document.getElementById('navbar-desc-bottom').textContent = `CURRENTLY ${isOnline() ? 'ONLINE' : 'OFFLINE'}`;
    }

    const statusEl = document.getElementById("status");
    if (statusEl) {
      if (isOnline()) {
      	statusEl.textContent = "WE'RE CURRENTLY ONLINE";
      } else {
        statusEl.textContent = "WE'RE CURRENTLY OFFLINE";
      }
    }
  }

  setInterval(updateJam, 1000);
  updateJam();
  
  // -- END JAM DAN LIBUR -- //


  // -- ANIMATE TEXT TO HAVE REVEAL ANIMATION -- //

  /*const textReveal = gsap.utils.toArray('h1:not(.no-heading-animate), h2:not(.no-heading-animate), h3:not(.no-heading-animate), h4:not(.no-heading-animate), h5:not(.no-heading-animate), h6:not(.no-heading-animate), p.text-reveal');
  
  textReveal.forEach(text => {
  	SplitText.create(text, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'text-line-reveal',
      autoSplit: true,
      onSplit: (self) => {
        return gsap.from(self.lines, {
          y: 100,
          stagger: 0.05,
          scrollTrigger: {
            trigger: text,
            start: `top bottom-=${text.clientHeight * 0.2}`,
          },
        });
      },
    });
  });*/
  
  // -- END TEXT REVEAL ANIMATION -- //

  initNavbarInteraction();
});
  
function initTextReveal() {
  const textReveal = gsap.utils.toArray(
    "h1:not(.no-heading-animate), h2:not(.no-heading-animate), h3:not(.no-heading-animate), h4:not(.no-heading-animate), h5:not(.no-heading-animate), h6:not(.no-heading-animate), p.text-reveal"
  );

  textReveal.forEach((text) => {
    const split = SplitText.create(text, {
      type: "lines",
      mask: "lines",
      linesClass: "text-line-reveal",
      autoSplit: true,
      onSplit: (self) => {
        return gsap.from(self.lines, {
          y: 100,
          stagger: 0.05,
          scrollTrigger: {
            trigger: text,
            start: `top bottom-=${text.clientHeight * 0.2}`,
          },
        });
      },
    });
  });
}

document.fonts.ready.then(() => {
  initTextReveal();
});

</script>
