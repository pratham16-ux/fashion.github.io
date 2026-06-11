// ========================================
//   STACKLY FASHION STORE - Main JavaScript
// ========================================

(function () {
  'use strict';

  // ================================================================
  //  SAFE GUARD — prevent double-init
  // ================================================================
  if (window.__stacklyMainLoaded) return;
  window.__stacklyMainLoaded = true;

  // ================================================================
  //  PERSISTENT WISHLIST (localStorage)
  // ================================================================
  var WISH_KEY = 'stackly_wishlist';

  function loadWL() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveWL(obj) {
    try { localStorage.setItem(WISH_KEY, JSON.stringify(obj)); } catch (e) {}
  }
  function isWished(id) { return !!loadWL()[id]; }
  function wishAdd(id, data) { var o = loadWL(); o[id] = data; saveWL(o); }
  function wishRemove(id) { var o = loadWL(); delete o[id]; saveWL(o); }

  // ================================================================
  //  TOAST
  // ================================================================
  function showToast(msg) {
    var wrap = document.querySelector('.toast-container');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-container'; document.body.appendChild(wrap); }
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span class="toast-icon">\u2713</span><span>' + msg + '</span>';
    wrap.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 400); }, 3500);
  }
  window.showToast = showToast;

  // ================================================================
  //  CART BADGE HELPER (legacy alias — real impl added below)
  // ================================================================
  function bumpCart() {
    // Will call updateCartBadge once it's defined; kept for wishlist drawer compat
    var b = document.querySelector('.cart-count');
    if (!b) return;
    b.style.transform = 'scale(1.5)';
    setTimeout(function () { b.style.transform = ''; }, 300);
  }

  // ================================================================
  //  WISHLIST BADGE UPDATE
  // ================================================================
  function updateWLBadge() {
    var n = Object.keys(loadWL()).length;
    // Header badge (component.js injects #headerWishBadge)
    var hb = document.getElementById('headerWishBadge');
    if (hb) { hb.textContent = n; hb.style.display = n > 0 ? 'flex' : 'none'; }
    // Shop page badge
    var sb = document.getElementById('wishBadge');
    if (sb) sb.textContent = n;
  }

  // ================================================================
  //  GET STABLE CARD ID
  // ================================================================
  function cardId(card) {
    if (card.dataset.id) return 'pid_' + card.dataset.id;
    if (!card.dataset.wid) {
      var n = card.querySelector('.product-name');
      var b = card.querySelector('.product-brand');
      card.dataset.wid = ((b ? b.textContent : '') + '_' + (n ? n.textContent : ''))
        .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 40) || ('w' + Date.now());
    }
    return card.dataset.wid;
  }

  function cardData(card) {
    return {
      name:  (card.querySelector('.product-name') || {}).textContent || '',
      brand: (card.querySelector('.product-brand') || {}).textContent || '',
      price: (card.querySelector('.price-current') || {}).textContent || '',
      img:   ((card.querySelector('.product-img') || {}).src) || ''
    };
  }

  // ================================================================
  //  SET HEART STATE ON A CARD
  // ================================================================
  function setHeart(card, on) {
    var pill = card.querySelector('.wishlist-pill');
    // also sync .btn-wishlist on shop page cards
    var wb = card.querySelector('.btn-wishlist');
    [pill, wb].forEach(function (el) {
      if (!el) return;
      el.classList.toggle('active', on);
      var svg = el.querySelector('svg');
      if (svg) { svg.style.fill = on ? '#C9614A' : 'none'; svg.style.stroke = on ? '#C9614A' : 'currentColor'; }
    });
  }

  // ================================================================
  //  INJECT WISHLIST PILLS (floating heart on each card)
  // ================================================================
  function injectPills() {
    document.querySelectorAll('.product-card').forEach(function (card) {
      if (card.querySelector('.wishlist-pill')) return; // already injected
      var wrap = card.querySelector('.product-img-wrap');
      if (!wrap) return;
      var pill = document.createElement('button');
      pill.className = 'wishlist-pill';
      pill.type = 'button';
      pill.setAttribute('aria-label', 'Add to wishlist');
      pill.innerHTML = '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      wrap.appendChild(pill);
      // Restore state from localStorage
      setHeart(card, isWished(cardId(card)));
    });
  }

  // Sync all existing cards' heart states from localStorage
  function syncHearts() {
    document.querySelectorAll('.product-card').forEach(function (card) {
      setHeart(card, isWished(cardId(card)));
    });
  }

  // ================================================================
  //  HEART CLICK — works for .wishlist-pill AND shop page .btn-wishlist
  // ================================================================
  document.addEventListener('click', function (e) {
    // wishlist-pill (injected by main.js)
    var pill = e.target.closest('.wishlist-pill');
    if (pill) {
      e.stopPropagation();
      var card = pill.closest('.product-card');
      if (!card) return;
      var id = cardId(card);
      if (isWished(id)) {
        wishRemove(id);
        setHeart(card, false);
        showToast('\u{1F494} Removed from wishlist');
      } else {
        var d = cardData(card); d.id = id;
        wishAdd(id, d);
        setHeart(card, true);
        showToast('\u2764\uFE0F Added to wishlist!');
      }
      updateWLBadge();
      return;
    }

    // .btn-wishlist inside a product card (shop page inline button)
    // Only intercept if shop.html's own toggleWish is NOT defined
    var wb = e.target.closest('.product-card .btn-wishlist');
    if (wb && typeof toggleWish !== 'function') {
      e.stopPropagation();
      var card2 = wb.closest('.product-card');
      if (!card2) return;
      var id2 = cardId(card2);
      if (isWished(id2)) {
        wishRemove(id2);
        setHeart(card2, false);
        showToast('\u{1F494} Removed from wishlist');
      } else {
        var d2 = cardData(card2); d2.id = id2;
        wishAdd(id2, d2);
        setHeart(card2, true);
        showToast('\u2764\uFE0F Added to wishlist!');
      }
      updateWLBadge();
    }
  });

  // ================================================================
  //  WISHLIST DRAWER STYLES (injected once)
  // ================================================================
  function injectDrawerStyles() {
    if (document.getElementById('wd-styles')) return;
    var s = document.createElement('style');
    s.id = 'wd-styles';
    s.textContent = [
      '.wishlist-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1500;opacity:0;visibility:hidden;transition:opacity .4s,visibility .4s;backdrop-filter:blur(4px)}',
      '.wishlist-overlay.show{opacity:1;visibility:visible}',
      '.wishlist-drawer{position:fixed;top:0;right:-100%;width:min(460px,95vw);height:100vh;background:#FFFDF9;z-index:1600;display:flex;flex-direction:column;transition:right .45s cubic-bezier(.25,.46,.45,.94);box-shadow:-8px 0 60px rgba(0,0,0,.15)}',
      '.wishlist-drawer.open{right:0}',
      '.wd-head{display:flex;align-items:center;justify-content:space-between;padding:22px 28px;border-bottom:1px solid #E8E4DF}',
      '.wd-head h2{font-family:"Cormorant Garamond",serif;font-size:26px;font-weight:500;color:#1A1A1A;display:flex;align-items:center;gap:10px}',
      '.wd-badge{background:#C9614A;color:#fff;font-size:11px;font-weight:700;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center}',
      '.wd-x{width:36px;height:36px;border-radius:50%;border:none;background:#E8E4DF;color:#2C2C2C;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s}',
      '.wd-x:hover{background:#C9614A;color:#fff}',
      '.wd-body{flex:1;overflow-y:auto;padding:16px 28px}',
      '.wd-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;gap:14px;padding:60px 0}',
      '.wd-empty-icon{font-size:56px;opacity:.25}',
      '.wd-empty h3{font-family:"Cormorant Garamond",serif;font-size:22px;font-weight:400;color:#888}',
      '.wd-empty p{font-size:13px;color:#888}',
      '.wd-item{display:flex;gap:14px;padding:15px 0;border-bottom:1px solid #E8E4DF}',
      '.wd-img{width:78px;height:96px;border-radius:10px;object-fit:cover;background:#E8E4DF;flex-shrink:0}',
      '.wd-info{flex:1;min-width:0}',
      '.wd-brand{font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#C9614A;margin-bottom:3px}',
      '.wd-name{font-family:"Cormorant Garamond",serif;font-size:15px;font-weight:500;color:#1A1A1A;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.wd-price{font-size:15px;font-weight:700;color:#1A1A1A;margin-bottom:10px}',
      '.wd-acts{display:flex;align-items:center;gap:8px}',
      '.wd-atc{flex:1;padding:8px 12px;border-radius:8px;border:none;background:#C9614A;color:#fff;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:background .25s}',
      '.wd-atc:hover{background:#A8432A}',
      '.wd-del{background:none;border:none;color:#888;font-size:16px;padding:4px;cursor:pointer;transition:color .2s;line-height:1}',
      '.wd-del:hover{color:#e53935}',
      '.wd-foot{padding:18px 28px;border-top:1px solid #E8E4DF}',
      '.wd-foot .btn-primary{width:100%;display:flex;align-items:center;justify-content:center;gap:8px}'
    ].join('');
    document.head.appendChild(s);
  }

  // ================================================================
  //  BUILD / RENDER WISHLIST DRAWER
  // ================================================================
  function buildDrawer() {
    if (document.querySelector('.wishlist-drawer')) return;
    injectDrawerStyles();

    var ov = document.createElement('div');
    ov.className = 'wishlist-overlay';
    // Close on overlay click handled by document-level delegation below

    var dr = document.createElement('div');
    dr.className = 'wishlist-drawer';
    // NOTE: no aria-label="Wishlist" here — that was causing every click inside
    // the drawer (including .wd-x and Continue Shopping) to also trigger openDrawer()
    dr.innerHTML =
      '<div class="wd-head">' +
        '<h2>My Wishlist <span class="wd-badge">0</span></h2>' +
        '<button class="wd-x" aria-label="Close wishlist">' +
          '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="wd-body"></div>' +
      '<div class="wd-foot" style="display:none">' +
        '<button class="wd-continue btn-primary" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;border:none">Continue Shopping ' +
          '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
        '</button>' +
      '</div>';

    dr.querySelector('.wd-continue').addEventListener('click', function () {
      closeDrawer();
      window.location.href = 'shop.html';
    });
    document.body.appendChild(ov);
    document.body.appendChild(dr);
  }

  function renderDrawer() {
    var dr = document.querySelector('.wishlist-drawer');
    if (!dr) return;
    var items  = Object.values(loadWL());
    var badge  = dr.querySelector('.wd-badge');
    var body   = dr.querySelector('.wd-body');
    var foot   = dr.querySelector('.wd-foot');

    if (badge) badge.textContent = items.length;
    if (foot)  foot.style.display = items.length ? 'block' : 'none';

    if (!items.length) {
      body.innerHTML =
        '<div class="wd-empty">' +
          '<div class="wd-empty-icon">\uD83E\uDD0D</div>' +
          '<h3>Your wishlist is empty</h3>' +
          '<p>Tap \u2661 on any product to save it here.</p>' +
        '</div>';
      return;
    }

    body.innerHTML = items.map(function (it) {
      return '<div class="wd-item" data-id="' + it.id + '">' +
        '<img class="wd-img" src="' + it.img + '" alt="' + it.name + '" loading="lazy">' +
        '<div class="wd-info">' +
          '<p class="wd-brand">' + it.brand + '</p>' +
          '<p class="wd-name">' + it.name + '</p>' +
          '<p class="wd-price">' + it.price + '</p>' +
          '<div class="wd-acts">' +
            '<button class="wd-atc" data-id="' + it.id + '">Add to Cart</button>' +
            '<button class="wd-del" data-id="' + it.id + '" aria-label="Remove">\u2715</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    body.querySelectorAll('.wd-del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        wishRemove(id);
        // un-fill heart on visible card
        var card = document.querySelector('[data-wid="' + id + '"], [data-id="' + id.replace('pid_', '') + '"]');
        if (card) setHeart(card, false);
        updateWLBadge();
        renderDrawer();
        showToast('\uD83D\uDC94 Removed from wishlist');
      });
    });

    body.querySelectorAll('.wd-atc').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = loadWL()[btn.dataset.id];
        if (!item) return;
        cartAdd({ id: btn.dataset.id, name: item.name, brand: item.brand || '', price: parsePrice(item.price), priceStr: item.price, img: item.img || '' });
        updateCartBadge();
        showToast('\uD83D\uDECD\uFE0F ' + item.name + ' added to cart!');
        btn.textContent = 'Added \u2713';
        btn.style.background = '#5A7050';
        setTimeout(function () { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 2000);
      });
    });
  }

  function openDrawer() {
    buildDrawer();
    renderDrawer();
    document.querySelector('.wishlist-drawer').classList.add('open');
    document.querySelector('.wishlist-overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    var dr = document.querySelector('.wishlist-drawer');
    var ov = document.querySelector('.wishlist-overlay');
    if (dr) dr.classList.remove('open');
    if (ov) ov.classList.remove('show');
    document.body.style.overflow = '';
  }

  // ================================================================
  //  CLOSE BUTTON — event delegation so it works regardless of
  //  when the drawer HTML is inserted into the DOM
  // ================================================================
  document.addEventListener('click', function (e) {
    // Wishlist close button or overlay click
    if (e.target.closest('.wd-x') || (e.target.classList.contains('wishlist-overlay') && e.target.classList.contains('show'))) {
      e.stopPropagation();
      closeDrawer();
      return;
    }
    // Cart drawer close button or overlay click
    if (e.target.closest('.cd-x') || (e.target.classList.contains('cart-overlay') && e.target.classList.contains('show'))) {
      e.stopPropagation();
      closeCartDrawer();
      return;
    }
  });

  // ================================================================
  //  NAV WISHLIST BUTTON → open drawer
  //  Handles both component.js header button (#headerWishBtn / aria-label="Wishlist")
  // ================================================================
  document.addEventListener('click', function (e) {
    var navBtn = e.target.closest('#headerWishBtn, [aria-label="Wishlist"]');
    if (!navBtn) return;
    // Ignore clicks that originate INSIDE a drawer, product card, or on heart pills
    if (navBtn.closest('.wishlist-drawer') || navBtn.closest('.cart-drawer') ||
        navBtn.closest('.product-card') ||
        navBtn.classList.contains('wishlist-pill') ||
        navBtn.classList.contains('btn-wishlist')) return;
    if (typeof openWish === 'function') return; // shop page override
    e.preventDefault();
    e.stopPropagation();
    openDrawer();
  });

  // ================================================================
  //  NAV CART BUTTON → open global cart drawer on all pages
  // ================================================================
  document.addEventListener('click', function (e) {
    var cartBtn = e.target.closest('[aria-label="Cart"]');
    if (!cartBtn || cartBtn.closest('.product-card')) return;
    e.preventDefault();
    // On shop.html let it open the shop's own drawer if present
    if (document.getElementById('cartDrawer')) {
      var sd = document.getElementById('cartDrawer'), so = document.getElementById('cartOverlay');
      if (sd) sd.classList.add('open');
      if (so) so.classList.add('open');
      document.body.style.overflow = 'hidden';
      return;
    }
    openCartDrawer();
  });

  // ================================================================
  //  PERSISTENT CART (localStorage)
  // ================================================================
  var CART_KEY = 'stackly_cart';
  function loadCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } }
  function saveCart(arr) { try { localStorage.setItem(CART_KEY, JSON.stringify(arr)); } catch (e) {} }
  function cartCount() { return loadCart().reduce(function (s, i) { return s + i.qty; }, 0); }
  function cartTotal() { return loadCart().reduce(function (s, i) { return s + i.price * i.qty; }, 0); }
  function parsePrice(str) { return parseFloat((str || '').replace(/[^0-9.]/g, '')) || 0; }

  function cartAdd(item) {
    var arr = loadCart();
    var ex = arr.find(function (x) { return x.id === item.id; });
    if (ex) { ex.qty++; } else { arr.push({ id: item.id, name: item.name, brand: item.brand || '', price: item.price, priceStr: item.priceStr || ('₹' + item.price), img: item.img || '', qty: 1 }); }
    saveCart(arr);
  }
  function cartRemove(id) { saveCart(loadCart().filter(function (x) { return x.id !== id; })); }
  function cartChangeQty(id, delta) {
    var arr = loadCart();
    var it = arr.find(function (x) { return x.id === id; });
    if (it) { it.qty = Math.max(1, it.qty + delta); saveCart(arr); }
  }

  function updateCartBadge() {
    var n = cartCount();
    document.querySelectorAll('.cart-count').forEach(function (b) { b.textContent = n; b.style.display = 'flex'; });
  }

  // ================================================================
  //  CART DRAWER STYLES
  // ================================================================
  function injectCartStyles() {
    if (document.getElementById('cd-styles')) return;
    var s = document.createElement('style');
    s.id = 'cd-styles';
    s.textContent = [
      '.cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1500;opacity:0;visibility:hidden;transition:opacity .4s,visibility .4s;backdrop-filter:blur(4px)}',
      '.cart-overlay.show{opacity:1;visibility:visible}',
      '.cart-drawer{position:fixed;top:0;right:-100%;width:min(460px,95vw);height:100vh;background:#FFFDF9;z-index:1600;display:flex;flex-direction:column;transition:right .45s cubic-bezier(.25,.46,.45,.94);box-shadow:-8px 0 60px rgba(0,0,0,.15)}',
      '.cart-drawer.open{right:0}',
      '.cd-head{display:flex;align-items:center;justify-content:space-between;padding:22px 28px;border-bottom:1px solid #E8E4DF}',
      '.cd-head h2{font-family:"Cormorant Garamond",serif;font-size:26px;font-weight:500;color:#1A1A1A;display:flex;align-items:center;gap:10px}',
      '.cd-badge{background:#C9614A;color:#fff;font-size:11px;font-weight:700;min-width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;padding:0 4px}',
      '.cd-x{width:36px;height:36px;border-radius:50%;border:none;background:#E8E4DF;color:#2C2C2C;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;flex-shrink:0}',
      '.cd-x:hover{background:#C9614A;color:#fff}',
      '.cd-body{flex:1;overflow-y:auto;padding:16px 28px}',
      '.cd-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;gap:14px;padding:60px 0}',
      '.cd-empty-icon{font-size:56px;opacity:.25}',
      '.cd-empty h3{font-family:"Cormorant Garamond",serif;font-size:22px;font-weight:400;color:#888}',
      '.cd-empty p{font-size:13px;color:#888}',
      '.cd-item{display:flex;gap:14px;padding:15px 0;border-bottom:1px solid #E8E4DF}',
      '.cd-img{width:78px;height:96px;border-radius:10px;object-fit:cover;background:#E8E4DF;flex-shrink:0}',
      '.cd-info{flex:1;min-width:0}',
      '.cd-brand{font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#C9614A;margin-bottom:3px}',
      '.cd-name{font-family:"Cormorant Garamond",serif;font-size:15px;font-weight:500;color:#1A1A1A;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.cd-price{font-size:15px;font-weight:700;color:#1A1A1A;margin-bottom:10px}',
      '.cd-acts{display:flex;align-items:center;gap:8px}',
      '.cd-qty{display:flex;align-items:center;border:1.5px solid #E8E4DF;border-radius:8px;overflow:hidden}',
      '.cd-qty-btn{width:28px;height:28px;border:none;background:none;font-size:16px;cursor:pointer;transition:background .2s;color:#2C2C2C}',
      '.cd-qty-btn:hover{background:#E8E4DF}',
      '.cd-qty-val{width:30px;text-align:center;font-size:13px;font-weight:600;color:#2C2C2C}',
      '.cd-del{background:none;border:none;color:#888;font-size:16px;padding:4px;cursor:pointer;transition:color .2s;line-height:1}',
      '.cd-del:hover{color:#e53935}',
      '.cd-foot{padding:18px 28px;border-top:1px solid #E8E4DF;background:#FFFDF9}',
      '.cd-totals{margin-bottom:16px}',
      '.cd-line{display:flex;justify-content:space-between;font-size:13px;color:#2C2C2C;margin-bottom:7px}',
      '.cd-line.free{color:#8FA882;font-weight:600}',
      '.cd-grand{display:flex;justify-content:space-between;font-size:18px;font-weight:700;padding-top:12px;margin-top:6px;border-top:1px solid #E8E4DF;margin-bottom:16px}',
      '.cd-grand span:last-child{color:#C9614A}',
      '.cd-checkout{width:100%;padding:15px;background:#C9614A;color:#fff;border:none;border-radius:12px;font-family:"DM Sans",sans-serif;font-size:14px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:all .3s;margin-bottom:10px}',
      '.cd-checkout:hover{background:#A8432A;transform:translateY(-2px);box-shadow:0 10px 28px rgba(201,97,74,.35)}',
      '.cd-continue{width:100%;padding:12px;background:transparent;color:#2C2C2C;border:1.5px solid #E8E4DF;border-radius:12px;font-family:"DM Sans",sans-serif;font-size:12px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:all .3s}',
      '.cd-continue:hover{border-color:#C9614A;color:#C9614A}',
      '.cd-freeship{text-align:center;font-size:11px;color:#8FA882;font-weight:600;margin-top:10px}',
      '@media(max-width:480px){.cart-drawer{width:100%}}'
    ].join('');
    document.head.appendChild(s);
  }

  // ================================================================
  //  BUILD / RENDER CART DRAWER
  // ================================================================
  function buildCartDrawer() {
    if (document.querySelector('.cart-drawer')) return;
    injectCartStyles();

    var ov = document.createElement('div');
    ov.className = 'cart-overlay';

    var dr = document.createElement('div');
    dr.className = 'cart-drawer';
    dr.setAttribute('aria-label', 'Shopping cart');
    dr.innerHTML =
      '<div class="cd-head">' +
        '<h2>Your Bag <span class="cd-badge">0</span></h2>' +
        '<button class="cd-x" aria-label="Close cart">' +
          '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="cd-body"></div>' +
      '<div class="cd-foot" style="display:none">' +
        '<div class="cd-totals">' +
          '<div class="cd-line"><span>Subtotal</span><span class="cd-sub">₹0</span></div>' +
          '<div class="cd-line free"><span>Shipping</span><span>FREE</span></div>' +
          '<div class="cd-grand"><span>Total</span><span class="cd-total">₹0</span></div>' +
        '</div>' +
        '<button class="cd-checkout" onclick="window.location.href=\'404.html\'">Proceed to Checkout →</button>' +
        '<button class="cd-continue">Continue Shopping</button>' +
        '<p class="cd-freeship">✓ Free shipping on orders above ₹2,000</p>' +
      '</div>';

    dr.querySelector('.cd-continue').addEventListener('click', closeCartDrawer);
    document.body.appendChild(ov);
    document.body.appendChild(dr);
  }

  function renderCartDrawer() {
    var dr = document.querySelector('.cart-drawer');
    if (!dr) return;
    var items = loadCart();
    var cnt   = cartCount();
    var badge = dr.querySelector('.cd-badge');
    var body  = dr.querySelector('.cd-body');
    var foot  = dr.querySelector('.cd-foot');

    if (badge) badge.textContent = cnt;
    if (foot)  foot.style.display = items.length ? 'block' : 'none';
    updateCartBadge();

    if (!items.length) {
      body.innerHTML =
        '<div class="cd-empty">' +
          '<div class="cd-empty-icon">🛍️</div>' +
          '<h3>Your bag is empty</h3>' +
          '<p>Add some gorgeous styles to get started!</p>' +
        '</div>';
      return;
    }

    body.innerHTML = items.map(function (it) {
      return '<div class="cd-item">' +
        '<img class="cd-img" src="' + it.img + '" alt="' + it.name + '" loading="lazy">' +
        '<div class="cd-info">' +
          '<p class="cd-brand">' + it.brand + '</p>' +
          '<p class="cd-name">' + it.name + '</p>' +
          '<p class="cd-price">₹' + (it.price * it.qty).toLocaleString('en-IN') + '</p>' +
          '<div class="cd-acts">' +
            '<div class="cd-qty">' +
              '<button class="cd-qty-btn" data-id="' + it.id + '" data-d="-1">−</button>' +
              '<span class="cd-qty-val">' + it.qty + '</span>' +
              '<button class="cd-qty-btn" data-id="' + it.id + '" data-d="1">+</button>' +
            '</div>' +
            '<button class="cd-del" data-id="' + it.id + '" aria-label="Remove">✕</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    var sub = cartTotal();
    var subEl = dr.querySelector('.cd-sub'), totEl = dr.querySelector('.cd-total');
    if (subEl) subEl.textContent = '₹' + sub.toLocaleString('en-IN');
    if (totEl) totEl.textContent = '₹' + sub.toLocaleString('en-IN');

    body.querySelectorAll('.cd-del').forEach(function (btn) {
      btn.addEventListener('click', function () { cartRemove(btn.dataset.id); renderCartDrawer(); });
    });
    body.querySelectorAll('.cd-qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { cartChangeQty(btn.dataset.id, parseInt(btn.dataset.d, 10)); renderCartDrawer(); });
    });
  }

  function openCartDrawer() {
    buildCartDrawer();
    renderCartDrawer();
    document.querySelector('.cart-drawer').classList.add('open');
    document.querySelector('.cart-overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    var dr = document.querySelector('.cart-drawer');
    var ov = document.querySelector('.cart-overlay');
    if (dr) dr.classList.remove('open');
    if (ov) ov.classList.remove('show');
    document.body.style.overflow = '';
  }

  // ================================================================
  //  ADD TO CART — intercept .btn-add-cart clicks on non-shop pages
  //  and also mirror shop page cart actions into localStorage
  // ================================================================
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-add-cart');
    if (!btn || btn.closest('.wishlist-drawer') || btn.closest('.cart-drawer')) return;
    if (typeof addToCart === 'function') {
      // Shop page handles its own state; mirror to localStorage after short delay
      setTimeout(function () {
        var card = btn.closest('.product-card');
        if (!card) return;
        var id = cardId(card), d = cardData(card);
        cartAdd({ id: id, name: d.name, brand: d.brand, price: parsePrice(d.price), priceStr: d.price, img: d.img });
        updateCartBadge();
      }, 60);
      return;
    }
    var card = btn.closest('.product-card');
    var name = card ? ((card.querySelector('.product-name') || {}).textContent || 'Item') : 'Item';
    var id   = card ? cardId(card) : 'generic_' + Date.now();
    var d    = card ? cardData(card) : { name: name, brand: '', price: '₹0', img: '' };
    cartAdd({ id: id, name: d.name, brand: d.brand, price: parsePrice(d.price), priceStr: d.price, img: d.img });
    updateCartBadge();
    showToast('🛍️ ' + name + ' added to cart!');
    btn.textContent = 'Added!';
    btn.style.background = '#5A7050';
    setTimeout(function () { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 2000);
  });

  // ================================================================
  //  SHOP PAGE INTEGRATION
  //  After shop.js renders products, sync hearts from localStorage
  // ================================================================
  var _origRenderProducts = null;
  var _syncTimeout = null;
  function scheduleSyncHearts() {
    clearTimeout(_syncTimeout);
    _syncTimeout = setTimeout(function () {
      injectPills();
      syncHearts();
    }, 120);
  }

  // Watch for new product cards added by shop.js
  if (typeof MutationObserver !== 'undefined') {
    var _lastChildCount = 0;
    var mo = new MutationObserver(function (mutations) {
      var hasNewCards = false;
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && (n.classList.contains('product-card') || n.querySelector && n.querySelector('.product-card'))) {
            hasNewCards = true;
          }
        });
      });
      if (hasNewCards) scheduleSyncHearts();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // ================================================================
  //  CUSTOM CURSOR
  // ================================================================
  var cursor = document.querySelector('.cursor');
  var follower = document.querySelector('.cursor-follower');
  if (cursor && follower) {
    var mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    });
    (function af() {
      fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
      requestAnimationFrame(af);
    })();
    document.querySelectorAll('a, button, .product-card, .category-card, .lookbook-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.style.width = '20px'; cursor.style.height = '20px'; follower.style.width = '50px'; follower.style.height = '50px'; follower.style.opacity = '0.3'; });
      el.addEventListener('mouseleave', function () { cursor.style.width = '12px'; cursor.style.height = '12px'; follower.style.width = '36px'; follower.style.height = '36px'; follower.style.opacity = '0.6'; });
    });
  }

  // ================================================================
  //  PAGE LOADER
  // ================================================================
  var loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('hidden'); }, 2000);
    });
  }

  // ================================================================
  //  SCROLL PROGRESS
  // ================================================================
  var sp = document.querySelector('.scroll-progress');
  if (sp) {
    window.addEventListener('scroll', function () {
      var st = window.pageYOffset;
      var dh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      sp.style.width = (dh ? (st / dh * 100) : 0) + '%';
    }, { passive: true });
  }

  // ================================================================
  //  STICKY HEADER
  // ================================================================
  var hdr = document.querySelector('header');
  if (hdr) {
    window.addEventListener('scroll', function () { hdr.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });
  }

  // ================================================================
  //  HAMBURGER / MOBILE NAV
  // ================================================================
  var hbg = document.querySelector('.hamburger');
  var mnv = document.querySelector('.mobile-nav');
  var nov = document.querySelector('.nav-overlay');

  function closeMobileNav() {
    if (hbg) hbg.classList.remove('active');
    if (mnv) mnv.classList.remove('open');
    if (nov) nov.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (hbg) {
    hbg.addEventListener('click', function () {
      if (mnv && mnv.classList.contains('open')) { closeMobileNav(); }
      else {
        hbg.classList.add('active');
        if (mnv) mnv.classList.add('open');
        if (nov) nov.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  }
  if (nov) nov.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-nav-links a').forEach(function (l) { l.addEventListener('click', closeMobileNav); });

  // ================================================================
  //  HERO SLIDER
  // ================================================================
  var slides = document.querySelectorAll('.hero-slide');
  var dots   = document.querySelectorAll('.hero-dot');
  var cur = 0, iv = null;

  function goSlide(i) {
    if (!slides.length) return;
    slides[cur].classList.remove('active');
    if (dots[cur]) dots[cur].classList.remove('active');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
  }
  function startSl() { iv = setInterval(function () { goSlide(cur + 1); }, 5500); }
  function resetSl() { clearInterval(iv); startSl(); }

  if (slides.length) {
    slides[0].classList.add('active');
    if (dots[0]) dots[0].classList.add('active');
    startSl();
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goSlide(i); resetSl(); }); });
    var pa = document.querySelector('.hero-arrow.prev'), na = document.querySelector('.hero-arrow.next');
    if (pa) pa.addEventListener('click', function () { goSlide(cur - 1); resetSl(); });
    if (na) na.addEventListener('click', function () { goSlide(cur + 1); resetSl(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goSlide(cur - 1); resetSl(); }
      if (e.key === 'ArrowRight') { goSlide(cur + 1); resetSl(); }
    });
    var tsx = 0, hs = document.querySelector('.hero');
    if (hs) {
      hs.addEventListener('touchstart', function (e) { tsx = e.touches[0].clientX; }, { passive: true });
      hs.addEventListener('touchend', function (e) { var d = tsx - e.changedTouches[0].clientX; if (Math.abs(d) > 50) { goSlide(cur + (d > 0 ? 1 : -1)); resetSl(); } }, { passive: true });
    }
  }

  // ================================================================
  //  SCROLL REVEAL
  // ================================================================
  var ro = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); ro.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger').forEach(function (el) { ro.observe(el); });

  // ================================================================
  //  COUNTER
  // ================================================================
  var co = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, tgt = parseInt(el.dataset.count, 10), sfx = el.dataset.suffix || '', v = 0, st = tgt / 125;
      var t = setInterval(function () { v = Math.min(v + st, tgt); el.textContent = Math.floor(v).toLocaleString() + sfx; if (v >= tgt) clearInterval(t); }, 16);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number[data-count]').forEach(function (el) { co.observe(el); });

  // ================================================================
  //  TESTIMONIALS SLIDER
  // ================================================================
  function initTestSlider() {
    var tr = document.querySelector('.testimonials-track');
    var cs = document.querySelectorAll('.testimonial-card');
    var pb = document.querySelector('.test-nav-btn.prev');
    var nb = document.querySelector('.test-nav-btn.next');
    if (!tr || !cs.length || !pb || !nb) return;
    var ci = 0;
    function pv() { return window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3; }
    function mx() { return Math.max(0, cs.length - pv()); }
    function cw() { var w = cs[0].getBoundingClientRect().width; return w || Math.floor((tr.parentElement || {}).offsetWidth / pv()) || 300; }
    function gt(p) { ci = Math.max(0, Math.min(p, mx())); tr.style.transform = 'translateX(-' + (ci * (cw() + 24)) + 'px)'; pb.style.opacity = ci === 0 ? '.35' : '1'; nb.style.opacity = ci >= mx() ? '.35' : '1'; }
    pb.addEventListener('click', function () { gt(ci - 1); });
    nb.addEventListener('click', function () { gt(ci + 1); });
    window.addEventListener('resize', function () { gt(0); }, { passive: true });
    gt(0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTestSlider);
  else initTestSlider();
  window.addEventListener('load', initTestSlider);

  // ================================================================
  //  BACK TO TOP
  // ================================================================
  var btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', function () { btt.classList.toggle('visible', window.scrollY > 400); }, { passive: true });
    btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // ================================================================
  //  NEWSLETTER
  // ================================================================
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    var inp = form.querySelector('.newsletter-input'), btn = form.querySelector('.btn-subscribe');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (inp && inp.value && inp.value.includes('@')) {
        showToast('\uD83C\uDF89 You are subscribed! Welcome to Stackly.');
        inp.value = '';
        btn.textContent = 'Subscribed!'; btn.style.background = 'var(--deep-sage)'; btn.style.color = '#fff';
        setTimeout(function () { btn.textContent = 'Subscribe'; btn.style.background = ''; btn.style.color = ''; }, 3000);
      } else { showToast('\u26A0\uFE0F Please enter a valid email address.'); }
    });
  });

  // ================================================================
  //  MISC INTERACTIONS
  // ================================================================
  document.addEventListener('click', function (e) {
    var sb = e.target.closest('.size-btn,.size-option');
    if (sb) { var g = sb.closest('.size-grid,.size-selector'); if (g) { g.querySelectorAll('.size-btn,.size-option').forEach(function (b) { b.classList.remove('active','selected'); }); sb.classList.add('active','selected'); } }
    var sw = e.target.closest('.color-swatch');
    if (sw) { var g2 = sw.closest('.product-colors'); if (g2) { g2.querySelectorAll('.color-swatch').forEach(function (s) { s.classList.remove('active'); }); sw.classList.add('active'); } }
    var qb = e.target.closest('.qty-btn');
    if (qb) { var qs = qb.closest('.qty-selector'), qi = qs && qs.querySelector('.qty-input'); if (qi) { var v = parseInt(qi.value, 10) || 1; if (qb.classList.contains('minus')) v = Math.max(1, v - 1); if (qb.classList.contains('plus')) v++; qi.value = v; } }
  });

  document.querySelectorAll('.gallery-thumb').forEach(function (th) {
    th.addEventListener('click', function () {
      document.querySelectorAll('.gallery-thumb').forEach(function (t) { t.classList.remove('active'); });
      th.classList.add('active');
      var mi = document.querySelector('.gallery-main img');
      if (mi && th.querySelector('img')) mi.src = th.querySelector('img').src;
    });
  });

  var ftb = document.querySelector('.filter-toggle-btn'), fsb = document.querySelector('.filter-sidebar');
  if (ftb && fsb) { ftb.addEventListener('click', function () { fsb.classList.toggle('show'); ftb.textContent = fsb.classList.contains('show') ? '\u2715 Close Filters' : '\u2699 Filters'; }); }

  document.querySelectorAll('a[href^="#"]').forEach(function (l) {
    l.addEventListener('click', function (e) { var t = document.querySelector(l.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
  });

  var cp = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a,.mobile-nav-links a').forEach(function (l) { if (l.getAttribute('href') && l.getAttribute('href').includes(cp)) l.classList.add('active'); });

  document.querySelectorAll('.floating-dots').forEach(function (c) {
    for (var i = 0; i < 5; i++) {
      var d = document.createElement('div'), sz = Math.random() * 8 + 4;
      d.className = 'floating-dot';
      d.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;top:' + (Math.random() * 100) + '%;left:' + (Math.random() * 100) + '%;background:' + (Math.random() > .5 ? 'rgba(201,97,74,.15)' : 'rgba(212,149,106,.2)') + ';animation-delay:' + (Math.random() * 4) + 's;animation-duration:' + (Math.random() * 4 + 5) + 's';
      c.appendChild(d);
    }
  });

  var li = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var i = e.target; i.src = i.dataset.src; i.removeAttribute('data-src'); lio.unobserve(i); } }); }, { rootMargin: '200px' });
    li.forEach(function (i) { lio.observe(i); });
  } else { li.forEach(function (i) { i.src = i.dataset.src; }); }

  // ================================================================
  //  INIT
  // ================================================================
  function init() {
    injectPills();
    syncHearts();
    updateWLBadge();
    updateCartBadge();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', init);

  console.log('%cSTACKLY Fashion Store', 'color:#C9614A;font-size:18px;font-weight:bold;font-family:serif;');
  console.log('%cBuilt with \u2764\uFE0F and great style', 'color:#888;font-size:13px;');

})();