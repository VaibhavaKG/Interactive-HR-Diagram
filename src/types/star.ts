export interface Star {
  name: string;
  temperature: number;  // Kelvin
  luminosity: number;   // Solar luminosities (L☉)
  spectral_type: string;
  distance: number;      // light years
  magnitude: number;     // apparent magnitude
}

export interface TooltipData {
  star: Star;
  x: number;
  y: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface UseStarsReturn {
  stars: Star[];
  loadingState: LoadingState;
  error: string | null;
}

export interface FilterState {
  spectralClasses: string[];        // e.g., ['O', 'B', 'A', 'F', 'G', 'K', 'M']
  luminosityClasses: string[];      // e.g., ['I', 'II', 'III', 'IV', 'V']
  maxDistance: number;              // light years, up to 1000
  magnitudeRange: [number, number]; // [minMagnitude, maxMagnitude]
  activeOverlays: string[];         // e.g., ['Main Sequence', 'Giants', 'Supergiants', 'White Dwarfs']
}

export interface StellarStats {
  visibleCount: number;
  avgTemperature: number;
  avgLuminosity: number;
  avgDistance: number;
  mostCommonSpectralClass: string;
}
