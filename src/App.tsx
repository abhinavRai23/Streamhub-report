import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReportBuilderApp } from './components/Layout/ReportBuilderApp';

// Instantiate QueryClient ONCE outside the component lifecycle to prevent cache evictions on re-render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportBuilderApp />
    </QueryClientProvider>
  );
}
