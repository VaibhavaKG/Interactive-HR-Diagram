import React, { useState } from 'react';
import type { FilterState, StellarStats } from '../types/star';
import { DistanceSlider } from './DistanceSlider';
import { MagnitudeSlider } from './MagnitudeSlider';
import { OverlayToggle } from './OverlayToggle';
import { StatisticsPanel } from './StatisticsPanel';

interface FiltersPanelProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  stats: StellarStats;
  totalCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

const spectralColors: Record<string, string> = {
  O: '#93c5fd', // blue-300
  B: '#bae6fd', // sky-200
  A: '#f1f5f9', // slate-100 (white)
  F: '#fef9c3', // yellow-100
  G: '#fde68a', // amber-200
  K: '#fb923c', // orange-400
  M: '#f87171', // red-400
};

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onChangeFilters,
  stats,
  totalCount,
  isOpen,
  onToggle,
}) => {
  const spectralClasses = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
  const luminosityClasses = [
    { value: 'I',   label: 'I — Supergiants' },
    { value: 'II',  label: 'II — Bright Giants' },
    { value: 'III', label: 'III — Giants' },
    { value: 'IV',  label: 'IV — Subgiants' },
    { value: 'V',   label: 'V — Main Sequence' },
  ];

  const [openSections, setOpenSections] = useState({
    spectral: true,
    luminosity: true,
    ranges: true,
    regions: true,
    stats: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSpectralToggle = (cls: string) => {
    const nextList = filters.spectralClasses.includes(cls)
      ? filters.spectralClasses.filter((x) => x !== cls)
      : [...filters.spectralClasses, cls];
    onChangeFilters({ ...filters, spectralClasses: nextList });
  };

  const handleLuminosityToggle = (cls: string) => {
    const nextList = filters.luminosityClasses.includes(cls)
      ? filters.luminosityClasses.filter((x) => x !== cls)
      : [...filters.luminosityClasses, cls];
    onChangeFilters({ ...filters, luminosityClasses: nextList });
  };

  const handleOverlaysChange = (nextOverlays: string[]) => {
    // Also update highlightedRegion from the first active overlay (for the diagram)
    const highlightedRegion = nextOverlays.length > 0 ? nextOverlays[0] : null;
    onChangeFilters({ ...filters, activeOverlays: nextOverlays, highlightedRegion });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-1">

        {/* ── Spectral Class ──────────────────────────────────── */}
        <SectionHeader
          title="Spectral Class"
          isOpen={openSections.spectral}
          onToggle={() => toggleSection('spectral')}
        />
        {openSections.spectral && (
          <div className="pb-4 animate-fade-in">
            <div className="flex gap-1.5 flex-wrap mt-1.5">
              {spectralClasses.map((cls) => {
                const isChecked = filters.spectralClasses.includes(cls);
                const color = spectralColors[cls];
                return (
                  <button
                    key={cls}
                    onClick={() => handleSpectralToggle(cls)}
                    aria-pressed={isChecked}
                    title={`Toggle spectral class ${cls}`}
                    className={`flex-1 min-w-[32px] py-1.5 rounded-md text-xs font-bold transition-all border cursor-pointer ${
                      isChecked
                        ? 'border-current/50 shadow-sm'
                        : 'bg-slate-900/30 border-slate-800/50 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                    }`}
                    style={isChecked ? { color, borderColor: `${color}55`, backgroundColor: `${color}12` } : {}}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-slate-600 mt-2 font-mono">O (hottest) → M (coolest)</p>
          </div>
        )}

        {/* ── Luminosity Class ────────────────────────────────── */}
        <SectionHeader
          title="Luminosity Class"
          isOpen={openSections.luminosity}
          onToggle={() => toggleSection('luminosity')}
        />
        {openSections.luminosity && (
          <div className="pb-4 animate-fade-in">
            <div className="flex flex-col gap-1 mt-1.5">
              {luminosityClasses.map((item) => {
                const isChecked = filters.luminosityClasses.includes(item.value);
                return (
                  <label
                    key={item.value}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border text-xs font-medium cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-cyan-950/25 border-cyan-900/50 text-cyan-300'
                        : 'bg-transparent border-slate-800/40 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleLuminosityToggle(item.value)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-500/30 w-3.5 h-3.5"
                    />
                    <span className="font-mono text-[10px]">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Metric Ranges ───────────────────────────────────── */}
        <SectionHeader
          title="Metric Ranges"
          isOpen={openSections.ranges}
          onToggle={() => toggleSection('ranges')}
        />
        {openSections.ranges && (
          <div className="pb-4 animate-fade-in space-y-3 mt-1.5">
            <DistanceSlider
              value={filters.maxDistance}
              onChange={(d) => onChangeFilters({ ...filters, maxDistance: d })}
            />
            <MagnitudeSlider
              value={filters.magnitudeRange}
              onChange={(r) => onChangeFilters({ ...filters, magnitudeRange: r })}
            />
          </div>
        )}

        {/* ── Region Overlays ─────────────────────────────────── */}
        <SectionHeader
          title="Region Overlays"
          isOpen={openSections.regions}
          onToggle={() => toggleSection('regions')}
        />
        {openSections.regions && (
          <div className="pb-4 animate-fade-in mt-1.5">
            <OverlayToggle
              activeOverlays={filters.activeOverlays}
              onChangeOverlays={handleOverlaysChange}
            />
          </div>
        )}

        {/* ── Live Statistics ─────────────────────────────────── */}
        <SectionHeader
          title="Live Statistics"
          isOpen={openSections.stats}
          onToggle={() => toggleSection('stats')}
        />
        {openSections.stats && (
          <div className="pb-4 animate-fade-in mt-1.5">
            <StatisticsPanel stats={stats} totalCount={totalCount} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 max-w-[calc(100vw-56px)] bg-slate-950 border-r border-slate-800/60 z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden`}
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 flex-shrink-0">
          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Filter Console
          </span>
          <button
            onClick={onToggle}
            aria-label="Close filter panel"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col border-r border-slate-800/60 bg-slate-950/95 backdrop-blur-md transition-all duration-300 ease-in-out z-30 h-full relative overflow-hidden flex-shrink-0 ${
          isOpen ? 'w-72' : 'w-0'
        }`}
      >
        {/* Collapse/Expand tab on right edge */}
        <button
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="absolute top-1/2 -right-3.5 -translate-y-1/2 h-14 w-3.5 bg-slate-900 border border-l-0 border-slate-800/80 rounded-r-md flex items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer transition-colors shadow-lg z-40"
        >
          <span className="text-[8px] select-none font-bold">
            {isOpen ? '◀' : '▶'}
          </span>
        </button>

        <div className={`flex-1 flex flex-col h-full overflow-hidden transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Sidebar header */}
          <div className="px-4 py-3 border-b border-slate-800/60 flex-shrink-0">
            <span className="font-mono text-[9px] font-bold tracking-widest text-slate-500 uppercase">
              Filter Console
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            {sidebarContent}
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Section Header Sub-component ────────────────────────────────── */
interface SectionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="flex justify-between items-center w-full text-left font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest py-2.5 border-t border-slate-800/40 cursor-pointer hover:text-slate-400 transition-colors first:border-t-0"
  >
    <span>{title}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={`w-3 h-3 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  </button>
);
