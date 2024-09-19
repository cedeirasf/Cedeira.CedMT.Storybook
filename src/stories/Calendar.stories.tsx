import { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "../components/ui/calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/ui/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    mode: {
      control: { type: "select" },
      options: ["default", "multiple", "range", "single"],
    },
    initialFocus: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

// Template for stories
export const Default: StoryObj<typeof Calendar> = {
  args: {
    selected: new Date(),
    mode: "single",
    initialFocus: false,
    onSelect: (date: Date | undefined) => {
      console.log("Selected date:", date);
    },
  },
};

// Template for stories
export const DisabledDates: StoryObj<typeof Calendar> = {
  args: {
    mode: "single",
    initialFocus: false,
    selected: new Date(),
    onSelect: (date: Date | undefined) => {
      console.log("Selected date:", date);
    },
    disabled: [],
  },
};
