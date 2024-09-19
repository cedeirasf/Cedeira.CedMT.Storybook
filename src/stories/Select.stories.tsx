import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { action } from "@storybook/addon-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CustomSelect } from "../components/custom/CustomSelect";

const meta: Meta<typeof CustomSelect> = {
  title: "Components/ui/Select",
  component: CustomSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    options: {
      control: "object",
      description: "Array of options for the select.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the select",
    },
    onValueChange: { action: "valueChanged" },
    disabled: {
      control: "boolean",
      description: "Disables the select",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CustomSelect>;

export const Default: Story = {
  args: {
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3", disabled: true },
    ],
    placeholder: "Select an option",
    onValueChange: action("value changed"),
  },
};

export const WithCustomOptions: Story = {
  args: {
    options: [
      { value: "apple", label: "🍎 Apple" },
      { value: "banana", label: "🍌 Banana" },
      { value: "orange", label: "🍊 Orange", disabled: true },
    ],
    placeholder: "Choose a fruit",
    onValueChange: action("value changed"),
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    placeholder: "Disabled Select",
  },
  render: (args) => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={args.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {args.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};
