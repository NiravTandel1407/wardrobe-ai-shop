import React from 'react';
import Section from './Section';
import ProductGrid from './ProductGrid';
import { PRODUCTS } from '../data/products';

export const NewArrivals = ({ products }) => {
  const source = products || PRODUCTS;
  const newArrivals = source.filter(p => p.isNew).slice(0, 4);

  return (
    <Section as="section" id="new-arrivals" className="py-10 sm:py-14 border-b border-brand-border/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg sm:text-[20px] font-medium text-brand-ink tracking-tight">
            New arrivals
          </h2>
          <span className="bg-brand-yellow text-brand-ink text-[11px] font-medium px-2 py-0.5 rounded-full select-none">
            This week
          </span>
        </div>
        <a
          href="#catalog"
          className="text-xs sm:text-sm font-normal text-brand-ink underline underline-offset-4 hover:text-black transition-colors"
        >
          View all
        </a>
      </div>

      {/* Grid: 4 columns desktop, 2 columns mobile, Square tiles (1:1), 'New' badge */}
      <ProductGrid
        products={newArrivals}
        aspectRatio="aspect-square"
        columns="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
        badge="New"
      />
    </Section>
  );
};

export default NewArrivals;
