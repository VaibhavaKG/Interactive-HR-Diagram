/**
 * Realistic stellar color mapping based on blackbody temperature.
 * Color progression: Blue → Blue-White → White → Yellow-White → Yellow → Orange → Red
 */

interface ColorStop {
  temp: number;
  color: string;
}

const STELLAR_COLOR_STOPS: ColorStop[] = [
  { temp: 40000, color: '#9bb0ff' }, // O-type: blue
  { temp: 20000, color: '#aabfff' }, // B-type: blue-white
  { temp: 10000, color: '#cad7ff' }, // A-type: white-blue
  { temp: 7500,  color: '#f8f7ff' }, // F-type: white
  { temp: 6000,  color: '#fff4ea' }, // G-type: yellow-white
  { temp: 5000,  color: '#ffd2a1' }, // G/K-type: pale orange
  { temp: 4000,  color: '#ffbd6f' }, // K-type: orange
  { temp: 3500,  color: '#ff9d50' }, // M-type: orange-red
  { temp: 2500,  color: '#ff6030' }, // M-type cool: deep orange-red
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [255, 255, 255];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Returns a realistic stellar color hex string for a given temperature in Kelvin.
 */
export function getStellarColor(temperature: number): string {
  const stops = STELLAR_COLOR_STOPS;

  if (temperature >= stops[0].temp) return stops[0].color;
  if (temperature <= stops[stops.length - 1].temp) return stops[stops.length - 1].color;

  for (let i = 0; i < stops.length - 1; i++) {
    const upper = stops[i];
    const lower = stops[i + 1];

    if (temperature <= upper.temp && temperature >= lower.temp) {
      const t = (upper.temp - temperature) / (upper.temp - lower.temp);
      const [r1, g1, b1] = hexToRgb(upper.color);
      const [r2, g2, b2] = hexToRgb(lower.color);
      return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
    }
  }

  return '#ffffff';
}

