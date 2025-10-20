<script src="https://unpkg.com/@barba/core"></script>

<script>
window.Webflow ||= [];
window.Webflow.push(() => {

  const loader = document.getElementById("preloader");
  const percentText = loader?.querySelector(".percent");
  const progressBar = loader?.querySelector(".progress-bar");

  async function runPreloader() {
    if (!loader) return;

    let progress = 0;
    let done = false;
    const tick = setInterval(() => {
      if (done) return;
      progress += Math.random() * 4;
      if (progress > 95) progress = 95;
      if (percentText) percentText.textContent = Math.round(progress) + "%";
      if (progressBar) progressBar.style.width = progress + "%";
    }, 80);

    await new Promise(r => setTimeout(r, 300));

    done = true;
    clearInterval(tick);
    if (percentText) percentText.textContent = "100%";
    if (progressBar) progressBar.style.width = "100%";

    await new Promise(r => setTimeout(r, 600));

    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        loader.remove();
      }
    });
  }

  function resetGridHome() {
    const colListWrapper = document.querySelector('[data-barba-namespace="home"] .w-dyn-items');
    if (!colListWrapper) return;
    [...colListWrapper.children].forEach(item => item.style.gridArea = '');
  }

  function setupGridHome() {
    const colListWrapper = document.querySelector('[data-barba-namespace="home"] .w-dyn-items');
    if (!colListWrapper) return;

    const totalItems = [...colListWrapper.children];
    totalItems.forEach((item, idx) => {
      item.style.gridArea = `Area-${idx + 1}`;
    });
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

  async function restartFinsweet() {
  try {

    // Tunggu sampai FinsweetAttributes.modules.list tersedia
    let tries = 0;
    while (!window.FinsweetAttributes?.modules?.list && tries < 50) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }

    const fsList = window.FinsweetAttributes?.modules?.list;
    if (!fsList) {
      console.warn(" [FS] Gagal mendeteksi modul list setelah 5 detik.");
      return;
    }


    // Tunggu loading promise (kalau masih jalan)
    if (fsList.loading) {
      await fsList.loading;
    }

    await fsList.restart();

    await new Promise(r => setTimeout(r, 300));

  } catch (err) {
    console.error(" [FS] Gagal restart Finsweet CMS Combine:", err);
  }
}



  async function runHomeCode({ skipFSRestart=false } = {}) {
    const containerSelector = '[data-barba-namespace="home"] .w-dyn-items';
    const itemSelector = '[data-barba-namespace="home"] .w-dyn-item';

    await waitForElement(containerSelector);

    if (!skipFSRestart && window.FinsweetAttributes?.modules?.list?.restart) {
      console.log(" Restart FS List...");
      await window.FinsweetAttributes.modules.list.restart();
      console.log("FS List sudah direstart!");
      await waitForItems(itemSelector);
    }

    if (typeof window.HomeCode === "function") {
      console.log(" Menjalankan HomeCode...");
      await window.HomeCode();
    }

    resetGridHome();
    setupGridHome();
  }


  barba.init({
    transitions: [
      {
        name: "fade",
        async leave(data) {
          await gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
        },
        async enter(data) {
          await gsap.from(data.next.container, { opacity: 0, duration: 0.3 });
        },
      },
    ],
    views: [
      {
        namespace: "home",
        async afterEnter() {
          console.log(" AfterEnter Home (Barba)");
          await runHomeCode({ skipFSRestart:false });
        },
      },
      {
        namespace: "works",
        async afterEnter() {
          console.log(" AfterEnter Work (Barba)");
          await restartFinsweet();

          if (typeof window.WorkCode === "function") {
            await window.WorkCode();
          }
        },
      },
    ],
  });


  barba.hooks.afterEnter((data) => {
    if (data.next.namespace === 'home') {
      console.log(" Balik ke Home — cek ulang grid");
      const colListWrapper = document.querySelector('.w-dyn-items[fs-list-combine="content"]');
      if (!colListWrapper) {
        console.warn(" Tidak menemukan .w-dyn-items setelah balik ke Home");
        return;
      }

      if (!colListWrapper.classList.contains('c-home-portfolio')) {
        colListWrapper.classList.add('c-home-portfolio');
        console.log(" c-home-portfolio ditambahkan ulang");
      } else {
        console.log(" c-home-portfolio sudah ada");
      }
    }
  });


  (async () => {
    const firstLoadDone = sessionStorage.getItem("firstLoadDone") === "true";
    if (!firstLoadDone) {
      await runPreloader();
      sessionStorage.setItem("firstLoadDone", "true");
      await runHomeCode({ skipFSRestart:true });
    } else {
      console.log(" Skip preloader (sudah pernah dijalankan)");
      if (loader) loader.remove();
      await runHomeCode({ skipFSRestart:false });
    }
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
    console.log("ScrollSmoother created successfully");
    console.log("Wrapper element:", smoother.wrapper());
    console.log("Content element:", smoother.content());
  } else {
    console.log(" ScrollSmoother failed to create");
  }

//} //function init()

//window.addEventListener("preloaderDone", function(event) {
//	init();
//});



  
// GET ELEMENT HEIGHT
//  document.documentElement.style.setProperty('--navbar-height', document.getElementById("navbar").offsetHeight + 'px');
//  document.documentElement.style.setProperty('--separator-text', document.getElementById("c-separator-text").offsetHeight + 'px');
  
 



  
// jam dan libur
  
document.addEventListener("DOMContentLoaded", () => {
  function parseCMSDate(str) {
  // Coba langsung ke Date
  let d = new Date(str);
  if (!isNaN(d)) {
    d.setHours(12, 0, 0, 0);
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
      d.setHours(12, 0, 0, 0);
      return d;
    }
  }

  return null; // fallback kalau gagal total
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

    // Ambil libur dari CMS
    const holidayEls = document.querySelectorAll(".holiday-date");
    const holidayDates = Array.from(holidayEls)
      .map(el => parseCMSDate(el.textContent.trim()))
      .filter(Boolean); // buang null

    const todayStr = nowJakarta.toISOString().split("T")[0];
    const isWeekend = [0, 6].includes(nowJakarta.getDay());
    const isHoliday = holidayDates.some(
      d => d.toISOString().split("T")[0] === todayStr
    );

    const statusEl = document.getElementById("status");
    if (statusEl) {
      const hourWIB = nowJakarta.getHours();
      if (!isWeekend && !isHoliday && hourWIB >= 8 && hourWIB < 17) {
        statusEl.textContent = "WE'RE CURRENTLY ONLINE";
      } else {
        statusEl.textContent = "WE'RE CURRENTLY OFFLINE";
      }
    }
  }

  setInterval(updateJam, 1000);
  updateJam();
});



</script>
