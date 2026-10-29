/**
 * WARDROBE — Vanilla JavaScript Storefront
 * All interactive logic: cart, filters, sort, pagination, mobile UI
 * Replace PRODUCTS with a fetch() call to plug in a FastAPI backend.
 */

'use strict';

/* ══════════════════════════════════════════════════
   1.  PRODUCT DATA
══════════════════════════════════════════════════ */
const PRODUCTS = [
  // ── Featured (4)
  { id: 1,  name: 'Boxy graphic tee',     price: 799,  category: 'T-shirts', sizes: ['S','M','L','XL'], colour: 'yellow', bg: '#FFF3B0', isFeatured: true,  isNew: false, popularity: 98, image: null },
  { id: 2,  name: 'Cargo joggers',         price: 1499, category: 'Jeans',    sizes: ['S','M','L','XL'], colour: 'black',  bg: '#E8E8E8', isFeatured: true,  isNew: false, popularity: 95, image: null },
  { id: 3,  name: 'Zip hoodie',            price: 1899, category: 'Hoodies',  sizes: ['S','M','L','XL'], colour: 'blue',   bg: '#DDEBFF', isFeatured: true,  isNew: false, popularity: 92, image: null },
  { id: 4,  name: 'Denim jacket',          price: 2499, category: 'Jackets',  sizes: ['S','M','L','XL'], colour: 'blue',   bg: '#FFE0D6', isFeatured: true,  isNew: false, popularity: 90, image: null },
  // ── New arrivals (4)
  { id: 5,  name: 'Retro polo',            price: 999,  category: 'T-shirts', sizes: ['S','M','L','XL'], colour: 'white',  bg: '#E3F2E1', isFeatured: false, isNew: true,  popularity: 88, image: null },
  { id: 6,  name: 'Washed sweatshirt',     price: 1699, category: 'Hoodies',  sizes: ['S','M','L','XL'], colour: 'black',  bg: '#EADFFC', isFeatured: false, isNew: true,  popularity: 85, image: null },
  { id: 7,  name: 'Wide-leg denim',        price: 1799, category: 'Jeans',    sizes: ['S','M','L','XL'], colour: 'blue',   bg: '#FFF3B0', isFeatured: false, isNew: true,  popularity: 83, image: null },
  { id: 8,  name: 'Varsity jacket',        price: 2999, category: 'Jackets',  sizes: ['M','L','XL'],     colour: 'black',  bg: '#E8E8E8', isFeatured: false, isNew: true,  popularity: 80, image: null },
  // ── Catalog only (16 more)
  { id: 9,  name: 'Essential crew tee',   price: 599,  category: 'T-shirts', sizes: ['S','M','L','XL'], colour: 'white',  bg: '#DDEBFF', isFeatured: false, isNew: false, popularity: 78, image: null },
  { id: 10, name: 'Stripe tee',           price: 699,  category: 'T-shirts', sizes: ['S','M','L'],      colour: 'blue',   bg: '#FFE0D6', isFeatured: false, isNew: false, popularity: 76, image: null },
  { id: 11, name: 'Slogan tee',           price: 749,  category: 'T-shirts', sizes: ['S','M','L','XL'], colour: 'white',  bg: '#E3F2E1', isFeatured: false, isNew: false, popularity: 74, image: null },
  { id: 12, name: 'Oversized tee',        price: 799,  category: 'T-shirts', sizes: ['S','M','L','XL'], colour: 'yellow', bg: '#EADFFC', isFeatured: false, isNew: false, popularity: 72, image: null },
  { id: 13, name: 'Tie-dye tee',          price: 849,  category: 'T-shirts', sizes: ['S','M','L'],      colour: 'white',  bg: '#FFF3B0', isFeatured: false, isNew: false, popularity: 70, image: null },
  { id: 14, name: 'Cropped hoodie',       price: 1399, category: 'Hoodies',  sizes: ['S','M','L'],      colour: 'yellow', bg: '#E8E8E8', isFeatured: false, isNew: false, popularity: 68, image: null },
  { id: 15, name: 'Pullover hoodie',      price: 1599, category: 'Hoodies',  sizes: ['S','M','L','XL'], colour: 'black',  bg: '#DDEBFF', isFeatured: false, isNew: false, popularity: 66, image: null },
  { id: 16, name: 'Half-zip sweatshirt',  price: 1799, category: 'Hoodies',  sizes: ['S','M','L','XL'], colour: 'blue',   bg: '#FFE0D6', isFeatured: false, isNew: false, popularity: 64, image: null },
  { id: 17, name: 'Slim chinos',          price: 1199, category: 'Jeans',    sizes: ['S','M','L','XL'], colour: 'black',  bg: '#E3F2E1', isFeatured: false, isNew: false, popularity: 62, image: null },
  { id: 18, name: 'Distressed jeans',     price: 1499, category: 'Jeans',    sizes: ['S','M','L'],      colour: 'blue',   bg: '#EADFFC', isFeatured: false, isNew: false, popularity: 60, image: null },
  { id: 19, name: 'Jogger denim',         price: 1699, category: 'Jeans',    sizes: ['S','M','L','XL'], colour: 'blue',   bg: '#FFF3B0', isFeatured: false, isNew: false, popularity: 58, image: null },
  { id: 20, name: 'Cargo pants',          price: 1899, category: 'Jeans',    sizes: ['M','L','XL'],     colour: 'black',  bg: '#E8E8E8', isFeatured: false, isNew: false, popularity: 56, image: null },
  { id: 21, name: 'Windbreaker',          price: 2199, category: 'Jackets',  sizes: ['S','M','L','XL'], colour: 'blue',   bg: '#DDEBFF', isFeatured: false, isNew: false, popularity: 54, image: null },
  { id: 22, name: 'Quilted jacket',       price: 2499, category: 'Jackets',  sizes: ['S','M','L'],      colour: 'black',  bg: '#FFE0D6', isFeatured: false, isNew: false, popularity: 52, image: null },
  { id: 23, name: 'Oversized blazer',     price: 2699, category: 'Jackets',  sizes: ['S','M','L','XL'], colour: 'black',  bg: '#E3F2E1', isFeatured: false, isNew: false, popularity: 50, image: null },
  { id: 24, name: 'Puffer vest',          price: 1799, category: 'Jackets',  sizes: ['S','M','L','XL'], colour: 'yellow', bg: '#EADFFC', isFeatured: false, isNew: false, popularity: 48, image: null },
];

/* ══════════════════════════════════════════════════
   2.  APPLICATION STATE
══════════════════════════════════════════════════ */
const state = {
  cart: 0,
  wishlist: new Set(),

  // Filters — these are the "applied" values
  categories: new Set(),
  sizes:      new Set(),
  colours:    new Set(),
  priceMin:   499,
  priceMax:   2999,

  // Pending values (used inside mobile sheet before Apply)
  pendingCategories: new Set(),
  pendingSizes:      new Set(),
  pendingColours:    new Set(),
  pendingPriceMin:   499,
  pendingPriceMax:   2999,

  sort:        'popularity',
  visibleCount: 6,   // how many catalog products are shown
  PAGE_SIZE:    6,
};

/* ══════════════════════════════════════════════════
   3.  DOM REFERENCES
══════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const el = {
  // Grids
  featuredGrid:  $('#featured-grid'),
  arrivalsGrid:  $('#arrivals-grid'),
  catalogGrid:   $('#catalog-grid'),

  // Header
  hamburgerBtn:      $('#hamburger-btn'),
  drawerOverlay:     $('#drawer-overlay'),
  mobileDrawer:      $('#mobile-drawer'),
  closeDrawerBtn:    $('#close-drawer-btn'),
  mobileCartBadge:   $('#mobile-cart-badge'),
  desktopCartBadge:  $('#desktop-cart-badge'),

  // Catalog
  itemCount:         $('#item-count'),
  sortSelect:        $('#sort-select'),
  sortSelectMobile:  $('#sort-select-mobile'),
  activeFilters:     $('#active-filters'),
  activeChips:       $('#active-chips'),
  clearAllBtn:       $('#clear-all-btn'),
  loadMoreWrap:      $('#load-more-wrap'),
  loadMoreBtn:       $('#load-more-btn'),
  emptyState:        $('#empty-state'),
  emptyClearBtn:     $('#empty-clear-btn'),
  filterCountBadge:  $('#filter-count-badge'),

  // Sidebar
  catChecks:    $$('.cat-check'),
  sizeChips:    $$('.size-chip'),
  swatches:     $$('.swatch'),
  priceMinIn:   $('#price-min'),
  priceMaxIn:   $('#price-max'),
  priceMinDisp: $('#price-min-display'),
  priceMaxDisp: $('#price-max-display'),
  rangeFill:    $('#range-fill'),

  // Mobile filter sheet
  mobileFilterBtn: $('#mobile-filter-btn'),
  sheetOverlay:    $('#sheet-overlay'),
  filterSheet:     $('#filter-sheet'),
  closeSheetBtn:   $('#close-sheet-btn'),
  applyFiltersBtn: $('#apply-filters-btn'),
  catChecksM:      $$('.cat-check-m'),
  sizeChipsM:      $$('.size-chip-m'),
  swatchesM:       $$('.swatch-m'),
  priceMinInM:     $('#price-min-m'),
  priceMaxInM:     $('#price-max-m'),
  priceMinDispM:   $('#price-min-display-m'),
  priceMaxDispM:   $('#price-max-display-m'),
  rangeFillM:      $('#range-fill-m'),

  // Newsletter
  newsletterForm:  $('#newsletter-form'),
  newsletterEmail: $('#newsletter-email'),
  newsletterMsg:   $('#newsletter-msg'),

  // Cart toast
  cartToast:    $('#cart-toast'),
  cartToastMsg: $('#cart-toast-msg'),

  // Footer accordions
  footerToggles: $$('.footer-col-toggle'),
};

/* ══════════════════════════════════════════════════
   4.  PRODUCT CARD RENDERER
══════════════════════════════════════════════════ */
function createProductCard(product, tileRatio = 'tile-4-5', showNew = false) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = product.id;

  const isWished = state.wishlist.has(product.id);

  card.innerHTML = `
    <div class="product-tile ${tileRatio}" style="background:${product.bg}">
      ${showNew ? `<span class="new-badge">New</span>` : ''}
      <button class="wishlist-btn${isWished ? ' active' : ''}"
              aria-label="${isWished ? 'Remove from' : 'Add to'} wishlist"
              data-id="${product.id}">
        <i class="ti ${isWished ? 'ti-heart-filled' : 'ti-heart'}"></i>
      </button>
      ${product.image
        ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
        : `<i class="ti ti-shirt" aria-hidden="true"></i>`
      }
      <button class="quick-add-btn" data-id="${product.id}" aria-label="Add ${product.name} to bag">
        Add to bag
      </button>
    </div>
    <div class="product-name">${product.name}</div>
    <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
  `;

  return card;
}

function renderProductGrid(containerId, products, tileRatio, showNew = false) {
  const container = $('#' + containerId);
  if (!container) return;
  container.innerHTML = '';
  products.forEach(p => {
    container.appendChild(createProductCard(p, tileRatio, showNew));
  });
}

/* ══════════════════════════════════════════════════
   5.  FEATURED & NEW ARRIVALS (static grids)
══════════════════════════════════════════════════ */
function renderStaticGrids() {
  const featured  = PRODUCTS.filter(p => p.isFeatured);
  const arrivals  = PRODUCTS.filter(p => p.isNew);

  renderProductGrid('featured-grid',  featured, 'tile-4-5', false);
  renderProductGrid('arrivals-grid',  arrivals,  'tile-1-1', true);
}

/* ══════════════════════════════════════════════════
   6.  CATALOG — FILTER, SORT, PAGINATE
══════════════════════════════════════════════════ */
function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    if (state.categories.size > 0 && !state.categories.has(p.category)) return false;
    if (state.sizes.size > 0 && !p.sizes.some(s => state.sizes.has(s))) return false;
    if (state.colours.size > 0 && !state.colours.has(p.colour)) return false;
    if (p.price < state.priceMin || p.price > state.priceMax) return false;
    return true;
  });
}

function getSortedProducts(products) {
  const arr = [...products];
  if (state.sort === 'popularity') arr.sort((a, b) => b.popularity - a.popularity);
  if (state.sort === 'price-asc')  arr.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-desc') arr.sort((a, b) => b.price - a.price);
  if (state.sort === 'newest')     arr.sort((a, b) => b.id - a.id);
  return arr;
}

function renderCatalog() {
  const filtered = getFilteredProducts();
  const sorted   = getSortedProducts(filtered);
  const total    = sorted.length;
  const slice    = sorted.slice(0, state.visibleCount);

  // Item count
  el.itemCount.textContent = `${total} item${total !== 1 ? 's' : ''}`;

  // Render grid
  el.catalogGrid.innerHTML = '';
  slice.forEach(p => {
    el.catalogGrid.appendChild(createProductCard(p, 'tile-4-5', false));
  });

  // Empty state
  el.emptyState.hidden = total > 0;
  el.catalogGrid.hidden = total === 0;

  // Load more
  el.loadMoreWrap.hidden = state.visibleCount >= total;

  // Active filter chips
  renderActiveFilterChips();

  // Update mobile filter badge
  updateFilterCountBadge();
}

/* ══════════════════════════════════════════════════
   7.  ACTIVE FILTER CHIPS
══════════════════════════════════════════════════ */
function renderActiveFilterChips() {
  el.activeChips.innerHTML = '';
  const chips = [];

  state.categories.forEach(cat => {
    chips.push({ label: cat, type: 'cat', value: cat });
  });
  state.sizes.forEach(sz => {
    chips.push({ label: `Size ${sz}`, type: 'size', value: sz });
  });
  state.colours.forEach(col => {
    chips.push({ label: col.charAt(0).toUpperCase() + col.slice(1), type: 'colour', value: col });
  });
  if (state.priceMin !== 499 || state.priceMax !== 2999) {
    chips.push({
      label: `₹${state.priceMin.toLocaleString('en-IN')} – ₹${state.priceMax.toLocaleString('en-IN')}`,
      type: 'price', value: null
    });
  }

  const hasFilters = chips.length > 0;
  el.activeFilters.hidden = !hasFilters;

  chips.forEach(chip => {
    const div = document.createElement('div');
    div.className = 'active-chip';
    div.innerHTML = `
      <span>${chip.label}</span>
      <button aria-label="Remove ${chip.label} filter">×</button>
    `;
    div.querySelector('button').addEventListener('click', () => {
      if (chip.type === 'cat')    { state.categories.delete(chip.value); syncSidebarCheckbox(chip.value, false); }
      if (chip.type === 'size')   { state.sizes.delete(chip.value); syncSidebarSizeChip(chip.value, false); }
      if (chip.type === 'colour') { state.colours.delete(chip.value); syncSidebarSwatch(chip.value, false); }
      if (chip.type === 'price')  { state.priceMin = 499; state.priceMax = 2999; syncRangeSlider(); }
      state.visibleCount = state.PAGE_SIZE;
      renderCatalog();
    });
    el.activeChips.appendChild(div);
  });
}

function updateFilterCountBadge() {
  const count = state.categories.size + state.sizes.size + state.colours.size +
    (state.priceMin !== 499 || state.priceMax !== 2999 ? 1 : 0);
  el.filterCountBadge.hidden = count === 0;
  el.filterCountBadge.textContent = count;
}

function clearAllFilters() {
  state.categories.clear();
  state.sizes.clear();
  state.colours.clear();
  state.priceMin = 499;
  state.priceMax = 2999;
  state.visibleCount = state.PAGE_SIZE;
  syncAllSidebarUI();
  renderCatalog();
}

/* ══════════════════════════════════════════════════
   8.  SIDEBAR SYNC HELPERS
      (keep sidebar UI in sync when chips are removed)
══════════════════════════════════════════════════ */
function syncSidebarCheckbox(value, checked) {
  el.catChecks.forEach(cb => { if (cb.value === value) cb.checked = checked; });
}

function syncSidebarSizeChip(value, selected) {
  el.sizeChips.forEach(btn => {
    if (btn.dataset.size === value) btn.classList.toggle('selected', selected);
  });
}

function syncSidebarSwatch(value, selected) {
  el.swatches.forEach(btn => {
    if (btn.dataset.colour === value) btn.classList.toggle('selected', selected);
  });
}

function syncRangeSlider() {
  el.priceMinIn.value = state.priceMin;
  el.priceMaxIn.value = state.priceMax;
  el.priceMinDisp.textContent = '₹' + state.priceMin.toLocaleString('en-IN');
  el.priceMaxDisp.textContent = '₹' + state.priceMax.toLocaleString('en-IN');
  updateRangeFill(el.priceMinIn, el.priceMaxIn, el.rangeFill);
}

function syncAllSidebarUI() {
  el.catChecks.forEach(cb => { cb.checked = state.categories.has(cb.value); });
  el.sizeChips.forEach(btn => { btn.classList.toggle('selected', state.sizes.has(btn.dataset.size)); });
  el.swatches.forEach(btn => { btn.classList.toggle('selected', state.colours.has(btn.dataset.colour)); });
  syncRangeSlider();
}

/* ══════════════════════════════════════════════════
   9.  DUAL RANGE SLIDER
══════════════════════════════════════════════════ */
function updateRangeFill(minInput, maxInput, fillEl) {
  const min = parseInt(minInput.min);
  const max = parseInt(minInput.max);
  const lo  = parseInt(minInput.value);
  const hi  = parseInt(maxInput.value);
  const leftPct  = ((lo - min) / (max - min)) * 100;
  const rightPct = ((hi - min) / (max - min)) * 100;
  fillEl.style.left  = leftPct + '%';
  fillEl.style.width = (rightPct - leftPct) + '%';
}

function setupRangeSlider(minIn, maxIn, minDisp, maxDisp, fillEl, onUpdate) {
  function update() {
    let lo = parseInt(minIn.value);
    let hi = parseInt(maxIn.value);
    if (lo > hi - 100) {
      if (document.activeElement === minIn) lo = hi - 100;
      else hi = lo + 100;
      minIn.value = lo;
      maxIn.value = hi;
    }
    minDisp.textContent = '₹' + lo.toLocaleString('en-IN');
    maxDisp.textContent = '₹' + hi.toLocaleString('en-IN');
    updateRangeFill(minIn, maxIn, fillEl);
    onUpdate(lo, hi);
  }

  minIn.addEventListener('input', update);
  maxIn.addEventListener('input', update);
  updateRangeFill(minIn, maxIn, fillEl);
}

/* ══════════════════════════════════════════════════
   10.  CART
══════════════════════════════════════════════════ */
let toastTimer = null;

function addToCart(productId) {
  state.cart++;
  updateCartBadges();

  const product = PRODUCTS.find(p => p.id === productId);
  showToast(`Added: ${product ? product.name : 'Item'}`);
}

function updateCartBadges() {
  [el.mobileCartBadge, el.desktopCartBadge].forEach(badge => {
    badge.textContent = state.cart;
    badge.hidden = state.cart === 0;
  });
}

function showToast(msg) {
  el.cartToastMsg.textContent = msg;
  el.cartToast.hidden = false;
  el.cartToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.cartToast.classList.remove('show');
    setTimeout(() => { el.cartToast.hidden = true; }, 250);
  }, 2000);
}

/* ══════════════════════════════════════════════════
   11.  WISHLIST
══════════════════════════════════════════════════ */
function toggleWishlist(productId, btn) {
  if (state.wishlist.has(productId)) {
    state.wishlist.delete(productId);
    btn.classList.remove('active');
    btn.setAttribute('aria-label', 'Add to wishlist');
    btn.innerHTML = '<i class="ti ti-heart"></i>';
  } else {
    state.wishlist.add(productId);
    btn.classList.add('active');
    btn.setAttribute('aria-label', 'Remove from wishlist');
    btn.innerHTML = '<i class="ti ti-heart-filled"></i>';
  }
}

/* ══════════════════════════════════════════════════
   12.  GLOBAL CLICK DELEGATION (cards & buttons)
══════════════════════════════════════════════════ */
document.addEventListener('click', (e) => {
  // Quick-add button
  const qab = e.target.closest('.quick-add-btn');
  if (qab) {
    e.stopPropagation();
    addToCart(parseInt(qab.dataset.id));
    return;
  }

  // Wishlist button
  const wb = e.target.closest('.wishlist-btn');
  if (wb) {
    e.stopPropagation();
    toggleWishlist(parseInt(wb.dataset.id), wb);
    return;
  }
});

/* ══════════════════════════════════════════════════
   13.  MOBILE DRAWER
══════════════════════════════════════════════════ */
function openDrawer() {
  el.mobileDrawer.classList.add('open');
  el.drawerOverlay.classList.add('open');
  el.mobileDrawer.setAttribute('aria-hidden', 'false');
  el.drawerOverlay.setAttribute('aria-hidden', 'false');
  el.hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  el.mobileDrawer.classList.remove('open');
  el.drawerOverlay.classList.remove('open');
  el.mobileDrawer.setAttribute('aria-hidden', 'true');
  el.drawerOverlay.setAttribute('aria-hidden', 'true');
  el.hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

el.hamburgerBtn.addEventListener('click', openDrawer);
el.closeDrawerBtn.addEventListener('click', closeDrawer);
el.drawerOverlay.addEventListener('click', closeDrawer);

// Close drawer when a link is clicked
$$('.drawer-link').forEach(link => {
  link.addEventListener('click', () => {
    closeDrawer();
    // Apply nav-bar category filter if data attribute present
    const cat = link.dataset.filterCat;
    if (cat) applyNavFilter({ cat });
  });
});

/* ══════════════════════════════════════════════════
   14.  NAV LINK FILTER SHORTCUTS (desktop + drawer)
══════════════════════════════════════════════════ */
function applyNavFilter({ cat, sort }) {
  if (cat) {
    state.categories.clear();
    state.categories.add(cat);
    syncAllSidebarUI();
  }
  if (sort) {
    state.sort = sort;
    el.sortSelect.value = sort;
    el.sortSelectMobile.value = sort;
  }
  state.visibleCount = state.PAGE_SIZE;
  renderCatalog();
}

$$('.nav-link[data-filter-cat], .mobile-chips-inner [data-filter-cat]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    applyNavFilter({ cat: link.dataset.filterCat });
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  });
});

$$('.nav-link[data-filter-sort], .mobile-chips-inner [data-filter-sort]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    applyNavFilter({ sort: link.dataset.filterSort });
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  });
});

// Hero "Trending" button
const heroTrendingBtn = $('#hero-trending-btn');
if (heroTrendingBtn) {
  heroTrendingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    applyNavFilter({ sort: 'popularity' });
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════
   15.  SIDEBAR FILTER EVENTS
══════════════════════════════════════════════════ */
// Category checkboxes
el.catChecks.forEach(cb => {
  cb.addEventListener('change', () => {
    cb.checked ? state.categories.add(cb.value) : state.categories.delete(cb.value);
    state.visibleCount = state.PAGE_SIZE;
    renderCatalog();
  });
});

// Size chips
el.sizeChips.forEach(btn => {
  btn.addEventListener('click', () => {
    const sz = btn.dataset.size;
    if (state.sizes.has(sz)) {
      state.sizes.delete(sz);
      btn.classList.remove('selected');
    } else {
      state.sizes.add(sz);
      btn.classList.add('selected');
    }
    state.visibleCount = state.PAGE_SIZE;
    renderCatalog();
  });
});

// Colour swatches
el.swatches.forEach(btn => {
  btn.addEventListener('click', () => {
    const col = btn.dataset.colour;
    if (state.colours.has(col)) {
      state.colours.delete(col);
      btn.classList.remove('selected');
    } else {
      state.colours.add(col);
      btn.classList.add('selected');
    }
    state.visibleCount = state.PAGE_SIZE;
    renderCatalog();
  });
});

// Price range slider (desktop sidebar)
setupRangeSlider(
  el.priceMinIn, el.priceMaxIn,
  el.priceMinDisp, el.priceMaxDisp,
  el.rangeFill,
  (lo, hi) => {
    state.priceMin = lo;
    state.priceMax = hi;
    state.visibleCount = state.PAGE_SIZE;
    renderCatalog();
  }
);

// Sort
el.sortSelect.addEventListener('change', () => {
  state.sort = el.sortSelect.value;
  el.sortSelectMobile.value = state.sort;
  state.visibleCount = state.PAGE_SIZE;
  renderCatalog();
});

el.sortSelectMobile.addEventListener('change', () => {
  state.sort = el.sortSelectMobile.value;
  el.sortSelect.value = state.sort;
  state.visibleCount = state.PAGE_SIZE;
  renderCatalog();
});

// Clear all
el.clearAllBtn.addEventListener('click', clearAllFilters);
el.emptyClearBtn.addEventListener('click', clearAllFilters);

// Load more
el.loadMoreBtn.addEventListener('click', () => {
  state.visibleCount += state.PAGE_SIZE;
  renderCatalog();
});

/* ══════════════════════════════════════════════════
   16.  MOBILE FILTER SHEET
══════════════════════════════════════════════════ */
function openFilterSheet() {
  // Copy current state to pending (so Cancel doesn't apply)
  state.pendingCategories = new Set(state.categories);
  state.pendingSizes      = new Set(state.sizes);
  state.pendingColours    = new Set(state.colours);
  state.pendingPriceMin   = state.priceMin;
  state.pendingPriceMax   = state.priceMax;

  // Sync sheet UI to current state
  el.catChecksM.forEach(cb => { cb.checked = state.pendingCategories.has(cb.value); });
  el.sizeChipsM.forEach(btn => { btn.classList.toggle('selected', state.pendingSizes.has(btn.dataset.size)); });
  el.swatchesM.forEach(btn => { btn.classList.toggle('selected', state.pendingColours.has(btn.dataset.colour)); });
  el.priceMinInM.value = state.pendingPriceMin;
  el.priceMaxInM.value = state.pendingPriceMax;
  el.priceMinDispM.textContent = '₹' + state.pendingPriceMin.toLocaleString('en-IN');
  el.priceMaxDispM.textContent = '₹' + state.pendingPriceMax.toLocaleString('en-IN');
  updateRangeFill(el.priceMinInM, el.priceMaxInM, el.rangeFillM);

  el.filterSheet.classList.add('open');
  el.sheetOverlay.classList.add('open');
  el.filterSheet.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeFilterSheet() {
  el.filterSheet.classList.remove('open');
  el.sheetOverlay.classList.remove('open');
  el.filterSheet.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

el.mobileFilterBtn.addEventListener('click', openFilterSheet);
el.closeSheetBtn.addEventListener('click', closeFilterSheet);
el.sheetOverlay.addEventListener('click', closeFilterSheet);

// Mobile sheet category checkboxes
el.catChecksM.forEach(cb => {
  cb.addEventListener('change', () => {
    cb.checked ? state.pendingCategories.add(cb.value) : state.pendingCategories.delete(cb.value);
  });
});

// Mobile sheet size chips
el.sizeChipsM.forEach(btn => {
  btn.addEventListener('click', () => {
    const sz = btn.dataset.size;
    if (state.pendingSizes.has(sz)) {
      state.pendingSizes.delete(sz);
      btn.classList.remove('selected');
    } else {
      state.pendingSizes.add(sz);
      btn.classList.add('selected');
    }
  });
});

// Mobile sheet swatches
el.swatchesM.forEach(btn => {
  btn.addEventListener('click', () => {
    const col = btn.dataset.colour;
    if (state.pendingColours.has(col)) {
      state.pendingColours.delete(col);
      btn.classList.remove('selected');
    } else {
      state.pendingColours.add(col);
      btn.classList.add('selected');
    }
    btn.classList.toggle('selected', state.pendingColours.has(col));
  });
});

// Mobile sheet price range
setupRangeSlider(
  el.priceMinInM, el.priceMaxInM,
  el.priceMinDispM, el.priceMaxDispM,
  el.rangeFillM,
  (lo, hi) => {
    state.pendingPriceMin = lo;
    state.pendingPriceMax = hi;
  }
);

// Apply button — commit pending → state
el.applyFiltersBtn.addEventListener('click', () => {
  state.categories = new Set(state.pendingCategories);
  state.sizes      = new Set(state.pendingSizes);
  state.colours    = new Set(state.pendingColours);
  state.priceMin   = state.pendingPriceMin;
  state.priceMax   = state.pendingPriceMax;
  state.visibleCount = state.PAGE_SIZE;
  syncAllSidebarUI();
  renderCatalog();
  closeFilterSheet();
});

/* ══════════════════════════════════════════════════
   17.  NEWSLETTER
══════════════════════════════════════════════════ */
el.newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = el.newsletterEmail.value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  el.newsletterMsg.className = 'newsletter-msg';

  if (!email) {
    el.newsletterMsg.className = 'newsletter-msg error';
    el.newsletterMsg.textContent = 'Please enter your email address.';
    el.newsletterEmail.focus();
    return;
  }

  if (!emailRe.test(email)) {
    el.newsletterMsg.className = 'newsletter-msg error';
    el.newsletterMsg.textContent = 'Hmm, that doesn\'t look like a valid email.';
    el.newsletterEmail.focus();
    return;
  }

  // Success
  el.newsletterMsg.className = 'newsletter-msg success';
  el.newsletterMsg.textContent = '🎉 You\'re in! Check your inbox for 10% off.';
  el.newsletterEmail.value = '';
  el.newsletterEmail.disabled = true;
  el.newsletterForm.querySelector('button[type="submit"]').disabled = true;
});

/* ══════════════════════════════════════════════════
   18.  FOOTER ACCORDIONS (mobile only)
══════════════════════════════════════════════════ */
el.footerToggles.forEach(btn => {
  // Find the sibling <ul>
  const list = btn.nextElementSibling;
  if (!list) return;

  // On mobile, collapse by default
  function updateAccordion() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      list.classList.toggle('collapsed', !isExpanded);
    } else {
      list.classList.remove('collapsed');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  // Start collapsed on mobile
  if (window.innerWidth < 768) {
    btn.setAttribute('aria-expanded', 'false');
    list.classList.add('collapsed');
  }

  btn.addEventListener('click', () => {
    if (window.innerWidth >= 768) return;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    updateAccordion();
  });

  window.addEventListener('resize', updateAccordion, { passive: true });
});

/* ══════════════════════════════════════════════════
   19.  ESCAPE KEY HANDLER
══════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeFilterSheet();
  }
});

/* ══════════════════════════════════════════════════
   20.  INIT
══════════════════════════════════════════════════ */
function init() {
  renderStaticGrids();
  renderCatalog();
}

init();
