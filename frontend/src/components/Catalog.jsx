import React, { useState } from 'react';
import Section from './Section';
import Filters from './Filters';
import FilterSheet from './FilterSheet';
import ProductGrid from './ProductGrid';
import { SORT_OPTIONS } from '../data/products';
import { SlidersHorizontal, ChevronDown, X, RefreshCw } from 'lucide-react';

export const Catalog = ({ filterState }) => {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const {
    selectedCategories,
    selectedSizes,
    priceRange,
    selectedColor,
    sortBy,
    setSortBy,
    toggleCategory,
    toggleSize,
    toggleColor,
    updatePriceRange,
    clearAllFilters,
    removeFilter,
    visibleProducts,
    hasMore,
    loadMore,
    activeFilterCount,
    activeChips,
    totalCount,
  } = filterState;

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortBy)?.label || 'Popular';

  return (
    <Section as="section" id="catalog" className="py-12 sm:py-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-brand-border/40">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-ink tracking-tight">
            All products
          </h2>
          <span className="text-sm font-normal text-brand-muted">
            {totalCount} {totalCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Desktop & Mobile Sort + Mobile Filter Button */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Sheet Trigger Button */}
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="lg:hidden flex items-center gap-2 text-xs font-medium border border-brand-border px-3.5 py-2 rounded-full hover:border-brand-ink transition-colors bg-white"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-brand-ink text-brand-yellow w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 text-xs font-normal border border-brand-border px-3.5 py-2 rounded-full hover:border-neutral-400 transition-colors bg-white"
            >
              <span className="text-brand-muted">Sort:</span>
              <span className="text-brand-ink font-medium">{currentSortLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
            </button>

            {sortDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setSortDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-brand-border rounded-card shadow-lg py-1.5 z-30">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.id);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                        sortBy === opt.id
                          ? 'bg-brand-cream font-medium text-brand-ink'
                          : 'text-brand-ink hover:bg-neutral-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block border-r border-brand-border pr-8">
          <Filters
            selectedCategories={selectedCategories}
            selectedSizes={selectedSizes}
            priceRange={priceRange}
            selectedColor={selectedColor}
            toggleCategory={toggleCategory}
            toggleSize={toggleSize}
            toggleColor={toggleColor}
            updatePriceRange={updatePriceRange}
          />
        </aside>

        {/* Right Product Grid Area */}
        <div className="flex flex-col">
          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {activeChips.map((chip, idx) => (
                <div
                  key={`${chip.type}-${chip.value}-${idx}`}
                  className="inline-flex items-center gap-1.5 bg-brand-cream border border-[#F3ECC0] text-brand-ink text-xs font-normal px-3 py-1 rounded-full"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={() => removeFilter(chip.type, chip.value)}
                    className="hover:opacity-70 transition-opacity p-0.5"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-brand-muted hover:text-brand-ink underline underline-offset-2 ml-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid or Empty State */}
          {visibleProducts.length > 0 ? (
            <>
              <ProductGrid
                products={visibleProducts}
                aspectRatio="aspect-[4/5]"
                columns="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
              />

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-10 sm:mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="inline-flex items-center gap-2 border border-brand-ink text-brand-ink text-xs sm:text-sm font-medium px-8 py-2.5 rounded-btn hover:bg-black/5 transition-colors"
                  >
                    <span>Load more</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="py-16 text-center flex flex-col items-center justify-center bg-neutral-50 rounded-card border border-dashed border-brand-border">
              <p className="text-base font-medium text-brand-ink">
                No products match your filters
              </p>
              <p className="text-xs text-brand-muted mt-1 max-w-sm">
                Try loosening your category, size, price, or color filters to explore more items.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 inline-flex items-center gap-1.5 bg-brand-ink text-brand-yellow text-xs font-medium px-4 py-2 rounded-btn hover:bg-neutral-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear all filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <FilterSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        totalCount={totalCount}
        selectedCategories={selectedCategories}
        selectedSizes={selectedSizes}
        priceRange={priceRange}
        selectedColor={selectedColor}
        toggleCategory={toggleCategory}
        toggleSize={toggleSize}
        toggleColor={toggleColor}
        updatePriceRange={updatePriceRange}
        clearAllFilters={clearAllFilters}
      />
    </Section>
  );
};

export default Catalog;

