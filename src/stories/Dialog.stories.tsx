import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { CustomDialog } from "../components/custom/CustomDialog";
import { Button } from "../components/ui/button";

const meta: Meta<typeof CustomDialog> = {
  title: "Components/ui/Dialog",
  component: CustomDialog,
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
    isOpen: {
      control: { type: "boolean" },
      description: "Determina si el diálogo está abierto.",
    },
    closeOnClickOutside: {
      control: { type: "boolean" },
      description:
        "Determina si el diálogo se cierra al hacer clic fuera de él.",
    },
    size: {
      control: {
        type: "select",
      },
      description: "Define el tamaño del diálogo.",
      options: ["sm", "md", "lg", "xl", "2xl"],
    },
    backdropOpacity: {
      control: {
        type: "range",
        min: 0,
        max: 1,
        step: 0.1,
      },
      description: "Define la opacidad del fondo del diálogo.",
    },
  },
};

export default meta;

const createStory = (
  label: string,
  dialogProps: Partial<typeof CustomDialog.defaultProps> = {},
  buttonProps: Partial<typeof Button.defaultProps> = {}
): StoryObj<typeof CustomDialog> => ({
  render: (args) => {
    function DialogComponent() {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <>
          <Button {...buttonProps} onClick={() => setIsOpen(true)}>
            {label}
          </Button>
          <CustomDialog
            {...dialogProps}
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            {dialogProps.children || (
              <p>This is the main content of the dialog.</p>
            )}
          </CustomDialog>
        </>
      );
    }
    return <DialogComponent />;
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

export const Default = createStory("Open Default Dialog", {
  title: "Default Dialog",
  description: "This is a default dialog with basic configuration",
  size: "md",
  footer: (
    <>
      <Button variant="secondary" onClick={() => {}}>
        Cancel
      </Button>
      <Button onClick={() => {}}>Confirm</Button>
    </>
  ),
});

export const WithCustomBackdrop = createStory(
  "Open Dialog with Custom Backdrop",
  {
    title: "Custom Backdrop Dialog",
    description: "Dialog with a more transparent backdrop",
    backdropOpacity: 0.8,
    size: "lg",
    footer: (
      <>
        <Button variant="ghost" onClick={() => {}}>
          Close
        </Button>
      </>
    ),
  },
  {
    variant: "secondary",
  }
);

export const DisabledCloseOnOutsideClick = createStory(
  "Open Dialog without Outside Close",
  {
    title: "No Outside Close Dialog",
    description: "This dialog can only be closed by buttons",
    closeOnClickOutside: false,
    size: "sm",
    footer: (
      <>
        <Button onClick={() => {}}>Understood</Button>
      </>
    ),
  },
  {
    variant: "destructive",
  }
);

export const DisabledCloseUsingEscape = createStory(
  "Dialog without Escape Key Close",
  {
    title: "No Escape Key Close Dialog",
    description: "This dialog can only be closed by buttons",
    disableEscapeKeyDown: true,
    size: "sm",
    footer: (
      <>
        <Button onClick={() => {}}>Understood</Button>
      </>
    ),
  },
  {
    variant: "destructive",
  }
);

export const LongContentDialog = createStory(
  "Open Long Content Dialog",
  {
    title: "Long Content Dialog",
    description: "A dialog with extensive content",
    children: Array.from({ length: 10 }).map((_, index) => (
      <p key={index} className="mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    )),
    size: "xl",
    footer: (
      <>
        <Button variant="secondary" onClick={() => {}}>
          Close
        </Button>
      </>
    ),
  },
  {
    variant: "outline",
  }
);

export const NoHeaderDialog = createStory(
  "Open Dialog without Header",
  {
    size: "2xl",
    footer: (
      <>
        <Button variant="secondary" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => {}}>Confirm</Button>
      </>
    ),
    children: <p>This dialog has no title or description.</p>,
  },
  {
    variant: "ghost",
  }
);
