import { useState, useEffect, useCallback } from 'react';
import type { FilterState } from '../types/star';
import { DEFAULT_FILTERS, deserializeFilters, serializeFilters } from '../utils/filtering';

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Initialize filters from URL on page mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsedFilters = deserializeFilters(params);
    setFilters(parsedFilters);
  }, []);

  // Update URL parameters when filters change
  const setFiltersAndUrl = useCallback((nextFilters: FilterState | ((prev: FilterState) => FilterState)) => {
    setFilters((prev) => {
      const resolved = typeof nextFilters === 'function' ? nextFilters(prev) : nextFilters;
      const query = serializeFilters(resolved);
      const newUrl = window.location.pathname + query;
      window.history.replaceState(null, '', newUrl);
      return resolved;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersAndUrl(DEFAULT_FILTERS);
  }, [setFiltersAndUrl]);

  return {
    filters,
    setFilters: setFiltersAndUrl,
    resetFilters,
  };
}
