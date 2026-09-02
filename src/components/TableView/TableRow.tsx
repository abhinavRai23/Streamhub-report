import { memo } from 'react';
import type { Dimension, Metric, AggregatedRow } from '../../types/report';
import { METRIC_REGISTRY } from '../../config/reportSchema';

interface TableRowProps {
  row: AggregatedRow;
  dimension: Dimension;
  metrics: Metric[];
}

export const TableRow = memo(({ row, dimension, metrics }: TableRowProps) => {
  return (
    <tr className="hover:bg-indigo-50/30 transition-colors">
      <td className="px-6 py-3 font-semibold text-slate-900">
        {String(row[dimension])}
      </td>

      {metrics.map((metricId) => {
        const def = METRIC_REGISTRY[metricId];
        const rawVal = Number(row[metricId]) || 0;
        const formatted = def.format(rawVal);

        return (
          <td
            key={metricId}
            className={`px-6 py-3 text-right font-mono ${
              def.isRatio ? 'text-amber-700 font-medium' : 'text-slate-800'
            }`}
          >
            {formatted}
          </td>
        );
      })}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

