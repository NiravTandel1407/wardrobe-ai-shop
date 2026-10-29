import React from 'react';
import { CATEGORIES, SIZES, COLORS } from '../data/products';
import { Check } from 'lucide-react';

export const Filters = ({
  selectedCategories,
  selectedSizes,
  priceRange,
  selectedColor,
  toggleCategory,
  toggleSize,
  toggleColor,
  updatePriceRange,
  className = '',
}) => {
  const minPrice = 499;
  const maxPrice = 2999;

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 100);
    updatePriceRange([val, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 100);
    updatePriceRange([priceRange[0], val]);
  };

  const leftPercent = ((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const widthPercent = ((priceRange[1] - priceRange[0]) / (maxPrice - minPrice)) * 100;

  return (
    <div className={`flex flex-col gap-7 ${className}`}>
      {/* Category Section */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-ink mb-3.5">
          Category
        </h3>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-ink cursor-pointer select-none group"
              >
                <div
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-brand-yellow border-brand-yellow'
                      : 'border-brand-border bg-white group-hover:border-neutral-400'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-brand-ink stroke-[2.5]" />}
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat)}
                  className="sr-only"
                />
                <span className="font-normal group-hover:text-black">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Section */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-ink mb-3.5">
          Size
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`w-9 h-9 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-ink text-brand-yellow border border-brand-ink'
                    : 'bg-white border border-brand-border text-brand-ink hover:border-neutral-400'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Section */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-ink mb-3.5">
          Price
        </h3>
        {/* Dual Handle Slider */}
        <div className="relative pt-2 pb-1">
          {/* Background Bar */}
          <div className="h-1.5 w-full bg-brand-border rounded-full relative">
            {/* Active Range Highlight */}
            <div
              className="absolute top-0 h-1.5 bg-brand-yellow rounded-full"
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
              }}
            />
          </div>

          {/* Range Inputs */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={50}
            value={priceRange[0]}
            onChange={handleMinChange}
            aria-label="Minimum price"
            className="range-slider-thumb absolute top-1 left-0 w-full h-1.5 appearance-none bg-transparent pointer-events-none"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={50}
            value={priceRange[1]}
            onChange={handleMaxChange}
            aria-label="Maximum price"
            className="range-slider-thumb absolute top-1 left-0 w-full h-1.5 appearance-none bg-transparent pointer-events-none"
          />
        </div>

        {/* Selected Price Range Label */}
        <div className="mt-3 text-xs text-brand-muted font-normal">
          ₹{priceRange[0].toLocaleString('en-IN')} – ₹{priceRange[1].toLocaleString('en-IN')}
        </div>
      </div>

      {/* Colour Section */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-ink mb-3.5">
          Colour
        </h3>
        <div className="flex items-center gap-3">
          {COLORS.map((col) => {
            const isSelected = selectedColor === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => toggleColor(col.id)}
                aria-label={`Filter by ${col.name}`}
                className={`w-6 h-6 rounded-full transition-all relative ${
                  col.border ? 'border border-brand-border' : ''
                } ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-brand-ink scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;

