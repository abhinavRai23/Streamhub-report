import { memo } from 'react';
import { Button } from '../UI/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ChartErrorStateProps {
  message: string;
  isFetching: boolean;
  onRetry: () => void;
}

export const ChartErrorState = memo(({ message, isFetching, onRetry }: ChartErrorStateProps) => {
  return (
    <div className="bg-white rounded-xl border border-rose-200 p-10 text-center shadow-xs flex flex-col items-center justify-center min-h-[420px]">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">
        Simulated API Query Failure
      </h3>
      <p className="text-xs text-rose-600 font-mono bg-rose-50 px-3 py-1.5 rounded-md border border-rose-200 max-w-md mb-4">
        {message}
      </p>
      <p className="text-xs text-slate-500 max-w-md mb-5">
        The mock API includes a simulated ~10% failure rate to demonstrate error resilience.
      </p>
      <Button
        variant="primary"
        onClick={onRetry}
        disabled={isFetching}
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        {isFetching ? 'Retrying...' : 'Retry Query'}
      </Button>
    </div>
  );
});

ChartErrorState.displayName = 'ChartErrorState';

