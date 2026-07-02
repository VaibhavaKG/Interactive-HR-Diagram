import React, { useState, useEffect, useMemo } from 'react';
import { useStars } from './hooks/useStars';
import { Header } from './components/Header';
import { HRDiagram } from './components/HRDiagram';
import { Footer } from './components/Footer';
import { FiltersPanel } from './components/FiltersPanel';
import { SearchBar } from './components/SearchBar';
import { InfoModal } from './components/InfoModal';
import { filterStars, deserializeFilters, serializeFilters, DEFAULT_FILTERS } from './utils/filtering';
import { calculateStats } from './utils/statistics';
import type { FilterState } from './types/star';
import './index.css';

const App: React.FC = () => {
  const { stars, loadingState, error } = useStars();

  // Sidebar open state (desktop: open by default, mobile: closed)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter state — synchronised with URL query params
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Search / highlight state
  const [selectedStarName, setSelectedStarName] = useState<string | null>(null);

  // Info modal open state
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Initialise filters from URL and set sidebar default based on screen width
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsedFilters = deserializeFilters(params);
    setFilters(parsedFilters);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Push filter changes to URL for shareability
  const handleFilterChange = (nextFilters: FilterState) => {
    setFilters(nextFilters);
    const query = serializeFilters(nextFilters);
    window.history.replaceState(null, '', window.location.pathname + query);
  };

  // Memoised filtered star list
  const filteredStars = useMemo(() => {
    if (stars.length === 0) return [];
    return filterStars(stars, filters);
  }, [stars, filters]);

  // Memoised live statistics for the current visible subset
  const stats = useMemo(() => calculateStats(filteredStars), [filteredStars]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#06060a] overflow-hidden">
      {/* Ambient background glow */}
      <div className="bg-glow-effect" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_#06060a_100%)] pointer-events-none" aria-hidden="true" />

      {/* ── Header ──────────────────────────────────────────────── */}
      <Header
        starCount={filteredStars.length}
        onOpenInfo={() => setIsInfoOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((o) => !o)}
      />

      {/* ── Main Workspace ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-row relative overflow-hidden">

        {/* Left collapsible filter sidebar */}
        <FiltersPanel
          filters={filters}
          onChangeFilters={handleFilterChange}
          stats={stats}
          totalCount={stars.length}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((o) => !o)}
        />

        {/* Main visualisation area */}
        <main className="flex-1 flex flex-col p-3 md:p-5 overflow-hidden z-10 min-w-0">

          {/* ── Loading State ──────────────────────────────────── */}
          {loadingState === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 min-h-[400px]">
              <div className="relative flex items-center justify-center">
                <div className="h-14 w-14 animate-spin rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-500 border-r-indigo-500" />
                <div className="absolute h-8 w-8 animate-ping rounded-full border border-purple-500 opacity-40" />
                <div className="absolute h-3 w-3 rounded-full bg-cyan-400" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-mono text-[10px] font-bold tracking-widest text-cyan-400 uppercase animate-pulse">
                  Calibrating Stellar Coordinates
                </p>
                <p className="text-[10px] text-slate-600 font-mono">
                  Loading catalog: stars.csv
                </p>
              </div>
            </div>
          )}

          {/* ── Error State ──────────────────────────────────────── */}
          {loadingState === 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[400px]">
              <div className="rounded-full bg-red-950/30 p-4 border border-red-900/50 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="text-center max-w-sm">
                <h3 className="font-mono text-sm font-bold text-red-400 tracking-wider uppercase mb-1">
                  Failed to Load Dataset
                </h3>
                <p className="text-xs text-slate-500">
                  {error || 'Could not parse the stellar CSV records. Ensure public/data/stars.csv exists.'}
                </p>
              </div>
            </div>
          )}

          {/* ── Empty State ──────────────────────────────────────── */}
          {loadingState === 'success' && stars.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 min-h-[400px] text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18" />
              </svg>
              <p className="font-mono text-xs">Observational archives are empty.</p>
            </div>
          )}

          {/* ── Main Diagram ─────────────────────────────────────── */}
          {loadingState === 'success' && stars.length > 0 && (
            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
              {/* Search toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/50">
                <div className="hidden sm:flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">
                    Stellar Locator
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Search by name or designation
                  </span>
                </div>
                <div className="w-full sm:max-w-xs">
                  <SearchBar
                    stars={filteredStars}
                    onSelectStar={setSelectedStarName}
                    selectedStarName={selectedStarName}
                  />
                </div>
              </div>

              {/* Diagram canvas */}
              <div className="flex-1 min-h-[450px] overflow-hidden">
                <HRDiagram
                  stars={filteredStars}
                  allStars={stars}
                  selectedStarName={selectedStarName}
                  onSelectStar={setSelectedStarName}
                  activeOverlays={filters.activeOverlays}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <Footer />

      {/* ── Info / About Modal ───────────────────────────────────── */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
};

export default App;
