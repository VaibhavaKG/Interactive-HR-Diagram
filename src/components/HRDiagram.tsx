import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { Star, TooltipData } from '../types/star';
import { Tooltip } from './Tooltip';
import { getStellarColor } from '../utils/stellarColors';
import {
  createXScale,
  createYScale,
  getStarRadius,
  formatLuminosityTick,
  DEFAULT_MARGIN,
} from '../utils/scales';

interface HRDiagramProps {
  stars: Star[];
  allStars: Star[];
  selectedStarName: string | null;
  onSelectStar: (starName: string | null) => void;
  activeOverlays: string[];
}

type D3Scale = d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>;

interface RegionDef {
  type: 'rect' | 'polygon';
  color: string;
  data: { x1: number; x2: number; y1: number; y2: number } | number[][];
}

function buildRegionDefs(
  cX: (v: number) => number,
  cY: (v: number) => number
): Record<string, RegionDef> {
  return {
    Supergiants: {
      type: 'rect',
      color: '#f43f5e',
      data: { x1: cX(40000), x2: cX(2000), y1: cY(2000000), y2: cY(10000) },
    },
    Giants: {
      type: 'rect',
      color: '#fb923c',
      data: { x1: cX(6500), x2: cX(3000), y1: cY(5000), y2: cY(10) },
    },
    'White Dwarfs': {
      type: 'rect',
      color: '#cbd5e1',
      data: { x1: cX(25000), x2: cX(6000), y1: cY(0.02), y2: cY(0.00001) },
    },
    'Main Sequence': {
      type: 'polygon',
      color: '#06b6d4',
      data: [
        [cX(40000), cY(1000000)],
        [cX(15000), cY(10000)],
        [cX(6000), cY(10)],
        [cX(2500), cY(0.00001)],
        [cX(2000), cY(0.00001)],
        [cX(3500), cY(0.02)],
        [cX(10000), cY(500)],
        [cX(30000), cY(50000)],
      ],
    },
  };
}

function drawRegionOverlays(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  overlays: string[],
  cX: (v: number) => number,
  cY: (v: number) => number
) {
  group.selectAll('*').remove();
  if (!overlays.length) return;

  const defs = buildRegionDefs(cX, cY);
  overlays.forEach((name) => {
    const def = defs[name];
    if (!def) return;

    if (def.type === 'rect') {
      const { x1, x2, y1, y2 } = def.data as { x1: number; x2: number; y1: number; y2: number };
      group
        .append('rect')
        .attr('x', x1)
        .attr('y', y1)
        .attr('width', x2 - x1)
        .attr('height', y2 - y1)
        .attr('fill', def.color)
        .attr('fill-opacity', 0.06)
        .attr('stroke', def.color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5 4')
        .attr('stroke-opacity', 0.4);
    } else {
      const pts = (def.data as number[][]).map((p) => p.join(',')).join(' ');
      group
        .append('polygon')
        .attr('points', pts)
        .attr('fill', def.color)
        .attr('fill-opacity', 0.05)
        .attr('stroke', def.color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5 4')
        .attr('stroke-opacity', 0.35);
    }
  });
}

export const HRDiagram: React.FC<HRDiagramProps> = ({
  stars,
  allStars,
  selectedStarName,
  onSelectStar,
  activeOverlays,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoomLevel, setZoomLevel] = useState(1);

  // Refs to avoid stale closures in D3 callbacks
  const xScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);
  const yScaleRef = useRef<d3.ScaleLogarithmic<number, number> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const currentXRef = useRef<D3Scale | null>(null);
  const currentYRef = useRef<D3Scale | null>(null);
  const selectedStarRef = useRef<string | null>(null);
  const activeOverlaysRef = useRef<string[]>(activeOverlays);
  const onSelectStarRef = useRef(onSelectStar);

  // Keep refs in sync
  useEffect(() => { selectedStarRef.current = selectedStarName; }, [selectedStarName]);
  useEffect(() => { activeOverlaysRef.current = activeOverlays; }, [activeOverlays]);
  useEffect(() => { onSelectStarRef.current = onSelectStar; }, [onSelectStar]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width } = entries[0].contentRect;
      setDimensions({
        width: Math.max(width, 320),
        height: Math.max(window.innerHeight - 280, 400),
      });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Main D3 setup (on dimensions or allStars change) ───────────────
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = DEFAULT_MARGIN;
    const W = dimensions.width - margin.left - margin.right;
    const H = dimensions.height - margin.top - margin.bottom;

    // Defs
    const defs = svg.append('defs');
    const glowFilter = defs
      .append('filter')
      .attr('id', 'star-glow')
      .attr('x', '-80%').attr('y', '-80%')
      .attr('width', '260%').attr('height', '260%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    glowFilter
      .append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', (d) => d);

    defs.append('clipPath').attr('id', 'plot-clip')
      .append('rect').attr('width', W).attr('height', H);

    // Scales
    const xScale = createXScale(W);
    const yScale = createYScale(H);
    xScaleRef.current = xScale;
    yScaleRef.current = yScale;
    currentXRef.current = xScale;
    currentYRef.current = yScale;

    // Layer groups
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const gridGroup = g.append('g').attr('class', 'grid-lines opacity-10');
    const xAxisGroup = g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${H})`);
    const yAxisGroup = g.append('g').attr('class', 'y-axis');
    const highlightGroup = g.append('g').attr('class', 'region-highlights').attr('clip-path', 'url(#plot-clip)');
    const labelGroup = g.append('g').attr('class', 'region-labels').attr('clip-path', 'url(#plot-clip)');
    const plotGroup = g.append('g').attr('class', 'plot-stars').attr('clip-path', 'url(#plot-clip)');
    const selectionGroup = g.append('g').attr('class', 'selection-ring').attr('clip-path', 'url(#plot-clip)');

    // Helper: draw background region labels
    const drawLabels = (cX: D3Scale, cY: D3Scale) => {
      labelGroup.selectAll('*').remove();
      const cXn = cX as (v: number) => number;
      const cYn = cY as (v: number) => number;
      const labels = [
        { text: 'MAIN SEQUENCE', x: cXn(8000), y: cYn(10), rotate: -32 },
        { text: 'SUPERGIANTS',   x: cXn(6000), y: cYn(150000), rotate: 0 },
        { text: 'GIANTS',        x: cXn(4000), y: cYn(200), rotate: 0 },
        { text: 'WHITE DWARFS',  x: cXn(16000), y: cYn(0.0008), rotate: 0 },
      ];
      labels.forEach(({ text, x, y, rotate }) => {
        labelGroup
          .append('text')
          .attr('x', x).attr('y', y)
          .attr('transform', rotate ? `rotate(${rotate}, ${x}, ${y})` : '')
          .attr('text-anchor', 'middle')
          .attr('fill', '#475569')
          .attr('font-size', '10px')
          .attr('font-family', "'JetBrains Mono', monospace")
          .attr('font-weight', '600')
          .attr('letter-spacing', '0.1em')
          .attr('pointer-events', 'none')
          .attr('opacity', 0.5)
          .text(text);
      });
    };

    // Helper: draw axes + grid
    const drawAxes = (cX: D3Scale, cY: D3Scale) => {
      xAxisGroup.call(
        d3.axisBottom(cX as d3.ScaleLinear<number, number>)
          .ticks(8)
          .tickFormat((d) => `${d3.format(',')(+d)}`)
      );
      yAxisGroup.call(
        d3.axisLeft(cY as d3.ScaleLogarithmic<number, number>)
          .ticks(10, '~e')
          .tickFormat(formatLuminosityTick)
      );
      gridGroup.selectAll('*').remove();
      gridGroup.append('g').call(
        d3.axisBottom(cX as d3.ScaleLinear<number, number>).tickSize(H).tickFormat(() => '')
      );
      gridGroup.append('g').call(
        d3.axisLeft(cY as d3.ScaleLogarithmic<number, number>).tickSize(-W).tickFormat(() => '')
      );
    };

    // Helper: draw selection ring
    const drawSelectionRing = (cX: D3Scale, cY: D3Scale) => {
      selectionGroup.selectAll('*').remove();
      const name = selectedStarRef.current;
      if (!name) return;
      const star = allStars.find((s) => s.name === name);
      if (!star) return;
      const cXn = cX as (v: number) => number;
      const cYn = cY as (v: number) => number;
      const cx = cXn(star.temperature);
      const cy = cYn(star.luminosity);
      const r = getStarRadius(star.luminosity);

      selectionGroup
        .append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', r * 2.6)
        .attr('fill', 'none')
        .attr('stroke', '#22d3ee')
        .attr('stroke-width', 2)
        .attr('class', 'animate-ping')
        .attr('opacity', 0.7);

      selectionGroup
        .append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', r * 1.5)
        .attr('fill', 'none')
        .attr('stroke', '#22d3ee')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.9);
    };

    // ── Zoom ─────────────────────────────────────────────────────────
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 40])
      .extent([[0, 0], [W, H]])
      .on('zoom', (event) => {
        const { transform } = event;
        setZoomLevel(transform.k);

        const newX = transform.rescaleX(xScale);
        const newY = transform.rescaleY(yScale);
        currentXRef.current = newX;
        currentYRef.current = newY;

        plotGroup
          .selectAll<SVGCircleElement, Star>('.star-point')
          .attr('cx', (d) => newX(d.temperature))
          .attr('cy', (d) => newY(d.luminosity));

        drawSelectionRing(newX, newY);
        drawAxes(newX, newY);
        drawLabels(newX, newY);
        drawRegionOverlays(
          highlightGroup,
          activeOverlaysRef.current,
          (v) => newX(v),
          (v) => newY(v)
        );
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // ── Star data-join update function exposed via ref ────────────────
    const updateStars = (newStars: Star[]) => {
      const cX = currentXRef.current;
      const cY = currentYRef.current;
      if (!cX || !cY) return;

      const cXn = cX as (v: number) => number;
      const cYn = cY as (v: number) => number;

      const items = plotGroup
        .selectAll<SVGCircleElement, Star>('.star-point')
        .data(newStars, (d) => d.name);

      items
        .exit()
        .transition().duration(300)
        .attr('opacity', 0).attr('r', 0)
        .remove();

      const entering = items
        .enter()
        .append('circle')
        .attr('class', 'star-point cursor-crosshair')
        .attr('cx', (d) => cXn(d.temperature))
        .attr('cy', (d) => cYn(d.luminosity))
        .attr('r', (d) => getStarRadius(d.luminosity))
        .attr('fill', (d) => getStellarColor(d.temperature))
        .attr('opacity', 0);

      entering
        .on('mouseover', function (event, d) {
          d3.select(this)
            .raise()
            .transition().duration(80)
            .attr('r', getStarRadius(d.luminosity) * 1.55)
            .style('filter', 'url(#star-glow)');
          setTooltip({ star: d, x: event.clientX, y: event.clientY });
        })
        .on('mousemove', function (event) {
          setTooltip((prev) =>
            prev ? { ...prev, x: event.clientX, y: event.clientY } : null
          );
        })
        .on('mouseleave', function (_e, d) {
          d3.select(this)
            .transition().duration(130)
            .attr('r', getStarRadius(d.luminosity))
            .style('filter', null);
          setTooltip(null);
        })
        .on('click', function (_e, d) {
          onSelectStarRef.current(d.name);
        });

      entering.transition().duration(500).attr('opacity', 0.85);

      // Update existing star positions
      items
        .attr('cx', (d) => cXn(d.temperature))
        .attr('cy', (d) => cYn(d.luminosity))
        .on('click', function (_e, d) {
          onSelectStarRef.current(d.name);
        });
    };

    // Store updateStars on ref so other effects can call it
    updateStarsRef.current = updateStars;

    // Reset view
    resetViewRef.current = () => {
      onSelectStarRef.current(null);
      svg.transition().duration(750).ease(d3.easeCubicOut)
        .call(zoom.transform, d3.zoomIdentity);
    };

    // Initial render
    drawAxes(xScale, yScale);
    drawLabels(xScale, yScale);
    drawRegionOverlays(highlightGroup, activeOverlaysRef.current, (v) => xScale(v), (v) => yScale(v));
    updateStars(stars);

  }, [dimensions, allStars]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refs for cross-effect communication (instead of window hacks)
  const updateStarsRef = useRef<((s: Star[]) => void) | null>(null);
  const resetViewRef = useRef<(() => void) | null>(null);

  // Update star points when filtered stars change
  useEffect(() => {
    updateStarsRef.current?.(stars);
  }, [stars]);

  // Update overlays when activeOverlays changes
  useEffect(() => {
    if (!svgRef.current || !currentXRef.current || !currentYRef.current) return;
    const svg = d3.select(svgRef.current);
    const group = svg.select<SVGGElement>('.region-highlights');
    const cX = currentXRef.current as (v: number) => number;
    const cY = currentYRef.current as (v: number) => number;
    drawRegionOverlays(group, activeOverlays, cX, cY);
  }, [activeOverlays]);

  // Auto-zoom to selected star
  useEffect(() => {
    if (!svgRef.current) return;

    if (!selectedStarName) {
      d3.select(svgRef.current).select('.selection-ring').selectAll('*').remove();
      return;
    }

    if (!xScaleRef.current || !yScaleRef.current || !zoomRef.current) return;

    const star = allStars.find((s) => s.name === selectedStarName);
    if (!star) return;

    const margin = DEFAULT_MARGIN;
    const W = dimensions.width - margin.left - margin.right;
    const H = dimensions.height - margin.top - margin.bottom;
    const zoomFactor = 14;
    const x = xScaleRef.current(star.temperature);
    const y = yScaleRef.current(star.luminosity);
    const tx = W / 2 - x * zoomFactor;
    const ty = H / 2 - y * zoomFactor;

    d3.select(svgRef.current)
      .transition().duration(1100).ease(d3.easeCubicInOut)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(zoomFactor));
  }, [selectedStarName, allStars, dimensions]);

  // Touch: dismiss tooltip on touch outside
  const handleReset = useCallback(() => {
    resetViewRef.current?.();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-slate-950/20 border border-slate-800/50 rounded-xl overflow-hidden shadow-inner"
    >
      {/* HUD — top left */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="flex flex-col gap-0.5 font-mono text-[9px] text-slate-500 bg-slate-950/80 px-2.5 py-2 rounded-lg border border-slate-800/60 backdrop-blur leading-tight">
          <span>ZOOM <span className="text-cyan-400 font-bold ml-1">{zoomLevel.toFixed(1)}×</span></span>
          <span>STARS <span className="text-emerald-400 font-bold ml-1">{stars.length.toLocaleString()}</span></span>
        </div>
      </div>

      {/* Reset button — top right */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleReset}
          title="Reset zoom to default view"
          aria-label="Reset zoom and selection"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800/60 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow cursor-pointer active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reset
        </button>
      </div>

      {/* SVG canvas */}
      <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="max-w-full max-h-full select-none touch-none"
          aria-label="Hertzsprung-Russell Diagram: stellar temperature vs luminosity scatter plot"
          role="img"
        />

        {/* X-axis label */}
        <div
          className="absolute font-mono font-bold tracking-wider text-[10px] uppercase text-slate-500 pointer-events-none"
          style={{
            bottom: '14px',
            left: `${dimensions.width / 2}px`,
            transform: 'translateX(-50%)',
          }}
          aria-hidden="true"
        >
          Surface Temperature (K) →
        </div>

        {/* Y-axis label */}
        <div
          className="absolute font-mono font-bold tracking-wider text-[10px] uppercase text-slate-500 pointer-events-none"
          style={{
            left: '-8px',
            top: `${dimensions.height / 2}px`,
            transform: 'rotate(-90deg) translateX(-50%)',
            transformOrigin: 'left top',
            whiteSpace: 'nowrap',
          }}
          aria-hidden="true"
        >
          Luminosity (L☉) ↑
        </div>

        {/* Spectral class labels — top of plot */}
        <div
          className="absolute top-2 pointer-events-none"
          style={{
            left: `${DEFAULT_MARGIN.left}px`,
            width: `${dimensions.width - DEFAULT_MARGIN.left - DEFAULT_MARGIN.right}px`,
          }}
          aria-hidden="true"
        >
          <div className="flex justify-between font-mono text-[9px]">
            <span className="text-blue-400">O (&gt;30kK)</span>
            <span className="text-sky-300">B</span>
            <span className="text-slate-200">A</span>
            <span className="text-yellow-100">F</span>
            <span className="text-yellow-300">G</span>
            <span className="text-orange-400">K</span>
            <span className="text-red-400">M (&lt;3.5kK)</span>
          </div>
        </div>
      </div>

      <Tooltip data={tooltip} />
    </div>
  );
};
