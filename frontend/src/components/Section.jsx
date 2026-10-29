import React from 'react';

/**
 * Reusable Section wrapper ensuring exact responsive horizontal margin rules:
 * - Desktop (>= 1024px): 15% padding-inline
 * - Tablet (640px - 1023px): 6% padding-inline
 * - Mobile (< 640px): 16px padding-inline
 */
export const Section = ({
  children,
  className = '',
  containerClassName = '',
  id,
  as: Component = 'section',
}) => {
  return (
    <Component id={id} className={`w-full ${className}`}>
      <div className={`w-full px-4 sm:px-[6%] lg:px-[15%] mx-auto ${containerClassName}`}>
        {children}
      </div>
    </Component>
  );
};

export default Section;

