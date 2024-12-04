import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../components/ui/badge"; // Ajusta la ruta si es necesario
import { CheckIcon, InfoIcon } from "lucide-react";
import React from "react";

const meta: Meta<typeof Badge> = {
  title: "Components/ui/Badge",
  component: Badge,
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
    color: {
      control: { type: "select" },
      options: ["neutral", "green", "blue", "red", "orange", "yellow", "violet"],
      description: "Define el color de la etiqueta.",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Define el tamaño de la etiqueta.",
    },
    rounded: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "full"],
      description: "Define el radio de los bordes de la etiqueta.",
    },
    border: {
      control: { type: "boolean" },
      description: "Determina si la etiqueta tiene borde.",
    },
    icon: {
      description: "Permite agregar un icono a la etiqueta.",
    },
    iconPosition: {
      control: { type: "select" },
      options: ["start", "end"],
      description: "Define la posición del icono en relación al texto.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

// Historias para cada color
export const Neutral: Story = {
  args: {
    color: "neutral",
    size: "md",
    rounded: "md",
    border: true,
    children: "Neutral",
  },
};

export const Green: Story = {
  args: {
    color: "green",
    size: "md",
    rounded: "md",
    border: true,
    children: "Éxito",
  },
};

export const Blue: Story = {
  args: {
    color: "blue",
    size: "md",
    rounded: "md",
    border: true,
    children: "Información",
  },
};

export const Red: Story = {
  args: {
    color: "red",
    size: "md",
    rounded: "md",
    border: true,
    children: "Error",
  },
};

export const Orange: Story = {
  args: {
    color: "orange",
    size: "md",
    rounded: "md",
    border: true,
    children: "Pendiente",
  },
};

export const Yellow: Story = {
  args: {
    color: "yellow",
    size: "md",
    rounded: "md",
    border: true,
    children: "Advertencia",
  },
};

export const Violet: Story = {
  args: {
    color: "violet",
    size: "md",
    rounded: "md",
    border: true,
    children: "Etiqueta",
  },
};

// Historia con icono
export const ConIcono: Story = {
  args: {
    color: "green",
    size: "md",
    rounded: "full",
    border: true,
    icon: <CheckIcon className="size-4" />,
    children: "Éxito",
  },
};

// Historia con icono al final
export const ConIconoFinal: Story = {
  args: {
    color: "blue",
    size: "lg",
    rounded: "md",
    border: true,
    icon: <InfoIcon className="size-4" />,
    iconPosition: "end",
    children: "Información",
  },
};

// Historia con estilos personalizados
export const EtiquetaPersonalizada: Story = {
  args: {
    color: "neutral",
    size: "lg",
    rounded: "full",
    border: true,
    className: "bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg",
    children: "Etiqueta Personalizada",
  },
};

// Historias para diferentes tamaños
export const Pequeña: Story = {
  args: {
    color: "neutral",
    size: "sm",
    rounded: "md",
    border: true,
    children: "Etiqueta Pequeña",
  },
};

export const Mediana: Story = {
  args: {
    color: "neutral",
    size: "md",
    rounded: "md",
    border: true,
    children: "Etiqueta Mediana",
  },
};

export const Grande: Story = {
  args: {
    color: "neutral",
    size: "lg",
    rounded: "md",
    border: true,
    children: "Etiqueta Grande",
  },
};
