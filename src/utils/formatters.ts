/**
 * Formatting utilities for metrics and chart axes.
 * Centralizes all numeric, currency, and percentage formatting across the application.
 */

const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/**
 * Formats a count or generic integer with comma separation (e.g. 1,234)
 */
export const formatNumber = (val: number): string => {
  return numberFormatter.format(Math.round(val));
};

/**
 * Formats a currency value in USD without decimals (e.g. $24,780)
 */
export const formatCurrency = (val: number, maximumFractionDigits = 0): string => {
  if (maximumFractionDigits === 0) {
    return currencyFormatter.format(val);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(val);
};

/**
 * Formats a decimal ratio as a percentage string (e.g. 0.20 -> "20.0%" or "20%")
 */
export const formatPercent = (val: number, fractionDigits = 1): string => {
  return `${(val * 100).toFixed(fractionDigits)}%`;
};

/**
 * Formats Y-axis labels compactly for volumetric or currency metrics
 * (e.g. $5k or 1,200)
 */
export const formatAxisValue = (val: number, isCurrency: boolean): string => {
  if (isCurrency && val >= 1000) {
    return `$${(val / 1000).toFixed(0)}k`;
  }
  return formatNumber(val);
};
