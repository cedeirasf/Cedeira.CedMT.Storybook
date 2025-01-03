export interface ICustomCalendar {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  initialFocus?: boolean;
  fromDate?: Date;
  toDate?: Date;
  className?: string;
}
