import * as d3 from 'd3';

export const TEMP_DOMAIN: [number, number] = [42000, 2200];  // slightly expanded — reversed (hot left)
export const LUM_DOMAIN: [number, number] = [0.00005, 2_000_000]; // log scale — expanded range

export interface DiagramMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const DEFAULT_MARGIN: DiagramMargin = {
  top: 50,
  right: 50,
  bottom: 75,
  left: 95, // wider to allow clean Y-axis tick labels
};

/**
 * Creates the x-scale (temperature, reversed linear).
 */
export function createXScale(width: number): d3.ScaleLinear<number, number> {
  return d3.scaleLinear().domain(TEMP_DOMAIN).range([0, width]);
}

/**
 * Creates the y-scale (luminosity, log scale).
 */
export function createYScale(height: number): d3.ScaleLogarithmic<number, number> {
  return d3.scaleLog().domain(LUM_DOMAIN).range([height, 0]).clamp(true);
}

/**
 * Returns the star radius based on luminosity, for visual representation.
 * Maps log luminosity to a radius between minR and maxR.
 */
export function getStarRadius(luminosity: number, minR = 1.8, maxR = 11): number {
  const logLum = Math.log10(Math.max(luminosity, 0.00005));
  const logMin = Math.log10(0.00005);
  const logMax = Math.log10(2_000_000);
  const t = (logLum - logMin) / (logMax - logMin);
  return minR + t * (maxR - minR);
}

/**
 * Formats a luminosity tick value for the Y-axis using proper superscript notation.
 * Returns empty string for non-power-of-ten values to keep labels clean.
 */
export function formatLuminosityTick(value: d3.NumberValue): string {
  const v = Number(value);
  if (v <= 0) return '';

  const exponent = Math.round(Math.log10(v));
  const roundedVal = Math.pow(10, exponent);

  // Only label clean powers of 10
  if (Math.abs(v - roundedVal) / roundedVal > 0.15) return '';

  const superscripts: Record<string, string> = {
    '-5': '⁻⁵', '-4': '⁻⁴', '-3': '⁻³', '-2': '⁻²', '-1': '⁻¹',
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷',
  };

  if (exponent === 0) return '1';
  return `10${superscripts[String(exponent)] ?? `^${exponent}`}`;
}

/**
 * Formats a luminosity value for display in tooltips/panels.
 */
export function formatLuminosity(lum: number): string {
  if (lum >= 1000) return `${lum.toLocaleString()} L☉`;
  if (lum >= 1) return `${lum.toFixed(2)} L☉`;
  return `${lum.toExponential(2)} L☉`;
}

/**
 * Formats a temperature value for display.
 */
export function formatTemperature(temp: number): string {
  return `${temp.toLocaleString()} K`;
}
