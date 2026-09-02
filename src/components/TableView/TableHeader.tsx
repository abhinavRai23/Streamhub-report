import { memo } from 'react';
import type { Dimension, Metric } from '../../types/report';
import { METRIC_REGISTRY } from '../../config/reportSchema';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TableHeaderProps {
  dimension: Dimension;
  metrics: Metric[];
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  onSort: (key: string) => void;
}

export const TableHeader = memo(({
  dimension,
  metrics,
  sortKey,
  sortOrder,
  onSort,
}: TableHeaderProps) => {
  const renderSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
    );
  };

  return (
    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-2xs">
      <tr>
        <th
          onClick={() => onSort(dimension)}
          className="px-6 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors group"
        >
          <div className="flex items-center gap-1.5 capitalize">
            {dimension}
            {renderSortIcon(dimension)}
          </div>
        </th>

        {metrics.map((metricId) => {
          const def = METRIC_REGISTRY[metricId];
          return (
            <th
              key={metricId}
              onClick={() => onSort(metricId)}
              className="px-6 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors text-right group"
            >
              <div className="flex items-center justify-end gap-1.5">
                <span>{def.label}</span>
                {renderSortIcon(metricId)}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

