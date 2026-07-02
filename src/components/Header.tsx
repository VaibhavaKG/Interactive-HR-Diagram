import React from 'react';

interface HeaderProps {
  starCount: number;
  onOpenInfo: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  starCount,
  onOpenInfo,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <header className="relative z-20 border-b border-slate-800/60 bg-slate-950/90 px-4 md:px-6 py-3 backdrop-blur-xl">
      {/* Top accent gradient bar */}
      <div className="absolute top-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-violet-600 via-cyan-500 to-rose-500 opacity-70" />

      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand + Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close filters panel' : 'Open filters panel'}
            className="md:hidden flex-shrink-0 p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          <div className="min-w-0">
            {/* Subtitle badge */}
            <div className="flex items-center gap-2 mb-0.5">
              <span className="flex h-2 w-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="font-mono text-[9px] font-bold tracking-widest text-cyan-400/80 uppercase hidden sm:block">
                Astrophysics Visualization Portal
              </span>
            </div>

            {/* Main title */}
            <h1 className="text-base md:text-xl font-extrabold tracking-tight leading-none">
              <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Hertzsprung–Russell Diagram
              </span>
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
              Exploring Stellar Evolution Through Observational Data
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Info button */}
          <button
            onClick={onOpenInfo}
            aria-label="Open theory and info panel"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:border-cyan-800/60 transition-all cursor-pointer shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <span className="hidden sm:inline">About</span>
          </button>

          {/* Observed count badge */}
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/50 px-3 py-1.5 text-right">
            <div className="text-[9px] uppercase tracking-wider text-slate-600 font-mono leading-none mb-0.5">Objects</div>
            <div className="font-mono text-sm font-bold text-cyan-400 leading-none">
              {starCount > 0 ? starCount.toLocaleString() : '—'}
            </div>
          </div>

          {/* Dataset badge */}
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/50 px-3 py-1.5 text-right hidden lg:block">
            <div className="text-[9px] uppercase tracking-wider text-slate-600 font-mono leading-none mb-0.5">Dataset</div>
            <div className="font-mono text-xs font-semibold text-slate-400 leading-none">Gaia DR3</div>
          </div>
        </div>
      </div>
    </header>
  );
};
