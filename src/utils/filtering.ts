import type { Star, FilterState } from '../types/star';

export const DEFAULT_FILTERS: FilterState = {
  spectralClasses: ['O', 'B', 'A', 'F', 'G', 'K', 'M'],
  luminosityClasses: ['I', 'II', 'III', 'IV', 'V'],
  maxDistance: 1000,
  magnitudeRange: [-2, 15],
  highlightedRegion: null,
  activeOverlays: [],
};

/**
 * Helper to parse the luminosity class of a star from its spectral type string.
 */
export function getLuminosityClass(spectralType: string): string {
  if (spectralType.startsWith('DA')) return 'V'; // Group White Dwarfs with Dwarfs/Main Sequence V for simplicity
  if (spectralType.includes('Ia') || spectralType.includes('Ib')) return 'I';
  if (spectralType.includes('II') && !spectralType.includes('III')) return 'II';
  if (spectralType.includes('III')) return 'III';
  if (spectralType.includes('IV')) return 'IV';
  if (spectralType.includes('V')) return 'V';
  
  // Fallback for single 'I' roman numeral
  if (/\bI\b/.test(spectralType)) return 'I';
  
  return 'V'; // Default to main sequence/dwarf V
}

/**
 * Helper to parse the primary spectral class letter of a star.
 */
export function getSpectralClass(spectralType: string): string {
  if (spectralType.startsWith('DA')) return 'A'; // White dwarfs (DA) have hydrogen lines, historically A-like temperature
  const firstChar = spectralType.charAt(0).toUpperCase();
  return ['O', 'B', 'A', 'F', 'G', 'K', 'M'].includes(firstChar) ? firstChar : 'G';
}

/**
 * Filter predicate to check if a star matches the active FilterState.
 */
export function filterStars(stars: Star[], filters: FilterState): Star[] {
  return stars.filter((star) => {
    // 1. Spectral Class Filter
    const specClass = getSpectralClass(star.spectral_type);
    if (!filters.spectralClasses.includes(specClass)) {
      return false;
    }

    // 2. Luminosity Class Filter
    const lumClass = getLuminosityClass(star.spectral_type);
    if (!filters.luminosityClasses.includes(lumClass)) {
      return false;
    }

    // 3. Distance Filter
    if (star.distance > filters.maxDistance) {
      return false;
    }

    // 4. Apparent Magnitude Filter
    const [minMag, maxMag] = filters.magnitudeRange;
    if (star.magnitude < minMag || star.magnitude > maxMag) {
      return false;
    }

    // 5. Region Highlight Filter (if active, we can show everything, but we highlight the region. 
    // In terms of filtering, we don't hide other stars unless we want to, but the prompt says 
    // "Allow users to toggle visibility of Main Sequence, Giants, Supergiants, White Dwarfs. For Phase 2: Use transparent overlay regions. No educational panel yet. Just visual highlighting."
    // So visual highlighting means the other stars are still visible, but the selected region is highlighted. 
    // Thus we don't filter out stars based on highlightedRegion, we just pass this information to the diagram.)

    return true;
  });
}

/**
 * Parses URLSearchParams into a FilterState object.
 */
export function deserializeFilters(params: URLSearchParams): FilterState {
  const spectral = params.get('spectral');
  const luminosity = params.get('luminosity');
  const distance = params.get('distance');
  const magnitude = params.get('magnitude');
  const region = params.get('region');
  const overlays = params.get('overlays');

  return {
    spectralClasses: spectral ? spectral.split(',') : DEFAULT_FILTERS.spectralClasses,
    luminosityClasses: luminosity ? luminosity.split(',') : DEFAULT_FILTERS.luminosityClasses,
    maxDistance: distance ? Number(distance) : DEFAULT_FILTERS.maxDistance,
    magnitudeRange: magnitude
      ? (magnitude.split(',').map(Number) as [number, number])
      : DEFAULT_FILTERS.magnitudeRange,
    highlightedRegion: region || DEFAULT_FILTERS.highlightedRegion,
    activeOverlays: overlays ? overlays.split(',').filter(Boolean) : DEFAULT_FILTERS.activeOverlays,
  };
}

/**
 * Serializes FilterState into a URLSearchParams-compatible query string.
 */
export function serializeFilters(filters: FilterState): string {
  const params = new URLSearchParams();

  // Only append if they differ from defaults, keeping URL clean
  if (JSON.stringify(filters.spectralClasses) !== JSON.stringify(DEFAULT_FILTERS.spectralClasses)) {
    params.set('spectral', filters.spectralClasses.join(','));
  }
  if (JSON.stringify(filters.luminosityClasses) !== JSON.stringify(DEFAULT_FILTERS.luminosityClasses)) {
    params.set('luminosity', filters.luminosityClasses.join(','));
  }
  if (filters.maxDistance !== DEFAULT_FILTERS.maxDistance) {
    params.set('distance', filters.maxDistance.toString());
  }
  if (JSON.stringify(filters.magnitudeRange) !== JSON.stringify(DEFAULT_FILTERS.magnitudeRange)) {
    params.set('magnitude', filters.magnitudeRange.join(','));
  }
  if (filters.highlightedRegion !== DEFAULT_FILTERS.highlightedRegion) {
    params.set('region', filters.highlightedRegion || '');
  }
  if (filters.activeOverlays.length > 0) {
    params.set('overlays', filters.activeOverlays.join(','));
  }

  const queryStr = params.toString();
  return queryStr ? `?${queryStr}` : '';
}
