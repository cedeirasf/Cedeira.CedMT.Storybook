import React from 'react'
import type { Meta, StoryObj } from "@storybook/react"
import { CustomMultiselect } from '../components/custom/CustomMultiSelect'

const meta: Meta<typeof CustomMultiselect> = {
  title: "Components/ui/Multiselect",
  component: CustomMultiselect,
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
      description: "Define el tamaño del selector múltiple.",
      defaultValue: "medium",
    },
    state: {
      control: { type: "select" },
      options: ["default", "error", "active"],
      description: "Estado visual del selector que indica su condición actual.",
      defaultValue: "default",
    },
    label: {
      control: "text",
      description: "Etiqueta descriptiva que aparece sobre el selector.",
    },
    helperText: {
      control: "text",
      description: "Texto de ayuda que aparece debajo del selector.",
    },
    placeholder: {
      control: "text",
      description: "Texto provisional que se muestra cuando no hay selección.",
    },
    maxCount: {
      control: { type: "number", min: 1 },
      description: "Número máximo de elementos visibles antes de mostrar +N.",
    },
    selected: {
      control: "object",
      description: "Array de valores seleccionados.",
    },
  },
}

export default meta
type Story = StoryObj<typeof CustomMultiselect>

const MultiSelectWrapper: Story["render"] = (args) => {
  const [selected, setSelected] = React.useState<string[]>(args.selected || [])
  
  React.useEffect(() => {
    setSelected(args.selected || [])
  }, [args.selected])

  return (
    <div className="w-[300px]">
      <div className="p-4 bg-background rounded-lg">
        <CustomMultiselect
          {...args}
          selected={selected}
          onChange={setSelected}
        />
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-sm font-medium text-foreground">Selected values:</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap text-foreground">
            {JSON.stringify(selected, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: MultiSelectWrapper,
  args: {
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
      { value: "date", label: "Date" },
      { value: "elderberry", label: "Elderberry" },
    ],
    placeholder: "Select fruits...",
    label: "Fruits",
    maxCount: 3,
    size: "medium",
    state: "default",
  },
}

export const WithPreselected: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    selected: ["apple", "banana"],
  },
}

export const Small: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    size: "small",
    label: "Small Multiselect",
  },
}

export const Large: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    size: "large",
    label: "Large Multiselect",
  },
}

export const Error: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    state: "error",
    label: "Error State",
    helperText: "This field is required",
  },
}

export const Active: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    state: "active",
    label: "Active State",
  },
}

export const WithManyOptions: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
      { value: "date", label: "Date" },
      { value: "elderberry", label: "Elderberry" },
      { value: "fig", label: "Fig" },
      { value: "grape", label: "Grape" },
      { value: "kiwi", label: "Kiwi" },
      { value: "lemon", label: "Lemon" },
    ],
    label: "Many Options",
  },
}

export const CustomMaxCount: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    maxCount: 2,
    selected: ["apple", "banana", "cherry"],
    label: "Custom Max Count",
  },
}

export const WithHelperText: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    label: "With Helper Text",
    helperText: "Select your favorite fruits",
  },
}

