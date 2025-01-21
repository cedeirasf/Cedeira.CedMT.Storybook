import type { DateRange as DayPickerDateRange } from "react-day-picker"

export type DateRange = DayPickerDateRange

export interface ICustomCalendarRange {
  selected?: DateRange
  onSelect?: (date: DateRange | undefined) => void
  disabled?: boolean
  initialFocus?: boolean
  fromDate?: Date
  toDate?: Date
  className?: string
  numberOfMonths?: number
  mode?: "range"
}

