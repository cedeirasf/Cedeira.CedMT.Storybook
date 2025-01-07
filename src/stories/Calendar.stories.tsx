import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import React, { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "Components/ui/Calendar",
  component: Calendar,
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
  calendarProps: Partial<React.ComponentProps<typeof Calendar>> = {}
): StoryObj<typeof Calendar> => ({
  render: (args) => {
    function CalendarComponent() {
      const [date, setDate] = useState<Date | undefined>(
        args.selected ? new Date(args.selected as Date) : undefined
      );
      const onSelect = (date: Date | undefined) => {
        if (date) {
          setDate(date);
        }
      };

      return (
        <div className="flex flex-col items-center gap-4">
          <Calendar
            mode="single"
            onSelect={onSelect}
            {...calendarProps}
            {...args}
            selected={date}
          />
          {date && <p className="text-sm">Selected: {format(date, "PPP")}</p>}
        </div>
      );
    }
    return <CalendarComponent />;
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
  selected: new Date(),
});

export const WithDateRange = createStory({
  selected: new Date(),
  fromDate: new Date(2025, 1, 5),
  toDate: new Date(2025, 2, 5),
});

export const Disabled = createStory({
  selected: new Date(),
  disabled: true,
});

export const WithCustomStyles = createStory({
  selected: new Date(),
  className: "rounded-xl border-2 border-primary p-4",
});
