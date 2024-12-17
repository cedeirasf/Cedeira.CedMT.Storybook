import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TagFilter from "../components/custom/CustomTagFilter";

const meta: Meta<typeof TagFilter> = {
  title: "Components/ui/TagFilter",
  component: TagFilter,
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
    label: {
      control: "text",
      description: "Texto del TagFilter",
      defaultValue: "Filtro Activo",
    },
    onClick: {
      action: "onClick",
      description: "Acción al hacer clic en el lado izquierdo del tag.",
    },
    onRemove: {
      action: "onRemove",
      description: "Acción al hacer clic en la cruz para eliminar el tag.",
    },
    color: {
      control: { type: "select" },
      options: ["neutral", "green", "blue", "red", "orange", "yellow", "violet"],
      description: "Color del TagFilter",
      defaultValue: "neutral",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Tamaño del TagFilter",
      defaultValue: "md",
    },
    rounded: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "full"],
      description: "Redondeado del TagFilter",
      defaultValue: "md",
    },
    border: {
      control: "boolean",
      description: "Muestra borde alrededor del TagFilter.",
      defaultValue: true,
    },
    truncate: {
      control: "boolean",
      description: "Trunca el texto si es muy largo.",
      defaultValue: true,
    },
    disabled: {
      control: "boolean",
      description: "Deshabilita el TagFilter.",
      defaultValue: false,
    },
  },
};

export default meta;
 

// Decorador para alternar entre temas light/dark
const createStory = (
  args: Partial<React.ComponentProps<typeof TagFilter>>
): StoryObj<typeof TagFilter> => ({
  args,
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

// Historias
export const Default = createStory({
  label: "Filtro Activo",
});

export const Colors = createStory({
  label: "Tag Green",
  color: "green",
});

export const Truncated = createStory({
  label: "Este es un texto muy largo que debería truncarse correctamente en el TagFilter",
  truncate: true,
});

export const Disabled = createStory({
  label: "Filtro Deshabilitado",
  disabled: true,
});

export const NoBorder = createStory({
  label: "Sin Borde",
  border: false,
});

export const RoundedFull = createStory({
  label: "Filtro Redondeado",
  rounded: "full",
});

export const Sizes = createStory({
  label: "Filtro Tamaño",
  size: "lg",
});

export const Clickable = createStory({
  label: "Filtro con Acciones",
  onClick: () => alert("Se hizo clic en el filtro"),
  onRemove: () => alert("Se eliminó el filtro"),
});
