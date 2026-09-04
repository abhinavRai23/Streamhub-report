import { memo, lazy, Suspense } from 'react';
import type { ViewMode } from './ViewModeToggle';
import { ChartSkeleton } from '../ChartView/ChartSkeleton';

const ChartView = lazy(() => import('../ChartView/ChartView'));
const TableView = lazy(() => import('../TableView/TableView'));

interface ReportDisplaySectionProps {
  viewMode: ViewMode;
}

export const ReportDisplaySection = memo(({ viewMode }: ReportDisplaySectionProps) => {
  return (
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
          <Suspense
            fallback={
              <div className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />
            }
          >
            <TableView />
          </Suspense>
        </div>
      )}
    </section>
  );
});

ReportDisplaySection.displayName = 'ReportDisplaySection';
