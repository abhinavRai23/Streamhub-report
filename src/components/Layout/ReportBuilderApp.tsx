import { useState } from 'react';
import { ConfigPanel } from '../ConfigPanel/ConfigPanel';
import { AppHeader } from './AppHeader';
import { ReportDisplaySection } from './ReportDisplaySection';
import type { ViewMode } from './ViewModeToggle';
import { useUrlSync } from '../../hooks/useUrlSync';

export function ReportBuilderApp() {
  // Sync Zustand report state with browser URL search parameters
  useUrlSync();

  const [viewMode, setViewMode] = useState<ViewMode>('both');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <AppHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <ConfigPanel />
        <ReportDisplaySection viewMode={viewMode} />
      </main>
    </div>
  );
}
