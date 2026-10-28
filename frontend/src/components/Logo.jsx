import React from 'react';

export default function Logo({ size = 36, variant = 'dark' }) {
  const isLight = variant === 'light';
  const textColor = isLight ? '#111111' : '#FFFFFF';

  return (
    <div className="wardrobe-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Yellow Icon with stylized W */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="100" height="100" rx="22" fill="#FFCC00" />
        <path
          d="M21 28L34 72L50 42L66 72L79 28H68L59 58L50 38L41 58L32 28H21Z"
          fill="#111111"
        />
      </svg>

      {/* Bold WARDROBE Wordmark */}
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 900,
          fontSize: `${size * 0.58}px`,
          letterSpacing: '0.12em',
          color: textColor,
          lineHeight: 1,
          textTransform: 'uppercase',
        }}
      >
        WARDROBE
      </span>
    </div>
  );
}
