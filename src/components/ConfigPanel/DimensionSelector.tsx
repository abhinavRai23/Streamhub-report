import { memo } from 'react';
import type { Dimension } from '../../types/report';
import { Select, type SelectOption } from '../UI/Select';
import { AVAILABLE_DIMENSIONS } from '../../config/reportSchema';
import { DIMENSIONS } from '../../constants/report';
import { UI_STYLES } from '../../constants/styles';

interface DimensionSelectorProps {
  value: Dimension;
  onChange: (dimension: Dimension) => void;
}

const DIMENSION_OPTIONS: SelectOption<Dimension>[] = AVAILABLE_DIMENSIONS.map((dim) => ({
  label: dim.charAt(0).toUpperCase() + dim.slice(1),
  value: dim,
}));

export const DimensionSelector = memo(({ value, onChange }: DimensionSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={UI_STYLES.sectionTitle}>
          Primary Dimension
        </label>
        <span className="text-2xs text-slate-400">Single select</span>
      </div>

      <Select<Dimension>
        value={value}
        onChange={onChange}
        options={DIMENSION_OPTIONS}
        className="w-full font-medium"
        ariaLabel="Select dimension"
      />

      <p className="text-xs text-slate-500">
        {value === DIMENSIONS.DATE
          ? 'Renders as a continuous time-series line chart.'
          : 'Renders as categorical bar/column chart.'}
      </p>
    </div>
  );
});

DimensionSelector.displayName = 'DimensionSelector';

