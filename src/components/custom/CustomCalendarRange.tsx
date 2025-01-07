import type { ICustomCalendarRange } from "../../types/components/custom-calendar-range.types";
import { Calendar } from "@/components/ui/calendar";
import clsx from "clsx";

export const CustomCalendarRange: React.FC<ICustomCalendarRange> = ({
  selected,
  onSelect,
  disabled = false,
  initialFocus = false,
  fromDate,
  toDate,
  className,
  numberOfMonths = 2,
  ...props
}) => {
  return (
    <Calendar
      mode="range"
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      initialFocus={initialFocus}
      fromDate={fromDate}
      toDate={toDate}
      numberOfMonths={numberOfMonths}
      className={clsx("rounded-md border shadow", className)}
      {...props}
    />
  );
};
