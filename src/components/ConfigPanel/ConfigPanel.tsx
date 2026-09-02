import { useCallback } from 'react';
import { useReportStore } from '../../store/useReportStore';
import { ConfigPanelHeader } from './ConfigPanelHeader';
import { DimensionSelector } from './DimensionSelector';
import { MetricSelector } from './MetricSelector';
import { FilterSection } from './FilterSection';
import { DIMENSIONS, OPERATORS, DATE_PRESETS } from '../../constants/report';
import { UI_STYLES } from '../../constants/styles';

export const ConfigPanel = () => {
  const {
    dimension,
    metrics,
    filters,
    setDimension,
    toggleMetric,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
    resetToDefaults,
  } = useReportStore();

  const handleAddDefaultFilter = useCallback(() => {
    addFilter({
      field: DIMENSIONS.COUNTRY,
      operator: OPERATORS.EQUALS,
      value: DATE_PRESETS.BENCHMARK_COUNTRY,
    });
  }, [addFilter]);

  const handleSetPromptBenchmark = useCallback(() => {
    setDimension(DIMENSIONS.DEVICE);
    clearFilters();
    addFilter({
      field: DIMENSIONS.COUNTRY,
      operator: OPERATORS.EQUALS,
      value: DATE_PRESETS.BENCHMARK_COUNTRY,
    });
  }, [setDimension, clearFilters, addFilter]);

  return (
    <div className={`${UI_STYLES.cardBase} space-y-6`}>
      <ConfigPanelHeader
        onLoadBenchmark={handleSetPromptBenchmark}
        onReset={resetToDefaults}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <DimensionSelector value={dimension} onChange={setDimension} />
        </div>

        <div className="lg:col-span-8">
          <MetricSelector
            selectedMetrics={metrics}
            onToggleMetric={toggleMetric}
          />
        </div>
      </div>

      <FilterSection
        filters={filters}
        onAddFilter={handleAddDefaultFilter}
        onClearFilters={clearFilters}
        onRemoveFilter={removeFilter}
        onUpdateFilter={updateFilter}
      />
    </div>
  );
};