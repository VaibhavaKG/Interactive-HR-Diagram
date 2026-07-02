import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { Star, TooltipData } from '../types/star';
import { Tooltip } from './Tooltip';
import { getStellarColor } from '../utils/stellarColors';
import {
  createXScale,
  createYScale,
  getStarRadius,
  DEFAULT_MARGIN,
} from '../utils/scales';

interface HRDiagramProps {
  stars: Star[];
  allStars: Star[];
  selectedStarName: string | null;
  onSelectStar: (starName: string | null) => void;
  /** Single highlighted region (legacy compat) */
  highlightedRegion: string | null;
  /** Active overlay list (multi-region support) */
  activeOverlays: string[];
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
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const xScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);
  const yScaleRef = useRef<d3.ScaleLogarithmic<number, number> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const currentXScaleRef = useRef<any>(null);
  const currentYScaleRef = useRef<any>(null);
  const activeSelectedStarRef = useRef<string | null>(null);

  // Sync selectedStarName to ref
  useEffect(() => {
    activeSelectedStarRef.current = selectedStarName;
  }, [selectedStarName]);

  // Handle resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width } = entries[0].contentRect;
      setDimensions({
        width: Math.max(width, 400),
        height: Math.max(window.innerHeight - 280, 450),
      });
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // ── Main D3 setup effect ─────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = DEFAULT_MARGIN;
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Defs: glow filter + clip path
    const defs = svg.append('defs');

    const glowFilter = defs.append('filter')
      .attr('id', 'star-glow')
      .attr('x', '-80%').attr('y', '-80%')
      .attr('width', '260%').attr('height', '260%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    glowFilter.append('feMerge').selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter().append('feMergeNode').attr('in', (d) => d);

    defs.append('clipPath').attr('id', 'plot-clip')
      .append('rect').attr('width', width).attr('height', height);

    // Scales
    const xScale = createXScale(width);
    const yScale = createYScale(height);
    xScaleRef.current = xScale;
    yScaleRef.current = yScale;
    currentXScaleRef.current = xScale;
    currentYScaleRef.current = yScale;

    // Main group
    const mainGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Layer groups (order matters for z-stacking)
    const gridGroup = mainGroup.append('g').attr('class', 'grid-lines opacity-10');
    const xAxisGroup = mainGroup.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`);
    const yAxisGroup = mainGroup.append('g').attr('class', 'y-axis');
    const highlightGroup = mainGroup.append('g').attr('class', 'region-highlights').attr('clip-path', 'url(#plot-clip)');
    const labelGroup = mainGroup.append('g').attr('class', 'evolutionary-labels').attr('clip-path', 'url(#plot-clip)');
    const plotGroup = mainGroup.append('g').attr('class', 'plot-stars').attr('clip-path', 'url(#plot-clip)');
    const selectionGroup = mainGroup.append('g').attr('class', 'selection-highlight').attr('clip-path', 'url(#plot-clip)');

    // ── Subtle background region labels ────────────────────────────
    const drawSubtleLabels = (currX: any, currY: any) => {
      labelGroup.selectAll('*').remove();
      const labels = [
        { text: 'Main Sequence', x: currX(8000), y: currY(10), rotate: -32 },
        { text: 'Supergiants', x: currX(6000), y: currY(150000), rotate: 0 },
        { text: 'Giants', x: currX(4000), y: currY(200), rotate: 0 },
        { text: 'White Dwarfs', x: currX(16000), y: currY(0.0008), rotate: 0 },
      ];
      labels.forEach(({ text, x, y, rotate }) => {
        labelGroup.append('text')
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
          .text(text.toUpperCase());
      });
    };

    // ── Region overlay drawing ─────────────────────────────────────
    const drawRegionOverlays = (currX: any, currY: any, overlays: string[]) => {
      highlightGroup.selectAll('*').remove();
      if (!overlays.length) return;

      const regionDefs: Record<string, { type: 'rect' | 'polygon'; color: string; data: any }> = {
        'Supergiants': {
          type: 'rect',
          color: '#f43f5e',
          data: { x1: currX(40000), x2: currX(2000), y1: currY(2000000), y2: currY(10000) },
        },
        'Giants': {
          type: 'rect',
          color: '#fb923c',
          data: { x1: currX(6500), x2: currX(3000), y1: currY(5000), y2: currY(10) },
        },
        'White Dwarfs': {
          type: 'rect',
          color: '#cbd5e1',
          data: { x1: currX(25000), x2: currX(6000), y1: currY(0.02), y2: currY(0.00001) },
        },
        'Main Sequence': {
          type: 'polygon',
          color: '#06b6d4',
          data: [
            [currX(40000), currY(1000000)],
            [currX(15000), currY(10000)],
            [currX(6000), currY(10)],
            [currX(2500), currY(0.00001)],
            [currX(2000), currY(0.00001)],
            [currX(3500), currY(0.02)],
            [currX(10000), currY(500)],
            [currX(30000), currY(50000)],
          ],
        },
      };

      overlays.forEach((regionName) => {
        const def = regionDefs[regionName];
        if (!def) return;

        if (def.type === 'rect') {
          const { x1, x2, y1, y2 } = def.data;
          highlightGroup.append('rect')
            .attr('x', x1).attr('y', y1)
            .attr('width', x2 - x1).attr('height', y2 - y1)
            .attr('fill', def.color).attr('fill-opacity', 0.06)
            .attr('stroke', def.color).attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '5 4').attr('stroke-opacity', 0.4);
        } else {
          const points = def.data.map((p: number[]) => p.join(',')).join(' ');
          highlightGroup.append('polygon')
            .attr('points', points)
            .attr('fill', def.color).attr('fill-opacity', 0.05)
            .attr('stroke', def.color).attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '5 4').attr('stroke-opacity', 0.35);
        }
      });
    };

    // ── Axes ───────────────────────────────────────────────────────
    const updateAxes = (currX: any, currY: any) => {
      xAxisGroup.call(
        d3.axisBottom(currX).ticks(8).tickFormat((d) => `${d3.format(',')(+d)}`)
      );
      yAxisGroup.call(
        d3.axisLeft(currY).ticks(10, '~e').tickFormat((d) => {
          const v = Number(d);
          if (v === 1) return '1';
          if (v >= 1e6) return '10⁶';
          if (v >= 1e3) return '10³';
          if (v >= 1e2) return '10²';
          if (v >= 10) return '10¹';
          if (v <= 1e-4) return '10⁻⁴';
          if (v <= 1e-3) return '10⁻³';
          if (v <= 0.01) return '10⁻²';
          return `${v}`;
        })
      );

      gridGroup.selectAll('*').remove();
      gridGroup.append('g').call(d3.axisBottom(currX).tickSize(height).tickFormat(() => ''));
      gridGroup.append('g').call(d3.axisLeft(currY).tickSize(-width).tickFormat(() => ''));
    };

    // ── Selection ring ─────────────────────────────────────────────
    const updatePulseRing = (currX: any, currY: any) => {
      selectionGroup.selectAll('*').remove();
      const name = activeSelectedStarRef.current;
      if (!name) return;
      const star = allStars.find((s) => s.name === name);
      if (!star) return;

      const cx = currX(star.temperature);
      const cy = currY(star.luminosity);
      const r = getStarRadius(star.luminosity);

      selectionGroup.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', r * 2.6)
        .attr('fill', 'none')
        .attr('stroke', '#22d3ee').attr('stroke-width', 2)
        .attr('class', 'animate-ping').attr('opacity', 0.7);

      selectionGroup.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', r * 1.5)
        .attr('fill', 'none')
        .attr('stroke', '#22d3ee').attr('stroke-width', 1.5)
        .attr('opacity', 0.9);
    };

    // ── Zoom behaviour ─────────────────────────────────────────────
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 40])
      .extent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        const { transform } = event;
        setZoomLevel(transform.k);

        const newX = transform.rescaleX(xScale);
        const newY = transform.rescaleY(yScale);
        currentXScaleRef.current = newX;
        currentYScaleRef.current = newY;

        plotGroup.selectAll<SVGCircleElement, Star>('.star-point')
          .attr('cx', (d) => newX(d.temperature))
          .attr('cy', (d) => newY(d.luminosity));

        updatePulseRing(newX, newY);
        updateAxes(newX, newY);
        drawSubtleLabels(newX, newY);
        // Re-draw overlays with updated scales using current global active overlays
        drawRegionOverlays(newX, newY, (window as any).__hrActiveOverlays ?? []);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // ── Star data-join update function ─────────────────────────────
    (window as any).updateHRDiagramPoints = (newStars: Star[]) => {
      const cX = currentXScaleRef.current;
      const cY = currentYScaleRef.current;

      const items = plotGroup.selectAll<SVGCircleElement, Star>('.star-point')
        .data(newStars, (d) => d.name);

      items.exit()
        .transition().duration(350)
        .attr('opacity', 0).attr('r', 0)
        .remove();

      const entering = items.enter()
        .append('circle')
        .attr('class', 'star-point cursor-crosshair')
        .attr('cx', (d) => cX(d.temperature))
        .attr('cy', (d) => cY(d.luminosity))
        .attr('r', (d) => getStarRadius(d.luminosity))
        .attr('fill', (d) => getStellarColor(d.temperature))
        .attr('opacity', 0);

      entering
        .on('mouseover', function (event, d) {
          d3.select(this).raise()
            .transition().duration(80)
            .attr('r', getStarRadius(d.luminosity) * 1.55)
            .style('filter', 'url(#star-glow)');
          setTooltip({ star: d, x: event.clientX, y: event.clientY });
        })
        .on('mousemove', function (event) {
          setTooltip((prev) => prev ? { ...prev, x: event.clientX, y: event.clientY } : null);
        })
        .on('mouseleave', function (_e, d) {
          d3.select(this)
            .transition().duration(130)
            .attr('r', getStarRadius(d.luminosity))
            .style('filter', null);
          setTooltip(null);
        })
        .on('click', function (_e, d) {
          onSelectStar(d.name);
        });

      entering.transition().duration(550).attr('opacity', 0.85);

      // Update existing star positions (when filters change)
      items
        .attr('cx', (d) => cX(d.temperature))
        .attr('cy', (d) => cY(d.luminosity))
        .on('click', function (_e, d) { onSelectStar(d.name); });
    };

    // ── Reset view handler ─────────────────────────────────────────
    (window as any).resetHRDiagramView = () => {
      onSelectStar(null);
      svg.transition().duration(750).ease(d3.easeCubicOut)
        .call(zoom.transform, d3.zoomIdentity);
    };

    // ── Initial render ─────────────────────────────────────────────
    updateAxes(xScale, yScale);
    drawSubtleLabels(xScale, yScale);
    drawRegionOverlays(xScale, yScale, (window as any).__hrActiveOverlays ?? []);
    (window as any).updateHRDiagramPoints(stars);

  }, [dimensions, allStars]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Update stars when filter list changes ─────────────────────────
  useEffect(() => {
    if ((window as any).updateHRDiagramPoints) {
      (window as any).updateHRDiagramPoints(stars);
    }
  }, [stars]);

  // ── Update overlays when activeOverlays changes ───────────────────
  useEffect(() => {
    (window as any).__hrActiveOverlays = activeOverlays;

    if (svgRef.current && currentXScaleRef.current && currentYScaleRef.current) {
      const cX = currentXScaleRef.current;
      const cY = currentYScaleRef.current;
      const svg = d3.select(svgRef.current);
      const highlightGroup = svg.select<SVGGElement>('.region-highlights');
      highlightGroup.selectAll('*').remove();

      if (!activeOverlays.length) return;

      const regionDefs: Record<string, { type: 'rect' | 'polygon'; color: string; data: any }> = {
        'Supergiants': { type: 'rect', color: '#f43f5e', data: { x1: cX(40000), x2: cX(2000), y1: cY(2000000), y2: cY(10000) } },
        'Giants':      { type: 'rect', color: '#fb923c', data: { x1: cX(6500),  x2: cX(3000), y1: cY(5000),    y2: cY(10)    } },
        'White Dwarfs':{ type: 'rect', color: '#cbd5e1', data: { x1: cX(25000), x2: cX(6000), y1: cY(0.02),    y2: cY(0.00001) } },
        'Main Sequence':{ type: 'polygon', color: '#06b6d4', data: [
          [cX(40000), cY(1000000)], [cX(15000), cY(10000)], [cX(6000), cY(10)],
          [cX(2500), cY(0.00001)], [cX(2000), cY(0.00001)], [cX(3500), cY(0.02)],
          [cX(10000), cY(500)],    [cX(30000), cY(50000)],
        ]},
      };

      activeOverlays.forEach((name) => {
        const def = regionDefs[name];
        if (!def) return;
        if (def.type === 'rect') {
          const { x1, x2, y1, y2 } = def.data;
          highlightGroup.append('rect')
            .attr('x', x1).attr('y', y1)
            .attr('width', x2 - x1).attr('height', y2 - y1)
            .attr('fill', def.color).attr('fill-opacity', 0.06)
            .attr('stroke', def.color).attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '5 4').attr('stroke-opacity', 0.4);
        } else {
          const pts = def.data.map((p: number[]) => p.join(',')).join(' ');
          highlightGroup.append('polygon')
            .attr('points', pts)
            .attr('fill', def.color).attr('fill-opacity', 0.05)
            .attr('stroke', def.color).attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '5 4').attr('stroke-opacity', 0.35);
        }
      });
    }
  }, [activeOverlays]);

  // ── Auto-zoom to selected star ────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current || !xScaleRef.current || !yScaleRef.current || !zoomRef.current) {
      if (!selectedStarName && svgRef.current) {
        d3.select(svgRef.current).select('.selection-highlight').selectAll('*').remove();
      }
      return;
    }
    if (!selectedStarName) {
      d3.select(svgRef.current).select('.selection-highlight').selectAll('*').remove();
      return;
    }

    const star = allStars.find((s) => s.name === selectedStarName);
    if (!star) return;

    const margin = DEFAULT_MARGIN;
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const zoomFactor = 14;
    const x = xScaleRef.current(star.temperature);
    const y = yScaleRef.current(star.luminosity);
    const tx = width / 2 - x * zoomFactor;
    const ty = height / 2 - y * zoomFactor;

    d3.select(svgRef.current)
      .transition().duration(1100).ease(d3.easeCubicInOut)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(zoomFactor));

  }, [selectedStarName, allStars, dimensions]);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-slate-950/20 border border-slate-800/50 rounded-xl overflow-hidden shadow-inner"
    >
      {/* HUD overlay — top left */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex flex-col gap-0.5 font-mono text-[9px] text-slate-500 bg-slate-950/80 px-2.5 py-2 rounded-lg border border-slate-800/60 backdrop-blur leading-tight">
          <span>ZOOM <span className="text-cyan-400 font-bold ml-1">{zoomLevel.toFixed(1)}×</span></span>
          <span>STARS <span className="text-emerald-400 font-bold ml-1">{stars.length.toLocaleString()}</span></span>
        </div>
      </div>

      {/* Reset button — top right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => { (window as any).resetHRDiagramView?.(); }}
          title="Reset zoom to default view"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800/60 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow cursor-pointer active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
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
          className="max-w-full max-h-full select-none"
          aria-label="Hertzsprung-Russell Diagram"
          role="img"
        />

        {/* X-axis label */}
        <div
          className="absolute font-mono font-bold tracking-wider text-[10px] uppercase text-slate-500 pointer-events-none"
          style={{
            bottom: '18px',
            left: `${dimensions.width / 2}px`,
            transform: 'translateX(-50%)',
          }}
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

      {/* Floating tooltip */}
      <Tooltip data={tooltip} />
    </div>
  );
};
