/* ==========================================================================
   MYSERVICEPARK TRAVEL - INTERACTION, CAROUSEL & FILTER ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. DESTINATIONS LIVE FILTER & SEARCH LOGIC
     ========================================== */
  const searchInput = document.getElementById('destinationSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destinationCards = document.querySelectorAll('#destinationsGrid .destination-card');
  const noResults = document.getElementById('noResults');

  if (destinationCards.length > 0) {
    let activeCategory = 'all';
    let searchQuery = '';

    const filterDestinations = () => {
      let visibleCount = 0;

      destinationCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardKeywords = (card.getAttribute('data-keywords') + ' ' + card.querySelector('.card-title').textContent).toLowerCase();

        const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
        const matchesSearch = searchQuery === '' || cardKeywords.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterDestinations();
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');
        filterDestinations();
      });
    });
  }

  /* ==========================================
     2. INFINITE INSTAGRAM-STYLE CAROUSEL ENGINE
     ========================================== */
  const carousels = document.querySelectorAll('.insta-carousel-wrapper');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.insta-carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.insta-slide'));
    const badge = carousel.querySelector('.insta-badge');
    const captionTag = carousel.querySelector('.insta-location-tag');
    const captionText = carousel.querySelector('.insta-caption-text');
    const dotsContainer = carousel.querySelector('.insta-dots');
    const prevBtn = carousel.querySelector('.insta-nav-btn.prev');
    const nextBtn = carousel.querySelector('.insta-nav-btn.next');

    if (!track || slides.length === 0) return;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('insta-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          track.scrollTo({
            left: slides[index].offsetLeft,
            behavior: 'smooth'
          });
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    const getActiveIndex = () => {
      const scrollPosition = track.scrollLeft;
      const slideWidth = track.clientWidth;
      return Math.round(scrollPosition / slideWidth);
    };

    const updateActiveSlide = () => {
      const activeIndex = getActiveIndex();
      const currentSlide = slides[activeIndex];

      if (!currentSlide) return;

      if (badge) {
        badge.textContent = `${activeIndex + 1} / ${slides.length}`;
      }

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });

      const title = currentSlide.getAttribute('data-location') || 'Featured View';
      const caption = currentSlide.getAttribute('data-caption') || currentSlide.querySelector('img')?.alt || '';

      if (captionTag) captionTag.innerHTML = `📍 ${title}`;
      if (captionText) captionText.textContent = caption;
    };

    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActiveSlide);
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const activeIndex = getActiveIndex();
        if (activeIndex >= slides.length - 1) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const activeIndex = getActiveIndex();
        if (activeIndex <= 0) {
          track.scrollTo({ left: slides[slides.length - 1].offsetLeft, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
        }
      });
    }

    updateActiveSlide();
  });

  /* ==========================================
     3. LIGHTBOX & TAP-TO-ZOOM
     ========================================== */
  if (!document.getElementById('lightboxModal')) {
    const lightboxHTML = `
      <div id="lightboxModal" class="lightbox-modal" aria-hidden="true">
        <div class="lightbox-header-bar">
          <div class="lightbox-controls">
            <button id="zoomIn" class="lightbox-btn">Zoom In (+)</button>
            <button id="zoomOut" class="lightbox-btn">Zoom Out (-)</button>
            <button id="zoomReset" class="lightbox-btn">Reset</button>
          </div>
          <button id="lightboxClose" class="lightbox-close" aria-label="Close Lightbox">&times;</button>
        </div>
        <div class="lightbox-viewport">
          <img id="lightboxImg" class="lightbox-img" src="" alt="Full view" />
        </div>
        <p id="lightboxCaption" class="lightbox-caption-text"></p>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomResetBtn = document.getElementById('zoomReset');

  let currentScale = 1;

  const setScale = (scale) => {
    currentScale = Math.min(Math.max(scale, 0.6), 3);
    if (modalImg) modalImg.style.transform = `scale(${currentScale})`;
  };

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => setScale(currentScale + 0.3));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setScale(currentScale - 0.3));
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => setScale(1));

  if (modalImg) {
    modalImg.addEventListener('click', () => {
      setScale(currentScale === 1 ? 1.8 : 1);
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.matches('.insta-slide img, .gallery-thumb, .article-hero-img')) {
      if (modalImg) modalImg.src = e.target.src;
      if (modalCaption) modalCaption.textContent = e.target.alt || e.target.closest('.insta-slide')?.getAttribute('data-caption') || '';
      setScale(1);
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';
    }
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('lightbox-viewport')) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================
     4. RESPONSIVE MOBILE MENU
     ========================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
});
