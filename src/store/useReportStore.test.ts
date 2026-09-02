import { describe, it, expect, beforeEach } from 'vitest';
import { useReportStore } from './useReportStore';

describe('useReportStore Actions', () => {
  beforeEach(() => {
    useReportStore.getState().resetToDefaults();
  });

  it('updates dimension', () => {
    useReportStore.getState().setDimension('channel');
    expect(useReportStore.getState().dimension).toBe('channel');
  });

  it('toggles metrics and respects the 3 metrics limit', () => {
    useReportStore.getState().setMetrics(['sessions']);
    expect(useReportStore.getState().metrics).toEqual(['sessions']);

    useReportStore.getState().toggleMetric('revenue');
    expect(useReportStore.getState().metrics).toEqual(['sessions', 'revenue']);

    useReportStore.getState().toggleMetric('bounceRate');
    expect(useReportStore.getState().metrics).toEqual(['sessions', 'revenue', 'bounceRate']);

    // Attempt to add a 4th metric when at capacity (should be blocked)
    useReportStore.getState().toggleMetric('conversions');
    expect(useReportStore.getState().metrics).toEqual(['sessions', 'revenue', 'bounceRate']);

    // Toggle off one metric
    useReportStore.getState().toggleMetric('revenue');
    expect(useReportStore.getState().metrics).toEqual(['sessions', 'bounceRate']);
  });

  it('adds, updates, removes, and clears filters', () => {
    useReportStore.getState().addFilter({
      field: 'country',
      operator: 'equals',
      value: 'US',
    });

    const filters = useReportStore.getState().filters;
    expect(filters).toHaveLength(1);
    expect(filters[0].field).toBe('country');
    expect(filters[0].value).toBe('US');

    const filterId = filters[0].id;
    useReportStore.getState().updateFilter(filterId, { value: 'UK' });
    expect(useReportStore.getState().filters[0].value).toBe('UK');

    useReportStore.getState().removeFilter(filterId);
    expect(useReportStore.getState().filters).toHaveLength(0);
  });
});
