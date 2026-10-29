import { useState, useMemo } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

export const useFilters = (customProducts = null) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([499, 2999]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(6);

  const allProducts = customProducts && customProducts.length > 0 ? customProducts : DEFAULT_PRODUCTS;

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setVisibleCount(6);
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setVisibleCount(6);
  };

  const toggleColor = (color) => {
    setSelectedColor(prev => (prev === color ? null : color));
    setVisibleCount(6);
  };

  const updatePriceRange = (range) => {
    setPriceRange(range);
    setVisibleCount(6);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange([499, 2999]);
    setSelectedColor(null);
    setVisibleCount(6);
  };

  const removeFilter = (type, value) => {
    if (type === 'category') toggleCategory(value);
    if (type === 'size') toggleSize(value);
    if (type === 'color') setSelectedColor(null);
    if (type === 'price') setPriceRange([499, 2999]);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category filter (OR inside category, AND across groups)
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Size filter: product must have at least one of the selected sizes
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some(s => product.sizes?.includes(s));
        if (!hasSize) return false;
      }

      // Price filter (handles both INR 499-2999 and low denomination products)
      const minThreshold = priceRange[0] === 499 ? 0 : priceRange[0];
      if (product.price < minThreshold || product.price > priceRange[1]) {
        return false;
      }

      // Color filter
      if (selectedColor && product.colour !== selectedColor && product.color !== selectedColor) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.popularity || 0) - (a.popularity || 0);
      if (sortBy === 'trending') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.popularity || 0) - (a.popularity || 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [allProducts, selectedCategories, selectedSizes, priceRange, selectedColor, sortBy]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  // Calculate active filter count
  const isPriceFiltered = priceRange[0] > 499 || priceRange[1] < 2999;
  const activeFilterCount =
    selectedCategories.length +
    selectedSizes.length +
    (selectedColor ? 1 : 0) +
    (isPriceFiltered ? 1 : 0);

  // Active filter chip items for display
  const activeChips = [];
  selectedCategories.forEach(cat => {
    activeChips.push({ type: 'category', value: cat, label: cat });
  });
  selectedSizes.forEach(size => {
    activeChips.push({ type: 'size', value: size, label: `Size ${size}` });
  });
  if (selectedColor) {
    activeChips.push({ type: 'color', value: selectedColor, label: `Color: ${selectedColor}` });
  }
  if (isPriceFiltered) {
    activeChips.push({
      type: 'price',
      value: 'price',
      label: `₹${priceRange[0]} - ₹${priceRange[1]}`
    });
  }

  return {
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
    filteredProducts,
    visibleProducts,
    hasMore,
    loadMore,
    activeFilterCount,
    activeChips,
    totalCount: filteredProducts.length,
  };
};

export default useFilters;
