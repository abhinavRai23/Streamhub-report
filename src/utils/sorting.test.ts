import { describe, it, expect } from 'vitest';
import { sortAggregatedRows } from './sorting';
import type { AggregatedRow } from '../types/report';

describe('sorting utility', () => {
  const sampleRows: AggregatedRow[] = [
    { country: 'US', sessions: 6200, revenue: 24780, conversions: 500, bounces: 1000, totalVisits: 5000, bounceRate: 0.2 },
    { country: 'DE', sessions: 1500, revenue: 7500, conversions: 120, bounces: 300, totalVisits: 1000, bounceRate: 0.3 },
    { country: 'UK', sessions: 3400, revenue: 12000, conversions: 250, bounces: 500, totalVisits: 2000, bounceRate: 0.25 },
  ];

  it('sorts alphabetically ascending by dimension', () => {
    const sorted = sortAggregatedRows(sampleRows, 'country', 'asc');
    expect(sorted.map((r) => r.country)).toEqual(['DE', 'UK', 'US']);
  });

  it('sorts alphabetically descending by dimension', () => {
    const sorted = sortAggregatedRows(sampleRows, 'country', 'desc');
    expect(sorted.map((r) => r.country)).toEqual(['US', 'UK', 'DE']);
  });

  it('sorts numerically ascending by metric', () => {
    const sorted = sortAggregatedRows(sampleRows, 'sessions', 'asc');
    expect(sorted.map((r) => r.sessions)).toEqual([1500, 3400, 6200]);
  });

  it('sorts numerically descending by metric', () => {
    const sorted = sortAggregatedRows(sampleRows, 'sessions', 'desc');
    expect(sorted.map((r) => r.sessions)).toEqual([6200, 3400, 1500]);
  });
});
