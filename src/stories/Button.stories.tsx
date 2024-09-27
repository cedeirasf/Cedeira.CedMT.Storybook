import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Button> = {
  title: "Components/ui/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
    },
    onClick: { action: "clicked" },
  },
};

export default meta;

export const Default: StoryObj<typeof Button> = {
  args: {
    variant: "default",
    size: "default",
    children: "Outline Button",
    onClick: action("default click"),
    disabled: false,
    className: "",
  },
};

export const Outline: StoryObj<typeof Button> = {
  args: {
    variant: "outline",
    size: "default",
    children: "Outline Button",
    onClick: action("default click"),
    disabled: false,
    className: "",
  },
};

export const Ghost: StoryObj<typeof Button> = {
  args: {
    variant: "ghost",
    size: "lg",
    children: "Ghost Button",
    onClick: action("default click"),
    disabled: false,
    className: "",
  },
};

export const Link: StoryObj<typeof Button> = {
  args: {
    variant: "link",
    size: "lg",
    children: "Link Button",
    onClick: action("default click"),
    disabled: false,
    className: "",
  },
};
