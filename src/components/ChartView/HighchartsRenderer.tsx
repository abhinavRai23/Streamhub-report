import { memo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Resilient resolver for ESM/CJS interop across bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HighchartsComponent: any = (HighchartsReact as any).default || HighchartsReact;

interface HighchartsRendererProps {
  options: Highcharts.Options;
}

export const HighchartsRenderer = memo(({ options }: HighchartsRendererProps) => {
  return (
    <div className="w-full">
      <HighchartsComponent highcharts={Highcharts} options={options} />
    </div>
  );
});

HighchartsRenderer.displayName = 'HighchartsRenderer';
