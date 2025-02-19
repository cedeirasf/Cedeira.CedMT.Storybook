import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import {
  CustomTooltip,
  CustomTooltipProps,
} from "../components/custom/CustomTooltip";
import { Button } from "../components/ui/button";

const meta: Meta<CustomTooltipProps> = {
  title: "Components/ui/Tooltip",
  component: CustomTooltip,
  parameters: {
    docs: {
      description: {
        component:
          "El componente `CustomTooltip` se utiliza para mostrar información sobre algún componente en particular.",
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description:
        "Se abre cuando se renderiza. Se usa cuando no se necesita control su estado una vez abierto.",
    },
    disableHoverableContent: {
      control: "boolean",
      description:
        "Previene que el tooltip permanezca abierto mientras se hace hover.",
    },
    delayDuration: {
      control: "number",
      description: "Establece cuanto tarda en abrirse",
    },
    onOpenChange: {
      control: false,
      description:
        "Manejador de estados que se ejecuta cuando cambia el estado abierto del tooltip.",
    },
    open: {
      control: "boolean",
      description:
        "El estado controlado del tooltip. Debe ser usado en conjunción con onOpenChange.",
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description:
        "Lado donde se encontrará el tooltip en relación con el trigger.",
    },
    trigger: {
      control: false,
      description: "Elemento donde se ejecuta el tooltip.",
    },
    children: {
      control: false,
      description: "El contenido del tooltip.",
    },
    variant: {
      control: "select",
      options: ["default", "success", "error", "warning", "info"],
      description:
        "Define el tipo de color del tooltip (éxito, error, advertencia o información).",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Posición del tooltip en relación con el trigger.",
    },
  },
};

export default meta;

const Template: StoryFn = (args) => {
  return (
    <div className="flex justify-center items-center">
      <CustomTooltip {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  variant: "default",
  align: "center",
  side: "top",
  defaultOpen: true,
  trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
  children: "This is the tooltip",
};

export const Success = Template.bind({});
Success.args = {
  variant: "success",
  align: "center",
  trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
  children: "This is the tooltip",
};

export const Error = Template.bind({});
Error.args = {
  variant: "error",
  align: "center",
  trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
  children: "This is the tooltip",
};

export const Warning = Template.bind({});
Warning.args = {
  variant: "warning",
  align: "center",
  trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
  children: "This is the tooltip",
};

export const Info = Template.bind({});
Info.args = {
  variant: "info",
  align: "center",
  trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
  children: "This is the tooltip",
};

export const Action = Template.bind({});
Action.args = {
  variant: "default",
  side: "right",
  trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
  children: (
    <>
      ACCION: <Button onClick={() => alert("Accion")}>Accion</Button>
    </>
  ),
};
