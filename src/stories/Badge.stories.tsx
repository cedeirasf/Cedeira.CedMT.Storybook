import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../components/ui/badge"; // Ajusta la ruta si es necesario
import { CheckIcon, InfoIcon, XIcon } from "lucide-react";
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

// Historias para cada color
export const Colores: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge color="neutral">Neutral</Badge>
      <Badge color="green">Éxito</Badge>
      <Badge color="blue">Información</Badge>
      <Badge color="red">Error</Badge>
      <Badge color="orange">Pendiente</Badge>
      <Badge color="yellow">Advertencia</Badge>
      <Badge color="violet">Etiqueta</Badge>
    </div>
  ),
};

// Historias con sombras
export const Sombra: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge className="shadow-sm">Sombra pequeña</Badge>
      <Badge className="shadow-md">Sombra mediana</Badge>
      <Badge className="shadow-lg">Sombra grande</Badge>
    </div>
  ),
};

// Historias con gradientes personalizados
export const Gradientes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        Gradiente Azul-Púrpura
      </Badge>
      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        Gradiente Rojo-Naranja
      </Badge>
    </div>
  ),
};

// Historias con iconos
export const ConIconos: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge icon={<CheckIcon className="size-4" />}>Con icono al inicio</Badge>
      <Badge icon={<InfoIcon className="size-4" />} iconPosition="end">
        Con icono al final
      </Badge>
      <Badge icon={<XIcon className="size-4" />}>Con icono de cierre</Badge>
    </div>
  ),
};

// Historias para tamaños
export const Tamaños: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge size="sm">Pequeña</Badge>
      <Badge size="md">Mediana</Badge>
      <Badge size="lg">Grande</Badge>
    </div>
  ),
};

// Historias con bordes y redondeado
export const BordesYRedondeado: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge rounded="sm">Borde pequeño</Badge>
      <Badge rounded="md">Borde mediano</Badge>
      <Badge rounded="lg">Borde grande</Badge>
      <Badge rounded="full">Borde completo</Badge>
    </div>
  ),
};
