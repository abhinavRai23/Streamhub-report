import { memo } from 'react';
import { Button } from '../UI/Button';
import { Sparkles } from 'lucide-react';

interface ConfigPanelHeaderProps {
  onLoadBenchmark: () => void;
  onReset: () => void;
}

export const ConfigPanelHeader = memo(({ onLoadBenchmark, onReset }: ConfigPanelHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-5 border-b border-slate-100 gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          Report Configuration
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure dimensions, metrics, and filter criteria to shape your visualization.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoadBenchmark}
          className="text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50/50"
          title="Load benchmark: Country=US, Grouped by Device"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Prompt Benchmark
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800"
        >
          Reset
        </Button>
      </div>
    </div>
  );
});

ConfigPanelHeader.displayName = 'ConfigPanelHeader';

