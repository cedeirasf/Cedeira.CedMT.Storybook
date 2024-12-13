import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Button } from "../components/ui/Button";
import { CustomToast } from "../components/custom/CustomToast";
import { useToast } from "../hooks/use-toast";
import { Smile, AlertTriangle } from "lucide-react";

const meta: Meta = {
  title: "Componentes/CustomToast",
  component: CustomToast,
  parameters: {
    docs: {
      description: {
        component: "El componente `CustomToast` se utiliza para mostrar notificaciones en la aplicación.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "error", "warning", "info"],
      description: "Define el tipo de notificación (éxito, error, advertencia o información).",
    },
    toastDuration: {
      control: "select",
      options: ["short", "long", "sticky"],
      description: "Duración del toast: corto (3000ms), largo (7000ms) o fijo (requiere cierre manual).",
    },
    position: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left"],
      description: "Posición del toast en la pantalla.",
    },
    title: {
      control: "text",
      description: "El título del toast.",
    },
    description: {
      control: "text",
      description: "La descripción del toast.",
    },
  },
};

export default meta;

const Template: StoryFn = (args) => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: args.title || `${args.variant} Toast`,
      description: args.description || `This is a ${args.variant} toast in the ${args.position} position.`,
      variant: args.variant,
      toastDuration: args.toastDuration,
      position: args.position,
      icon: args.icon, // Icono personalizado si es proporcionado
    });
  };

  return (
    <div className="space-y-4">
      <Button onClick={showToast}>Show Toast</Button>
      <CustomToast />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  variant: "default",
  toastDuration: "short",
  position: "top-right",
  title: "Default Toast",
  description: "This is the default toast.",
};

export const Success = Template.bind({});
Success.args = {
  variant: "success",
  toastDuration: "long",
  position: "bottom-right",
  title: "Success Toast",
  description: "This toast indicates success.",
};

export const Error = Template.bind({});
Error.args = {
  variant: "error",
  toastDuration: "sticky",
  position: "top-left",
  title: "Error Toast",
  description: "An error has occurred.",
};

export const Warning = Template.bind({});
Warning.args = {
  variant: "warning",
  toastDuration: "short",
  position: "bottom-left",
  title: "Warning Toast",
  description: "This is a warning notification.",
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  variant: "info",
  toastDuration: "short",
  position: "top-right",
  title: "Custom Icon Toast",
  description: "This toast uses a custom icon.",
  icon: <Smile className="text-yellow-600" />, // Icono personalizado enviado como prop
};

export const AlertIcon = Template.bind({});
AlertIcon.args = {
  variant: "error",
  toastDuration: "short",
  position: "top-left",
  title: "Alert Icon Toast",
  description: "This toast uses an alert icon.",
  icon: <AlertTriangle className="text-red-600" />, // Otro ejemplo con un icono personalizado
};
