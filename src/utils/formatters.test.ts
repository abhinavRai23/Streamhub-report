import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatAxisValue,
} from './formatters';

describe('formatters utility', () => {
  it('formats counts and numbers with commas correctly', () => {
    expect(formatNumber(1200)).toBe('1,200');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(1200.4)).toBe('1,200');
    expect(formatNumber(1200.6)).toBe('1,201');
  });

  it('formats currency in USD correctly', () => {
    expect(formatCurrency(4800)).toBe('$4,800');
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(24780)).toBe('$24,780');
    expect(formatCurrency(24780.5, 2)).toBe('$24,780.50');
  });

  it('formats decimal ratios to percentages correctly', () => {
    expect(formatPercent(0.2)).toBe('20.0%');
    expect(formatPercent(0.4523, 1)).toBe('45.2%');
    expect(formatPercent(0.4523, 0)).toBe('45%');
    expect(formatPercent(0, 1)).toBe('0.0%');
    expect(formatPercent(1, 0)).toBe('100%');
  });

  it('formats axis values compactly for currency and numbers', () => {
    expect(formatAxisValue(5000, true)).toBe('$5k');
    expect(formatAxisValue(24000, true)).toBe('$24k');
    expect(formatAxisValue(500, true)).toBe('500');
    expect(formatAxisValue(5000, false)).toBe('5,000');
  });
});
