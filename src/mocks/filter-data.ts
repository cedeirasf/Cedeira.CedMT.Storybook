import {  Field, FilterOption } from  '../types/components/advanced-input-filter.type'

export const sources = [
  { id: '1', label: 'Coelsa' },
  { id: '2', label: 'CoelsaId' },
]

export const fields: Field[] = [
  { 
    id: '1', 
    label: 'Tipo Movimiento',
    type: 'select',
    operators: ['1', '2'] // Es, No es
  },
  { 
    id: '2', 
    label: 'Fecha',
    type: 'date',
    operators: ['1', '2', '7', '8'] // Es, No es, Desde, Hasta
  },
  { 
    id: '3', 
    label: 'Importe',
    type: 'number',
    operators: ['1', '2', '7', '8'] // Es, No es, Mayor a, Menor a
  },
  { 
    id: '4', 
    label: 'CBU',
    type: 'text',
    operators: ['1', '2', '3', '4', '5', '6'] // Todos menos rangos
  },
]

export const operators = [
  { id: '1', label: 'Es' },
  { id: '2', label: 'No es' },
  { id: '3', label: 'Contiene' },
  { id: '4', label: 'No contiene' },
  { id: '5', label: 'Está vacío' },
  { id: '6', label: 'No está vacío' },
  { id: '7', label: 'Desde' },
  { id: '8', label: 'Hasta' },
]

// Initial filters that will be shown as tags
export const initialFilters: FilterOption[] = [
  { 
    id: '1',
    type: 'date',
    label: 'Fecha desde Hoy 12:00pm',
    source: '1',
    field: '2',
    operator: '7',
    value: 'today'
  },
  { 
    id: '2',
    type: 'number',
    label: 'Importe mayor a 1000',
    source: '1',
    field: '3',
    operator: '7',
    value: 1000
  },
  { 
    id: '3',
    type: 'text',
    label: 'CBU contiene "123"',
    source: '1',
    field: '4',
    operator: '3',
    value: '123'
  }
]

export const mockSuggestions: FilterOption[] = [
  { 
    id: '1', 
    type: 'date', 
    label: 'Fecha igual a...',
    source: '1',
    field: '2',
    operator: '1',
  },
  { 
    id: '2', 
    type: 'date', 
    label: 'Fecha desde...',
    source: '1',
    field: '2',
    operator: '7',
  },
  { 
    id: '3', 
    type: 'number', 
    label: 'Importe mayor a...',
    source: '1',
    field: '3',
    operator: '7',
  },
  { 
    id: '4', 
    type: 'text', 
    label: 'CBU contiene...',
    source: '1',
    field: '4',
    operator: '3',
  },
]

