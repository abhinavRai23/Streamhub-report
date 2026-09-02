import { useState, memo } from 'react';
import { ViewModeToggle, type ViewMode } from './ViewModeToggle';
import { Button } from '../UI/Button';
import { Share2, Check } from 'lucide-react';

interface AppHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const AppHeader = memo(({ viewMode, onViewModeChange }: AppHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                StreamHub
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Report Builder
              </span>
            </div>
            <p className="text-2xs text-slate-500 hidden sm:block">
              Client-side aggregation engine with adaptive multi-metric visualization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />

          <Button
            variant="default"
            size="sm"
            onClick={handleCopyLink}
            className="text-xs"
            title="Copy deep-link with current dimension, metrics, and filters"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Link</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
});

AppHeader.displayName = 'AppHeader';

