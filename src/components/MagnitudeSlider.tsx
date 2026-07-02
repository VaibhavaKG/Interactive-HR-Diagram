import React from 'react';

interface MagnitudeSliderProps {
  value: [number, number]; // [min, max]
  onChange: (value: [number, number]) => void;
}

export const MagnitudeSlider: React.FC<MagnitudeSliderProps> = ({ value, onChange }) => {
  const minLimit = -2;
  const maxLimit = 15;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minVal = Math.min(Number(e.target.value), value[1] - 1);
    onChange([minVal, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxVal = Math.max(Number(e.target.value), value[0] + 1);
    onChange([value[0], maxVal]);
  };

  // Calculate percentage positions for the slider highlight track
  const getPercent = (val: number) => {
    return ((val - minLimit) / (maxLimit - minLimit)) * 100;
  };

  const minPercent = getPercent(value[0]);
  const maxPercent = getPercent(value[1]);

  return (
    <div className="flex flex-col gap-2 bg-slate-900/30 p-3 rounded-lg border border-slate-900/60">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Apparent Magnitude</span>
        <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">
          {value[0] > 0 ? `+${value[0]}` : value[0]} → {value[1] > 0 ? `+${value[1]}` : value[1]}
        </span>
      </div>

      {/* Custom Double Range Slider Container */}
      <div className="relative w-full h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute left-0 right-0 h-1 rounded bg-slate-800" />
        
        {/* Active Range Highlight */}
        <div
          className="absolute h-1 rounded bg-cyan-500"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* Min Input Slider */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={1}
          value={value[0]}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer focus:outline-none pointer-events-none accent-cyan-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
          style={{ zIndex: value[0] > maxLimit - 5 ? 5 : 3 }}
        />

        {/* Max Input Slider */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={1}
          value={value[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer focus:outline-none pointer-events-none accent-cyan-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between text-[9px] font-mono text-slate-500">
        <span>-2 (Very Bright)</span>
        <span>Human Eye Limit (~6)</span>
        <span>+15 (Very Dim)</span>
      </div>
    </div>
  );
};
