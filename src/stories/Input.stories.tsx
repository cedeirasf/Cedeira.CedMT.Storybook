import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Input } from "../components/ui/input"; // Ajusta la ruta si es necesario

const meta: Meta<typeof Input> = {
  title: "Components/ui/Input",
  component: Input,
  argTypes: {
    inputSize: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "Define el tamaño del input.",
      defaultValue: "medium",
    },
    inputState: {
      control: { type: "select" },
      options: ["default", "error", "active"],
      description: "Define el estado visual del input.",
      defaultValue: "default",
    },
    type: {
      control: { type: "select" },
      options: ["text", "number", "email", "password", "date", "tel", "url"],
      description: "Define el tipo de entrada del input.",
      defaultValue: "text",
    },
    placeholder: {
      control: "text",
      description: "Texto que se muestra cuando el campo está vacío.",
    },
    disabled: {
      control: "boolean",
      description: "Desactiva el input si está configurado como true.",
      defaultValue: false,
    },
    className: {
      control: "text",
      description: "Clases CSS adicionales para personalización.",
    },
    onChange: {
      action: "onChange",
      description: "Evento que se dispara al cambiar el valor del input.",
    },
    onFocus: {
      action: "onFocus",
      description: "Evento que se dispara al enfocar el input.",
    },
    onBlur: {
      action: "onBlur",
      description: "Evento que se dispara al perder el foco del input.",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

// Historia básica
export const Default: Story = {
  args: {
    placeholder: "Escribe aquí...",
    inputSize: "medium",
    type: "text",
  },
};

// Historia para tamaños
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input inputSize="small" placeholder="Small input" />
      <Input inputSize="medium" placeholder="Medium input" />
      <Input inputSize="large" placeholder="Large input" />
    </div>
  ),
};

// Historia para estados
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input inputState="default" placeholder="Default input" />
      <Input inputState="error" placeholder="Error input" />
      <Input inputState="active" placeholder="Active input" />
      <Input disabled placeholder="Disabled input" />
    </div>
  ),
};

// Historia para tipos de entrada
export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input type="text" placeholder="Text input" />
      <Input type="number" placeholder="Number input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="date" placeholder="Date input" />
      <Input type="tel" placeholder="Tel input" />
      <Input type="url" placeholder="URL input" />
    </div>
  ),
};

// Historia con personalización de clases
export const CustomStyles: Story = {
  args: {
    className: "bg-gray-100 border-blue-500 focus-visible:ring-blue-500",
    placeholder: "Input personalizado",
  },
};

/* // Historia para temas claro y oscuro
export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-background text-foreground p-4 dark:bg-gray-900 dark:text-white">
      <Input inputSize="medium" placeholder="Light theme input" />
      <div className="dark">
        <Input inputSize="medium" placeholder="Dark theme input" />
      </div>
    </div>
  ),
}; */
