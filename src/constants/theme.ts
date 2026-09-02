import { METRICS } from './report';

/**
 * Design system color tokens for charts and visualization surfaces.
 * Replaces hardcoded hex codes with semantic theme variables.
 */
export const CHART_PALETTE: Record<string, string> = {
  [METRICS.SESSIONS]: '#6366f1', // Indigo 500
  [METRICS.REVENUE]: '#10b981',  // Emerald 500
  [METRICS.CONVERSIONS]: '#3b82f6', // Blue 500
  [METRICS.BOUNCE_RATE]: '#f59e0b', // Amber 500
};

export const CHART_THEME = {
  text: {
    primary: '#0f172a',    // Slate 900
    secondary: '#475569',  // Slate 600
    muted: '#64748b',      // Slate 500
    highlight: '#1e293b',  // Slate 800
    accent: '#f59e0b',     // Amber 500 (ratio metric)
  },
  grid: {
    line: '#f1f5f9',       // Slate 100
    axis: '#cbd5e1',       // Slate 300
  },
  tooltip: {
    background: '#ffffff',
    border: '#e2e8f0',     // Slate 200
    shadowColor: 'rgba(0, 0, 0, 0.06)',
  },
  plot: {
    borderRadius: 4,
    lineWidth: 2.5,
    markerRadius: 4,
  },
} as const;
