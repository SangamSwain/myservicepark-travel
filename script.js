/* ==========================================================================
   MYSERVICEPARK TRAVEL - INTERACTION & INFINITE CAROUSEL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. INFINITE INSTAGRAM-STYLE CAROUSEL ENGINE
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

    // Generate dynamic dots
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

    const getActiveIndex = () => {
      const scrollPosition = track.scrollLeft;
      const slideWidth = track.clientWidth;
      return Math.round(scrollPosition / slideWidth);
    };

    const updateActiveSlide = () => {
      const activeIndex = getActiveIndex();
      const currentSlide = slides[activeIndex];

      if (!currentSlide) return;

      // Update counter badge
      if (badge) {
        badge.textContent = `${activeIndex + 1} / ${slides.length}`;
      }

      // Sync active dot
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });

      // Sync active caption & location
      const title = currentSlide.getAttribute('data-location') || 'Featured View';
      const caption = currentSlide.getAttribute('data-caption') || currentSlide.querySelector('img')?.alt || '';

      if (captionTag) captionTag.innerHTML = `📍 ${title}`;
      if (captionText) captionText.textContent = caption;
    };

    // Scroll listener for manual touch swipes
    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActiveSlide);
    });

    // INFINITE LOOP NEXT ACTION
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const activeIndex = getActiveIndex();
        if (activeIndex >= slides.length - 1) {
          // Wrap around to start instantly
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
        }
      });
    }

    // INFINITE LOOP PREVIOUS ACTION
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const activeIndex = getActiveIndex();
        if (activeIndex <= 0) {
          // Wrap around to the last slide smoothly
          track.scrollTo({ left: slides[slides.length - 1].offsetLeft, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
        }
      });
    }

    // Initialize state
    updateActiveSlide();
  });

  /* ==========================================
     2. FULLSCREEN LIGHTBOX & TAP-TO-ZOOM
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
    currentScale = Math.min(Math.max(scale, 0.6), 3);
    modalImg.style.transform = `scale(${currentScale})`;
  };

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => setScale(currentScale + 0.3));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setScale(currentScale - 0.3));
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => setScale(1));

  // Double tap / click to zoom
  modalImg.addEventListener('click', () => {
    setScale(currentScale === 1 ? 1.8 : 1);
  });

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

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
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
     3. RESPONSIVE MOBILE MENU
     ========================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
});
