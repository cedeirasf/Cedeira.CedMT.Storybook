import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from "../components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../components/custom/CustomSheet'


const meta: Meta<typeof SheetContent> = {
  title: 'Components/ui/Sheet',
  component: SheetContent,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'right',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      defaultValue: 'medium',
    },
    showBackdrop: {
      control: 'boolean',
      defaultValue: true,
    },
    backdropClassName: {
      control: 'text',
    },
  },
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
}

export default meta
type Story = StoryObj<typeof SheetContent>

const SheetDemo = (args: React.ComponentProps<typeof SheetContent>) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button>Abrir Sheet</Button>
    </SheetTrigger>
    <SheetContent {...args}>
      <SheetHeader>
        <SheetTitle>Titulo</SheetTitle>
        <SheetDescription>
              Descripción de la sheet
        </SheetDescription>
      </SheetHeader>
      <div className="py-4">
        <p>
            Contenido de la sheet
        </p>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Guardar</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
)

export const Default: Story = {
  render: (args) => <SheetDemo {...args} />,
  args: {
    side: 'right',
    size: 'medium',
    showBackdrop: true,
  },
}

export const LeftSide: Story = {
  render: (args) => <SheetDemo {...args} />,
  args: {
    ...Default.args,
    side: 'left',
  },
}

export const TopSide: Story = {
  render: (args) => <SheetDemo {...args} />,
  args: {
    ...Default.args,
    side: 'top',
  },
}

export const BottomSide: Story = {
  render: (args) => <SheetDemo {...args} />,
  args: {
    ...Default.args,
    side: 'bottom',
  },
}

export const SmallSize: Story = {
  render: (args) => <SheetDemo {...args} />,
  args: {
    ...Default.args,
    size: 'small',
  },
}

export const LargeSize: Story = {
  render: (args) => <SheetDemo {...args} />,
  args: {
    ...Default.args,
    size: 'large',
  },
}

export const NoBackdrop: Story = {
  render: (args) => <SheetDemo {...args} />,
  args: {
    ...Default.args,
    showBackdrop: false,
  },
}

export const CustomBackdrop: Story = {
  render: (args) => <SheetDemo {...args} />,
  args: {
    ...Default.args,
    backdropClassName: 'bg-primary/50 backdrop-blur-sm',
  },
}

