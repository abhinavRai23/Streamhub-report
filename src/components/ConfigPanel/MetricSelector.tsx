import { memo } from 'react';
import type { Metric } from '../../types/report';
import { METRIC_REGISTRY, AVAILABLE_METRICS } from '../../config/reportSchema';
import { UI_STYLES } from '../../constants/styles';
import { Check, AlertCircle } from 'lucide-react';

interface MetricSelectorProps {
  selectedMetrics: Metric[];
  onToggleMetric: (metric: Metric) => void;
}

export const MetricSelector = memo(({
  selectedMetrics,
  onToggleMetric,
}: MetricSelectorProps) => {
  const getBadgeClass = () => {
    if (selectedMetrics.length === 0) return 'bg-amber-100 text-amber-800';
    if (selectedMetrics.length === 3) return 'bg-indigo-100 text-indigo-800';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={UI_STYLES.sectionTitle}>
          Metrics
        </label>
        <span className={`${UI_STYLES.badgeCount} ${getBadgeClass()}`}>
          {selectedMetrics.length}/3 selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {AVAILABLE_METRICS.map((metricId) => {
          const def = METRIC_REGISTRY[metricId];
          const isSelected = selectedMetrics.includes(metricId);
          const isAtLimit = !isSelected && selectedMetrics.length >= 3;

          return (
            <button
              key={metricId}
              type="button"
              onClick={() => onToggleMetric(metricId)}
              disabled={isAtLimit}
              className={`group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 group-hover:border-slate-400 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </span>

              <span>{def.label}</span>

              {def.isRatio && (
                <span
                  className={UI_STYLES.badgeRatio}
                  title="Ratio metric: recomputed from raw bounces and visits"
                >
                  Ratio
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedMetrics.length === 0 && (
        <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Please select at least 1 metric to render visualization.
        </p>
      )}
    </div>
  );
});

MetricSelector.displayName = 'MetricSelector';

