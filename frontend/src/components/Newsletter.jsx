import React, { useState } from 'react';
import Section from './Section';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter an email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Success
    setStatus('success');
    setEmail('');
    setErrorMessage('');
  };

  return (
    <Section as="section" className="bg-brand-yellow">
      <div className="py-10 sm:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-10">
        {/* Left Copy */}
        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl font-medium text-brand-ink tracking-tight">
            Join the Wardrobe club
          </h2>
          <p className="text-xs sm:text-sm text-brand-ink/90 mt-1 font-normal">
            Get 10% off your first order and early access to drops.
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-auto md:min-w-[380px] lg:min-w-[420px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status) setStatus(null);
                }}
                placeholder="Enter your email"
                aria-label="Email for newsletter"
                className="w-full bg-white text-brand-ink placeholder:text-brand-muted text-xs sm:text-sm px-4 py-3 rounded-btn border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-ink shadow-none font-normal"
              />
              <button
                type="submit"
                className="bg-brand-ink text-brand-yellow px-6 py-3 rounded-btn text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-colors flex-shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </div>

            {/* Inline Feedback Messages */}
            {status === 'success' && (
              <div className="flex items-center gap-1.5 text-xs text-brand-ink font-medium mt-1">
                <CheckCircle2 className="w-4 h-4 text-brand-ink" />
                <span>You're in! Check your inbox for your 10% discount code.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-xs text-brand-sale font-medium mt-1">
                <AlertCircle className="w-4 h-4 text-brand-sale" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </Section>
  );
};

export default Newsletter;

