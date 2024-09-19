import type { Meta, StoryObj } from "@storybook/react";
import { Badge, BadgeProps } from "../components/ui/badge";
import * as React from "react";

const meta: Meta<typeof Badge> = {
  title: "Components/ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
    },
    children: {
      control: "text",
      defaultValue: "Badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = (args: BadgeProps) => <Badge {...args} />;
Default.args = {
  variant: "default",
  children: "Default Badge",
};

export const Secondary: Story = (args: BadgeProps) => <Badge {...args} />;
Secondary.args = {
  variant: "secondary",
  children: "Secondary Badge",
};

export const Destructive: Story = (args: BadgeProps) => <Badge {...args} />;
Destructive.args = {
  variant: "destructive",
  children: "Destructive Badge",
};

export const Outline: Story = (args: BadgeProps) => <Badge {...args} />;
Outline.args = {
  variant: "outline",
  children: "Outline Badge",
};
