import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "../components/custom/CustomTimePicker";
import * as React from "react";

const meta: Meta<typeof TimePicker> = {
  title: "Components/ui/TimePicker",
  component: TimePicker,
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
    value: {
      control: "object",
      description:
        "El valor actual del TimePicker. Objeto con propiedades hours, minutes, seconds y period.",
    },
    onChange: {
      action: "changed",
      description: "Función llamada cuando el valor del tiempo cambia.",
    },
    format: {
      control: { type: "radio" },
      options: ["12h", "24h"],
      description: "Formato de tiempo (12 horas o 24 horas).",
      defaultValue: "12h",
    },
    disabled: {
      control: "boolean",
      description: "Determina si el TimePicker está deshabilitado.",
      defaultValue: false,
    },
    minTime: {
      control: "object",
      description: "Tiempo mínimo seleccionable.",
    },
    maxTime: {
      control: "object",
      description: "Tiempo máximo seleccionable.",
    },
    className: {
      control: "text",
      description: "Clases CSS adicionales para aplicar al TimePicker.",
    },
    standalone: {
      control: "boolean",
      description:
        "Determina si el TimePicker se muestra como componente independiente sin Popover.",
      defaultValue: false,
    },
    error: {
      control: "text",
      description:
        "Mensaje de error para mostrar cuando el tiempo seleccionado es inválido.",
    },
  },
};

export default meta;

const createStory = (
  args: Partial<React.ComponentProps<typeof TimePicker>>
): StoryObj<typeof TimePicker> => ({
  args,
  decorators: [
    (Story, context) => {
      const theme =
        context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light";

      if (typeof window !== "undefined") {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      }

      return <Story />;
    },
  ],
});

export const Default = createStory({
  value: { hours: 12, minutes: 0, seconds: 0, period: "PM" },
  format: "12h",
});

export const Format24h = createStory({
  value: { hours: 14, minutes: 30, seconds: 0 },
  format: "24h",
});

export const WithSeconds = createStory({
  value: { hours: 9, minutes: 45, seconds: 30, period: "AM" },
  format: "12h",
});

export const Disabled = createStory({
  value: { hours: 10, minutes: 0, seconds: 0, period: "AM" },
  disabled: true,
});

export const WithTimeLimits = createStory({
  value: { hours: 12, minutes: 0, seconds: 0, period: "PM" },
  minTime: { hours: 9, minutes: 0, seconds: 0, period: "AM" },
  maxTime: { hours: 5, minutes: 0, seconds: 0, period: "PM" },
});

export const CustomInitialTime = createStory({
  value: { hours: 3, minutes: 45, seconds: 30, period: "AM" },
});

export const CustomStyling = createStory({
  value: { hours: 2, minutes: 15, seconds: 0, period: "PM" },
  className: "bg-purple-100 text-purple-800 border-2 border-purple-500",
});

export const Standalone = createStory({
  value: { hours: 9, minutes: 0, seconds: 0, period: "AM" },
  standalone: true,
});

export const WithError = createStory({
  value: { hours: 7, minutes: 0, seconds: 0, period: "AM" },
  minTime: { hours: 9, minutes: 0, period: "AM" },
  maxTime: { hours: 5, minutes: 0, period: "PM" },
  error: "Please select a time between 9:00 AM and 5:00 PM",
});

export const Dark = createStory({
  value: { hours: 9, minutes: 0, seconds: 0, period: "AM" },
});

Dark.parameters = {
  backgrounds: { default: "dark" },
};
