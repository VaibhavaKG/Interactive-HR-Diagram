import React, { useEffect, useRef } from 'react';
import type { Star } from '../types/star';
import { useSearch } from '../hooks/useSearch';

interface SearchBarProps {
  stars: Star[];
  onSelectStar: (starName: string | null) => void;
  selectedStarName: string | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({ stars, onSelectStar, selectedStarName }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    suggestions,
    isOpen,
    setIsOpen,
    focusedIndex,
    setFocusedIndex,
    selectStar,
    handleKeyDown,
  } = useSearch(stars, selectedStarName, onSelectStar);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length === 0) {
      selectStar(null);
    } else {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    selectStar(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3 pointer-events-none text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          placeholder="Search by star name (e.g. Sun, Vega...)"
          className="w-full pl-8.5 pr-8 py-1.5 rounded-lg border border-slate-900 bg-slate-950/60 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 backdrop-blur shadow-inner transition-all"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded-full hover:bg-slate-900 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 z-40 max-h-56 overflow-y-auto rounded-lg border border-slate-900 bg-slate-950 py-1 shadow-2xl backdrop-blur-md font-mono text-xs">
          {suggestions.map((star, idx) => {
            const isFocused = idx === focusedIndex;
            return (
              <li
                key={star.name}
                onClick={() => selectStar(star.name)}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`flex justify-between items-center px-3 py-1.5 cursor-pointer text-slate-300 transition-colors border-l-2 ${
                  isFocused
                    ? 'bg-cyan-950/50 text-cyan-200 border-cyan-500'
                    : 'border-transparent hover:bg-slate-900/40'
                }`}
              >
                <span className="font-semibold">{star.name}</span>
                <span className="text-[9px] text-slate-500">
                  {star.spectral_type} • {star.temperature}K
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
