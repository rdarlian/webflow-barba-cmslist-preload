
<script>
  window.HomeCode = async function() {
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

    console.log("🎲 Combine diacak di Home pageeee!");
  }

    async function initHomeGrid() {
      const colListWrapper = document.querySelector(".w-dyn-items");
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
      console.log("✅ Home grid siap ta");
    }

    // Jalankan grid init
    //await shuffleCombine();
    //await initHomeGrid();
  };
</script>



<script>

/*
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push(['cmscombine', (listInstances) => {
  const colListWrapper = document.querySelector(".w-dyn-items");

  // pastikan wrapper ada dan punya anak
  if (!colListWrapper) return;

  const totalItems = [...colListWrapper.children];

  function assignArea() {
    totalItems.forEach((item, idx) => {
      item.style.gridArea = `Area-${idx + 1}`;
    });
  }

  function setGrid() {
    colListWrapper.classList.add("c-home-portfolio");
    assignArea();
  }

  setGrid();
}]);
*/ 

/*
// RANDOM PORTFOLIO GRID
  const colListWrapper = document.querySelector(".w-dyn-items");
  const totalItems = [...colListWrapper.children];
  
  function assignArea() {
    totalItems.forEach((item, idx) => {
      item.style.gridArea = `Area-${idx + 1}`;
    });
  }
  function setGrid() {
    colListWrapper.classList.add("c-home-portfolio");
    assignArea();
  }
  setGrid();
*/
</script>

<script>
//PAGE: HOMEPAGE
function init() {

  // Get portfolio list's height
  const portfolioList = document.querySelector(".c-home__right");
  const portfolioListHeight = portfolioList.getBoundingClientRect().height;
  const sectionHeight = portfolioListHeight / 6;
  console.log(portfolioList);
  console.log(portfolioListHeight);
  console.log(sectionHeight);

  // Define section
  const homepageTrigger = document.querySelector(".c-home-portfolio");
  const homepageAbout = document.querySelector(".c-home__content-wrapper.about");
  const homepageOverview = document.querySelector(".c-home__content-wrapper.overview");
  const homepageService = document.querySelector(".c-home__content-wrapper.services");
  const homepageServiceWebsite = document.querySelector(".c-home__content-services.website");
  const homepageServiceProduct = document.querySelector(".c-home__content-services.product");
  const homepageServiceBrand = document.querySelector(".c-home__content-services.brand");
  const homepageHow = document.querySelector(".c-home__content-wrapper.how");
  console.log(homepageTrigger);
  console.log(homepageAbout);
  console.log(homepageOverview);
  console.log(homepageService);
  console.log(homepageServiceWebsite);
  console.log(homepageServiceProduct);
  console.log(homepageServiceBrand);
  console.log(homepageHow);
  
  // Set initial state
  gsap.set(".c-home__content-wrapper", { visibility: "hidden" });
  gsap.set(".c-home__content-services", { visibility: "hidden" });

  // Scroll to SECTION 2
  ScrollTrigger.create({
    trigger: homepageTrigger,
    start: `${sectionHeight}px bottom`,
    end: `${sectionHeight * 2}px bottom`,
    preventOverlaps: true,
    fastScrollEnd: true,
    onEnter: () => {
      gsap.to(homepageAbout, { 
        autoAlpha: 0,
        duration: 0.3 
      });
      gsap.to(homepageOverview, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    },
    onLeaveBack: () => {
      gsap.to(homepageOverview, { 
      	autoAlpha: 0,
        duration: 0.3 
      });
      gsap.to(homepageAbout, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    }
  });

  // Scroll to SECTION 3
  ScrollTrigger.create({
    trigger: homepageTrigger,
    start: `${sectionHeight * 2}px bottom`,
    end: `${sectionHeight * 3}px bottom`,
    preventOverlaps: true,
    fastScrollEnd: true,
    onEnter: () => {
      gsap.to(homepageOverview, { 
      	autoAlpha: 0,
        duration: 0.3 
      });
      gsap.to(homepageService, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
      gsap.to(homepageServiceWebsite, { 
      	autoAlpha: 1,
      });
    },
    onLeaveBack: () => {
      gsap.to(homepageService, { 
      	autoAlpha: 0,
        duration: 0.3,
      });
      gsap.to(homepageServiceWebsite, { 
      	autoAlpha: 0,
      });
      gsap.to(homepageOverview, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    }
  });

  // Scroll to SECTION 4
  ScrollTrigger.create({
    trigger: homepageTrigger,
    start: `${sectionHeight * 3}px bottom`,
    end: `${sectionHeight * 4}px bottom`,
    preventOverlaps: true,
    fastScrollEnd: true,
    onEnter: () => {
      gsap.to(homepageService, { 
      	autoAlpha: 1,
      });
      gsap.to(homepageServiceWebsite, { 
      	autoAlpha: 0,
        duration: 0.3
      });
      gsap.to(homepageServiceProduct, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    },
    onLeaveBack: () => {
      gsap.to(homepageService, { 
      	autoAlpha: 1,
      });
      gsap.to(homepageServiceProduct, { 
      	autoAlpha: 0,
        duration: 0.3
      });
      gsap.to(homepageServiceWebsite, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    }
  });
  
  // Scroll to SECTION 5
  ScrollTrigger.create({
    trigger: homepageTrigger,
    start: `${sectionHeight * 4}px bottom`,
    end: `${sectionHeight * 5}px bottom`,
    preventOverlaps: true,
    fastScrollEnd: true,
    onEnter: () => {
      gsap.to(homepageService, { 
      	autoAlpha: 1,
      });
      gsap.to(homepageServiceProduct, { 
      	autoAlpha: 0,
        duration: 0.3
      });
      gsap.to(homepageServiceBrand, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    },
    onLeaveBack: () => {
      gsap.to(homepageService, { 
      	autoAlpha: 1,
      });
      gsap.to(homepageServiceBrand, { 
      	autoAlpha: 0,
        duration: 0.3
      });
      gsap.to(homepageServiceProduct, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    }
  });
  
  // Scroll to SECTION 6
  ScrollTrigger.create({
    trigger: homepageTrigger,
    start: `${sectionHeight * 5}px bottom`,
    end: `${sectionHeight * 6}px bottom`,
    preventOverlaps: true,
    fastScrollEnd: true,
    onEnter: () => {
      gsap.to(homepageService, { 
      	autoAlpha: 0,
      });
      gsap.to(homepageServiceBrand, { 
      	autoAlpha: 0,
        duration: 0.3
      });
      gsap.to(homepageHow, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    },
    onLeaveBack: () => {
      gsap.to(homepageHow, { 
      	autoAlpha: 0,
        duration: 0.3
      });
      gsap.to(homepageService, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
      gsap.to(homepageServiceBrand, { 
      	autoAlpha: 1,
        duration: 0.3,
        delay: 0.2
      });
    }
  });
}

ScrollTrigger.refresh();

window.addEventListener("load", function(event) {
  init();
  ScrollTrigger.refresh();
})

</script>
