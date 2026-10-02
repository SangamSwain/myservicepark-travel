/* ==========================================================================
   MYSERVICEPARK TRAVEL - INTERACTION & CAROUSEL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. INSTAGRAM-STYLE CAROUSEL SYNC
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

    // Create dynamic navigation dots
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

    const dots = Array.from(dotsContainer.children);

    // Update active state based on scroll position
    const updateActiveSlide = () => {
      const scrollPosition = track.scrollLeft;
      const slideWidth = track.clientWidth;
      const activeIndex = Math.round(scrollPosition / slideWidth);

      // Update Slide Counter Badge (e.g. 1 / 3)
      if (badge) {
        badge.textContent = `${activeIndex + 1} / ${slides.length}`;
      }

      // Sync active dot
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });

      // Sync caption text under carousel
      const currentSlide = slides[activeIndex];
      if (currentSlide) {
        const title = currentSlide.getAttribute('data-location') || 'Featured View';
        const caption = currentSlide.getAttribute('data-caption') || currentSlide.querySelector('img')?.alt || '';

        if (captionTag) captionTag.innerHTML = `📍 ${title}`;
        if (captionText) captionText.textContent = caption;
      }
    };

    // Listen for manual swipe / scroll
    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActiveSlide);
    });

    // Arrow Button Handlers
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
      });
    }

    // Initialize initial state
    updateActiveSlide();
  });

  /* ==========================================
     2. FULLSCREEN LIGHTBOX & ZOOM ENGINE
     ========================================== */
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

  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomResetBtn = document.getElementById('zoomReset');

  let currentScale = 1;

  const setScale = (scale) => {
    currentScale = Math.min(Math.max(scale, 0.6), 3); // Clamped between 0.6x and 3.0x
    modalImg.style.transform = `scale(${currentScale})`;
  };

  zoomInBtn.addEventListener('click', () => setScale(currentScale + 0.3));
  zoomOutBtn.addEventListener('click', () => setScale(currentScale - 0.3));
  zoomResetBtn.addEventListener('click', () => setScale(1));

  // Double click photo to toggle zoom
  modalImg.addEventListener('dblclick', () => {
    setScale(currentScale === 1 ? 2 : 1);
  });

  // Attach Lightbox event listener to images across site
  document.addEventListener('click', (e) => {
    if (e.target.matches('.insta-slide img, .gallery-thumb, .article-hero-img')) {
      modalImg.src = e.target.src;
      modalCaption.textContent = e.target.alt || e.target.closest('.insta-slide')?.getAttribute('data-caption') || '';
      setScale(1);
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-viewport')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================
     3. MOBILE NAVIGATION TOGGLE
     ========================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
});
