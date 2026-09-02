import { memo } from 'react';
import { BarChart3 } from 'lucide-react';

export const ChartEmptyState = memo(() => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[420px]">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <BarChart3 className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        No metrics selected
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">
        Select between 1 and 3 metrics from the configuration panel above to generate your report visualization.
      </p>
    </div>
  );
});

ChartEmptyState.displayName = 'ChartEmptyState';

