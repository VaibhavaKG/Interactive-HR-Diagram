import React from 'react';
import type { StellarStats } from '../types/star';
import { formatTemperature, formatLuminosity } from '../utils/scales';

interface StatisticsPanelProps {
  stats: StellarStats;
  totalCount: number;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats, totalCount }) => {
  const visiblePercent = totalCount > 0 ? ((stats.visibleCount / totalCount) * 100).toFixed(1) : '0';

  return (
    <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4 flex flex-col gap-3.5 backdrop-blur shadow-inner">
      <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-1.5 flex items-center justify-between">
        <span>Live Catalog Telemetry</span>
        <span className="text-[9px] font-normal text-slate-500 font-sans uppercase">Active Filters</span>
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Visible Count */}
        <div className="rounded-lg bg-slate-900/40 p-2.5 border border-slate-900">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Visible Cohort</div>
          <div className="font-mono text-base font-bold text-cyan-400 mt-0.5">
            {stats.visibleCount.toLocaleString()}
          </div>
          <div className="text-[8px] text-slate-600 font-mono mt-0.5">
            {visiblePercent}% of total
          </div>
        </div>

        {/* Most Common Class */}
        <div className="rounded-lg bg-slate-900/40 p-2.5 border border-slate-900">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Dominant Class</div>
          <div className="font-mono text-base font-bold text-indigo-400 mt-0.5">
            {stats.mostCommonSpectralClass}
          </div>
          <div className="text-[8px] text-slate-600 font-mono mt-0.5">
            By density mode
          </div>
        </div>

        {/* Average Temperature */}
        <div className="rounded-lg bg-slate-900/40 p-2.5 border border-slate-900 col-span-2">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Average Temp (Mean)</div>
          <div className="font-mono text-sm font-bold text-slate-200 mt-0.5">
            {stats.avgTemperature > 0 ? formatTemperature(stats.avgTemperature) : '0 K'}
          </div>
        </div>

        {/* Average Luminosity */}
        <div className="rounded-lg bg-slate-900/40 p-2.5 border border-slate-900 col-span-2">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Average Luminosity (Mean)</div>
          <div className="font-mono text-sm font-bold text-slate-200 mt-0.5">
            {stats.avgLuminosity > 0 ? formatLuminosity(stats.avgLuminosity) : '0 L☉'}
          </div>
        </div>

        {/* Average Distance */}
        <div className="rounded-lg bg-slate-900/40 p-2.5 border border-slate-900 col-span-2">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Average Distance (Mean)</div>
          <div className="font-mono text-sm font-bold text-slate-200 mt-0.5">
            {stats.avgDistance > 0 ? `${stats.avgDistance.toLocaleString()} ly` : '0 ly'}
          </div>
        </div>
      </div>
    </div>
  );
};
