import { useState, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';
import { AppHeader } from './components/Layout/AppHeader';
import { ChartSkeleton } from './components/ChartView/ChartSkeleton';
import type { ViewMode } from './components/Layout/ViewModeToggle';
import { useUrlSync } from './hooks/useUrlSync';

// Code-split heavy visualization and table modules
const ChartView = lazy(() =>
  import('./components/ChartView/ChartView').then((m) => ({ default: m.ChartView }))
);
const TableView = lazy(() =>
  import('./components/TableView/TableView').then((m) => ({ default: m.TableView }))
);

// Instantiate QueryClient ONCE outside the component lifecycle to prevent cache evictions on re-render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

function ReportBuilderApp() {
  // Sync Zustand report state with browser URL search parameters
  useUrlSync();

  const [viewMode, setViewMode] = useState<ViewMode>('both');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <AppHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <section>
          <ConfigPanel />
        </section>

        <section className="space-y-6">
          {(viewMode === 'both' || viewMode === 'chart') && (
            <div>
              <Suspense fallback={<ChartSkeleton />}>
                <ChartView />
              </Suspense>
            </div>
          )}

          {(viewMode === 'both' || viewMode === 'table') && (
            <div>
              <Suspense fallback={<div className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />}>
                <TableView />
              </Suspense>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportBuilderApp />
    </QueryClientProvider>
  );
}
