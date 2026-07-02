import React, { useState, useEffect, useCallback } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'overview' | 'theory' | 'howto' | 'tech' | 'references' | 'credits';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: 'theory',
    label: 'Theory',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15m-7.05-3.146A23.942 23.942 0 0112 15c-.872 0-1.725-.06-2.55-.17m5.1.17v3m0 0h1.5m-1.5 0h-1.5m-7.5-3v3m0 0H6m1.5 0H6" />
      </svg>
    ),
  },
  {
    id: 'howto',
    label: 'How to Use',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: 'tech',
    label: 'Tech Stack',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    id: 'references',
    label: 'References',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    id: 'credits',
    label: 'Credits',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
  },
];

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="About the H–R Diagram"
    >
      {/* Modal card */}
      <div className="animate-modal-in relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-700/60 bg-slate-950 shadow-2xl overflow-hidden">

        {/* Corner glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

        {/* ── Header ────────────────────────────────────────── */}
        <div className="relative flex items-start justify-between px-6 py-5 border-b border-slate-800/60 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500" />
              <span className="font-mono text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest">
                Reference Guide
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Interactive H–R Diagram
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theory, features, and scientific background
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer flex-shrink-0 ml-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Tab Bar ────────────────────────────────────────── */}
        <div className="flex border-b border-slate-800/60 bg-slate-950/50 overflow-x-auto flex-shrink-0 px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer flex-shrink-0 ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 animate-fade-in" key={activeTab}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'theory' && <TheoryTab />}
            {activeTab === 'howto' && <HowToTab />}
            {activeTab === 'tech' && <TechTab />}
            {activeTab === 'references' && <ReferencesTab />}
            {activeTab === 'credits' && <CreditsTab />}
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800/60 bg-slate-950/70 flex-shrink-0">
          <span className="font-mono text-[9px] text-slate-600">
            Distance Modulus: <span className="text-slate-500">m − M = 5 log₁₀(d/10 pc)</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-cyan-950/50 text-cyan-400 hover:bg-cyan-900/40 border border-cyan-900/40 hover:border-cyan-700/50 px-4 py-1.5 text-xs font-bold cursor-pointer transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Tab Content Components ────────────────────────────────────────── */

const SectionTitle: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = 'bg-cyan-500',
}) => (
  <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
    <span className={`h-1.5 w-1.5 rounded-full ${color} flex-shrink-0`} />
    {children}
  </h3>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl bg-slate-900/50 border border-slate-800/60 p-4">
    <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
    <div className="text-[11px] text-slate-400 leading-relaxed">{children}</div>
  </div>
);

/* ── Overview ─────────────────────────────────────────────────────── */
const OverviewTab: React.FC = () => (
  <div className="space-y-6 text-[12px] text-slate-400 leading-relaxed">
    <div>
      <SectionTitle>What Is This?</SectionTitle>
      <p>
        This is an <strong className="text-slate-200">interactive Hertzsprung–Russell (H–R) Diagram</strong> — a
        fundamental tool in astrophysics that maps over{' '}
        <strong className="text-cyan-400">5,000 real stellar objects</strong> by their surface temperature and
        luminosity. It reveals the life stages of stars, from bright blue giants to faint white dwarfs.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <InfoCard title="What You Can Do">
        <ul className="space-y-1.5 list-disc pl-4">
          <li>Zoom and pan freely across the stellar diagram</li>
          <li>Search and auto-center on any named star</li>
          <li>Filter by spectral class, luminosity class, distance, and magnitude</li>
          <li>Highlight evolutionary regions with overlay boxes</li>
          <li>Inspect any star with a detailed hover tooltip</li>
          <li>Share your current filter view via URL</li>
        </ul>
      </InfoCard>
      <InfoCard title="The Data">
        <ul className="space-y-1.5 list-disc pl-4">
          <li><strong className="text-slate-300">5,000+</strong> stellar entries from Gaia DR3 & Hipparcos</li>
          <li>Each star: temperature (K), luminosity (L☉), spectral type, distance (ly), and apparent magnitude</li>
          <li>Includes famous stars: the Sun, Vega, Betelgeuse, Sirius, Rigel, and more</li>
          <li>Covers all evolutionary classes: Main Sequence, Giants, Supergiants, White Dwarfs</li>
        </ul>
      </InfoCard>
    </div>

    <div className="rounded-xl bg-gradient-to-br from-cyan-950/20 to-indigo-950/20 border border-cyan-900/30 p-4">
      <p className="text-xs text-cyan-300/80 font-medium">
        💡 <strong>Quick Start:</strong> The diagram loads immediately with all stars visible. Use the{' '}
        <span className="font-mono bg-slate-900/60 px-1 rounded text-[10px]">Filter Console</span> on the left to
        narrow down the catalog, search for famous stars in the search bar, or scroll/pinch to zoom into regions
        of interest.
      </p>
    </div>
  </div>
);

/* ── Theory ──────────────────────────────────────────────────────── */
const TheoryTab: React.FC = () => (
  <div className="space-y-6 text-[12px] text-slate-400 leading-relaxed">
    <div>
      <SectionTitle>The Hertzsprung–Russell Diagram</SectionTitle>
      <p>
        Independently formulated in 1911–1913 by Danish astronomer{' '}
        <strong className="text-slate-200">Ejnar Hertzsprung</strong> and American astronomer{' '}
        <strong className="text-slate-200">Henry Norris Russell</strong>, the H–R Diagram is the cornerstone of
        modern stellar astrophysics. By plotting surface temperature against luminosity, it exposes the
        evolutionary lifecycle of stars and their physical properties.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <InfoCard title="X-Axis — Surface Temperature (K)">
        <p>
          Plotted <strong className="text-slate-300">in reverse</strong> (hot blue stars on the left, cool red
          stars on the right) following Wien's Displacement Law. The sequence corresponds to the Harvard Spectral
          Classification:
        </p>
        <p className="mt-2 font-mono text-[11px] font-bold text-cyan-300 tracking-wider">
          O → B → A → F → G → K → M
        </p>
        <p className="mt-1 text-[10px] text-slate-500">~42,000 K (O) down to ~2,200 K (M)</p>
      </InfoCard>
      <InfoCard title="Y-Axis — Luminosity (L☉)">
        <p>
          Plotted on a <strong className="text-slate-300">logarithmic scale</strong> relative to our Sun
          (1 L☉). It represents total radiative energy output per second, ranging from{' '}
          <span className="font-mono text-[10px]">10⁻⁵</span> up to{' '}
          <span className="font-mono text-[10px]">10⁶ L☉</span>.
        </p>
      </InfoCard>
    </div>

    <div>
      <SectionTitle color="bg-indigo-500">Evolutionary Regions</SectionTitle>
      <div className="space-y-2.5">
        {[
          {
            name: 'Main Sequence (Class V)',
            color: 'text-cyan-400',
            desc: 'The dominant diagonal band where stars fuse hydrogen into helium in their cores. Stars spend ~90% of their lifetimes here. The Sun is a G-type main-sequence star (~5,778 K, 1 L☉).',
          },
          {
            name: 'Giants (Class III) & Bright Giants (Class II)',
            color: 'text-orange-400',
            desc: 'Evolved stars that have exhausted core hydrogen, causing them to expand dramatically. They move off the main sequence, growing cooler on the surface but enormously more luminous.',
          },
          {
            name: 'Supergiants (Class I — Ia & Ib)',
            color: 'text-rose-400',
            desc: 'The most luminous stars known, fusing heavier elements. Betelgeuse (M-type, ~3,500 K, ~100,000 L☉) is a classic example. They are exceedingly rare and short-lived.',
          },
          {
            name: 'White Dwarfs (DA, DB, ...)',
            color: 'text-slate-300',
            desc: 'Hot, Earth-sized stellar remnants of low-to-intermediate mass stars after they shed their outer layers. High temperature (~10,000–100,000 K) but low luminosity due to tiny size. They slowly cool over billions of years.',
          },
          {
            name: 'Subgiants (Class IV)',
            color: 'text-yellow-400',
            desc: 'Stars that are beginning to evolve off the main sequence but have not yet become full giants. They occupy the region between the main sequence and giant branch.',
          },
        ].map(({ name, color, desc }) => (
          <div key={name} className="rounded-lg bg-slate-900/40 border border-slate-800/50 p-3">
            <p className={`font-mono text-[10px] font-bold ${color} uppercase tracking-wider mb-1`}>{name}</p>
            <p className="text-[11px]">{desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <SectionTitle color="bg-violet-500">Key Physical Laws</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoCard title="Stefan-Boltzmann Law">
          <p>Luminosity relates to radius and temperature:</p>
          <p className="font-mono text-[11px] text-violet-300 mt-2 text-center">L = 4πR²σT⁴</p>
          <p className="mt-1 text-[10px] text-slate-500">Explains why supergiants are bright despite being cooler than O-stars.</p>
        </InfoCard>
        <InfoCard title="Wien's Displacement Law">
          <p>Peak emission wavelength relates to temperature:</p>
          <p className="font-mono text-[11px] text-violet-300 mt-2 text-center">λₘₐₓ = b / T</p>
          <p className="mt-1 text-[10px] text-slate-500">Hot stars appear blue; cool stars appear red. This is why temperature maps to colour.</p>
        </InfoCard>
        <InfoCard title="Distance Modulus">
          <p>Relates apparent (m) and absolute (M) magnitudes:</p>
          <p className="font-mono text-[11px] text-violet-300 mt-2 text-center">m − M = 5 log₁₀(d) − 5</p>
          <p className="mt-1 text-[10px] text-slate-500">Where d is distance in parsecs. Used to determine stellar distances.</p>
        </InfoCard>
        <InfoCard title="Stellar Mass-Luminosity">
          <p>For main-sequence stars, luminosity scales with mass:</p>
          <p className="font-mono text-[11px] text-violet-300 mt-2 text-center">L ∝ M³·⁵</p>
          <p className="mt-1 text-[10px] text-slate-500">More massive stars are far brighter but burn fuel faster — shorter lifetimes.</p>
        </InfoCard>
      </div>
    </div>
  </div>
);

/* ── How To Use ──────────────────────────────────────────────────── */
const HowToTab: React.FC = () => (
  <div className="space-y-5 text-[12px] text-slate-400 leading-relaxed">
    <SectionTitle>Interactive Features Guide</SectionTitle>

    {[
      {
        icon: '🔍',
        title: 'Star Search Bar',
        color: 'border-cyan-900/40 bg-cyan-950/10',
        steps: [
          'Click the search field at the top of the diagram.',
          'Type any star name (e.g. "Sun", "Vega", "Betelgeuse", "Rigel", "Sirius").',
          'Select from the autocomplete dropdown — the diagram will smoothly zoom and center on the star.',
          'Click the × button or clear the input to reset the view.',
          'Press ↑ / ↓ arrow keys to navigate suggestions; Enter to select.',
        ],
      },
      {
        icon: '🎛️',
        title: 'Filter Console (Left Sidebar)',
        color: 'border-indigo-900/40 bg-indigo-950/10',
        steps: [
          'Click section headers (Spectral Class, Luminosity Class, etc.) to expand or collapse them.',
          'Toggle spectral class buttons (O, B, A, F, G, K, M) to show/hide star populations by temperature.',
          'Check/uncheck luminosity class boxes to filter by evolutionary stage.',
          'Drag the Distance slider to limit stars by maximum distance in light-years.',
          'Drag the Magnitude range slider to filter by apparent brightness (lower magnitude = brighter).',
          'On mobile, tap the ☰ menu button in the header to open the filter drawer.',
          'The ◀ / ▶ tab on the desktop sidebar collapses or expands it.',
        ],
      },
      {
        icon: '📐',
        title: 'Region Overlay Highlights',
        color: 'border-violet-900/40 bg-violet-950/10',
        steps: [
          'In the "Region Overlays" section, check one or more evolutionary zones.',
          'A coloured dashed boundary box will appear on the diagram, outlining that stellar region.',
          'Main Sequence → cyan overlay; Giants → orange; Supergiants → rose; White Dwarfs → slate.',
          'Multiple overlays can be active simultaneously for comparison.',
        ],
      },
      {
        icon: '🖱️',
        title: 'Zoom & Pan the Diagram',
        color: 'border-emerald-900/40 bg-emerald-950/10',
        steps: [
          'Scroll / pinch to zoom in and out on the diagram canvas.',
          'Click and drag to pan across the plot.',
          'Click the "Reset" button (top-right of the canvas) to return to the default view.',
          'The ZOOM DEPTH indicator (top-left of canvas) shows the current zoom level.',
          'After searching for a star, the diagram auto-zooms to a 15× view centred on it.',
        ],
      },
      {
        icon: '✨',
        title: 'Star Tooltips',
        color: 'border-amber-900/40 bg-amber-950/10',
        steps: [
          'Hover over any dot on the diagram to see its data card.',
          'The tooltip shows: Name, Spectral Type, Surface Temperature, Luminosity, Distance, and Apparent Magnitude.',
          'Click on a star to select it and trigger the auto-zoom.',
        ],
      },
      {
        icon: '🔗',
        title: 'URL Filter Persistence',
        color: 'border-rose-900/40 bg-rose-950/10',
        steps: [
          'When you change filters, the URL updates automatically with query parameters.',
          'Copy the URL and paste it in a new tab to restore the exact same filter configuration.',
          'This makes it easy to share specific stellar views with others.',
        ],
      },
      {
        icon: '📊',
        title: 'Live Statistics Panel',
        color: 'border-sky-900/40 bg-sky-950/10',
        steps: [
          'Expand the "Live Statistics" section in the Filter Console.',
          'It displays real-time stats for the currently visible star subset.',
          'Shows: visible count, dominant spectral class, average temperature, luminosity, and distance.',
          'Stats update instantly as you adjust filters.',
        ],
      },
    ].map(({ icon, title, color, steps }) => (
      <div key={title} className={`rounded-xl border ${color} p-4`}>
        <p className="font-semibold text-slate-200 mb-2">
          {icon} {title}
        </p>
        <ol className="space-y-1 list-decimal pl-5">
          {steps.map((step, i) => (
            <li key={i} className="text-[11px] text-slate-400">
              {step}
            </li>
          ))}
        </ol>
      </div>
    ))}
  </div>
);

/* ── Tech Stack ──────────────────────────────────────────────────── */
const TechTab: React.FC = () => (
  <div className="space-y-5 text-[12px] text-slate-400 leading-relaxed">
    <SectionTitle>Technologies & Libraries</SectionTitle>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        {
          name: 'React 19',
          color: '#22d3ee',
          role: 'UI Framework',
          desc: 'Functional components with hooks (useState, useEffect, useMemo, useCallback, useRef) for reactive state management and optimised rendering.',
        },
        {
          name: 'TypeScript ~6',
          color: '#818cf8',
          role: 'Type Safety',
          desc: 'Strict static typing for all data models (Star, FilterState, StellarStats), component props, D3 scale generics, and utility functions.',
        },
        {
          name: 'D3.js v7',
          color: '#fb923c',
          role: 'Data Visualisation',
          desc: 'Powers the SVG diagram: linear/log scales, zoom & pan behaviour, axis rendering, grid lines, star circle data-join with enter/exit transitions, and glow filters.',
        },
        {
          name: 'Tailwind CSS v4',
          color: '#38bdf8',
          role: 'Styling',
          desc: 'Utility-first CSS framework using the new @tailwindcss/vite plugin (CSS-first config). Handles all layout, dark theme, responsive breakpoints, and hover/transition states.',
        },
        {
          name: 'Vite 8',
          color: '#a78bfa',
          role: 'Build Tool',
          desc: 'Lightning-fast dev server with HMR, native ESM, and optimised production bundling. TypeScript compilation via tsc -b before Vite build.',
        },
        {
          name: 'Inter & JetBrains Mono',
          color: '#f472b6',
          role: 'Typography',
          desc: 'Inter (Google Fonts) for body text and UI labels. JetBrains Mono for all numeric/code readouts, axis labels, and monospaced data displays.',
        },
      ].map(({ name, color, role, desc }) => (
        <div key={name} className="rounded-xl bg-slate-900/50 border border-slate-800/60 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="font-mono text-xs font-bold" style={{ color }}>{name}</span>
            <span className="text-[9px] text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">{role}</span>
          </div>
          <p className="text-[11px]">{desc}</p>
        </div>
      ))}
    </div>

    <div className="rounded-xl bg-slate-900/40 border border-slate-800/50 p-4">
      <SectionTitle color="bg-emerald-500">Architecture Notes</SectionTitle>
      <ul className="space-y-2 list-disc pl-4 text-[11px]">
        <li>
          <strong className="text-slate-300">Data Loading:</strong> CSV parsed via d3.csv() with custom row mapping.
          Loaded once on mount, then kept in React state.
        </li>
        <li>
          <strong className="text-slate-300">Filtering:</strong> Applied via useMemo for zero-cost re-computation.
          Filter state is serialised into URL query params for shareability.
        </li>
        <li>
          <strong className="text-slate-300">D3 ↔ React bridge:</strong> D3 owns the SVG DOM; React manages all UI
          state. Communication is via refs and window-scoped update callbacks for zoom-safe star updates.
        </li>
        <li>
          <strong className="text-slate-300">Zoom system:</strong> d3.zoom with rescaleX/rescaleY ensures axes, grids,
          and star positions all stay in sync at any zoom level.
        </li>
        <li>
          <strong className="text-slate-300">Performance:</strong> The star data-join uses name as key for efficient
          enter/update/exit; large exit batches fade-out and remove smoothly.
        </li>
      </ul>
    </div>
  </div>
);

/* ── References ──────────────────────────────────────────────────── */
const ReferencesTab: React.FC = () => (
  <div className="space-y-5 text-[12px] text-slate-400 leading-relaxed">
    <SectionTitle>Scientific Resources & References</SectionTitle>

    <div className="space-y-3">
      {[
        {
          cat: 'Data Sources',
          color: 'bg-cyan-500',
          refs: [
            { title: 'Gaia Early Data Release 3 (Gaia EDR3)', detail: 'European Space Agency, 2020. Primary source for stellar parallaxes, photometry, and proper motions.' },
            { title: 'Hipparcos Catalogue (ESA SP-1200)', detail: 'ESA, 1997. 118,218 stellar positions with high-precision parallax measurements.' },
            { title: 'Yale Bright Star Catalogue (BSC5)', detail: 'Hoffleit & Warren, 1991. Fundamental reference for named and bright stars.' },
          ],
        },
        {
          cat: 'Textbooks',
          color: 'bg-indigo-500',
          refs: [
            { title: 'Carroll & Ostlie — Introduction to Modern Astrophysics (2nd ed.)', detail: 'Pearson, 2007. Chapters 8–13 cover stellar spectra, the H–R diagram, and stellar evolution comprehensively.' },
            { title: 'Karttunen et al. — Fundamental Astronomy (6th ed.)', detail: 'Springer, 2017. Chapter 11 on stellar classification and the HR diagram.' },
            { title: 'Phillips — The Physics of Stars (2nd ed.)', detail: 'Wiley, 1999. Detailed derivations of the mass-luminosity relation and stellar structure.' },
          ],
        },
        {
          cat: 'Online Resources',
          color: 'bg-violet-500',
          refs: [
            { title: 'ESA Gaia Mission — https://www.cosmos.esa.int/gaia', detail: 'Official mission portal for Gaia data releases and documentation.' },
            { title: 'SIMBAD Astronomical Database — http://simbad.u-strasbg.fr/', detail: 'CDS Strasbourg. Comprehensive database for stellar identifiers, coordinates, and bibliography.' },
            { title: 'NASA ADS — https://ui.adsabs.harvard.edu/', detail: 'Astrophysics Data System. Full-text access to peer-reviewed astronomy literature.' },
            { title: 'Harvard Spectral Classification — MKK Atlas', detail: 'Morgan, Keenan & Kellman (1943). The definitive spectral classification system used in this diagram.' },
          ],
        },
      ].map(({ cat, color, refs }) => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`h-1 w-4 rounded-full ${color}`} />
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cat}</span>
          </div>
          <div className="space-y-2 pl-2">
            {refs.map(({ title, detail }) => (
              <div key={title} className="rounded-lg bg-slate-900/40 border border-slate-800/50 p-3">
                <p className="font-medium text-slate-300 text-[11px]">{title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Credits ─────────────────────────────────────────────────────── */
const CreditsTab: React.FC = () => (
  <div className="space-y-5 text-[12px] text-slate-400 leading-relaxed">
    <SectionTitle color="bg-pink-500">Credits & Acknowledgements</SectionTitle>

    {/* Developer */}
    <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-700/60 p-5 flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-lg">
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden="true">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      </div>
      <div>
        <p className="text-slate-200 font-bold text-sm">VaibhavaKG</p>
        <p className="text-slate-500 text-[11px] mt-0.5">Designer & Developer</p>
        <p className="text-[11px] mt-2">
          Designed and developed this interactive H–R Diagram as a portfolio project exploring astrophysics
          visualisation using modern web technologies.
        </p>
        <a
          href="https://github.com/VaibhavaKG"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2.5 text-cyan-400 hover:text-cyan-300 transition-colors text-[11px] font-medium"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          github.com/VaibhavaKG
        </a>
      </div>
    </div>

    {/* Open Source */}
    <div>
      <SectionTitle color="bg-emerald-500">Open Source Libraries</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          { name: 'D3.js', author: 'Mike Bostock et al.', license: 'ISC' },
          { name: 'React', author: 'Meta Platforms', license: 'MIT' },
          { name: 'Vite', author: 'Evan You et al.', license: 'MIT' },
          { name: 'Tailwind CSS', author: 'Tailwind Labs', license: 'MIT' },
          { name: 'TypeScript', author: 'Microsoft', license: 'Apache-2.0' },
          { name: 'Inter Typeface', author: 'Rasmus Andersson', license: 'OFL-1.1' },
        ].map(({ name, author, license }) => (
          <div key={name} className="flex items-center justify-between rounded-lg bg-slate-900/40 border border-slate-800/50 px-3 py-2">
            <div>
              <span className="text-slate-300 font-medium text-[11px]">{name}</span>
              <span className="text-slate-600 text-[10px] ml-1.5">by {author}</span>
            </div>
            <span className="font-mono text-[9px] text-emerald-500 bg-emerald-950/30 border border-emerald-900/30 px-1.5 py-0.5 rounded">
              {license}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Data Attribution */}
    <div className="rounded-xl bg-slate-900/40 border border-slate-800/50 p-4 text-[11px]">
      <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Data Attribution</p>
      <p>
        Star data is derived from the <strong className="text-slate-300">Gaia DR3</strong> and{' '}
        <strong className="text-slate-300">Hipparcos catalogues</strong>, and is used for educational and
        demonstration purposes. This project is a non-commercial, open-source portfolio work.
      </p>
    </div>
  </div>
);
