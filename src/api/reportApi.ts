import type { RawDataRow } from '../types/report';
import mockData from './mockData.json';

// Simulated API options for testing
let forceApiFailure = false;

export const setForceApiFailure = (shouldFail: boolean) => {
  forceApiFailure = shouldFail;
};

/**
 * Simulates fetching analytics report data from a remote endpoint.
 * Introduces ~400ms latency and a ~10% random failure rate (or forced failure for testing).
 */
export const fetchReportData = async (): Promise<RawDataRow[]> => {
  // Simulate 400ms network roundtrip
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (forceApiFailure || Math.random() < 0.1) {
    throw new Error('503 Service Unavailable: Analytics engine simulated transient error. Please retry.');
  }

  // Deep clone to ensure immutability
  return JSON.parse(JSON.stringify(mockData)) as RawDataRow[];
};