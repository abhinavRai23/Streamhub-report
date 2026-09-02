import { useQuery } from '@tanstack/react-query';
import { fetchReportData } from '../api/reportApi';

export const REPORT_DATA_QUERY_KEY = ['reportData'] as const;

/**
 * Custom hook providing cached report data.
 * Leverages TanStack Query caching (5 min stale time, 10 min garbage collection).
 * Multiple components (ChartView, TableView) share this single cached dataset
 * without triggering redundant network roundtrips.
 */
export const useReportData = () => {
  return useQuery({
    queryKey: REPORT_DATA_QUERY_KEY,
    queryFn: fetchReportData,
    retry: false, // Explicit retry via UI button to display simulated transient failure
    staleTime: 1000 * 60 * 5, // 5 minutes cache freshness
    gcTime: 1000 * 60 * 10,    // 10 minutes cache retention
  });
};
