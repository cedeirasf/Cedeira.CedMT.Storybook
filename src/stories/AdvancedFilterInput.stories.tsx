import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { AdvancedFilterInput } from '../components/custom/AdvancedFilter/AdvancedFilterInput'
import { FilterOption } from '../types/components/advanced-input-filter.type'
import { mockSuggestions } from  '../mocks/filter-data'



const meta: Meta<typeof AdvancedFilterInput> = {
  title: 'Components/ui/AdvancedFilterInput',
  component: AdvancedFilterInput,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a202c' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light"

      if (typeof window !== "undefined") {
        const root = document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
      }

      return (
        <div className={`w-full max-w-3xl rounded-lg border border-input bg-background  shadow-sm ${theme === 'dark' ? 'dark' : ''}`}>
          <Story />
        </div>
      )
    },
  ],
  argTypes: {
    selectedFilters: { 
      control: 'object',
      description: 'Array de filtros seleccionados actualmente'
    },
    onAddFilter: { 
      action: 'onAddFilter',
      description: 'Función llamada cuando se agrega un nuevo filtro'
    },
    onRemoveFilter: { 
      action: 'onRemoveFilter',
      description: 'Función llamada cuando se elimina un filtro'
    },
    onClearAll: { 
      action: 'onClearAll',
      description: 'Función llamada cuando se eliminan todos los filtros'
    },
    onSearch: { 
      action: 'onSearch',
      description: 'Función asincrónica llamada para realizar búsquedas'
    },
  },
}

export default meta
type Story = StoryObj<typeof AdvancedFilterInput>

const mockFilters: FilterOption[] = [
  { id: '1', type: 'number', label: 'Importe mayor a 23', source: '1', field: '3', operator: '1', value: '23' },
  { id: '2', type: 'select', label: 'TipoMov igual a \'C\'', source: '1', field: '1', operator: '1', value: 'C' },
  { id: '3', type: 'text', label: 'CBU empieza con "123"', source: '1', field: '4', operator: '3', value: '123' },
  { id: '4', type: 'date', label: 'Fecha desde Hoy 12:00pm', source: '1', field: '2', operator: '7', value: 'today' },
  { id: '5', type: 'date', label: 'Fecha en Coelsa hasta Hoy 12:30pm', source: '1', field: '2', operator: '7', value: 'today' },
]

const defaultArgs = {
  selectedFilters: mockFilters,
  onAddFilter: (filter: FilterOption) => console.log('Filtro añadido:', filter),
  onRemoveFilter: (filterId: string) => console.log('Filtro eliminado:', filterId),
  onClearAll: () => console.log('Todos los filtros eliminados'),
  onSearch: async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockSuggestions.filter(suggestion =>
      suggestion.label.toLowerCase().includes(query.toLowerCase())
    )
  },
}

export const Default: Story = {
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        story: 'Estado por defecto del componente mostrando múltiples filtros seleccionados.',
      },
    },
  },
}

export const DarkMode: Story = {
  args: defaultArgs,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Visualización del componente en modo oscuro.',
      },
    },
  },
}

export const Empty: Story = {
  args: {
    ...defaultArgs,
    selectedFilters: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado inicial del componente sin filtros seleccionados.',
      },
    },
  },
}

export const SingleFilter: Story = {
  args: {
    ...defaultArgs,
    selectedFilters: [mockFilters[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'Componente con un único filtro seleccionado.',
      },
    },
  },
}

export const LoadingState: Story = {
  args: {
    ...defaultArgs,
    selectedFilters: [],
    onSearch: async () => {
      await new Promise(resolve => setTimeout(resolve, 5000))
      return []
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demuestra el estado de carga durante la búsqueda de filtros. El indicador de carga se mostrará por 5 segundos.',
      },
    },
  },
}

export const NoResults: Story = {
  args: {
    ...defaultArgs,
    selectedFilters: [],
    onSearch: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return []
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Muestra el estado cuando la búsqueda no encuentra resultados.',
      },
    },
  },
}

export const ErrorState: Story = {
  args: {
    ...defaultArgs,
    selectedFilters: [],
    onSearch: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      throw new Error('Error de búsqueda')
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demuestra el manejo de errores durante la búsqueda de filtros.',
      },
    },
  },
}

export const LongLabelFilter: Story = {
  args: {
    ...defaultArgs,
    selectedFilters: [
      {
        id: '6',
        type: 'text',
        label: 'Este es un filtro con un nombre extremadamente largo que debería truncarse en la interfaz',
        source: '1',
        field: '4',
        operator: '3',
        value: 'texto largo'
      }
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Muestra cómo se manejan las etiquetas largas en los filtros.',
      },
    },
  },
}


