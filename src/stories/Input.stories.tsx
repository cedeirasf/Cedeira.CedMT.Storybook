import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "../components/ui/Input"
import React from "react"

const meta: Meta<typeof Input> = {
  title: "Components/ui/Input",
  component: Input,
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
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "Define el tamaño del campo de entrada. Afecta al padding y tamaño de fuente.",
      defaultValue: "medium",
    },
    state: {
      control: { type: "select" },
      options: ["default", "error", "active"],
      description: "Estado visual del input que indica su condición actual.",
      defaultValue: "default",
    },
    type: {
      control: { type: "select" },
      options: ["text", "number", "email", "password", "date", "tel", "url"],
      description: "Tipo de datos que acepta el campo de entrada.",
      defaultValue: "text",
    },
    label: {
      control: "text",
      description: "Etiqueta descriptiva que aparece sobre el campo de entrada.",
    },
    helperText: {
      control: "text",
      description: "Texto de ayuda que aparece debajo del campo de entrada.",
    },
    placeholder: {
      control: "text",
      description: "Texto provisional que se muestra cuando el campo está vacío.",
    },
    disabled: {
      control: "boolean",
      description: "Determina si el campo de entrada está deshabilitado.",
    },
    className: {
      control: "text",
      description: "Clases personalizadas de Tailwind CSS para modificar el estilo.",
    },
  },
}

export default meta
/* type Story = StoryObj<typeof Input> */

const createStory = (
  args: Partial<React.ComponentProps<typeof Input>>
): StoryObj<typeof Input> => ({
  args,
  decorators: [
    (Story, context) => {
      const theme = context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light"

      if (typeof window !== "undefined") {
        const root = document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
      }

      return <Story />
    },
  ],
})

export const Default = createStory({
  size: "medium",
  state: "default",
  type: "text",
  label: "Label",
  helperText: "This is a helper text",
  placeholder: "Placeholder",
})

export const Email = createStory({
  ...Default.args,
  type: "email",
  label: "Email",
  placeholder: "ejemplo@dominio.com",
  helperText: "Ingrese un email válido",
})

export const Password = createStory({
  ...Default.args,
  type: "password",
  label: "Contraseña",
  placeholder: "••••••••",
  helperText: "Mínimo 8 caracteres",
})

export const Number = createStory({
  ...Default.args,
  type: "number",
  label: "Edad",
  placeholder: "18",
  helperText: "Debe ser mayor de edad",
})

export const Date = createStory({
  ...Default.args,
  type: "date",
  label: "Fecha de nacimiento",
  helperText: "Seleccione su fecha de nacimiento",
})

export const Small = createStory({
  ...Default.args,
  size: "small",
  label: "Campo pequeño",
})

export const Large = createStory({
  ...Default.args,
  size: "large",
  label: "Campo grande",
})

export const Error = createStory({
  ...Default.args,
  state: "error",
  label: "Campo con error",
  helperText: "Este campo es requerido",
})

export const Active = createStory({
  ...Default.args,
  state: "active",
  label: "Campo activo",
})

export const Disabled = createStory({
  ...Default.args,
  disabled: true,
  label: "Campo deshabilitado",
  helperText: "Este campo no se puede editar",
})

export const WithCustomClass = createStory({
  ...Default.args,
  label: "Campo personalizado",
  className: "border-2 border-purple-500 focus-visible:ring-purple-500",
  helperText: "Con estilos personalizados",
})

export const URL = createStory({
  ...Default.args,
  type: "url",
  label: "Sitio web",
  placeholder: "https://ejemplo.com",
  helperText: "Ingrese una URL válida",
})

export const Tel = createStory({
  ...Default.args,
  type: "tel",
  label: "Teléfono",
  placeholder: "+34 123 456 789",
  helperText: "Ingrese un número de teléfono válido",
})

