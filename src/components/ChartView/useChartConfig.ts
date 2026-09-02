import { useMemo } from 'react';
import type { Dimension, Metric, AggregatedRow } from '../../types/report';
import { METRIC_REGISTRY } from '../../config/reportSchema';
import { DIMENSIONS, METRICS } from '../../constants/report';
import { CHART_PALETTE, CHART_THEME } from '../../constants/theme';
import { formatAxisValue, formatPercent } from '../../utils/formatters';
import type Highcharts from 'highcharts';

interface UseChartConfigParams {
  dimension: Dimension;
  metrics: Metric[];
  data: AggregatedRow[];
}

export const useChartConfig = ({ dimension, metrics, data }: UseChartConfigParams) => {
  return useMemo(() => {
    const categories = data.map((row) => String(row[dimension]));
    const isDateDimension = dimension === DIMENSIONS.DATE;
    const chartType: 'line' | 'column' = isDateDimension ? 'line' : 'column';

    const hasBounceRate = metrics.includes(METRICS.BOUNCE_RATE);
    const hasVolumetricMetrics = metrics.some((m) => m !== METRICS.BOUNCE_RATE);
    const isDualAxis = hasBounceRate && hasVolumetricMetrics;

    const yAxes: Highcharts.YAxisOptions[] = [];

    if (isDualAxis) {
      const hasRevenue = metrics.includes(METRICS.REVENUE);
      yAxes.push({
        title: {
          text: hasRevenue ? 'Revenue ($) / Volume' : 'Volume (Count)',
          style: { color: CHART_THEME.text.secondary, fontSize: '11px', fontWeight: '600' },
        },
        labels: {
          style: { color: CHART_THEME.text.muted, fontSize: '10px' },
          formatter: function () {
            return formatAxisValue(Number(this.value), hasRevenue);
          },
        },
        gridLineColor: CHART_THEME.grid.line,
      });

      yAxes.push({
        title: {
          text: 'Bounce Rate (%)',
          style: { color: CHART_THEME.text.accent, fontSize: '11px', fontWeight: '600' },
        },
        opposite: true,
        min: 0,
        max: 1,
        labels: {
          style: { color: CHART_THEME.text.accent, fontSize: '10px' },
          formatter: function () {
            return formatPercent(Number(this.value), 0);
          },
        },
        gridLineWidth: 0,
      });
    } else if (hasBounceRate && !hasVolumetricMetrics) {
      yAxes.push({
        title: {
          text: 'Bounce Rate (%)',
          style: { color: CHART_THEME.text.secondary, fontSize: '11px', fontWeight: '600' },
        },
        min: 0,
        max: 1,
        labels: {
          style: { color: CHART_THEME.text.muted, fontSize: '10px' },
          formatter: function () {
            return formatPercent(Number(this.value), 0);
          },
        },
        gridLineColor: CHART_THEME.grid.line,
      });
    } else {
      const hasRevenue = metrics.includes(METRICS.REVENUE);
      yAxes.push({
        title: {
          text: hasRevenue ? 'Revenue ($) / Count' : 'Count',
          style: { color: CHART_THEME.text.secondary, fontSize: '11px', fontWeight: '600' },
        },
        labels: {
          style: { color: CHART_THEME.text.muted, fontSize: '10px' },
          formatter: function () {
            return formatAxisValue(Number(this.value), hasRevenue);
          },
        },
        gridLineColor: CHART_THEME.grid.line,
      });
    }

    const series: Highcharts.SeriesOptionsType[] = metrics.map((metricId) => {
      const def = METRIC_REGISTRY[metricId];
      const targetYAxis = isDualAxis && metricId === METRICS.BOUNCE_RATE ? 1 : 0;

      return {
        type: chartType,
        name: def.label,
        color: CHART_PALETTE[metricId] || CHART_PALETTE[METRICS.SESSIONS],
        yAxis: targetYAxis,
        data: data.map((row) => Number(row[metricId]) || 0),
        tooltip: {
          pointFormatter: function () {
            const formatted = def.format(Number(this.y));
            return `
              <span style="color:${this.color}">●</span> 
              ${this.series.name}: <b>${formatted}</b><br/>
            `;
          },
        },
      };
    });

    const options: Highcharts.Options = {
      chart: {
        type: chartType,
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'inherit',
        },
        height: 420,
      },
      title: {
        text: undefined,
      },
      accessibility: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories,
        labels: {
          style: {
            color: CHART_THEME.text.muted,
            fontSize: '11px',
          },
        },
        lineColor: CHART_THEME.grid.axis,
        tickColor: CHART_THEME.grid.axis,
      },
      yAxis: yAxes,
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: CHART_THEME.tooltip.background,
        borderColor: CHART_THEME.tooltip.border,
        borderRadius: 8,
        shadow: {
          color: CHART_THEME.tooltip.shadowColor,
          offsetX: 0,
          offsetY: 4,
          width: 12,
        },
        headerFormat: `<span style="font-size: 11px; font-weight: 600; color: ${CHART_THEME.text.highlight}">{point.key}</span><br/>`,
      },
      plotOptions: {
        column: {
          borderRadius: CHART_THEME.plot.borderRadius,
          borderWidth: 0,
          groupPadding: 0.15,
        },
        line: {
          lineWidth: CHART_THEME.plot.lineWidth,
          marker: {
            radius: CHART_THEME.plot.markerRadius,
            symbol: 'circle',
          },
        },
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        itemStyle: {
          color: CHART_THEME.text.secondary,
          fontSize: '12px',
          fontWeight: '500',
        },
        itemHoverStyle: {
          color: CHART_THEME.text.primary,
        },
      },
      series,
    };

    return {
      options,
      isDateDimension,
      isDualAxis,
      rowCount: data.length,
    };
  }, [dimension, metrics, data]);
};
