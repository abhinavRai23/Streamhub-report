/**
 * Shared UI styling constants to enforce DRY principles across Tailwind classes.
 */

export const UI_STYLES = {
  // Input fields
  inputBase:
    'h-9 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-100 transition-colors w-full',
  
  inputDate:
    'h-9 px-2.5 py-1 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 w-full transition-colors',

  // Cards and containers
  cardBase:
    'bg-white rounded-xl border border-slate-200/80 shadow-xs p-6',
  
  cardBordered:
    'bg-white rounded-lg border border-slate-200 shadow-2xs',

  // Typography and labels
  labelUppercase:
    'block text-2xs font-semibold text-slate-500 uppercase tracking-wider mb-1',
  
  sectionTitle:
    'text-xs font-semibold text-slate-700 uppercase tracking-wider',

  // Badges and pills
  badgeRatio:
    'px-1.5 py-0.5 text-3xs font-semibold uppercase tracking-wider rounded bg-amber-100 text-amber-800',
  
  badgeCount:
    'text-2xs font-medium px-2 py-0.5 rounded-full',
} as const;
