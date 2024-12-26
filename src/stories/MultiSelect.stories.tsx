import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorList,
  MultiSelectorFooter,
} from "../components/custom/CustomMultiSelect";

const meta: Meta<typeof MultiSelector> = {
  title: "Components/ui/MultiSelect",
  component: MultiSelector,
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
    maxCount: {
      control: { type: "number", min: 1 },
      description: "Número máximo de elementos visibles antes de mostrar +N.",
    },
    placeholder: {
      control: "text",
      description: "Texto provisional que se muestra cuando no hay selección.",
    },
    tagStyles: {
      control: "object",
      description: "Estilos para los tags seleccionados.",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Define el tamaño de los tags del multiselect.",
    },
    rounded: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "full"],
      description: "Define el redondeo de los tags del multiselect.",
    },
    color: {
      control: { type: "select" },
      options: ["neutral", "green", "blue", "red", "orange", "yellow", "violet"],
      description: "Define el color de los tags del multiselect.",
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
};

export default meta;
type Story = StoryObj<typeof MultiSelector>;

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

const MultiSelectWrapper: Story["render"] = (args) => {
  const [values, setValues] = React.useState<string[]>(args.values || []);
  const [tagStyles, setTagStyles] = React.useState(args.tagStyles);

  React.useEffect(() => {
    setTagStyles((prev) => ({
      ...prev,
      size: args.size || prev?.size || "md",
      rounded: args.rounded || prev?.rounded || "full",
      color: args.color || prev?.color || "blue",
    }));
  }, [args.size, args.rounded, args.color]);

  React.useEffect(() => {
    setValues(args.values || []);
  }, [args.values]);

  return (
    <div className="w-[300px]">
      <div className="p-4 bg-background rounded-lg">
        <MultiSelector
          values={values}
          onValuesChange={setValues}
          options={options}
          {...args}
          
          tagStyles={tagStyles}
        >
          <MultiSelectorTrigger />
          <MultiSelectorContent>
            <MultiSelectorInput placeholder="Buscar opciones..." />
            <MultiSelectorList />
            <MultiSelectorFooter />
          </MultiSelectorContent>
        </MultiSelector>
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-sm font-medium text-foreground">Valores seleccionados:</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap text-foreground">
            {JSON.stringify(values, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: MultiSelectWrapper,
  args: {
    placeholder: "Seleccionar opciones...",
    maxCount: 2,
    size: "md",
    rounded: "full",
    color: "blue",
    tagStyles: {
      size: "md",
      rounded: "full",
      color: "blue",
    },
  },
};

export const CustomTagStyles: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    size: "sm",
    rounded: "lg",
    color: "violet",
    tagStyles: {
      size: "sm",
      rounded: "lg",
      color: "violet",
    },
  },
};

export const WithMaxCount: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    maxCount: 3,
  },
};

export const PreSelected: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    values: ["apple", "banana"],
  },
};

export const LongList: Story = {
  render: MultiSelectWrapper,
  args: {
    ...Default.args,
    options: [
      ...options,
      { value: "kiwi", label: "Kiwi" },
      { value: "lemon", label: "Lemon" },
      { value: "mango", label: "Mango" },
      { value: "nectarine", label: "Nectarine" },
      { value: "orange", label: "Orange" },
      { value: "papaya", label: "Papaya" },
      { value: "quince", label: "Quince" },
      { value: "raspberry", label: "Raspberry" },
      { value: "strawberry", label: "Strawberry" },
    ],
  },
};
