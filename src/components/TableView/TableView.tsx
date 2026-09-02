import { useState, useMemo, useCallback } from 'react';
import { useReportStore } from '../../store/useReportStore';
import { useReportData } from '../../hooks/useReportData';
import { processData } from '../../utils/dataEngine';
import { sortAggregatedRows } from '../../utils/sorting';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

export const TableView = () => {
  const { dimension, metrics, filters } = useReportStore();
  const [sortKey, setSortKey] = useState<string>(dimension);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: rawData, isLoading } = useReportData();

  const processedData = useMemo(() => {
    if (!rawData) return [];
    return processData(rawData, dimension, metrics, filters);
  }, [rawData, dimension, metrics, filters]);

  const sortedRows = useMemo(() => {
    return sortAggregatedRows(processedData, sortKey, sortOrder);
  }, [processedData, sortKey, sortOrder]);

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  }, [sortKey]);

  if (isLoading || !rawData || processedData.length === 0 || metrics.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Aggregated Dataset Table
          </h3>
          <p className="text-xs text-slate-500">
            Click column headers to sort aggregated groups.
          </p>
        </div>
        <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md font-medium">
          {sortedRows.length} rows
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <TableHeader
            dimension={dimension}
            metrics={metrics}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <tbody className="divide-y divide-slate-100">
            {sortedRows.map((row, index) => (
              <TableRow
                key={String(row[dimension]) + index}
                row={row}
                dimension={dimension}
                metrics={metrics}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
