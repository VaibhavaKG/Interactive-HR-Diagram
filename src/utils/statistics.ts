import type { Star, StellarStats } from '../types/star';
import { getSpectralClass } from './filtering';

/**
 * Calculates live telemetry statistics for a given array of visible stars.
 */
export function calculateStats(visibleStars: Star[]): StellarStats {
  const count = visibleStars.length;
  if (count === 0) {
    return {
      visibleCount: 0,
      avgTemperature: 0,
      avgLuminosity: 0,
      avgDistance: 0,
      mostCommonSpectralClass: 'N/A',
    };
  }

  let totalTemp = 0;
  let totalLum = 0;
  let totalDist = 0;
  const classCounts: Record<string, number> = {
    O: 0, B: 0, A: 0, F: 0, G: 0, K: 0, M: 0,
  };

  for (let i = 0; i < count; i++) {
    const star = visibleStars[i];
    totalTemp += star.temperature;
    totalLum += star.luminosity;
    totalDist += star.distance;

    const specClass = getSpectralClass(star.spectral_type);
    if (specClass in classCounts) {
      classCounts[specClass]++;
    }
  }

  const avgTemp = Math.round(totalTemp / count);
  const avgLum = parseFloat((totalLum / count).toFixed(2));
  const avgDist = Math.round(totalDist / count);

  // Find the modal class
  let maxCount = -1;
  let mostCommon = 'N/A';
  
  for (const [cls, num] of Object.entries(classCounts)) {
    if (num > maxCount) {
      maxCount = num;
      mostCommon = cls;
    }
  }

  return {
    visibleCount: count,
    avgTemperature: avgTemp,
    avgLuminosity: avgLum,
    avgDistance: avgDist,
    mostCommonSpectralClass: mostCommon,
  };
}
