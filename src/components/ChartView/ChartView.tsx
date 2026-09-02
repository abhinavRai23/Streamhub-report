import { useMemo } from 'react';
import { useReportStore } from '../../store/useReportStore';
import { useReportData } from '../../hooks/useReportData';
import { processData } from '../../utils/dataEngine';
import { ChartEmptyState } from './ChartEmptyState';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartErrorState } from './ChartErrorState';
import { HighchartsRenderer } from './HighchartsRenderer';
import { useChartConfig } from './useChartConfig';

import { UI_STYLES } from '../../constants/styles';

export const ChartView = () => {
  const { dimension, metrics, filters } = useReportStore();

  const {
    data: rawData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useReportData();

  const processedData = useMemo(() => {
    if (!rawData) return [];
    return processData(rawData, dimension, metrics, filters);
  }, [rawData, dimension, metrics, filters]);

  const { options, isDateDimension, isDualAxis, rowCount } = useChartConfig({
    dimension,
    metrics,
    data: processedData,
  });

  // 1. Empty state
  if (metrics.length === 0) {
    return <ChartEmptyState />;
  }

  // 2. Loading state
  if (isLoading) {
    return <ChartSkeleton />;
  }

  // 3. Error state
  if (error) {
    return (
      <ChartErrorState
        message={(error as Error).message}
        isFetching={isFetching}
        onRetry={() => refetch()}
      />
    );
  }

  // 4. No matching records
  if (processedData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-xs min-h-[420px] flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-700">No matching records found</p>
        <p className="text-xs text-slate-500 mt-1">
          Try loosening your filter criteria to display aggregated data.
        </p>
      </div>
    );
  }

  return (
    <div className={`${UI_STYLES.cardBase} space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {isDateDimension ? 'Time-Series Trend' : 'Categorical Breakdown'}
          </h3>
          <p className="text-xs text-slate-500">
            Grouped by <span className="font-semibold text-slate-700 capitalize">{dimension}</span> across{' '}
            <span className="font-semibold text-slate-700">{rowCount}</span> groups
          </p>
        </div>

        {isDualAxis && (
          <span className="text-2xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-md font-medium">
            Dual Y-Axis: Volume (Left) & Bounce Rate % (Right)
          </span>
        )}
      </div>

      <HighchartsRenderer options={options} />
    </div>
  );
};