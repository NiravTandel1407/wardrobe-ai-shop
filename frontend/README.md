# WARDROBE — React + Vite Storefront

A responsive, light-theme e-commerce homepage for youth streetwear brand **WARDROBE**.

Built with React 18, Vite, Tailwind CSS, Lucide icons, and React Router.

## Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Custom Design Tokens for WARDROBE)
- **Icons:** `lucide-react` + custom streetwear shirt vector outlines
- **Routing:** `react-router-dom`
- **Typography:** Inter (Google Fonts, weights 400 & 500)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## How to Replace Placeholder Tiles with Real Product Images

Each product record is stored in `src/data/products.js`:

```javascript
{
  id: 1,
  name: "Boxy graphic tee",
  price: 799,
  category: "T-shirts",
  sizes: ["S", "M", "L", "XL"],
  color: "yellow",
  tileColor: "#FFF3B0",
  isFeatured: true,
  isNew: false,
  popularity: 98,
  image: "/path/to/real-photo.jpg", // <--- Set this to your photo path or URL
}
```

- When `image` is `null` or omitted, the `<ProductCard />` displays the custom pastel background with the centered streetwear shirt icon.
- When `image` is set to an image URL or local asset (e.g. `"/assets/products/shirt1.jpg"` in the `public/` folder), the image automatically renders inside the rounded pastel container with subtle zoom on hover.
- To connect to the FastAPI backend later, simply update `src/data/products.js` or replace the mock data fetch with `fetch('/api/v1/products')`.

