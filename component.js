// ========================================
//  STACKLY - Shared Header & Footer
// ========================================

(function () {
  const LOGO_URL = 'https://wsrv.nl/?url=https://snabsolutions.in/wp-content/uploads/2026/02/stackly-snab-solutions.png&w=260&h=104&output=webp&q=80&fit=inside';

  const headerHTML = `
    <div class="cursor"></div>
    <div class="cursor-follower"></div>
    <div class="scroll-progress"></div>

    <!-- Page Loader -->
    <div class="page-loader">
      <div class="loader-logo">
        <img src="${LOGO_URL}" alt="Stackly" width="180" height="72">
      </div>
      <div class="loader-bar">
        <div class="loader-bar-fill"></div>
      </div>
    </div>

    <!-- Mobile Nav Overlay -->
    <div class="nav-overlay"></div>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav" aria-label="Mobile navigation">
      <ul class="mobile-nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="shop.html">Shop</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="lookbook.html">Lookbook</a></li>
      </ul>
      <div class="mobile-nav-footer">
        <a href="signin.html" class="btn-nav-cta">Sign in</a>
        <div class="mobile-social-links">
          <a href="404.html" aria-label="Instagram">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <a href="404.html" aria-label="Pinterest">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
          </a>
          <a href="404.html" aria-label="Facebook">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Header -->
    <header>
      <div class="nav-wrapper">
        <a href="index.html" class="logo" aria-label="Stackly Home">
          <img src="${LOGO_URL}" alt="Stackly Fashion" width="130" height="52">
        </a>

        <nav class="nav-links" aria-label="Main navigation">
          <a href="index.html">Home</a>
          <a href="shop.html">Shop</a>
          <a href="lookbook.html">Lookbook</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </nav>

        <div class="nav-actions">
          <button class="nav-icon-btn" aria-label="Search" title="Search">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <button class="nav-icon-btn" aria-label="Wishlist" title="Wishlist">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button class="nav-icon-btn" aria-label="Cart" title="Cart" style="position:relative">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="cart-count">3</span>
          </button>
          <a href="signin.html" class="btn-nav-cta">Sign in</a>
          <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `;

  const footerHTML = `
    <!-- Newsletter -->
    <section class="newsletter py-section">
      <div class="container">
        <div class="newsletter-inner">
          <span class="newsletter-label">Stay in Style</span>
          <h2 class="newsletter-title">Join the <em style="font-style:italic">Stackly</em> Circle</h2>
          <p class="newsletter-desc">Be the first to know about new arrivals, exclusive deals, and style inspiration delivered straight to your inbox.</p>
          <div class="newsletter-form">
            <input type="email" class="newsletter-input" placeholder="Your email address" aria-label="Email for newsletter">
            <button class="btn-subscribe">Subscribe</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="footer-top">
        <div class="footer-brand">
          <a href="index.html" class="logo">
            <img src="${LOGO_URL}" alt="Stackly Fashion" width="120" height="48">
          </a>
          <p class="footer-tagline">Curating timeless fashion for the modern soul. Style is a way to say who you are without speaking.</p>
          <div class="footer-social">
            <a href="404.html" class="social-link" aria-label="Instagram">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href="404.html" class="social-link" aria-label="Pinterest">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
            </a>
            <a href="404.html" class="social-link" aria-label="Facebook">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="404.html" class="social-link" aria-label="Twitter/X">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="footer-col-title">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">Shop All</a></li>
            <li><a href="lookbook.html">Lookbook</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Categories</h4>
          <ul class="footer-links">
            <li><a href="shop.html">Women's Fashion</a></li>
            <li><a href="shop.html">Men's Essentials</a></li>
            <li><a href="shop.html">Accessories</a></li>
            <li><a href="shop.html">Footwear</a></li>
            <li><a href="shop.html">Seasonal Sale</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Get in Touch</h4>
          <div class="footer-contact-item">
            <span class="footer-contact-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <span>123 Fashion Ave, Style District, Mumbai 400001</span>
          </div>
          <div class="footer-contact-item">
            <span class="footer-contact-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91A16 16 0 0 0 15.09 16l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.31z"/></svg>
            </span>
            <span>+91 98765 43210</span>
          </div>
          <div class="footer-contact-item">
            <span class="footer-contact-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <span>hello@stackly.in</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copy">© 2026 Stackly Fashion. All rights reserved. Made with ❤️ in India.</p>
        <div class="footer-bottom-links">
          <a href="404.html">Privacy Policy</a>
          <a href="404.html">Terms of Service</a>
          <a href="404.html">Return Policy</a>
          <a href="404.html">Sitemap</a>
        </div>
        <div class="payment-icons">
          <span class="payment-icon">VISA</span>
          <span class="payment-icon">MC</span>
          <span class="payment-icon">UPI</span>
          <span class="payment-icon">COD</span>
        </div>
      </div>
    </footer>

    <!-- Back to Top -->
    <button class="back-to-top" aria-label="Back to top">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
    </button>

    <!-- Toast Container -->
    <div class="toast-container"></div>
  `;

  // Inject header before body content
  const headerMount = document.getElementById('header-mount');
  if (headerMount) headerMount.innerHTML = headerHTML;

  // Inject footer
  const footerMount = document.getElementById('footer-mount');
  if (footerMount) footerMount.innerHTML = footerHTML;
})();