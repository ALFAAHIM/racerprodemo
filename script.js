/* =============================================
   D GUN AUTOMOTIVE – JavaScript
   Smooth scroll, animations, lightbox, reviews
   ============================================= */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== SMOOTH SCROLL TO SECTIONS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 64; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const animateElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay') || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animateElements.forEach(el => observer.observe(el));

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox     = document.getElementById('lightbox');
const lbImg        = document.getElementById('lightbox-img');
const lbCaption    = document.getElementById('lightbox-caption');
const lbClose      = document.getElementById('lightbox-close');
const lbPrev       = document.getElementById('lightbox-prev');
const lbNext       = document.getElementById('lightbox-next');

let currentIndex = 0;
const galleryData = [];

galleryItems.forEach((item, i) => {
  const img     = item.querySelector('img');
  const caption = item.querySelector('.gallery-caption');
  galleryData.push({
    src: img.src,
    alt: img.alt,
    caption: caption ? caption.textContent : ''
  });
  item.addEventListener('click', () => openLightbox(i));
});

function openLightbox(index) {
  currentIndex = index;
  showLightboxImage(index);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLightboxImage(index) {
  const data = galleryData[index];
  lbImg.src = data.src;
  lbImg.alt = data.alt;
  lbCaption.textContent = data.caption;
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

lbPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
  showLightboxImage(currentIndex);
});

lbNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryData.length;
  showLightboxImage(currentIndex);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   { currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length; showLightboxImage(currentIndex); }
  if (e.key === 'ArrowRight')  { currentIndex = (currentIndex + 1) % galleryData.length; showLightboxImage(currentIndex); }
});

// ===== REVIEWS SLIDER =====
const reviewCards = document.querySelectorAll('.review-card');
const dots        = document.querySelectorAll('.dot');
let currentSlide  = 0;
let autoSlide;

function goToSlide(index) {
  reviewCards[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  reviewCards[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(autoSlide);
    goToSlide(i);
    startAutoSlide();
  });
});

function startAutoSlide() {
  autoSlide = setInterval(() => {
    const next = (currentSlide + 1) % reviewCards.length;
    goToSlide(next);
  }, 5000);
}
startAutoSlide();

// Touch swipe for review slider
let touchStartX = 0;
const slider = document.getElementById('reviews-slider');

slider.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

slider.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    clearInterval(autoSlide);
    if (diff > 0) {
      goToSlide((currentSlide + 1) % reviewCards.length);
    } else {
      goToSlide((currentSlide - 1 + reviewCards.length) % reviewCards.length);
    }
    startAutoSlide();
  }
}, { passive: true });

// ===== SCROLL INDICATOR HIDE =====
const scrollIndicator = document.getElementById('scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
    }
  }, { passive: true });
}

// ===== NAVBAR LOGO CLICK – scroll to top =====
document.querySelector('.nav-logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== COUNTER ANIMATION FOR HERO STATS =====
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Observe hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounter(document.querySelector('.stat:nth-child(1) .stat-num'), 500, '+');
      statObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statObserver.observe(heroStats);
}

// ===== SERVICE CARD PARALLAX (desktop only) =====
if (window.matchMedia('(min-width: 900px)').matches) {
  document.querySelectorAll('.service-img-wrap').forEach(wrap => {
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = wrap.querySelector('img');
      img.style.transform = `scale(1.06) translate(${x * 8}px, ${y * 6}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      const img = wrap.querySelector('img');
      img.style.transform = '';
    });
  });
}

// ===== WHY CARD HOVER GLOW =====
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  });
});

console.log('%c D Gun Automotive 🚗✨ ', 'background:#d4a940;color:#000;font-weight:bold;font-size:1.2rem;padding:4px 12px;border-radius:4px;');
console.log('%c Premium Car Wash & Detailing — Mudickal, Ernakulam ', 'color:#d4a940;font-size:0.9rem;');
