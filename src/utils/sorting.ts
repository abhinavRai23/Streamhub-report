import type { AggregatedRow } from '../types/report';

/**
 * Sorts aggregated dataset rows by a given metric or dimension key.
 * Handles both numeric comparisons and localized string comparisons.
 */
export const sortAggregatedRows = (
  rows: AggregatedRow[],
  sortKey: string,
  sortOrder: 'asc' | 'desc'
): AggregatedRow[] => {
  return [...rows].sort((a: AggregatedRow, b: AggregatedRow) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    const strA = String(valA ?? '');
    const strB = String(valB ?? '');
    return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });
};
