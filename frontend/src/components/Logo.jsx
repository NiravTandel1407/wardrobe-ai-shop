import React from 'react';

/**
 * Reusable Logo component
 * Brand: yellow rounded square (#FFD400, 6px radius) with bold black 'W',
 * followed by 'WARDROBE' in uppercase with 0.18em tracking and weight 500.
 * Supports swapping in an image via `useImage` prop.
 */
export const Logo = ({ useImage = false, className = '', imgClassName = 'h-7 w-auto' }) => {
  if (useImage) {
    return (
      <a href="/" className={`inline-flex items-center ${className}`} aria-label="Wardrobe Home">
        <img
          src="/logo.png"
          alt="Wardrobe"
          className={imgClassName}
          onError={(e) => {
            // Fallback to vector logo if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </a>
    );
  }

  return (
    <a
      href="/"
      className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}
      aria-label="Wardrobe Home"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-yellow rounded-[6px] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
        <span className="text-brand-ink font-bold text-base sm:text-lg leading-none select-none font-sans">
          W
        </span>
      </div>
      <span className="font-medium text-brand-ink text-sm sm:text-base tracking-[0.18em] uppercase select-none font-sans">
        WARDROBE
      </span>
    </a>
  );
};

export default Logo;

