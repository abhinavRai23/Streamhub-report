import { memo } from 'react';
import type { Filter } from '../../types/report';
import { FilterRow } from './FilterRow';
import { Button } from '../UI/Button';
import { UI_STYLES } from '../../constants/styles';
import { Plus, Trash2, Info } from 'lucide-react';

interface FilterSectionProps {
  filters: Filter[];
  onAddFilter: () => void;
  onClearFilters: () => void;
  onRemoveFilter: (id: string) => void;
  onUpdateFilter: (id: string, updates: Partial<Omit<Filter, 'id'>>) => void;
}

export const FilterSection = memo(({
  filters,
  onAddFilter,
  onClearFilters,
  onRemoveFilter,
  onUpdateFilter,
}: FilterSectionProps) => {
  return (
    <div className="pt-4 border-t border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className={UI_STYLES.sectionTitle}>
            Data Filters (AND logic)
          </h3>
          {filters.length > 0 && (
            <span className={`${UI_STYLES.badgeCount} bg-slate-100 text-slate-600`}>
              {filters.length} active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={onAddFilter}>
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            Add Filter
          </Button>
          {filters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {filters.length > 0 ? (
        <div className="space-y-2.5">
          {filters.map((filter) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              onRemove={onRemoveFilter}
              onUpdate={onUpdateFilter}
            />
          ))}
        </div>
      ) : (
        <div className="p-3.5 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            No filters currently applied. All records are included in aggregation.
          </p>
        </div>
      )}
    </div>
  );
});

FilterSection.displayName = 'FilterSection';

