<script>
window.Webflow ||= [];
window.Webflow.push(() => {

  const loader = document.getElementById("preloader");
  const percentText = loader?.querySelector(".percent");
  const progressBar = loader?.querySelector(".progress-bar");

  // =======================================
  // 🔥 RUN PRELOADER (revisi dengan gambar nyata)
  // =======================================
  async function runPreloader() {
    if (!loader) return;

    const images = Array.from(document.images);
    const total = images.length || 1; // biar gak 0
    let loaded = 0;
    let progress = 0;
    let done = false;

    const updateVisual = (target) => {
      if (percentText) percentText.textContent = `${Math.round(target)}%`;
      if (progressBar) progressBar.style.width = `${target}%`;
    };

    // update persen naik halus
    const smoothUpdate = (target) => {
      if (progress < target) {
        progress += 1;
        updateVisual(progress);
        requestAnimationFrame(() => smoothUpdate(target));
      }
    };

    // load semua gambar
    images.forEach((img) => {
      const imageClone = new Image();
      imageClone.onload = imageClone.onerror = () => {
        loaded++;
        const targetProgress = Math.round((loaded / total) * 100);
        smoothUpdate(targetProgress);
        if (loaded === total) finish();
      };
      imageClone.src = img.src;
    });

    // fallback timeout (kalau gak ada gambar)
    if (images.length === 0) {
      smoothUpdate(100);
      finish();
    }

    function finish() {
      done = true;
      updateVisual(100);
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.6,
          onComplete: () => loader.remove(),
        });
      }, 400);
    }
  }

  // =======================================
  // FUNGSI TAMBAHAN LAINNYA (asli kamu)
  // =======================================
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

      if (fsList.loading) await fsList.loading;
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

  // =======================================
  // 🔄 BARBA INIT (asli kamu, untouched)
  // =======================================
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

          if (typeof window.WorksCode === "function") {
            	await window.WorksCode();
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

  // =======================================
  // 🚀 STARTUP (sekali load aja)
  // =======================================
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
