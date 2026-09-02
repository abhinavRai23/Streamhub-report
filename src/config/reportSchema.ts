import type { Dimension, Metric, MetricDefinition } from '../types/report';
import { DIMENSIONS, METRICS, DIMENSION_PRESETS } from '../constants/report';
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters';

export const METRIC_REGISTRY: Record<Metric, MetricDefinition> = {
  [METRICS.SESSIONS]: {
    id: METRICS.SESSIONS,
    label: 'Sessions',
    description: 'Total user sessions initiated',
    unit: 'count',
    isRatio: false,
    axisType: 'primary',
    format: (val: number) => formatNumber(val),
  },
  [METRICS.REVENUE]: {
    id: METRICS.REVENUE,
    label: 'Revenue',
    description: 'Total gross revenue earned',
    unit: 'currency',
    isRatio: false,
    axisType: 'primary',
    format: (val: number) => formatCurrency(val),
  },
  [METRICS.CONVERSIONS]: {
    id: METRICS.CONVERSIONS,
    label: 'Conversions',
    description: 'Total completed target conversion events',
    unit: 'count',
    isRatio: false,
    axisType: 'primary',
    format: (val: number) => formatNumber(val),
  },
  [METRICS.BOUNCE_RATE]: {
    id: METRICS.BOUNCE_RATE,
    label: 'Bounce Rate',
    description: 'Ratio of bounces to total visits (recalculated per group)',
    unit: 'percent',
    isRatio: true,
    axisType: 'secondary',
    format: (val: number) => formatPercent(val, 1),
  },
};

export interface DimensionConfig {
  id: Dimension;
  label: string;
  defaultChartType: 'line' | 'column';
  presetValues?: readonly string[];
}

export const DIMENSION_REGISTRY: Record<Dimension, DimensionConfig> = {
  [DIMENSIONS.DATE]: {
    id: DIMENSIONS.DATE,
    label: 'Date',
    defaultChartType: 'line',
  },
  [DIMENSIONS.COUNTRY]: {
    id: DIMENSIONS.COUNTRY,
    label: 'Country',
    defaultChartType: 'column',
    presetValues: DIMENSION_PRESETS[DIMENSIONS.COUNTRY],
  },
  [DIMENSIONS.DEVICE]: {
    id: DIMENSIONS.DEVICE,
    label: 'Device',
    defaultChartType: 'column',
    presetValues: DIMENSION_PRESETS[DIMENSIONS.DEVICE],
  },
  [DIMENSIONS.CHANNEL]: {
    id: DIMENSIONS.CHANNEL,
    label: 'Channel',
    defaultChartType: 'column',
    presetValues: DIMENSION_PRESETS[DIMENSIONS.CHANNEL],
  },
  [DIMENSIONS.CAMPAIGN]: {
    id: DIMENSIONS.CAMPAIGN,
    label: 'Campaign',
    defaultChartType: 'column',
    presetValues: DIMENSION_PRESETS[DIMENSIONS.CAMPAIGN],
  },
};

export const AVAILABLE_DIMENSIONS: Dimension[] = Object.values(DIMENSIONS);

export const AVAILABLE_METRICS: Metric[] = Object.values(METRICS);
