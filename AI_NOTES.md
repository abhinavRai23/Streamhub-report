# AI Usage & Senior Engineering Directives (`AI_NOTES.md`)

## 1. What AI Was Used For
During the development of the StreamHub Report Builder, AI was leveraged as an accelerator for boilerplate scaffolding and diagnostic acceleration, specifically:
- **Scaffolding Data Structures & Types**: Drafting the base TypeScript definitions for the 5 dimensions, 4 metrics, and raw data models from the confidentiality prompt specification.
- **Highcharts Option Boilerplate**: Generating initial configuration structures for Highcharts (axes formatting, legend layout, tooltip HTML wrappers, plot options).
- **Test Case Scaffolding**: Generating synthetic data combinations for unit tests in `dataEngine.test.ts`.
- **CSS / UI Primitive Tokens**: Assisting with Tailwind utility composition for pill badges, metric selectors, and responsive header layouts.

---

## 2. Examples Where AI Output Was Corrected, Rejected, or Pushed Back On

### Example A: The Ratio-Metric Trap (Naive Averaging Rejection)
- **What AI Initially Generated**: When prompted to aggregate grouped rows, the AI's first proposed implementation computed `bounceRate` by calculating the bounce rate for each individual row (`row.bounces / row.totalVisits`) and then performing `sum(rowBounceRates) / count(rows)`.
- **Why It Was Rejected & Corrected**: This is mathematically invalid. In analytics platforms, averaging per-row percentages completely skews figures whenever traffic distribution is uneven (Simpson's Paradox). For instance, a low-volume campaign with 90% bounce rate (9 bounces / 10 visits) weighted equally with a high-volume campaign with 1% bounce rate (10 bounces / 1,000 visits) yields a naive average of 45.5%, whereas the true weighted business ratio is `19 / 1010 = 1.88%`.
- **The Senior Fix**: Replaced the naive loop with a two-pass component aggregation pattern: grouping sums raw `bounces` and `totalVisits`, and derives `bounceRate = sum(bounces) / sum(totalVisits)` per group. A deterministic Vitest unit test was added specifically testing this boundary condition.

### Example B: React Query Client Re-Instantiation Inside Component
- **What AI Initially Generated**: The AI placed `const queryClient = new QueryClient();` directly inside the body of `function App() { ... }`.
- **Why It Was Rejected & Corrected**: Instantiating a `QueryClient` inside a component render function causes the client instance to be discarded and recreated on every single re-render. This completely breaks TanStack Query's cache, resets ongoing requests, causes infinite fetching loops, and leaks memory.
- **The Senior Fix**: Moved `QueryClient` instantiation outside of the React component lifecycle with robust cache configuration (`staleTime: 5 mins`, `refetchOnWindowFocus: false`).

### Example C: Hardcoded Secondary Axis Index & React 19 Symbol Incompatibility
- **What AI Initially Generated**: The AI assigned `yAxis: metric === 'bounceRate' ? 1 : 0` without verifying if any volumetric metrics were selected, while hardcoding `yAxis: [volumetricAxis, bounceRateAxis]`.
- **Why It Was Rejected & Corrected**: When a user selects *only* `bounceRate`, axis 1 was pointing to a secondary axis with axis 0 left completely empty or misconfigured. Furthermore, the AI imported `highcharts-react-official` directly in an environment where React element symbols required bundler interop resolution.
- **The Senior Fix**: Designed a dynamic multi-axis allocation resolver:
  1. `isDualAxis = hasBounceRate && hasVolumetricMetrics`.
  2. If `bounceRate` is selected alone, Primary Axis (Axis 0) is dynamically re-configured as a dedicated 0–100% scale.
  3. Implemented a resilient bundler interop export resolver for Highcharts that functions cleanly across bundler configurations.

### Example D: Type "Any-Soup" vs. Discriminated Union for Filters
- **What AI Initially Generated**: The AI declared a loose filter interface:
  ```ts
  interface Filter {
    field: string;
    operator: string;
    value: any;
  }
  ```
- **Why It Was Rejected & Corrected**: This loose typing allowed invalid combinations (e.g. `country` with operator `between`, or `date` with single string value instead of date tuple) and failed TypeScript strict compilation under `verbatimModuleSyntax`.

### Example E: Monolithic Component Bloat vs. Atomic Architecture
- **What AI Initially Generated**: The AI grouped entire features into giant monolithic files: `ChartView.tsx` (336 lines combining query, skeletons, error states, and Highcharts logic), `ConfigPanel.tsx` (229 lines combining header, dimension select, metric pills, and filter lists), and `TableView.tsx` (143 lines).
- **Why It Was Rejected & Corrected**: Monolithic components violate the Single Responsibility Principle, make code review difficult, increase merge conflict risk, and hinder unit testability. A senior engineer breaks complex UIs into discrete, single-purpose atomic components.
- **The Senior Fix**: Refactored the codebase into atomic components:
  - `ChartView/`: `ChartEmptyState`, `ChartSkeleton`, `ChartErrorState`, `HighchartsRenderer`, and `useChartConfig` hook (cutting `ChartView` to 93 lines).
  - `ConfigPanel/`: `ConfigPanelHeader`, `DimensionSelector`, `MetricSelector`, `DateRangePicker`, and `FilterSection` (cutting `ConfigPanel` to 67 lines).
  - `TableView/`: `TableHeader` and `TableRow` (cutting `TableView` to 92 lines).
### Example F: Hardcoded Hex Codes, Magic Strings & Duplicate Classes vs. Centralized Tokens
- **What AI Initially Generated**: The AI hardcoded magic strings (`'between'`, `'equals'`, `'date'`, `'device'`) across multiple files, embedded raw hex codes (`#6366f1`, `#10b981`, `#f59e0b`, `#475569`, `#64748b`) directly inside chart option objects, and duplicated lengthy Tailwind utility class strings across buttons, inputs, and card containers.
- **Why It Was Rejected & Corrected**: Hardcoded values create maintainability hazards, introduce visual inconsistency, and make theme adjustments or re-branding tedious. A production codebase should rely on single sources of truth.
- **The Senior Fix**: 
  - Extracted domain constants into `src/constants/report.ts` (`DIMENSIONS`, `METRICS`, `OPERATORS`, `VIEW_MODES`).
  - Created visualization theme tokens in `src/constants/theme.ts` (`CHART_PALETTE`, `CHART_THEME`), replacing all inline hex codes.
  - Consolidated common Tailwind classes into `src/constants/styles.ts` (`UI_STYLES.inputBase`, `UI_STYLES.cardBase`, `UI_STYLES.badgeRatio`).
### Example G: Naive Bundling & Unbounded Re-renders vs. React.lazy & Memoization
- **What AI Initially Generated**: The AI imported Highcharts synchronously into the main entry bundle, creating a bloated initial JS chunk (>490 kB). Components lacked `React.memo`, causing sibling components and chart canvases to re-render whenever the user typed into a filter or toggled view modes. Leftover boilerplate image/svg assets remained in `src/assets/`.
- **Why It Was Rejected & Corrected**: Production enterprise dashboards require optimal First Contentful Paint (FCP) and smooth 60fps UI responsiveness. Heavy charting engines should be code-split on demand, and component re-renders must be bounded.
- **The Senior Fix**:
  - Implemented code-splitting via `React.lazy` and `<Suspense fallback={<ChartSkeleton />}>` in `App.tsx`, slashing the initial bundle down to **190 kB (60 kB gzipped)**.
  - Wrapped `HighchartsRenderer`, `FilterRow`, `MetricSelector`, `DimensionSelector`, `TableHeader`, `TableRow`, etc. with `React.memo` and stabilized callback props via `useCallback`.
  - Encapsulated TanStack Query in `useReportData` with 5-minute client-side caching so `ChartView` and `TableView` never make duplicate requests.
  - Pruned unused assets from the repository.

### Example H: Repetitive Formatting Logic vs. Centralized Number Formatting Utilities
- **What AI Initially Generated**: The AI duplicated `new Intl.NumberFormat('en-US')` and manual string formatters across 5 different files (`reportSchema.ts`, `useChartConfig.ts` in two identical Y-axis formatter blocks, `TableRow.tsx`). Re-instantiating `Intl.NumberFormat` inside render loops and Highcharts callbacks also incurred unnecessary memory and CPU overhead.
- **Why It Was Rejected & Corrected**: Number, currency, and percentage formatting are core design system primitives. Duplicating formatting logic leads to formatting discrepancies (e.g. inconsistent decimals, currency symbols) and wastes performance.
- **The Senior Fix**:
  - Created `src/utils/formatters.ts` with singleton formatters: `formatNumber`, `formatCurrency`, `formatPercent`, and `formatAxisValue`.
  - Replaced inline duplicates across `reportSchema.ts` and `useChartConfig.ts`.
  - Added dedicated Vitest unit tests in `src/utils/formatters.test.ts`.

### Example I: Scattered Presets & Fixed Durations vs. Unified Domain Configuration Registry
- **What AI Initially Generated**: Hardcoded dimension preset lists (`['US', 'UK', 'FR', 'DE']`, `['desktop', 'mobile']`, etc.) directly inside `reportSchema.ts`, while storing benchmark presets in `report.ts` and hardcoding date placeholders (`"e.g. 2026-06-01"`) in `FilterRow.tsx`.
- **Why It Was Rejected & Corrected**: Changing dataset boundaries, available dimension filters, or default date windows required searching through multiple components and config files, violating the Single Source of Truth principle.
- **The Senior Fix**:
  - Unified all presets into `src/constants/report.ts` via `DIMENSION_PRESETS` and `DATE_CONFIG` (exposing `MIN_DATE`, `MAX_DATE`, `DEFAULT_START_DATE`, `DEFAULT_END_DATE`, `DEFAULT_DATE_RANGE`).
  - Derived dimension configurations dynamically in `reportSchema.ts`.
  - Bound `DateRangePicker` min/max constraints and `FilterRow` defaults directly to `DATE_CONFIG`.

### Example J: Inline Table Sorting & ID Generation vs. Extracted Modular Utilities
- **What AI Initially Generated**: Embedded raw inline sorting logic with multiple type checks inside `TableView.tsx` and duplicated random ID string generation inside `useReportStore.ts`.
- **Why It Was Rejected & Corrected**: Inline sorting comparators in component bodies clutter UI components, cannot be unit-tested in isolation, and increase the risk of sorting regressions.
- **The Senior Fix**:
  - Extracted `sortAggregatedRows` into `src/utils/sorting.ts` with full unit test coverage in `src/utils/sorting.test.ts`.
  - Extracted `generateUniqueId` into `src/utils/id.ts` for clean, testable ID assignment.

---

## 3. Total Time Spent & Gut Check
- **Total Rough Time Spent**: ~2.5 hours.
- **One-Line Gut Check on Time Allocation**:
  *60% of the time was spent on rock-solid architectural foundations (mathematically correct ratio aggregation, discriminated union types, dynamic multi-axis resolution, and automated Vitest regression tests), 25% on bulletproof UI state synchronization and browser verification, and 15% on documentation and interview walkthrough readiness.*