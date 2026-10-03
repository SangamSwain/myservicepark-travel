/* ==========================================================================
   MYSERVICEPARK TRAVEL - INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initUniversalSearchAndFilters();
  initCarousels();
  initLightbox();
});

/* --- Mobile Navigation --- */
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

/* --- Real-Time Universal Search & Filtering --- */
function initUniversalSearchAndFilters() {
  const searchInput = document.getElementById('destinationSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.destination-card');
  const noResults = document.getElementById('noResults');

  if (!cards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
      const text = (card.querySelector('.card-text')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        text.includes(searchQuery) || 
        keywords.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      applyFilters();
    });
  });
}

/* --- Image Gallery Carousel --- */
function initCarousels() {
  const carousels = document.querySelectorAll('.insta-carousel-wrapper');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.insta-carousel-track');
    const slides = carousel.querySelectorAll('.insta-slide');
    const prevBtn = carousel.querySelector('.insta-nav-btn.prev');
    const nextBtn = carousel.querySelector('.insta-nav-btn.next');
    const badge = carousel.querySelector('.insta-badge');
    const locationTag = carousel.querySelector('.insta-location-tag');
    const captionText = carousel.querySelector('.insta-caption-text');
    const dotsContainer = carousel.querySelector('.insta-dots');

    if (!track || !slides.length) return;

    let currentIndex = 0;

    // Create pagination dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('insta-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateSlideState(index) {
      currentIndex = index;
      const slide = slides[currentIndex];
      const width = track.clientWidth;

      track.scrollTo({ left: width * currentIndex, behavior: 'smooth' });

      if (badge) badge.textContent = `${currentIndex + 1} / ${slides.length}`;
      if (locationTag) locationTag.textContent = `📍 ${slide.getAttribute('data-location') || ''}`;
      if (captionText) captionText.textContent = slide.getAttribute('data-caption') || '';

      const dots = dotsContainer?.querySelectorAll('.insta-dot');
      dots?.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function scrollToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      updateSlideState(index);
    }

    prevBtn?.addEventListener('click', () => scrollToSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => scrollToSlide(currentIndex + 1));
  });
}

/* --- Fullscreen Lightbox Modal --- */
function initLightbox() {
  const slides = document.querySelectorAll('.insta-slide img');
  
  if (!slides.length) return;

  // Create lightbox markup
  const modal = document.createElement('div');
  modal.className = 'lightbox-modal';
  modal.innerHTML = `
    <div class="lightbox-header-bar">
      <div class="lightbox-controls">
        <button class="lightbox-btn" id="zoomInBtn">Zoom In +</button>
        <button class="lightbox-btn" id="zoomOutBtn">Zoom Out -</button>
        <button class="lightbox-btn" id="resetZoomBtn">Reset</button>
      </div>
      <button class="lightbox-close">&times;</button>
    </div>
    <div class="lightbox-viewport">
      <img src="" alt="Enlarged preview" class="lightbox-img" />
    </div>
    <div class="lightbox-caption-text"></div>
  `;
  document.body.appendChild(modal);

  const lightboxImg = modal.querySelector('.lightbox-img');
  const lightboxCaption = modal.querySelector('.lightbox-caption-text');
  const closeBtn = modal.querySelector('.lightbox-close');
  let currentZoom = 1;

  function setZoom(zoom) {
    currentZoom = Math.min(Math.max(0.8, zoom), 2.5);
    lightboxImg.style.transform = `scale(${currentZoom})`;
  }

  slides.forEach(img => {
    img.addEventListener('click', () => {
      const slide = img.closest('.insta-slide');
      lightboxImg.src = img.src;
      lightboxCaption.textContent = slide?.getAttribute('data-caption') || '';
      currentZoom = 1;
      setZoom(1);
      modal.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-viewport')) {
      modal.classList.remove('active');
    }
  });

  document.getElementById('zoomInBtn')?.addEventListener('click', () => setZoom(currentZoom + 0.3));
  document.getElementById('zoomOutBtn')?.addEventListener('click', () => setZoom(currentZoom - 0.3));
  document.getElementById('resetZoomBtn')?.addEventListener('click', () => setZoom(1));
}
