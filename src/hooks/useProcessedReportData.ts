import { useMemo } from 'react';
import { useReportStore } from '../store/useReportStore';
import { useReportData } from '../hooks/useReportData';
import { processData } from '../utils/dataEngine';

export const useProcessedReportData = () => {
  const { dimension, metrics, filters } = useReportStore();
  const { data: rawData, isLoading, isFetching, error, refetch } = useReportData();

  const processedData = useMemo(() => {
    if (!rawData) return [];
    return processData(rawData, dimension, metrics, filters);
  }, [rawData, dimension, metrics, filters]);

  return { processedData, isLoading, isFetching, error, refetch };
};