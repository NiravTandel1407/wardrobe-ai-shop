import React from 'react';
import ProductCard from './ProductCard';

export const ProductGrid = ({
  products = [],
  aspectRatio = 'aspect-[4/5]',
  columns = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  badge = null,
}) => {
  return (
    <div className={`grid ${columns} gap-3 sm:gap-4 lg:gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          aspectRatio={aspectRatio}
          badge={badge}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

