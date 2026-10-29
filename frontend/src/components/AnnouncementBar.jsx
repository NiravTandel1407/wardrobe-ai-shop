import React from 'react';
import Section from './Section';

export const AnnouncementBar = () => {
  return (
    <Section as="div" className="bg-brand-ink text-brand-yellow">
      <div className="py-2 text-center text-[11px] font-medium tracking-wide">
        Free shipping over ₹999 · Easy 15-day returns
      </div>
    </Section>
  );
};

export default AnnouncementBar;

