import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Button } from "../components/ui/button";
import { PlusIcon, CheckIcon } from "lucide-react";
import React from "react";

const meta: Meta<typeof Button> = {
  title: "Components/ui/Button",
  component: Button,
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
      options: ["sm", "default", "lg", "icon"],
    },
    onClick: { action: "clicked" },
  },
};

export default meta;

type VariantType =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

const createStory = (variant: VariantType, label: string): StoryObj<typeof Button> => ({
  args: {
    variant,
    size: "default",
    children: label,
    onClick: action(`${variant} clicked`),
    disabled: false,
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light";

      if (typeof window !== "undefined") {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      }

      return <Story />;
    },
  ],
});

const createStoryWithIcons = (
  variant: VariantType,
  label: string,
  iconPosition: "left" | "right"
): StoryObj<typeof Button> => ({
  args: {
    variant,
    size: "default",
    children: (
      <>
        {iconPosition === "left" && <PlusIcon className="mr-2 w-4 h-4" />}
        {label}
        {iconPosition === "right" && <CheckIcon className="ml-2 w-4 h-4" />}
      </>
    ),
    onClick: action(`${variant} with icon ${iconPosition} clicked`),
    disabled: false,
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light";

      if (typeof window !== "undefined") {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      }

      return <Story />;
    },
  ],
});

// General Stories
export const Default = createStory("default", "Default Button");
export const Secondary = createStory("secondary", "Secondary Button");
export const Destructive = createStory("destructive", "Destructive Button");
export const Outline = createStory("outline", "Outline Button");
export const Ghost = createStory("ghost", "Ghost Button");
export const Link = createStory("link", "Link Button");

export const WithIconLeft = createStoryWithIcons(
  "default",
  "Button with Icon",
  "left"
);
export const WithIconRight = createStoryWithIcons(
  "default",
  "Button with Icon",
  "right"
);

// Icon-only Story
export const IconOnly: StoryObj<typeof Button> = {
  args: {
    variant: "default",
    size: "icon",
    children: <CheckIcon className="w-5 h-5" />,
    onClick: action("icon-only clicked"),
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light";

      if (typeof window !== "undefined") {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      }

      return <Story />;
    },
  ],
};
