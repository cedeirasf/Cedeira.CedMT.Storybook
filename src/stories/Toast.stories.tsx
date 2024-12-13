import { Meta, StoryFn } from "@storybook/react";
import { AlertTriangle, CheckCircle, Smile } from "lucide-react";
import React from "react";
import { CustomToast } from "../components/custom/CustomToast";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

const meta: Meta = {
  title: "Components/ui/Toast",
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
    action: {
      control: false,
      description: "Acción personalizada en el toast, como un botón.",
    },
    icon: {
      control: false,
      description: "Icono personalizado para el toast.",
    },
  },
};

export default meta;

const Template: StoryFn = (args) => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: args.title || `${args.variant} Toast`,
      description: args.description ||  `Este es un toast de tipo ${args.variant} en la posición ${args.position}.`,
      variant: args.variant,
      toastDuration: args.toastDuration,
      position: args.position,
      icon: args.icon, // Icono personalizado si es proporcionado
      action: args.action, // Acción personalizada si es proporcionada
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
  description:  "Este es el toast por defecto.",
};

export const Success = Template.bind({});
Success.args = {
  variant: "success",
  toastDuration: "long",
  position: "bottom-right",
  title: "Success",
  description:  "Este es un toast de tipo success.",
  icon: <CheckCircle className="text-green-600" />, // Otro ejemplo con un icono personalizado
};

export const Error = Template.bind({});
Error.args = {
  variant: "error",
  toastDuration: "sticky",
  position: "top-left",
  title:  "Error",
  description:  "Ocurrió un error.",
  icon: <AlertTriangle className="text-red-600" />, // Otro ejemplo con un icono personalizado
};

export const Warning = Template.bind({});
Warning.args = {
  variant: "warning",
  toastDuration: "short",
  position: "bottom-left",
  title: "Warning",
  description:  "Este es un toast de tipo warning.",
  icon: <AlertTriangle className="text-red-600" />, // Otro ejemplo con un icono personalizado
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  variant: "info",
  toastDuration: "short",
  position: "top-right",
  title:  "Custom Icon",
  description:  "Este es un toast que utiliza un icono personalizado.",
  icon: <Smile className="text-yellow-600" />, // Icono personalizado enviado como prop
};

export const AlertIcon = Template.bind({});
AlertIcon.args = {
  variant: "error",
  toastDuration: "short",
  position: "top-left",
  title:  "Alert Icon",
  description:  "Este es un toast que utiliza un icono de alerta.",
  icon: <AlertTriangle className="text-red-600" />, // Otro ejemplo con un icono personalizado
};

export const WithAction = Template.bind({});
WithAction.args = {
  variant: "info",
  toastDuration: "long",
  position: "top-right",
  title:  "Toast with Action",
  description:  "Este es un toast que incluye un botón de acción.",
  action: <Button size="sm" variant={"outline"} onClick={() => alert("Action triggered!")}> Undo </Button>, // Acción personalizada
};
