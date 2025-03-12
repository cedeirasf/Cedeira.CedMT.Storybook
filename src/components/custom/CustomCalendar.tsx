import type { ICustomCalendar } from "@/types/components/custom-calendar.types";
import { Calendar } from "@/components/ui/calendar";
import clsx from "clsx";
import React from "react";

export const CustomCalendar: React.FC<ICustomCalendar> = ({
  selected,
  onSelect,
  disabled = false,
  initialFocus = false,
  fromDate,
  toDate,
  className,
  ...props
}) => {
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      initialFocus={initialFocus}
      fromDate={fromDate}
      toDate={toDate}
      className={clsx("rounded-md border shadow", className)}
      {...props}
    />
  );
};
