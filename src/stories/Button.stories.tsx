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
        "elevated",
        "tonal",
      ],
      description:
        "Determina el estilo visual del botón. Cada variante tiene un propósito específico, como acciones destructivas, secundarias o estilos de enlace.",
      defaultValue: "default",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg", "icon"],
      description:
        "Define el tamaño del botón. Los tamaños disponibles incluyen pequeño (`sm`), predeterminado (`default`), grande (`lg`) e íconos (`icon`).",
      defaultValue: "default",
    },
    className: {
      control: { type: "text" },
      description:
        "Permite añadir clases personalizadas de Tailwind CSS para modificar el estilo del botón según tus necesidades.",
      defaultValue: "",
    },
    onClick: {
      action: "clicked",
      description: "Callback que se ejecuta cuando se hace clic en el botón.",
    },
  },
};

export default meta;

type VariantType =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"
  | "elevated"
  | "tonal";

type SizeType = "sm" | "default" | "lg" | "icon";

const createStory = (
  variant: VariantType,
  size: SizeType,
  label: string
): StoryObj<typeof Button> => ({
  args: {
    variant,
    size,
    children: label,
    onClick: action(`${variant} clicked`),
    disabled: false,
    className: "",
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
});

// Historias generales para todas las variantes
export const Default = createStory(
  "default",
  "default",
  "Botón Predeterminado"
);
export const Secondary = createStory(
  "secondary",
  "default",
  "Botón Secundario"
);
export const Destructive = createStory(
  "destructive",
  "default",
  "Botón Destructivo"
);
export const Outline = createStory("outline", "default", "Botón Outline");
export const Ghost = createStory("ghost", "default", "Botón Ghost");
export const Link = createStory("link", "default", "Botón Link");
export const Elevated = createStory("elevated", "default", "Botón Elevado");
export const Tonal = createStory("tonal", "default", "Botón Tonal");

// Historias de botones con íconos
export const WithIconLeft = {
  args: {
    variant: "default",
    size: "default",
    className: "",
    children: (
      <>
        <PlusIcon className="mr-2 w-4 h-4" />
        Botón con Ícono Izquierdo
      </>
    ),
    onClick: action("con-ícono-izquierdo clicado"),
  },
};

export const WithIconRight = {
  args: {
    variant: "default",
    size: "default",
    className: "",
    children: (
      <>
        Botón con Ícono Derecho
        <CheckIcon className="ml-2 w-4 h-4" />
      </>
    ),
    onClick: action("con-ícono-derecho clicado"),
  },
};

// Historias de tamaño de íconos
export const IconOnly: StoryObj<typeof Button> = {
  args: {
    variant: "default",
    size: "icon",
    children: <CheckIcon className="w-5 h-5" />,
    onClick: action("solo-ícono clicado"),
    className: "", // Soporte para personalización de estilos
  },
};

// Historia personalizada con clase dinámica
export const CustomClass: StoryObj<typeof Button> = {
  args: {
    variant: "default",
    size: "default",
    className: "bg-red-500 border-2 border-black shadow-md", // Clase predeterminada
    children: "Botón Personalizado",
    onClick: action("clase-personalizada clicada"),
  },
  argTypes: {
    className: {
      control: { type: "text" },
      description:
        "Añade clases personalizadas para estilizar el botón de forma dinámica.",
      defaultValue: "",
    },
  },
};
