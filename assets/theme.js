/* Levana Ceramic – theme scripts (no dependencies). */
(function () {
  'use strict';

  var theme = window.theme || { routes: {}, strings: {} };

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('SiteNav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(message) {
    var el = document.getElementById('CartToast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
  }

  /* ---------- Collection sort ---------- */
  var sortSelect = document.querySelector('[data-sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortSelect.value);
      url.searchParams.delete('page');
      window.location.href = url.toString();
    });
  }

  /* ---------- Product page ---------- */
  var section = document.querySelector('[data-product-section]');
  if (!section) return;

  var jsonEl = section.querySelector('[data-product-json]');
  var product = jsonEl ? JSON.parse(jsonEl.textContent) : null;
  var form = section.querySelector('[data-product-form]');
  var idInput = section.querySelector('[data-variant-id]');
  var addButton = section.querySelector('[data-add-button]');
  var errorEl = section.querySelector('[data-form-error]');
  var mainImage = section.querySelector('[data-main-image]');
  var thumbs = section.querySelectorAll('[data-thumb]');
  var optionSelects = section.querySelectorAll('[data-option-index]');

  function money(cents) {
    var currency = (window.Shopify && Shopify.currency && Shopify.currency.active) || 'ILS';
    return new Intl.NumberFormat(document.documentElement.lang || 'he', { style: 'currency', currency: currency }).format(cents / 100);
  }

  function showImage(src, mediaId) {
    if (!mainImage || !src) return;
    mainImage.removeAttribute('srcset');
    mainImage.src = src;
    thumbs.forEach(function (t) { t.classList.toggle('is-active', String(t.dataset.mediaId) === String(mediaId)); });
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () { showImage(thumb.dataset.src, thumb.dataset.mediaId); });
  });

  function currentVariant() {
    if (!product) return null;
    if (optionSelects.length === 0) return product.variants[0];
    var selected = Array.prototype.map.call(optionSelects, function (s) { return s.value; });
    return product.variants.find(function (v) {
      return v.options.every(function (opt, i) { return opt === selected[i]; });
    }) || null;
  }

  function onVariantChange() {
    var variant = currentVariant();
    if (!variant) {
      addButton.disabled = true;
      addButton.textContent = theme.strings.unavailable;
      return;
    }
    idInput.value = variant.id;
    addButton.disabled = !variant.available;
    addButton.textContent = variant.available ? theme.strings.addToCart : theme.strings.soldOut;

    var priceEl = section.querySelector('[data-price]');
    if (priceEl) {
      var html = '<span class="price__current">' + money(variant.price) + '</span>';
      var onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
      if (onSale) html += '<s class="price__compare">' + money(variant.compare_at_price) + '</s>';
      priceEl.innerHTML = html;
      priceEl.classList.toggle('price--sale', !!onSale);
    }

    if (variant.featured_media) {
      var thumb = section.querySelector('[data-thumb][data-media-id="' + variant.featured_media.id + '"]');
      if (thumb) showImage(thumb.dataset.src, variant.featured_media.id);
    }

    var url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url.toString());
  }

  optionSelects.forEach(function (s) { s.addEventListener('change', onVariantChange); });

  section.querySelectorAll('[data-qty-change]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentElement.querySelector('input');
      var next = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(btn.dataset.qtyChange, 10));
      input.value = next;
    });
  });

  /* Ajax add to cart – keeps the visitor on the page. Falls back to normal submit on failure. */
  if (form && window.fetch) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      addButton.disabled = true;

      fetch(theme.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.description || theme.strings.error);
            return data;
          });
        })
        .then(function () { return fetch(theme.routes.cart_url + '.js').then(function (r) { return r.json(); }); })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          toast(theme.strings.addedToCart);
        })
        .catch(function (err) {
          if (errorEl) { errorEl.textContent = err.message; errorEl.hidden = false; }
        })
        .finally(function () {
          var v = currentVariant();
          addButton.disabled = v ? !v.available : !product || !product.available;
        });
    });
  }
})();
