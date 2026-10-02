/**
 * MYSERVICEPARK TRAVEL - FRONTEND INTERACTION CONTROLLER
 * Handles mobile drawer nav, subpath link resolution, dynamic destination search, and FAQs
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initSubpathLinkResolver();
  initFaqAccordion();
  
  // Render Featured Destinations on Homepage if container exists
  if (document.getElementById("featured-destinations-grid")) {
    renderFeaturedDestinations();
  }

  // Render All Destinations & Setup Search on Destinations Page if container exists
  if (document.getElementById("all-destinations-grid")) {
    initDestinationsPage();
  }
});

/* --------------------------------------------------------------------------
   1. Subpath Relative Path Normalizer (Ensures 100% fix for GitHub Pages subpaths)
   -------------------------------------------------------------------------- */
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes("/articles/") || path.includes("/destinations/")) {
    return "../";
  }
  return "./";
}

function initSubpathLinkResolver() {
  const base = getBasePath();
  
  // Update internal links with base path if needed dynamically
  document.querySelectorAll("[data-relative-href]").forEach(element => {
    const relativeTarget = element.getAttribute("data-relative-href");
    element.href = base + relativeTarget;
  });
}

/* --------------------------------------------------------------------------
   2. Responsive Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("is-active");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("is-active");
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Card HTML Builder Template
   -------------------------------------------------------------------------- */
function createDestinationCardHTML(item) {
  const base = getBasePath();
  const targetUrl = item.articleUrl === "#" ? "#" : base + item.articleUrl;
  const isPlaceholder = item.articleUrl === "#";

  return `
    <article class="card">
      <div class="card-img-wrapper">
        <img src="${item.coverImage}" alt="${item.title}" class="card-img" loading="lazy" />
        <span class="card-badge">${item.categoryLabel}</span>
      </div>
      <div class="card-content">
        <div class="card-meta">${item.region} • ${item.readTime}</div>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-excerpt">${item.excerpt}</p>
        <a href="${targetUrl}" class="card-link">
          ${isPlaceholder ? 'Guide Coming Soon' : 'Read Travel Guide'} &rarr;
        </a>
      </div>
    </article>
  `;
}

/* --------------------------------------------------------------------------
   4. Render Featured Items on Homepage
   -------------------------------------------------------------------------- */
function renderFeaturedDestinations() {
  const container = document.getElementById("featured-destinations-grid");
  if (!container || typeof DESTINATIONS_DATA === "undefined") return;

  const featuredList = DESTINATIONS_DATA.filter(item => item.featured);
  container.innerHTML = featuredList.map(createDestinationCardHTML).join("");
}

/* --------------------------------------------------------------------------
   5. Destinations Page Live Search & Filter Engine
   -------------------------------------------------------------------------- */
function initDestinationsPage() {
  const container = document.getElementById("all-destinations-grid");
  const searchInput = document.getElementById("destination-search");
  const pillBtns = document.querySelectorAll(".pill-btn");

  let currentCategory = "all";
  let currentSearchQuery = "";

  function updateDisplay() {
    const filtered = getFilteredDestinations(currentCategory, currentSearchQuery);
    
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>No Destinations Found</h3>
          <p>We couldn't find anything matching "${currentSearchQuery}". Try another keyword or filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(createDestinationCardHTML).join("");
  }

  // Filter Pill Listener
  pillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      pillBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      updateDisplay();
    });
  });

  // Live Search Input Listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      updateDisplay();
    });
  }

  // Initial Render
  updateDisplay();
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion Logic
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  
  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      parent.classList.toggle("active");
    });
  });
}

/* ==========================================
   AUTOMATIC LIGHTBOX POPUP FUNCTIONALITY
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Lightbox HTML into body
  const lightboxHTML = `
    <div id="lightboxModal" class="lightbox-modal" aria-hidden="true">
      <div class="lightbox-content">
        <button id="lightboxClose" class="lightbox-close" aria-label="Close image popup">&times;</button>
        <img id="lightboxImg" class="lightbox-img" src="" alt="Full view image" />
        <p id="lightboxCaption" class="lightbox-caption"></p>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  // 2. Attach click handlers to all article images and gallery thumbnails
  const clickableImages = document.querySelectorAll('.article-hero-img, .gallery-thumb');

  clickableImages.forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt || 'Enlarged Image';
      modalCaption.textContent = img.alt || '';
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  });

  // 3. Close actions
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
});

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. IMAGE CAROUSEL LOGIC
     ========================================== */
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const dotsNav = carousel.querySelector('.carousel-dots');
    
    let currentIndex = 0;

    // Create dots dynamically
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(idx));
      dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    const moveToSlide = (index) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      track.style.transform = `translateX(-${index * 100}%)`;
      dots[currentIndex].classList.remove('active');
      dots[index].classList.add('active');
      currentIndex = index;
    };

    if (nextBtn) nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
  });

  /* ==========================================
     2. LIGHTBOX WITH ZOOM IN / OUT FEATURE
     ========================================== */
  const lightboxHTML = `
    <div id="lightboxModal" class="lightbox-modal" aria-hidden="true">
      <div class="lightbox-content">
        <div class="lightbox-controls">
          <button id="zoomIn" class="lightbox-btn">Zoom In (+)</button>
          <button id="zoomOut" class="lightbox-btn">Zoom Out (-)</button>
          <button id="zoomReset" class="lightbox-btn">Reset</button>
        </div>
        <button id="lightboxClose" class="lightbox-close" aria-label="Close">&times;</button>
        <div class="lightbox-img-wrapper">
          <img id="lightboxImg" class="lightbox-img" src="" alt="Enlarged view" />
        </div>
        <p id="lightboxCaption" class="lightbox-caption"></p>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomResetBtn = document.getElementById('zoomReset');

  let currentScale = 1;

  const updateScale = () => {
    modalImg.style.transform = `scale(${currentScale})`;
  };

  zoomInBtn.addEventListener('click', () => {
    if (currentScale < 3) {
      currentScale += 0.3;
      updateScale();
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (currentScale > 0.6) {
      currentScale -= 0.3;
      updateScale();
    }
  });

  zoomResetBtn.addEventListener('click', () => {
    currentScale = 1;
    updateScale();
  });

  // Attach click to hero images & gallery thumbnails
  document.addEventListener('click', (e) => {
    if (e.target.matches('.article-hero-img, .gallery-thumb, .carousel-slide img')) {
      modalImg.src = e.target.src;
      modalCaption.textContent = e.target.alt || '';
      currentScale = 1;
      updateScale();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  /* ==========================================
     3. STARTING POINT DISTANCE CALCULATOR
     ========================================== */
  const distanceMatrix = {
    "chilika-lake": {
      "Bhubaneswar": { dist: "70 km", time: "1 hr 45 min", route: "via NH-16 (towards Balugaon / Mangalajodi)" },
      "Cuttack": { dist: "95 km", time: "2 hr 15 min", route: "via NH-16" },
      "Berhampur": { dist: "110 km", time: "2 hr 30 min", route: "via NH-16 Northbound" },
      "Puri": { dist: "50 km", time: "1 hr 15 min", route: "via Puri-Satapada Canal Road" }
    },
    "daringbadi": {
      "Bhubaneswar": { dist: "245 km", time: "5 hr 45 min", route: "via NH-57 and Phulbani Ghat" },
      "Cuttack": { dist: "260 km", time: "6 hr 10 min", route: "via Badamba - Narsinghpur route" },
      "Berhampur": { dist: "125 km", time: "3 hr 30 min", route: "via Sorada Ghat Road" },
      "Puri": { dist: "270 km", time: "6 hr 30 min", route: "via Bhubaneswar - Nayagarh" }
    }
  };

  const calcBtn = document.getElementById('calculateDistanceBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const destinationId = calcBtn.getAttribute('data-destination');
      const startPoint = document.getElementById('startLocationSelect').value;
      const resultBox = document.getElementById('distanceResult');

      if (!startPoint) {
        alert('Please select your starting location.');
        return;
      }

      const info = distanceMatrix[destinationId]?.[startPoint];

      if (info) {
        resultBox.innerHTML = `
          <p><strong>Distance:</strong> ${info.dist} (${info.time} drive)</p>
          <p style="margin-top: 4px; font-size: 0.9rem; color: #334155;"><strong>Recommended Route:</strong> ${info.route}</p>
        `;
        resultBox.style.display = 'block';
      }
    });
  }
});
