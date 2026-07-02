import React from 'react';

interface OverlayToggleProps {
  activeOverlays: string[];
  onChangeOverlays: (overlays: string[]) => void;
}

export const OverlayToggle: React.FC<OverlayToggleProps> = ({
  activeOverlays,
  onChangeOverlays,
}) => {
  const overlays = [
    { value: 'Main Sequence', label: 'Main Sequence' },
    { value: 'Giants', label: 'Giants' },
    { value: 'Supergiants', label: 'Supergiants' },
    { value: 'White Dwarfs', label: 'White Dwarfs' },
  ];

  const handleToggle = (value: string) => {
    const nextOverlays = activeOverlays.includes(value)
      ? activeOverlays.filter((x) => x !== value)
      : [...activeOverlays, value];
    onChangeOverlays(nextOverlays);
  };

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {overlays.map((overlay) => {
        const isChecked = activeOverlays.includes(overlay.value);
        return (
          <label
            key={overlay.value}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded border text-xs font-medium cursor-pointer transition-all ${
              isChecked
                ? 'bg-indigo-950/20 border-indigo-900/50 text-indigo-300 font-semibold'
                : 'bg-slate-900/10 border-slate-950 text-slate-500 hover:border-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleToggle(overlay.value)}
              className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
            />
            <span className="font-mono text-[11px]">{overlay.label}</span>
          </label>
        );
      })}
    </div>
  );
};
