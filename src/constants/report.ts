/**
 * Single source of truth for all domain constants.
 * Eliminates magic strings across the codebase and prevents typos.
 */

export const DIMENSIONS = {
  DATE: 'date',
  COUNTRY: 'country',
  DEVICE: 'device',
  CHANNEL: 'channel',
  CAMPAIGN: 'campaign',
} as const;

export const METRICS = {
  SESSIONS: 'sessions',
  REVENUE: 'revenue',
  CONVERSIONS: 'conversions',
  BOUNCE_RATE: 'bounceRate',
} as const;

export const OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not-equals',
  BETWEEN: 'between',
} as const;

export const VIEW_MODES = {
  BOTH: 'both',
  CHART: 'chart',
  TABLE: 'table',
} as const;

export const DIMENSION_PRESETS = {
  [DIMENSIONS.COUNTRY]: ['US', 'UK', 'FR', 'DE'],
  [DIMENSIONS.DEVICE]: ['desktop', 'mobile'],
  [DIMENSIONS.CHANNEL]: ['organic', 'paid', 'social'],
  [DIMENSIONS.CAMPAIGN]: ['brand_search', 'retargeting', 'social_promo', 'eu_awareness'],
} as const;

export const DATE_CONFIG = {
  MIN_DATE: '2026-06-01',
  MAX_DATE: '2026-06-05',
  DEFAULT_START_DATE: '2026-06-01',
  DEFAULT_END_DATE: '2026-06-05',
  DEFAULT_DATE_RANGE: ['2026-06-01', '2026-06-05'] as [string, string],
  BENCHMARK_COUNTRY: 'US',
} as const;

export const DATE_PRESETS = DATE_CONFIG;
