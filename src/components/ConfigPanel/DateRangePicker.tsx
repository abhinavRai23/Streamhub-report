import { memo } from 'react';
import { UI_STYLES } from '../../constants/styles';
import { DATE_CONFIG } from '../../constants/report';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (range: [string, string]) => void;
  minDate?: string;
  maxDate?: string;
}

export const DateRangePicker = memo(({
  startDate,
  endDate,
  onChange,
  minDate = DATE_CONFIG.MIN_DATE,
  maxDate = DATE_CONFIG.MAX_DATE,
}: DateRangePickerProps) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={startDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => onChange([e.target.value, endDate])}
        className={UI_STYLES.inputDate}
        aria-label="Start date"
      />
      <span className="text-xs text-slate-400 font-medium">to</span>
      <input
        type="date"
        value={endDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => onChange([startDate, e.target.value])}
        className={UI_STYLES.inputDate}
        aria-label="End date"
      />
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

