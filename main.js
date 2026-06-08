// ========================================
//   STACKLY FASHION STORE - Main JavaScript
// ========================================

(function () {
  'use strict';

  // ---- Custom Cursor ----
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll('a, button, .product-card, .category-card, .lookbook-item');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        follower.style.width = '50px';
        follower.style.height = '50px';
        follower.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.opacity = '0.6';
      });
    });
  }

  // ---- Page Loader ----
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 2000);
    });
  }

  // ---- Scroll Progress Bar ----
  const scrollBar = document.querySelector('.scroll-progress');
  if (scrollBar) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / docHeight) * 100;
      scrollBar.style.width = progress + '%';
    }, { passive: true });
  }

  // ---- Sticky Header ----
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ---- Hamburger & Mobile Nav ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const navOverlay = document.querySelector('.nav-overlay');

  function closeMobileNav() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileNav) mobileNav.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav && mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        hamburger.classList.add('active');
        if (mobileNav) mobileNav.classList.add('open');
        if (navOverlay) navOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  // Close mobile nav on mobile link click
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  // ---- Hero Slider ----
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let sliderInterval = null;

  function goToSlide(index) {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startSlider() {
    sliderInterval = setInterval(nextSlide, 5500);
  }

  function resetSlider() {
    clearInterval(sliderInterval);
    startSlider();
  }

  if (slides.length > 0) {
    slides[0].classList.add('active');
    if (dots[0]) dots[0].classList.add('active');
    startSlider();

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetSlider();
      });
    });

    const prevArrow = document.querySelector('.hero-arrow.prev');
    const nextArrow = document.querySelector('.hero-arrow.next');
    if (prevArrow) prevArrow.addEventListener('click', function () { prevSlide(); resetSlider(); });
    if (nextArrow) nextArrow.addEventListener('click', function () { nextSlide(); resetSlider(); });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prevSlide(); resetSlider(); }
      if (e.key === 'ArrowRight') { nextSlide(); resetSlider(); }
    });

    // Touch swipe
    let touchStartX = 0;
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      heroSection.addEventListener('touchend', function (e) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) { nextSlide(); } else { prevSlide(); }
          resetSlider();
        }
      }, { passive: true });
    }
  }

  // ---- Intersection Observer (Scroll Reveal) ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  // ---- Counter Animation ----
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(function () {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) { counterObserver.observe(el); });

  // ---- Testimonials Slider ----
  const testTrack = document.querySelector('.testimonials-track');
  const testCards = document.querySelectorAll('.testimonial-card');
  const testPrev = document.querySelector('.test-nav-btn.prev');
  const testNext = document.querySelector('.test-nav-btn.next');
  let testCurrent = 0;

  function getTestPerView() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
  }

  function moveTestSlider(dir) {
    if (!testTrack || testCards.length === 0) return;
    const perView = getTestPerView();
    const maxIdx = Math.ceil(testCards.length / perView) - 1;
    testCurrent = Math.max(0, Math.min(testCurrent + dir, maxIdx));
    const cardWidth = testCards[0].offsetWidth + 24;
    testTrack.style.transform = 'translateX(-' + (testCurrent * perView * cardWidth) + 'px)';
  }

  if (testPrev) testPrev.addEventListener('click', function () { moveTestSlider(-1); });
  if (testNext) testNext.addEventListener('click', function () { moveTestSlider(1); });

  // ---- Wishlist Toggle ----
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-wishlist');
    if (btn) {
      const icon = btn.querySelector('svg, i, span');
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      if (icon) {
        icon.style.color = isActive ? '#C9614A' : '';
      }
      showToast(isActive ? '❤️ Added to wishlist!' : '💔 Removed from wishlist');
    }
  });

  // ---- Add to Cart ----
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-add-cart');
    if (btn) {
      const card = btn.closest('.product-card');
      const name = card ? (card.querySelector('.product-name') || {}).textContent : 'Item';

      // Animate cart count
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        const current = parseInt(cartCount.textContent, 10) || 0;
        cartCount.textContent = current + 1;
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(function () { cartCount.style.transform = 'scale(1)'; }, 300);
      }

      showToast('🛍️ ' + (name || 'Item') + ' added to cart!');

      // Button animation
      btn.textContent = 'Added!';
      btn.style.background = '#5A7050';
      setTimeout(function () {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
      }, 2000);
    }
  });

  // ---- Toast Notification ----
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast-icon">✓</span><span>' + message + '</span>';
    container.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3500);
  }

  // ---- Back to Top ----
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Newsletter Form ----
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(function (form) {
    const input = form.querySelector('.newsletter-input');
    const btn = form.querySelector('.btn-subscribe');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (input && input.value && input.value.includes('@')) {
          showToast('🎉 You are subscribed! Welcome to Stackly.');
          input.value = '';
          btn.textContent = 'Subscribed!';
          btn.style.background = 'var(--deep-sage)';
          btn.style.color = '#fff';
          setTimeout(function () {
            btn.textContent = 'Subscribe';
            btn.style.background = '';
            btn.style.color = '';
          }, 3000);
        } else {
          showToast('⚠️ Please enter a valid email address.');
        }
      });
    }
  });

  // ---- Product Size Selector ----
  document.addEventListener('click', function (e) {
    const sizeBtn = e.target.closest('.size-btn, .size-option');
    if (!sizeBtn) return;
    const group = sizeBtn.closest('.size-grid, .size-selector');
    if (group) {
      group.querySelectorAll('.size-btn, .size-option').forEach(function (b) {
        b.classList.remove('active', 'selected');
      });
      sizeBtn.classList.add('active', 'selected');
    }
  });

  // ---- Color Swatch Selector ----
  document.addEventListener('click', function (e) {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    const group = swatch.closest('.product-colors');
    if (group) {
      group.querySelectorAll('.color-swatch').forEach(function (s) {
        s.classList.remove('active');
      });
      swatch.classList.add('active');
    }
  });

  // ---- Quantity Selector ----
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const input = btn.closest('.qty-selector').querySelector('.qty-input');
    if (!input) return;
    let val = parseInt(input.value, 10) || 1;
    if (btn.classList.contains('minus')) { val = Math.max(1, val - 1); }
    if (btn.classList.contains('plus')) { val = val + 1; }
    input.value = val;
  });

  // ---- Gallery Thumbnails ----
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const galleryMain = document.querySelector('.gallery-main img');

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      if (galleryMain && thumb.querySelector('img')) {
        galleryMain.src = thumb.querySelector('img').src;
      }
    });
  });

  // ---- Filter Sidebar Toggle (Mobile) ----
  const filterToggleBtn = document.querySelector('.filter-toggle-btn');
  const filterSidebar = document.querySelector('.filter-sidebar');

  if (filterToggleBtn && filterSidebar) {
    filterToggleBtn.addEventListener('click', function () {
      filterSidebar.classList.toggle('show');
      const isOpen = filterSidebar.classList.contains('show');
      filterToggleBtn.textContent = isOpen ? '✕ Close Filters' : '⚙ Filters';
    });
  }

  // ---- Contact Form Submit ----
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('✅ Message sent! We\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  // ---- Parallax on Scroll ----
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', function () {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach(function (el) {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrolled) * speed;
        el.style.transform = 'translateY(' + offset * 0.2 + 'px)';
      });
    }, { passive: true });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Active Nav Link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });

  // ---- Floating Decorative Dots ----
  const floatingContainers = document.querySelectorAll('.floating-dots');
  floatingContainers.forEach(function (container) {
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('div');
      dot.className = 'floating-dot';
      const size = Math.random() * 8 + 4;
      dot.style.cssText = [
        'width:' + size + 'px',
        'height:' + size + 'px',
        'top:' + Math.random() * 100 + '%',
        'left:' + Math.random() * 100 + '%',
        'background:' + (Math.random() > 0.5 ? 'rgba(201,97,74,0.15)' : 'rgba(212,149,106,0.2)'),
        'animation-delay:' + (Math.random() * 4) + 's',
        'animation-duration:' + (Math.random() * 4 + 5) + 's'
      ].join(';');
      container.appendChild(dot);
    }
  });

  // ---- Image lazy loading fallback ----
  const images = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    images.forEach(function (img) { imgObserver.observe(img); });
  } else {
    images.forEach(function (img) {
      img.src = img.getAttribute('data-src');
    });
  }

  console.log('%cSTACKLY Fashion Store', 'color:#C9614A;font-size:18px;font-weight:bold;font-family:serif;');
  console.log('%cBuilt with ❤️ and great style', 'color:#888;font-size:13px;');

})();