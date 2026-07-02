import React from 'react';

interface DistanceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const DistanceSlider: React.FC<DistanceSliderProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 bg-slate-900/30 p-3 rounded-lg border border-slate-900/60">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Stellar Distance</span>
        <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">
          &lt; {value === 1000 ? '1,000+' : value} ly
        </span>
      </div>

      <input
        type="range"
        min={10}
        max={1000}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
      />

      <div className="flex justify-between text-[9px] font-mono text-slate-500">
        <span>10 ly</span>
        <span>Local Solar Cluster</span>
        <span>1,000 ly</span>
      </div>
    </div>
  );
};
