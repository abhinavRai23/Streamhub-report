import { memo } from 'react';
import { BarChart2, Table as TableIcon, Layers } from 'lucide-react';
import { VIEW_MODES } from '../../constants/report';

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const VIEW_MODE_ITEMS = [
  { id: VIEW_MODES.BOTH, label: 'Both', Icon: Layers },
  { id: VIEW_MODES.CHART, label: 'Chart', Icon: BarChart2 },
  { id: VIEW_MODES.TABLE, label: 'Table', Icon: TableIcon },
] as const;

export const ViewModeToggle = memo(({ viewMode, onChange }: ViewModeToggleProps) => {
  return (
    <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
      {VIEW_MODE_ITEMS.map(({ id, label, Icon }) => {
        const isActive = viewMode === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
});

ViewModeToggle.displayName = 'ViewModeToggle';

