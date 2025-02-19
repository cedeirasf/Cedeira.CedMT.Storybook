import type { DateRange } from "../types/components/custom-calendar-range.types";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { CustomCalendarRange } from "../components/custom/CustomCalendarRange";
import { format } from "date-fns";

const meta: Meta<typeof CustomCalendarRange> = {
  title: "Components/ui/CalendarRange",
  component: CustomCalendarRange,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1a202c" },
      ],
    },
  },
  argTypes: {
    selected: {
      control: "date",
      description: "Selected date",
    },
    disabled: {
      control: "boolean",
      description: "Disables the calendar",
    },
    initialFocus: {
      control: "boolean",
      description: "Sets initial focus on calendar",
    },
    fromDate: {
      control: "date",
      description: "Minimum selectable date",
    },
    toDate: {
      control: "date",
      description: "Maximum selectable date",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;

const createStory = (
  calendarProps: Partial<React.ComponentProps<typeof CustomCalendarRange>> = {}
): StoryObj<typeof CustomCalendarRange> => ({
  render: (args) => {
    function CalendarRangeComponent() {
      const [range, setRange] = useState<DateRange>({
        from: new Date(),
        to: undefined,
      });

      const onSelect = (value: { from?: Date; to?: Date } | undefined) => {
        if (value?.from != null) {
          setRange({ from: value.from, to: value?.to });
        }
      };

      return (
        <div className="flex flex-col items-center gap-4">
          <CustomCalendarRange
            mode="range"
            onSelect={onSelect}
            {...calendarProps}
            {...args}
            selected={range}
          />
          {range && (
            <p className="text-sm">{`Selected: ${
              range.from ? format(range.from, "PPP") : ""
            } ${range.to ? `- ${format(range.to, "PPP")}` : ""}`}</p>
          )}
        </div>
      );
    }
    return <CalendarRangeComponent />;
  },
  decorators: [
    (Story, context) => {
      const theme =
        context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light";
      if (typeof window !== "undefined") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
      }
      return <Story />;
    },
  ],
});

export const Default = createStory({
  selected: {
    from: new Date(),
  },
});

export const WithDateRange = createStory({
  selected: {
    from: new Date(),
  },
  fromDate: new Date(2025, 1, 2),
  toDate: new Date(2025, 2, 2),
});

export const Disabled = createStory({
  selected: {
    from: new Date(),
  },
  disabled: true,
});

export const WithCustomStyles = createStory({
  selected: {
    from: new Date(),
  },
  className: "rounded-xl border-2 border-primary p-4",
});

export const DisplayOneMonth = createStory({
  selected: {
    from: new Date(),
  },
  numberOfMonths: 1,
});
