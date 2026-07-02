import React from 'react';
import type { TooltipData } from '../types/star';
import { getStellarColor } from '../utils/stellarColors';
import { formatLuminosity, formatTemperature } from '../utils/scales';

interface TooltipProps {
  data: TooltipData | null;
}

export const Tooltip: React.FC<TooltipProps> = ({ data }) => {
  if (!data) return null;

  const { star, x, y } = data;
  const starColor = getStellarColor(star.temperature);

  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-50 min-w-[180px] rounded-xl border bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-xl animate-fade-in"
      style={{
        left: x + 14,
        top: y + 14,
        borderColor: `${starColor}45`,
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.6), 0 0 20px 2px ${starColor}18`,
      }}
    >
      {/* Star name + spectral type */}
      <div className="flex items-start justify-between gap-3 mb-2.5 pb-2 border-b" style={{ borderColor: `${starColor}25` }}>
        <span className="font-mono text-xs font-bold text-white leading-tight">{star.name}</span>
        <span
          className="rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-950 flex-shrink-0"
          style={{ backgroundColor: starColor }}
        >
          {star.spectral_type}
        </span>
      </div>

      {/* Star properties grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[10px]">
        <span className="text-slate-500">Temp</span>
        <span className="text-slate-200 font-semibold text-right">{formatTemperature(star.temperature)}</span>

        <span className="text-slate-500">Luminosity</span>
        <span className="text-slate-200 font-semibold text-right">{formatLuminosity(star.luminosity)}</span>

        <span className="text-slate-500">Distance</span>
        <span className="text-slate-200 font-semibold text-right">
          {star.distance > 0 ? `${star.distance.toLocaleString()} ly` : '—'}
        </span>

        <span className="text-slate-500">Magnitude</span>
        <span className="text-slate-200 font-semibold text-right">
          {star.magnitude !== undefined ? star.magnitude.toFixed(2) : '—'}
        </span>
      </div>

      {/* Colour bar accent */}
      <div
        className="mt-2.5 h-0.5 w-full rounded-full"
        style={{ background: `linear-gradient(to right, ${starColor}, ${starColor}00)` }}
      />
    </div>
  );
};
