import { useEffect, useRef } from 'react';
import { useReportStore } from '../store/useReportStore';
import type { Dimension, Metric, Filter } from '../types/report';
import { AVAILABLE_DIMENSIONS, AVAILABLE_METRICS } from '../config/reportSchema';

/**
 * Synchronizes Zustand report state with browser URL search parameters.
 * - Hydrates store state on initial page load (shareable deep-links).
 * - Debounces URL updates to keep browser history clean during rapid interactions.
 */
export const useUrlSync = () => {
  const {
    dimension,
    metrics,
    filters,
    setDimension,
    setMetrics,
    clearFilters,
    addFilter,
  } = useReportStore();

  const isHydratedRef = useRef(false);

  // 1. Hydrate state from URL on initial mount
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlDim = searchParams.get('dimension') as Dimension | null;
      if (urlDim && AVAILABLE_DIMENSIONS.includes(urlDim)) {
        setDimension(urlDim);
      }

      // Support comma-separated or multiple metric query params
      const rawMetrics = searchParams.get('metrics');
      if (rawMetrics) {
        const parsed = rawMetrics
          .split(',')
          .filter((m): m is Metric => AVAILABLE_METRICS.includes(m as Metric));
        if (parsed.length > 0) {
          setMetrics(parsed);
        }
      }

      const rawFilters = searchParams.get('filters');
      if (rawFilters) {
        const decoded = JSON.parse(decodeURIComponent(rawFilters)) as Filter[];
        if (Array.isArray(decoded) && decoded.length > 0) {
          clearFilters();
          decoded.forEach((f) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...cleanFilter } = f;
            addFilter(cleanFilter);
          });
        }
      }
    } catch (err) {
      console.warn('Failed to hydrate report state from URL:', err);
    } finally {
      isHydratedRef.current = true;
    }
  }, [setDimension, setMetrics, clearFilters, addFilter]);

  // 2. Debounced URL sync on state changes (post-hydration)
  useEffect(() => {
    if (!isHydratedRef.current) return;

    const timer = setTimeout(() => {
      const searchParams = new URLSearchParams();

      searchParams.set('dimension', dimension);

      if (metrics.length > 0) {
        searchParams.set('metrics', metrics.join(','));
      }

      if (filters.length > 0) {
        // Strip internal IDs to keep URLs minimal and clean
        const cleanFilters = filters.map((f) => ({
          field: f.field,
          operator: f.operator,
          value: f.value,
        }));
        searchParams.set('filters', encodeURIComponent(JSON.stringify(cleanFilters)));
      }

      const newQuery = searchParams.toString();
      const newUrl = newQuery
        ? `${window.location.pathname}?${newQuery}`
        : window.location.pathname;

      window.history.replaceState(null, '', newUrl);
    }, 250);

    return () => clearTimeout(timer);
  }, [dimension, metrics, filters]);
};