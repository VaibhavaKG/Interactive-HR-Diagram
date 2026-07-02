import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Star } from '../types/star';

export function useSearch(
  allStars: Star[],
  selectedStarName: string | null,
  onSelectStar: (starName: string | null) => void
) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Sync query when selectedStarName is changed externally (like clicking a star in the diagram)
  useEffect(() => {
    if (selectedStarName) {
      setQuery(selectedStarName);
    } else {
      setQuery('');
    }
  }, [selectedStarName]);

  const suggestions = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return [];

    // If query matches the selected star name exactly, no suggestions needed
    if (selectedStarName && trimmed.toLowerCase() === selectedStarName.toLowerCase()) {
      return [];
    }

    return allStars
      .filter((star) => star.name.toLowerCase().includes(trimmed.toLowerCase()))
      .slice(0, 8); // Limit suggestions list to 8
  }, [query, allStars, selectedStarName]);

  // Reset focus index when suggestions change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [suggestions]);

  const selectStar = useCallback((starName: string | null) => {
    onSelectStar(starName);
    setIsOpen(false);
  }, [onSelectStar]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
          selectStar(suggestions[focusedIndex].name);
        } else if (suggestions.length > 0) {
          selectStar(suggestions[0].name); // Select first suggestion by default
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  }, [isOpen, suggestions, focusedIndex, selectStar]);

  return {
    query,
    setQuery,
    suggestions,
    isOpen,
    setIsOpen,
    focusedIndex,
    setFocusedIndex,
    selectStar,
    handleKeyDown,
  };
}
