import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
  sortBy,
  onSortChange,
  totalResults,
}) {
  const genders = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'unisex', label: 'Unisex' },
  ];

  return (
    <div className="filter-bar">
      {/* Category Pills */}
      <div className="categories-scroll">
        <button
          className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${selectedCategory === String(cat.id) ? 'active' : ''}`}
            onClick={() => onSelectCategory(String(cat.id))}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Secondary Controls: Gender + Sort */}
      <div className="filter-controls">
        {/* Gender Tabs */}
        <div className="gender-tabs">
          {genders.map((g) => (
            <button
              key={g.id}
              className={`gender-tab ${selectedGender === g.id ? 'active' : ''}`}
              onClick={() => onSelectGender(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="sort-wrapper">
          <ArrowUpDown size={14} className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="featured">Featured Catalog</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="results-count">
        Showing <strong>{totalResults}</strong> curated piece{totalResults === 1 ? '' : 's'}
      </div>
    </div>
  );
}
