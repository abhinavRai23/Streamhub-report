import type { RawDataRow, AggregatedRow, Dimension, Metric, Filter } from '../types/report';

/**
 * Evaluates whether a raw data row satisfies a given filter.
 * Skips evaluation if filter value is unset/empty.
 */
export const matchesFilter = (row: RawDataRow, filter: Filter): boolean => {
  if (filter.operator === 'between') {
    const [start, end] = filter.value;
    const rowDate = row.date;
    if (start && end) {
      return rowDate >= start && rowDate <= end;
    }
    if (start) {
      return rowDate >= start;
    }
    if (end) {
      return rowDate <= end;
    }
    return true;
  }

  // EqualityFilter: 'equals' or 'not-equals'
  if (!filter.value || filter.value.trim() === '') {
    return true; // Ignore empty filter input so user typing/selecting isn't blanking results
  }

  const rowVal = String(row[filter.field]);
  if (filter.operator === 'equals') {
    return rowVal === filter.value;
  }
  if (filter.operator === 'not-equals') {
    return rowVal !== filter.value;
  }

  return true;
};

/**
 * Filters the raw dataset using AND logic across all specified filters.
 */
export const filterData = (rawData: RawDataRow[], filters: Filter[]): RawDataRow[] => {
  if (!filters || filters.length === 0) return rawData;
  return rawData.filter((row) => filters.every((filter) => matchesFilter(row, filter)));
};

/**
 * Aggregates filtered rows by the chosen dimension.
 *
 * CRITICAL RATIO-METRIC RULE:
 * `bounceRate` must NEVER be computed as a simple average of row bounce rates.
 * It is derived per group as `sum(bounces) / sum(totalVisits)` from raw counts.
 */
export const aggregateData = (
  filteredData: RawDataRow[],
  dimension: Dimension,
  _selectedMetrics?: Metric[]
): AggregatedRow[] => {
  interface IntermediateGroup {
    sessions: number;
    revenue: number;
    conversions: number;
    bounces: number;
    totalVisits: number;
  }

  const groupMap = new Map<string, IntermediateGroup>();

  for (const row of filteredData) {
    const key = String(row[dimension]);
    let group = groupMap.get(key);
    if (!group) {
      group = {
        sessions: 0,
        revenue: 0,
        conversions: 0,
        bounces: 0,
        totalVisits: 0,
      };
      groupMap.set(key, group);
    }

    group.sessions += row.sessions;
    group.revenue += row.revenue;
    group.conversions += row.conversions;
    group.bounces += row.bounces;
    group.totalVisits += row.totalVisits;
  }

  const result: AggregatedRow[] = [];

  groupMap.forEach((group, key) => {
    // Recompute ratio metric from its true components
    const bounceRate = group.totalVisits > 0 ? group.bounces / group.totalVisits : 0;

    result.push({
      [dimension]: key,
      sessions: group.sessions,
      revenue: group.revenue,
      conversions: group.conversions,
      bounces: group.bounces,
      totalVisits: group.totalVisits,
      bounceRate,
    });
  });

  // Sort: Chronological for date, alphabetical for categorical dimensions
  result.sort((a, b) => {
    const valA = String(a[dimension]);
    const valB = String(b[dimension]);
    return valA.localeCompare(valB);
  });

  return result;
};

/**
 * Master pipeline: filters raw dataset and aggregates according to config.
 */
export const processData = (
  rawData: RawDataRow[],
  dimension: Dimension,
  selectedMetrics: Metric[],
  filters: Filter[]
): AggregatedRow[] => {
  const filtered = filterData(rawData, filters);
  return aggregateData(filtered, dimension, selectedMetrics);
};