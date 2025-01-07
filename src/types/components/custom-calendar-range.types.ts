export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export interface ICustomCalendarRange {
  selected?: DateRange;
  onSelect?: (date: DateRange) => void;
  disabled?: boolean;
  initialFocus?: boolean;
  fromDate?: Date;
  toDate?: Date;
  className?: string;
  numberOfMonths?: number;
}
