import React, { useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import Filters from './Filters';

export const FilterSheet = ({
  isOpen,
  onClose,
  totalCount,
  selectedCategories,
  selectedSizes,
  priceRange,
  selectedColor,
  toggleCategory,
  toggleSize,
  toggleColor,
  updatePriceRange,
  clearAllFilters,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Drawer */}
      <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-brand-ink">Filters</h2>
            <span className="text-xs text-brand-muted">({totalCount} items)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAllFilters}
              className="text-xs text-brand-muted hover:text-brand-ink px-2 py-1 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
            <button
              onClick={onClose}
              className="p-1 text-brand-ink hover:bg-neutral-100 rounded-full"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Body */}
        <div className="px-5 py-6 overflow-y-auto flex-1">
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
        </div>

        {/* Apply CTA Bar */}
        <div className="p-4 border-t border-brand-border bg-white flex gap-3">
          <button
            onClick={onClose}
            className="w-full bg-brand-ink text-brand-yellow font-medium py-3 rounded-btn text-sm hover:bg-neutral-800 transition-colors"
          >
            Show {totalCount} {totalCount === 1 ? 'result' : 'results'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSheet;

