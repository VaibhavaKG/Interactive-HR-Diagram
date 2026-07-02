import React from 'react';
import { getStellarColor } from '../utils/stellarColors';

export const Legend: React.FC = () => {
  const spectralClasses = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
  const classTemps: Record<string, number> = {
    O: 40000, B: 20000, A: 10000, F: 7500, G: 6000, K: 5000, M: 3000,
  };

  return (
    <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4 flex flex-col gap-3.5 backdrop-blur shadow-inner">
      <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-1.5 flex items-center justify-between">
        <span>Stellar Legend</span>
        <span className="text-[10px] font-normal text-slate-500 lowercase font-sans">Sequence Reference</span>
      </h3>

      {/* Temperature / Spectral Sequence */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          Spectral Class & Temperature
        </span>
        <div className="flex flex-wrap gap-1">
          {spectralClasses.map((cls) => {
            const temp = classTemps[cls];
            const color = getStellarColor(temp);
            return (
              <div
                key={cls}
                className="flex-1 min-w-[36px] flex flex-col items-center gap-1 rounded bg-slate-900/60 p-1 border border-slate-800/50"
              >
                <span className="font-bold text-xs" style={{ color }}>{cls}</span>
                <span className="text-[8px] font-mono text-slate-500">{(temp / 1000).toFixed(0)}k K</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Progression Gradient Bar */}
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-400 via-slate-100 via-yellow-100 to-red-500 shadow-inner" />
        <div className="flex justify-between font-mono text-[9px] text-slate-500">
          <span>Hot (&gt;30,000 K)</span>
          <span>Warm (6,000 K)</span>
          <span>Cool (&lt;3,500 K)</span>
        </div>
      </div>

      {/* Luminosity Scale Legend */}
      <div className="flex flex-col gap-2 border-t border-slate-900 pt-3">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          Luminosity scale (L☉)
        </span>
        <div className="flex items-center justify-between px-2 bg-slate-900/20 py-1.5 rounded-lg border border-slate-900/50">
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            <span className="text-[9px] font-mono text-slate-400">10⁻⁴ (Dim)</span>
          </div>
          <div className="h-[1px] flex-1 mx-4 bg-slate-800 border-dashed" />
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-slate-400">10⁶ (Supergiant)</span>
            <div className="h-3 w-3 rounded-full bg-orange-400 shadow-sm" style={{ boxShadow: '0 0 8px rgba(251,146,60,0.5)' }} />
          </div>
        </div>
      </div>

      {/* Explanations */}
      <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-500 flex flex-col gap-1 font-sans">
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Hotter stars appear on the left.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <span>Cooler stars appear on the right.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18" />
          </svg>
          <span>Luminosity increases upward.</span>
        </div>
      </div>
    </div>
  );
};
