import * as React from "react";
import { ChevronUp, ChevronDown, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Time, TimeFormat } from "@/types/components/custom-times.types";
import {
  clampTime,
  decrementTimeValue,
  formatTime,
  incrementTimeValue,
  isTimeInRange,
  parseTimeInput,
} from "@/lib/time-utilts";

interface TimePickerProps {
  value?: Time;
  onChange?: (time: Time) => void;
  format?: TimeFormat;
  className?: string;
  disabled?: boolean;
  minTime?: Time;
  maxTime?: Time;
  error?: string;
  standalone?: boolean;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export function TimePicker({
  value = { hours: 12, minutes: 0, seconds: 0, period: "AM" },
  onChange,
  format = "12h",
  className,
  disabled = false,
  minTime,
  maxTime,
  error,
  standalone = false,
  name,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [time, setTime] = React.useState<Time>(
    clampTime(value, minTime, maxTime)
  );
  const [isEditing, setIsEditing] = React.useState<
    "hours" | "minutes" | "seconds" | null
  >(null);
  const id = React.useId();
  const errorId = `${id}-error`;
  const isInvalid = !isTimeInRange(time, minTime, maxTime);

  const handleTimeChange = (newTime: Time) => {
    const clampedTime = clampTime(newTime, minTime, maxTime);
    setTime(clampedTime);
    onChange?.(clampedTime);
  };

  const handleInputChange = (
    value: string,
    type: "hours" | "minutes" | "seconds"
  ) => {
    const newValue = parseTimeInput(value, type);
    handleTimeChange({ ...time, [type]: newValue });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "hours" | "minutes" | "seconds"
  ) => {
    if (e.key === "Enter") {
      setIsEditing(null);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handleTimeChange(incrementTimeValue(time, type));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleTimeChange(decrementTimeValue(time, type));
    } else if (e.key === "Tab") {
      setIsEditing(null);
    }
  };

  const togglePeriod = () => {
    const newPeriod = time.period === "AM" ? "PM" : "AM";
    if (isTimeInRange({ ...time, period: newPeriod }, minTime, maxTime)) {
      handleTimeChange({ ...time, period: newPeriod });
    }
  };

  const TimeUnit = ({
    type,
    value,
  }: {
    type: "hours" | "minutes" | "seconds";
    value: number;
  }) => (
    <div className="group relative flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={() => handleTimeChange(incrementTimeValue(time, type))}
        disabled={
          !isTimeInRange(incrementTimeValue(time, type), minTime, maxTime)
        }
        className="absolute -top-4 flex h-5 w-5 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:pointer-events-none text-muted-foreground hover:text-foreground"
        aria-label={`Increment ${type}`}
      >
        <ChevronUp className="h-3 w-3" />
      </button>
      {isEditing === type ? (
        <Input
          type="text"
          value={(value ?? 0).toString().padStart(2, "0")}
          onChange={(e) => handleInputChange(e.target.value, type)}
          onKeyDown={(e) => handleKeyDown(e, type)}
          onBlur={() => setIsEditing(null)}
          size="small"
          className="h-9 w-12 text-center text-xl p-0 border-input-dark dark:border-input bg-background dark:bg-background"
          aria-label={`Enter ${type}`}
          autoFocus
        />
      ) : (
        <div
          className={cn(
            "flex h-9 w-12 cursor-pointer items-center justify-center text-xl font-medium rounded-md transition-colors border border-transparent",
            isEditing === type &&
              "bg-primary/10 text-primary dark:bg-primary/20",
            !isEditing &&
              "hover:border-input-dark dark:hover:border-input hover:bg-background dark:hover:bg-background"
          )}
          onClick={() => setIsEditing(type)}
          role="button"
          tabIndex={0}
          aria-label={`Edit ${type}`}
        >
          {(value ?? 0).toString().padStart(2, "0")}
        </div>
      )}
      <button
        type="button"
        onClick={() => handleTimeChange(decrementTimeValue(time, type))}
        disabled={
          !isTimeInRange(decrementTimeValue(time, type), minTime, maxTime)
        }
        className="absolute -bottom-4 flex h-5 w-5 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:pointer-events-none text-muted-foreground hover:text-foreground"
        aria-label={`Decrement ${type}`}
      >
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );

  const TimePickerContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <TimeUnit type="hours" value={time.hours ?? 0} />
        <span className="text-xl text-muted-foreground">:</span>
        <TimeUnit type="minutes" value={time.minutes ?? 0} />
        <span className="text-xl text-muted-foreground">:</span>
        <TimeUnit type="seconds" value={time.seconds ?? 0} />
      </div>
      {format === "12h" && (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 flex items-center justify-center rounded-full transition-all",
            time.period === "AM"
              ? "bg-primary hover:bg-primary/90 text-white border-transparent dark:text-white"
              : "bg-background dark:bg-background hover:bg-accent/50 dark:hover:bg-accent/50 text-foreground dark:text-foreground border-input-dark dark:border-input"
          )}
          onClick={togglePeriod}
          disabled={
            !isTimeInRange(
              { ...time, period: time.period === "AM" ? "PM" : "AM" },
              minTime,
              maxTime
            )
          }
          aria-label={`Toggle between AM and PM, currently ${time.period}`}
        >
          <span className="text-xs font-medium">{time.period}</span>
        </Button>
      )}
    </div>
  );

  if (standalone) {
    return (
      <div className="space-y-2">
        <div
          className={cn(
            "w-full rounded-md border border-input-dark dark:border-input bg-background dark:bg-background p-4",
            isInvalid && "border-destructive",
            className
          )}
        >
          {TimePickerContent}
        </div>
        {(error || isInvalid) && (
          <div
            className="flex items-center gap-2 text-sm text-destructive"
            id={errorId}
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error || "Invalid time selected"}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-min-[200px] w-full justify-start text-left font-normal border-input-dark dark:border-input bg-background dark:bg-background",
              isInvalid && "border-destructive",
              !time && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            aria-invalid={isInvalid}
            aria-label={ariaLabel}
            aria-describedby={cn(error && errorId, ariaDescribedby)}
            name={name}
          >
            <Clock className="mr-2 h-4 w-4" />
            {formatTime(time, format)}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[250px] p-4 border-input-dark dark:border-input bg-background dark:bg-background"
          align="start"
        >
          {TimePickerContent}
        </PopoverContent>
      </Popover>
      {(error || isInvalid) && (
        <div
          className="flex items-center gap-2 text-sm text-destructive"
          id={errorId}
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error || "Invalid time selected"}</span>
        </div>
      )}
    </div>
  );
}
