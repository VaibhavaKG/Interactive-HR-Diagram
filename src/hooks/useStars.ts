import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { Star, LoadingState, UseStarsReturn } from '../types/star';

const DATA_URL = `${import.meta.env.BASE_URL}data/stars.csv`;

export function useStars(): UseStarsReturn {
  const [stars, setStars] = useState<Star[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingState('loading');

    d3.csv(DATA_URL, (d) => {
      if (!d.name || !d.temperature || !d.luminosity) return null;
      const temp = +d.temperature;
      const lum = +d.luminosity;
      if (!isFinite(temp) || !isFinite(lum) || temp <= 0 || lum <= 0) return null;

      return {
        name: d.name,
        temperature: temp,
        luminosity: lum,
        spectral_type: d.spectral_type || 'Unknown',
        distance: d.distance ? +d.distance : 0,
        magnitude: d.magnitude ? +d.magnitude : 0,
      } as Star;
    })
      .then((data) => {
        const cleanData = data.filter((d): d is Star => d !== null);
        setStars(cleanData);
        setLoadingState('success');
      })
      .catch((err) => {
        console.error('Error loading stars CSV:', err);
        setError(`Failed to load dataset from: ${DATA_URL}`);
        setLoadingState('error');
      });
  }, []);

  return { stars, loadingState, error };
}
