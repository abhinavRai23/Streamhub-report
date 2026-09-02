import { describe, it, expect } from 'vitest';
import { filterData, aggregateData, processData } from './dataEngine';
import mockData from '../api/mockData.json';
import type { RawDataRow, Filter } from '../types/report';

const rawMockData = mockData as RawDataRow[];

describe('dataEngine - Aggregation & Ratio Metric Integrity', () => {
  it('correctly recomputes bounceRate from components and avoids the naive averaging trap', () => {
    // Synthetic 2-row test specifically constructed where naive average != true ratio
    // Row 1: 10 bounces / 100 visits = 10% bounce rate
    // Row 2: 90 bounces / 100 visits = 90% bounce rate
    // Naive average of rates: (10% + 90%) / 2 = 50%
    // BUT what if Row 1 had 10 bounces / 1000 visits (1%) and Row 2 had 90 bounces / 100 visits (90%)?
    // Total visits: 1100, Total bounces: 100 -> True ratio: 100 / 1100 = 9.09%
    // Naive average would have yielded: (1% + 90%) / 2 = 45.5%! (Massive error)
    const testRows: RawDataRow[] = [
      {
        date: '2026-06-01',
        country: 'US',
        device: 'desktop',
        channel: 'organic',
        campaign: 'c1',
        sessions: 1000,
        revenue: 5000,
        conversions: 50,
        bounces: 10,
        totalVisits: 1000,
      },
      {
        date: '2026-06-02',
        country: 'US',
        device: 'desktop',
        channel: 'organic',
        campaign: 'c1',
        sessions: 100,
        revenue: 500,
        conversions: 5,
        bounces: 90,
        totalVisits: 100,
      },
    ];

    const aggregated = aggregateData(testRows, 'device', ['bounceRate']);
    expect(aggregated).toHaveLength(1);
    const desktop = aggregated[0];

    // True ratio = 100 bounces / 1100 visits ≈ 0.090909
    expect(desktop.bounces).toBe(100);
    expect(desktop.totalVisits).toBe(1100);
    expect(desktop.bounceRate).toBeCloseTo(100 / 1100, 4);
    // Explicitly assert it does NOT equal the naive average ((10/1000 + 90/100) / 2 = 0.455)
    expect(desktop.bounceRate).not.toBeCloseTo(0.455, 2);
  });

  it('matches the StreamHub prompt benchmark: Country = US, grouped by Device', () => {
    // Benchmark from prompt:
    // desktop → sessions 6,200 / revenue $24,780 / bounceRate ≈ 0.20
    // mobile → sessions 4,700 / revenue $14,100 / bounceRate ≈ 0.45
    const filters: Filter[] = [
      {
        id: 'f-1',
        field: 'country',
        operator: 'equals',
        value: 'US',
      },
    ];

    const result = processData(rawMockData, 'device', ['sessions', 'revenue', 'bounceRate'], filters);

    expect(result).toHaveLength(2);

    const desktop = result.find((r) => r.device === 'desktop');
    const mobile = result.find((r) => r.device === 'mobile');

    expect(desktop).toBeDefined();
    expect(mobile).toBeDefined();

    // Verify desktop figures
    expect(desktop?.sessions).toBe(6200);
    expect(desktop?.revenue).toBe(24780);
    expect(desktop?.conversions).toBe(496);
    expect(desktop?.bounceRate).toBeCloseTo(0.201, 2); // ≈ 0.20 (1575 / 7880)

    // Verify mobile figures
    expect(mobile?.sessions).toBe(4700);
    expect(mobile?.revenue).toBe(14100);
    expect(mobile?.conversions).toBe(282);
    expect(mobile?.bounceRate).toBeCloseTo(0.4485, 2); // ≈ 0.45 (2345 / 5250)
  });
});

describe('dataEngine - Multi-Filter & Date Range Logic', () => {
  it('handles AND logic with multiple equality filters', () => {
    const filters: Filter[] = [
      { id: '1', field: 'country', operator: 'equals', value: 'US' },
      { id: '2', field: 'device', operator: 'equals', value: 'mobile' },
      { id: '3', field: 'channel', operator: 'equals', value: 'paid' },
    ];

    const filtered = filterData(rawMockData, filters);
    // In mock data, there are 5 days for US mobile paid retargeting
    expect(filtered).toHaveLength(5);
    filtered.forEach((r) => {
      expect(r.country).toBe('US');
      expect(r.device).toBe('mobile');
      expect(r.channel).toBe('paid');
    });
  });

  it('handles not-equals filter correctly', () => {
    const filters: Filter[] = [
      { id: '1', field: 'country', operator: 'not-equals', value: 'US' },
    ];

    const filtered = filterData(rawMockData, filters);
    // 25 total rows - 10 US rows = 15 non-US rows
    expect(filtered).toHaveLength(15);
    filtered.forEach((r) => {
      expect(r.country).not.toBe('US');
    });
  });

  it('handles date range between operator', () => {
    const filters: Filter[] = [
      {
        id: '1',
        field: 'date',
        operator: 'between',
        value: ['2026-06-02', '2026-06-04'],
      },
    ];

    const filtered = filterData(rawMockData, filters);
    // 5 combos × 3 days = 15 rows
    expect(filtered).toHaveLength(15);
    filtered.forEach((r) => {
      expect(r.date >= '2026-06-02' && r.date <= '2026-06-04').toBe(true);
    });
  });

  it('handles empty / blank filters gracefully without filtering out data', () => {
    const filters: Filter[] = [
      { id: '1', field: 'country', operator: 'equals', value: '' },
    ];

    const filtered = filterData(rawMockData, filters);
    expect(filtered).toHaveLength(rawMockData.length);
  });
});
