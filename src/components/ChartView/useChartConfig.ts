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

    // Group metrics by their axisType from the registry
    const metricsByAxis: Record<'primary' | 'secondary', Metric[]> = {
      primary: [],
      secondary: []
    };

    metrics.forEach(metricId => {
      const axisType = METRIC_REGISTRY[metricId].axisType;
      metricsByAxis[axisType].push(metricId);
    });

    // Determine if we need dual axis (metrics on both primary and secondary)
    const isDualAxis = metricsByAxis.primary.length > 0 && metricsByAxis.secondary.length > 0;

    // Build yAxes configuration dynamically
    const yAxes: Highcharts.YAxisOptions[] = [];

    // Helper function to format a list of items with proper conjunctions
    const formatMetricList = (labels: string[]): string => {
      if (labels.length === 0) return '';
      if (labels.length === 1) return labels[0];
      if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
      return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
    };

    // Build metric lists for labeling
    const primaryMetricLabels = metricsByAxis.primary.map(id => METRIC_REGISTRY[id].label);

    // Primary axis (always present if we have primary metrics)
    if (metricsByAxis.primary.length > 0) {
      // Determine label based on metrics present
      const hasRevenue = metricsByAxis.primary.includes(METRICS.REVENUE);
      const volumeLabels = primaryMetricLabels.filter(label => label !== 'Revenue');
      const hasVolume = volumeLabels.length > 0;

      let primaryTitle = 'Volume';
      if (hasRevenue && hasVolume) {
        primaryTitle = `Revenue ($) and ${formatMetricList(volumeLabels)}`;
      } else if (hasRevenue) {
        primaryTitle = 'Revenue ($)';
      } else if (hasVolume) {
        primaryTitle = formatMetricList(volumeLabels);
      }

      yAxes.push({
        title: {
          text: primaryTitle,
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

    // Secondary axis (only if we have secondary metrics)
    if (metricsByAxis.secondary.length > 0) {
      // Build dynamic title from secondary metrics
      const secondaryMetricLabels = metricsByAxis.secondary.map(
        metricId => METRIC_REGISTRY[metricId].label
      );

      yAxes.push({
        title: {
          text: `${formatMetricList(secondaryMetricLabels)} (%)`,
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
    }

    // Build series configuration
    const series: Highcharts.SeriesOptionsType[] = metrics.map((metricId) => {
      const def = METRIC_REGISTRY[metricId];
      const targetYAxis = def.axisType === 'secondary' && isDualAxis ? 1 : 0;

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