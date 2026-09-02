export type Dimension = 'date' | 'country' | 'device' | 'channel' | 'campaign';

export type CategoricalDimension = 'country' | 'device' | 'channel' | 'campaign';

export type Metric = 'sessions' | 'revenue' | 'conversions' | 'bounceRate';

export type FilterOperator = 'equals' | 'not-equals' | 'between';

export interface EqualityFilter {
  id: string;
  field: Dimension;
  operator: 'equals' | 'not-equals';
  value: string;
}

export interface DateRangeFilter {
  id: string;
  field: 'date';
  operator: 'between';
  value: [string, string]; // [startDate, endDate] (inclusive ISO YYYY-MM-DD)
}

export type Filter = EqualityFilter | DateRangeFilter;

export interface RawDataRow {
  date: string;
  country: string;
  device: string;
  channel: string;
  campaign: string;
  sessions: number;
  revenue: number;
  conversions: number;
  bounces: number;
  totalVisits: number;
}

export interface AggregatedRow {
  [key: string]: string | number;
  sessions: number;
  revenue: number;
  conversions: number;
  bounces: number;
  totalVisits: number;
  bounceRate: number; // Stored as decimal ratio 0.000 to 1.000 (e.g. 0.20 for 20%)
}

export interface MetricDefinition {
  id: Metric;
  label: string;
  description: string;
  unit: 'currency' | 'count' | 'percent';
  isRatio: boolean;
  axisType: 'primary' | 'secondary';
  format: (value: number) => string;
}