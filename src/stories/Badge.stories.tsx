import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon, InfoIcon, XIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
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
      options: [
        "neutral",
        "green",
        "blue",
        "red",
        "orange",
        "yellow",
        "violet",
      ],
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
};

export default meta;

type Story = StoryObj<typeof Badge>;

// Historias para mostrar todas las variantes con controles habilitados
export const Controlable: Story = {
  args: {
    color: "neutral",
    size: "md",
    rounded: "md",
    border: true,
    icon: <CheckIcon className="size-4" />,
    iconPosition: "start",
    children: "Badge Controlable",
  },
};

// Historias con múltiples ejemplos de args
export const Colores: Story = {
  args: {
    size: "md",
    rounded: "md",
    border: true,
  },
  render: (args) => (
    <div className="flex flex-row flex-wrap gap-2">
      <Badge {...args} color="neutral">
        Neutral
      </Badge>
      <Badge {...args} color="green">
        Éxito
      </Badge>
      <Badge {...args} color="blue">
        Información
      </Badge>
      <Badge {...args} color="red">
        Error
      </Badge>
      <Badge {...args} color="orange">
        Pendiente
      </Badge>
      <Badge {...args} color="yellow">
        Advertencia
      </Badge>
      <Badge {...args} color="violet">
        Etiqueta
      </Badge>
    </div>
  ),
};

// Historias con sombras
export const Sombra: Story = {
  args: {
    size: "md",
    rounded: "md",
    border: true,
  },
  render: (args) => (
    <div className="flex flex-row flex-wrap gap-2">
      <Badge {...args} className="shadow-sm">
        Sombra pequeña
      </Badge>
      <Badge {...args} className="shadow-md">
        Sombra mediana
      </Badge>
      <Badge {...args} className="shadow-lg">
        Sombra grande
      </Badge>
    </div>
  ),
};

// Historias con gradientes personalizados
export const Gradientes: Story = {
  args: {
    size: "md",
    rounded: "full",
    border: true,
  },
  render: (args) => (
    <div className="flex flex-row flex-wrap gap-2">
      <Badge
        {...args}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
      >
        Gradiente Azul-Púrpura
      </Badge>
      <Badge
        {...args}
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white"
      >
        Gradiente Rojo-Naranja
      </Badge>
    </div>
  ),
};

// Historias con iconos
export const ConIconos: Story = {
  args: {
    size: "md",
    rounded: "md",
    border: true,
  },
  render: (args) => (
    <div className="flex flex-row flex-wrap gap-2">
      <Badge {...args} icon={<CheckIcon className="size-4" />}>
        Con icono al inicio
      </Badge>
      <Badge
        {...args}
        icon={<InfoIcon className="size-4" />}
        iconPosition="end"
      >
        Con icono al final
      </Badge>
      <Badge {...args} icon={<XIcon className="size-4" />}>
        Con icono de cierre
      </Badge>
    </div>
  ),
};
