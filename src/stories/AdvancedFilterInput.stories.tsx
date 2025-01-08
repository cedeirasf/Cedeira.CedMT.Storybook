import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { AdvancedFilterInput } from '../components/custom/AdvancedFilterInput/AdvancedFilterInput'
import { FilterOption } from '../types/components/advanced-input-filter.type'
import { mockSuggestions } from  '../mocks/filter-data'

const meta: Meta<typeof AdvancedFilterInput> = {
  title: 'Components/AdvancedFilterInput',
  component: AdvancedFilterInput,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <Story />
      </div>
    ),
  ],
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
}

