import { memo } from 'react';
import type { Filter, Dimension, FilterOperator } from '../../types/report';
import { Button } from '../UI/Button';
import { Select, type SelectOption } from '../UI/Select';
import { DateRangePicker } from './DateRangePicker';
import { Trash2 } from 'lucide-react';
import { DIMENSION_REGISTRY, AVAILABLE_DIMENSIONS } from '../../config/reportSchema';
import { DIMENSIONS, OPERATORS, DATE_CONFIG } from '../../constants/report';
import { UI_STYLES } from '../../constants/styles';

interface FilterRowProps {
  filter: Filter;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Filter, 'id'>>) => void;
}

const FIELD_OPTIONS: SelectOption<Dimension>[] = AVAILABLE_DIMENSIONS.map((dim) => ({
  label: dim.charAt(0).toUpperCase() + dim.slice(1),
  value: dim,
}));

const DATE_OPERATOR_OPTIONS: SelectOption<FilterOperator>[] = [
  { label: 'Between (Range)', value: OPERATORS.BETWEEN },
  { label: 'Equals', value: OPERATORS.EQUALS },
];

const CATEGORICAL_OPERATOR_OPTIONS: SelectOption<FilterOperator>[] = [
  { label: 'Equals (=)', value: OPERATORS.EQUALS },
  { label: 'Not Equals (≠)', value: OPERATORS.NOT_EQUALS },
];

export const FilterRow = memo(({ filter, onRemove, onUpdate }: FilterRowProps) => {
  const isDateField = filter.field === DIMENSIONS.DATE;
  const operatorOptions = isDateField ? DATE_OPERATOR_OPTIONS : CATEGORICAL_OPERATOR_OPTIONS;

  const handleFieldChange = (newField: Dimension) => {
    if (newField === DIMENSIONS.DATE) {
      onUpdate(filter.id, {
        field: DIMENSIONS.DATE,
        operator: OPERATORS.BETWEEN,
        value: [...DATE_CONFIG.DEFAULT_DATE_RANGE],
      });
    } else {
      const presets = DIMENSION_REGISTRY[newField].presetValues || [];
      onUpdate(filter.id, {
        field: newField,
        operator: OPERATORS.EQUALS,
        value: presets[0] || '',
      });
    }
  };

  const handleOperatorChange = (newOperator: FilterOperator) => {
    if (newOperator === OPERATORS.BETWEEN) {
      onUpdate(filter.id, {
        field: DIMENSIONS.DATE,
        operator: OPERATORS.BETWEEN,
        value: [...DATE_CONFIG.DEFAULT_DATE_RANGE],
      });
    } else {
      const currentVal = Array.isArray(filter.value) ? filter.value[0] || '' : filter.value;
      onUpdate(filter.id, {
        operator: newOperator,
        value: currentVal,
      });
    }
  };

  const presets = DIMENSION_REGISTRY[filter.field]?.presetValues || [];

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 ${UI_STYLES.cardBordered}`}>
      {/* Field Selector */}
      <div className="w-full sm:w-36">
        <label className={UI_STYLES.labelUppercase}>
          Field
        </label>
        <Select<Dimension>
          value={filter.field}
          onChange={handleFieldChange}
          options={FIELD_OPTIONS}
          ariaLabel="Filter field"
        />
      </div>

      {/* Operator Selector */}
      <div className="w-full sm:w-36">
        <label className={UI_STYLES.labelUppercase}>
          Condition
        </label>
        <Select<FilterOperator>
          value={filter.operator}
          onChange={handleOperatorChange}
          options={operatorOptions}
          ariaLabel="Filter condition"
        />
      </div>

      {/* Value Input */}
      <div className="flex-1 min-w-[200px]">
        <label className={UI_STYLES.labelUppercase}>
          Value
        </label>

        {filter.operator === OPERATORS.BETWEEN ? (
          <DateRangePicker
            startDate={Array.isArray(filter.value) ? filter.value[0] || '' : ''}
            endDate={Array.isArray(filter.value) ? filter.value[1] || '' : ''}
            onChange={(range) => onUpdate(filter.id, { value: range })}
            minDate={DATE_CONFIG.MIN_DATE}
            maxDate={DATE_CONFIG.MAX_DATE}
          />
        ) : presets.length > 0 ? (
          <Select<string>
            value={typeof filter.value === 'string' ? filter.value : ''}
            onChange={(val) => onUpdate(filter.id, { value: val })}
            options={presets.map((p) => ({ label: p, value: p }))}
            placeholder="Select value"
            className="w-full"
            ariaLabel="Filter value option"
          />
        ) : (
          <input
            type="text"
            value={typeof filter.value === 'string' ? filter.value : ''}
            onChange={(e) => onUpdate(filter.id, { value: e.target.value })}
            placeholder={`e.g. ${DATE_CONFIG.DEFAULT_START_DATE}`}
            className={UI_STYLES.inputBase}
          />
        )}
      </div>

      {/* Delete button */}
      <div className="sm:self-end pt-1">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(filter.id)}
          title="Remove filter"
          className="h-9 w-9 p-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

FilterRow.displayName = 'FilterRow';

