import React from 'react';
import Section from './Section';
import ProductGrid from './ProductGrid';
import { PRODUCTS } from '../data/products';

export const FeaturedProducts = ({ products }) => {
  const source = products || PRODUCTS;
  const featured = source.filter(p => p.isFeatured).slice(0, 4);

  return (
    <Section as="section" className="py-10 sm:py-14 border-b border-brand-border/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-[20px] font-medium text-brand-ink tracking-tight">
          Featured products
        </h2>
        <a
          href="#catalog"
          className="text-xs sm:text-sm font-normal text-brand-ink underline underline-offset-4 hover:text-black transition-colors"
        >
          View all
        </a>
      </div>

      {/* Grid: 4 columns desktop, 2 columns mobile */}
      <ProductGrid
        products={featured}
        aspectRatio="aspect-[4/5]"
        columns="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
      />
    </Section>
  );
};

export default FeaturedProducts;
