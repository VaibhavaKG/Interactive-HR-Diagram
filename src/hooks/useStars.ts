import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { Star, LoadingState, UseStarsReturn } from '../types/star';

export function useStars(): UseStarsReturn {
  const [stars, setStars] = useState<Star[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingState('loading');
    
    // Fetch and parse the CSV file from the public directory
    d3.csv('/data/stars.csv', (d) => {
      // Custom mapping and type casting for the columns
      if (!d.name || !d.temperature || !d.luminosity) return null;
      
      return {
        name: d.name,
        temperature: +d.temperature,
        luminosity: +d.luminosity,
        spectral_type: d.spectral_type || 'Unknown',
        distance: d.distance ? +d.distance : 0,
        magnitude: d.magnitude ? +d.magnitude : 0,
      } as Star;
    })
      .then((data) => {
        // Filter out null/invalid entries
        const cleanData = data.filter((d): d is Star => d !== null);
        setStars(cleanData);
        setLoadingState('success');
      })
      .catch((err) => {
        console.error('Error loading stars CSV:', err);
        setError('Failed to load stellar observational dataset.');
        setLoadingState('error');
      });
  }, []);

  return { stars, loadingState, error };
}
