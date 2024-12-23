import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { CustomTooltip, CustomTooltipProps } from "../components/custom/CustomTooltip";
import { Button } from "../components/ui/button";

const meta: Meta<CustomTooltipProps> = {
  title: "Components/ui/Tooltip",
  component: CustomTooltip,
  parameters: {
    docs: {
      description: {
        component: "El componente `CustomTooltip` se utiliza para mostrar información sobre algún componente en particular.",
      },
    },
  },
  argTypes: {
    side: {
        control: 'select',
        options: ["top", "right", "bottom", "left"]
    },
    avoidCollisions: {
        control: 'boolean',
        description: "Icono personalizado para el toast.",
    },
    trigger: {
        control: false,
        description: "Icono personalizado para el toast.",
    },
    children: {
        control: false,
        description: "Icono personalizado para el toast.",
    },
    variant: {
      control: "select",
      options: ["default", "success", "error", "warning", "info"],
      description: "Define el tipo de notificación (éxito, error, advertencia o información).",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Posición del toast en la pantalla.",
    },
  },
};

export default meta;

const Template: StoryFn = (args) => {
  return (
    <div className="space-y-4">
      <CustomTooltip 
        {...args}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  variant: "default",
  align: "center",
  side: 'right',
  trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
  children: 'This is the tooltip'
};

export const Success = Template.bind({});
Success.args = {
    variant: "success",
    align: "center",
    trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
    children: 'This is the tooltip'
};

export const Error = Template.bind({});
Error.args = {
    variant: "error",
    align: "center",
    trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
    children: 'This is the tooltip'
};

export const Warning = Template.bind({});
Warning.args = {
    variant: "default",
    align: "center",
    trigger: <Button onClick={() => {}}>Show Tooltip</Button>,
    children: 'This is the tooltip'
};
