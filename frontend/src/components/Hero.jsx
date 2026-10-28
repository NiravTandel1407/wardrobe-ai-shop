import React from 'react';
import heroModelImg from '../assets/hero_model.jpg';

export default function Hero({ onShopClick, onCategorySelect }) {
  return (
    <section className="vibe-hero-section">
      <div className="vibe-hero-split">
        {/* Left Side: Dark Bold Streetwear Vibe */}
        <div className="vibe-hero-left">
          <div className="vibe-hero-inner">
            <span className="vibe-tag">NEW DROP</span>

            <h1 className="vibe-title">
              WEAR<br />YOUR VIBE.
            </h1>

            <p className="vibe-subtitle">
              Make your own rules.
            </p>

            <div className="vibe-cta-group">
              <button
                className="btn-vibe-primary"
                onClick={() => onShopClick && onShopClick()}
              >
                SHOP NEW DROP
              </button>

              <button
                className="btn-vibe-secondary"
                onClick={() => onCategorySelect && onCategorySelect('t-shirt')}
              >
                SHOP T-SHIRTS
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Vibrant Yellow with Hero Model Photo */}
        <div className="vibe-hero-right">
          <div className="vibe-model-container">
            <img
              src={heroModelImg}
              alt="Streetwear model in black hoodie"
              className="vibe-hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
