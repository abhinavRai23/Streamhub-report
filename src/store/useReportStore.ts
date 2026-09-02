import { create } from 'zustand';
import type { Dimension, Metric, Filter } from '../types/report';
import { DIMENSIONS, METRICS } from '../constants/report';
import { generateUniqueId } from '../utils/id';

export interface ReportState {
  dimension: Dimension;
  metrics: Metric[];
  filters: Filter[];

  // Actions
  setDimension: (dimension: Dimension) => void;
  toggleMetric: (metric: Metric) => void;
  setMetrics: (metrics: Metric[]) => void;
  addFilter: (filter: Omit<Filter, 'id'>) => void;
  removeFilter: (id: string) => void;
  updateFilter: (id: string, updates: Partial<Omit<Filter, 'id'>>) => void;
  clearFilters: () => void;
  resetToDefaults: () => void;
}

export const DEFAULT_CONFIG = {
  dimension: DIMENSIONS.DATE as Dimension,
  metrics: [METRICS.SESSIONS, METRICS.REVENUE] as Metric[],
  filters: [] as Filter[],
};

export const useReportStore = create<ReportState>((set) => ({
  dimension: DEFAULT_CONFIG.dimension,
  metrics: DEFAULT_CONFIG.metrics,
  filters: DEFAULT_CONFIG.filters,

  setDimension: (dimension) => set({ dimension }),

  toggleMetric: (metric) =>
    set((state) => {
      if (state.metrics.includes(metric)) {
        return { metrics: state.metrics.filter((m) => m !== metric) };
      }
      // Enforce strict limit of 1 to 3 metrics
      if (state.metrics.length >= 3) {
        return state;
      }
      return { metrics: [...state.metrics, metric] };
    }),

  setMetrics: (metrics) =>
    set({
      metrics: metrics.slice(0, 3), // Safeguard to max 3
    }),

  addFilter: (filter) =>
    set((state) => ({
      filters: [
        ...state.filters,
        {
          ...filter,
          id: generateUniqueId('filter'),
        } as Filter,
      ],
    })),

  removeFilter: (id) =>
    set((state) => ({
      filters: state.filters.filter((f) => f.id !== id),
    })),

  updateFilter: (id, updates) =>
    set((state) => ({
      filters: state.filters.map((f) => {
        if (f.id !== id) return f;
        return { ...f, ...updates } as Filter;
      }),
    })),

  clearFilters: () => set({ filters: [] }),

  resetToDefaults: () =>
    set({
      dimension: DEFAULT_CONFIG.dimension,
      metrics: DEFAULT_CONFIG.metrics,
      filters: [],
    }),
}));