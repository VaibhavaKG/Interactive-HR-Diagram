# 🌟 Interactive Hertzsprung–Russell Diagram

> An interactive, browser-based visualisation of 5,000+ real stellar objects plotted on the classical Hertzsprung–Russell diagram — the cornerstone of stellar astrophysics.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![D3.js](https://img.shields.io/badge/D3.js-7-F9A03C?logo=d3.js&logoColor=white)](https://d3js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔭 **D3 Scatter Plot** | SVG-based H–R diagram with 5,000+ stellar objects |
| 🔍 **Star Search** | Autocomplete search that zooms & centres on any named star |
| 🎛️ **Multi-Filters** | Filter by spectral class (O–M), luminosity class (I–V), distance, and apparent magnitude |
| 📐 **Region Overlays** | Highlight Main Sequence, Giants, Supergiants, and White Dwarf zones |
| 🖱️ **Zoom & Pan** | Smooth scroll-to-zoom and drag-to-pan powered by d3.zoom |
| 💡 **Tooltips** | Rich hover tooltip with temperature, luminosity, distance, and spectral type |
| 📊 **Live Stats** | Real-time statistics panel updating as you filter |
| 🔗 **URL Persistence** | Filter state encoded in URL query params for easy sharing |
| 📱 **Responsive** | Mobile drawer + desktop collapsible sidebar |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/VaibhavaKG/HR-diagram.git
cd HR-diagram

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Output is in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
HR-diagram/
├── public/
│   ├── data/
│   │   └── stars.csv          # Stellar dataset (5,000+ objects)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── HRDiagram.tsx      # Core D3 scatter plot
│   │   ├── Header.tsx         # Top navigation bar
│   │   ├── Footer.tsx         # Footer with credits
│   │   ├── FiltersPanel.tsx   # Sidebar filter console
│   │   ├── InfoModal.tsx      # About / Theory modal (6 tabs)
│   │   ├── SearchBar.tsx      # Star search with autocomplete
│   │   ├── Tooltip.tsx        # Star hover tooltip
│   │   ├── StatisticsPanel.tsx # Live stats panel
│   │   ├── OverlayToggle.tsx  # Region overlay checkboxes
│   │   ├── DistanceSlider.tsx # Distance range slider
│   │   └── MagnitudeSlider.tsx # Magnitude range slider
│   ├── hooks/
│   │   ├── useStars.ts        # CSV data loading hook
│   │   ├── useSearch.ts       # Search autocomplete logic
│   │   └── useFilters.ts      # Filter state utilities
│   ├── types/
│   │   └── star.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── filtering.ts       # Filter logic + URL serialisation
│   │   ├── scales.ts          # D3 scale helpers
│   │   ├── statistics.ts      # Live stats computation
│   │   └── stellarColors.ts   # Blackbody colour mapping
│   ├── App.tsx                # Root component
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles + animations
├── index.html                 # HTML entry point (SEO, fonts)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌐 Deployment

### GitHub Pages

1. Install the GitHub Pages plugin:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Set `base` in `vite.config.ts`:
   ```ts
   export default defineConfig({
     base: '/HR-diagram/',
     plugins: [react(), tailwindcss()],
   })
   ```

4. Build and deploy:
   ```bash
   npm run build && npm run deploy
   ```

### Vercel / Netlify

Just connect your GitHub repository — both platforms auto-detect Vite projects and configure the build command (`npm run build`) and output directory (`dist`) automatically.

---

## 📊 Dataset

The star catalog (`public/data/stars.csv`) is derived from:

- **Gaia Early Data Release 3** — European Space Agency, 2020
- **Hipparcos Catalogue** — ESA SP-1200, 1997

Each record contains: `name`, `temperature` (K), `luminosity` (L☉), `spectral_type`, `distance` (ly), `magnitude`.

Data is used for **educational and demonstration purposes** only.

---

## 🧪 Tech Stack

| Library | Version | Role |
|---------|---------|------|
| React | 19 | UI framework |
| TypeScript | ~6 | Static typing |
| D3.js | 7 | SVG visualisation & zoom |
| Tailwind CSS | 4 | Utility-first styling |
| Vite | 8 | Build tool & dev server |
| Inter + JetBrains Mono | — | Typography (Google Fonts) |

---

## 📚 Scientific Background

The Hertzsprung–Russell Diagram maps stars by:
- **X-axis**: Surface temperature in Kelvin (reversed: hot on the left)
- **Y-axis**: Luminosity relative to the Sun (logarithmic scale)

Stars are colour-coded by their blackbody temperature and sized by luminosity. The four main evolutionary regions visible on the diagram are:

1. **Main Sequence** — hydrogen-burning stars (90% of a star's lifetime)
2. **Giants** — evolved stars that have left the main sequence
3. **Supergiants** — the most luminous stars, fusing heavier elements
4. **White Dwarfs** — degenerate remnants of Sun-like stars

---

## 📄 License

MIT © 2026 [VaibhavaKG](https://github.com/VaibhavaKG)

---

*Designed & Developed by [@VaibhavaKG](https://github.com/VaibhavaKG)*
