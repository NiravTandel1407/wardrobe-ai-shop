import React, { useState } from 'react';
import Section from './Section';
import Logo from './Logo';
import { ChevronDown, Instagram, Facebook, Youtube, Phone } from 'lucide-react';

export const Footer = () => {
  // Mobile accordion state for sections
  const [openSection, setOpenSection] = useState(null);

  const toggleAccordion = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const footerLinks = {
    Shop: [
      { name: 'New arrivals', href: '#new-arrivals' },
      { name: 'Trending', href: '#catalog' },
      { name: 'Men', href: '#catalog' },
      { name: 'Women', href: '#catalog' },
      { name: 'Sale', href: '#catalog' },
    ],
    Help: [
      { name: 'Track order', href: '#' },
      { name: 'Shipping', href: '#' },
      { name: 'Returns', href: '#' },
      { name: 'Size guide', href: '#' },
      { name: 'Contact us', href: '#' },
    ],
    Company: [
      { name: 'About us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Student discount', href: '#' },
      { name: 'Store locator', href: '#' },
    ],
  };

  return (
    <Section as="footer" className="bg-brand-footer text-brand-ink border-t border-brand-border/60">
      <div className="pt-14 pb-10">
        {/* Top 4-Column Layout (Desktop) / Brand + Accordions (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-brand-border">
          {/* Column 1: Brand block */}
          <div className="flex flex-col items-start">
            <Logo />
            <p className="mt-4 text-xs sm:text-sm text-brand-muted max-w-xs leading-relaxed font-normal">
              Everyday clothing for youth who like to stand out.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-ink hover:text-black hover:border-brand-ink transition-colors bg-white"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-ink hover:text-black hover:border-brand-ink transition-colors bg-white"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-ink hover:text-black hover:border-brand-ink transition-colors bg-white"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-ink hover:text-black hover:border-brand-ink transition-colors bg-white"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Desktop Columns 2, 3, 4 */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="hidden lg:flex flex-col">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-ink mb-4">
                {title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-brand-secondary hover:text-brand-ink transition-colors font-normal"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Mobile Accordions for Shop, Help, Company */}
          <div className="lg:hidden flex flex-col divide-y divide-brand-border border-t border-brand-border">
            {Object.entries(footerLinks).map(([title, links]) => {
              const isOpen = openSection === title;
              return (
                <div key={title} className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(title)}
                    className="w-full flex items-center justify-between text-left text-sm font-medium text-brand-ink py-1"
                  >
                    <span>{title}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <ul className="pt-3 pb-2 flex flex-col gap-2 pl-1">
                      {links.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="text-xs text-brand-secondary hover:text-brand-ink"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-brand-muted text-center sm:text-left font-normal">
            &copy; 2026 Wardrobe. All rights reserved. &middot;{' '}
            <a href="#" className="hover:underline">
              Privacy
            </a>{' '}
            &middot;{' '}
            <a href="#" className="hover:underline">
              Terms
            </a>
          </p>

          {/* Payment method chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['UPI', 'Visa', 'Cards', 'COD'].map((method) => (
              <span
                key={method}
                className="text-[11px] font-medium bg-white border border-brand-border text-brand-ink px-2.5 py-0.5 rounded-full shadow-none select-none"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Footer;

