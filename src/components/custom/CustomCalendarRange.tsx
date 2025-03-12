import type { ICustomCalendarRange } from "../../types/components/custom-calendar-range.types";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";

const CustomCalendarRange: React.FC<ICustomCalendarRange> = ({
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
      className={cn("rounded-md border shadow", className)}
      {...props}
    />
  );
};

export {
  type ICustomCalendarRange,
  type DateRange,
  CustomCalendarRange as CalendarRange,
  Calendar as CalendarShadcn,
  format,
};
