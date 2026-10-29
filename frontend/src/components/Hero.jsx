import React from 'react';
import Section from './Section';
import ShirtIcon from './ShirtIcon';

export const Hero = ({ onTrendingClick }) => {
  const handleTrendingClick = (e) => {
    e.preventDefault();
    if (onTrendingClick) onTrendingClick();
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewArrivalsClick = (e) => {
    e.preventDefault();
    const newArrivalsEl = document.getElementById('new-arrivals');
    if (newArrivalsEl) {
      newArrivalsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section as="section" className="bg-brand-cream border-b border-brand-border/60">
      <div className="py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="flex flex-col items-start justify-center">
          {/* Pill Badge */}
          <span className="inline-block bg-brand-yellow text-brand-ink text-xs font-medium px-3.5 py-1 rounded-full mb-4 sm:mb-6">
            Fall drop 2026
          </span>

          {/* Headline */}
          <h1 className="text-[34px] sm:text-[44px] lg:text-[56px] font-semibold text-brand-ink leading-[1.08] tracking-tight">
            Dress loud.<br />
            Live louder.
          </h1>

          {/* Subtext */}
          <p className="mt-4 sm:mt-5 text-brand-muted text-sm sm:text-base max-w-md leading-relaxed">
            Streetwear made for campus, concerts and everything between.
          </p>

          {/* CTAs */}
          <div className="mt-7 sm:mt-8 flex items-center gap-3.5 sm:gap-4 flex-wrap">
            <a
              href="#new-arrivals"
              onClick={handleNewArrivalsClick}
              className="inline-flex items-center gap-1.5 bg-brand-ink text-brand-yellow px-6 py-3 rounded-btn text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              New arrivals &rarr;
            </a>

            <a
              href="#catalog"
              onClick={handleTrendingClick}
              className="inline-flex items-center bg-transparent border border-brand-ink text-brand-ink px-6 py-3 rounded-btn text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer"
            >
              Trending
            </a>
          </div>
        </div>

        {/* Right Column: Hero Visual Block */}
        <div className="relative w-full">
          {/* Main Yellow Block */}
          <div className="w-full bg-brand-yellow rounded-hero min-h-[300px] sm:min-h-[360px] flex items-center justify-center relative overflow-hidden group">
            {/* Centered Shirt Placeholder (easy to swap with <img>) */}
            <div className="transition-transform duration-300 group-hover:scale-105">
              <ShirtIcon className="w-24 h-24 sm:w-28 sm:h-28 text-brand-ink" strokeWidth={1.75} />
            </div>

            {/* Overlapping Floating Tag: Top Right */}
            <div className="absolute top-5 right-5 sm:top-6 sm:right-6 bg-brand-ink text-brand-yellow text-xs font-medium px-3.5 py-1.5 rounded-full shadow-sm pointer-events-none select-none">
              30% off hoodies
            </div>

            {/* Overlapping Floating Tag: Bottom Left */}
            <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 bg-white text-brand-ink text-xs font-medium px-3.5 py-1.5 rounded-full shadow-sm pointer-events-none select-none">
              Oversized tee · ₹799
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;

