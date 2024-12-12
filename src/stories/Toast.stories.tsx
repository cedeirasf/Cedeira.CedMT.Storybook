import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { CustomToastProvider } from "../components/custom/CustomToast";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";

const meta: Meta = {
  title: "Components/CustomToast",
  decorators: [
    (Story) => (
      <CustomToastProvider>
        <Story />
      </CustomToastProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
    toastDuration: {
      control: "select",
      options: ["short", "long", "sticky"],
    },
    position: {
      control: "select",
      options: ["bottom-right", "bottom-left"],
    },
  },
};

export default meta;

const Template: StoryFn = (args) => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: `${args.variant} Toast`,
      description: `This is a ${args.variant} toast in the ${args.position} position.`,
      variant: args.variant,
      duration: args.toastDuration === "short" ? 3000 : 7000,
      position: args.position, // Pasar la posición al toast
    });
  };

  return <Button onClick={showToast}>Show Toast</Button>;
};

export const Default = Template.bind({});
Default.args = {
  variant: "info",
  toastDuration: "short",
  position: "top-right", // Control dinámico de posición
};
