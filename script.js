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
