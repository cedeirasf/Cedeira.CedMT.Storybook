import { z } from 'zod'

export interface Filter {
  source: string // Nombre de la fuente de datos o "*"
  field: string // Campo de la fuente de datos o "*"
  operator: string // Operador de filtrado (e.g., "eq", "gt", "contains")
  value: string  // Valor del filtro
}

export interface FilteringOperator {
  expression: string // Representación del operador
  display: string // Texto para mostrar en la UI
}

export interface DataType {
  primitive: string // Tipo de dato (e.g., "string", "number")
  filtering_operators: Record<string, FilteringOperator> // Operadores disponibles
  options?: Record<string, string> // Opciones para selects, si las hay
}

export interface Field {
  display: string // Nombre del campo para mostrar
  data_type: string // Tipo de dato asociado
  filteringTips?: Array<{
    tip: string // Sugerencia para el filtro
    filtering_operator: string // Operador asociado
  }>
}

export interface Source {
  source: string // Nombre de la fuente
  display: string // Nombre para mostrar
  fields: Record<string, Field> // Campos disponibles
}

export interface FilterScheme {
  data_types: Record<string, DataType> // Tipos de datos
}

export interface ChannelViewFilterSchemeResponse {
  filters: Filter[]
  scheme: FilterScheme
  sources: Source[]
}



/* Components Interfaces  */

export interface Suggestion {
  source: string
  sourceDisplay: string
  field: string
  fieldDisplay: string
  operator: string
  operatorDisplay: string
  tip: string
  dataType: string
  defaultValue: string | undefined
}

export interface InputDebounceProps {
  onSearch: (query: string) => void
  onSelect: (filter: Partial<Filter>) => void
  placeholder?: string
  className?: string
  filterScheme: FilterScheme
  sources: ChannelViewFilterSchemeResponse["sources"]
  size?: "small" | "medium" | "large"
  isLoading?: boolean
  value?: string
  selectedFilters?: Filter[] // Añadimos esta prop para verificar duplicados
}

export const filterFormSchema = z.object({
  source: z.string().min(1, "Seleccione una fuente"),
  field: z.string().min(1, "Seleccione un campo"),
  operator: z.string().min(1, "Seleccione un operador"),
  value: z.union([z.string(), z.number()]).optional(),
})

export type FilterFormData = z.infer<typeof filterFormSchema>

export interface FilterFormProps {
  initialFilter: Filter | null
  onSubmit: (filter: Filter) => void
  filterScheme: FilterScheme
  sources: ChannelViewFilterSchemeResponse["sources"]
}

export interface DropdownFilterListProps {
  filters: Filter[]
  onSelect?: (filter: Filter) => void
  onRemove?: (filter: Filter) => void
  variant?: "grid" | "list"
  filterScheme: FilterScheme
  sources: ChannelViewFilterSchemeResponse["sources"]
  className?: string
}

export interface AdvancedFilterInputProps {
  selectedFilters: Filter[]
  onFiltersChange: (filters: Filter[]) => void
  onSearch: (query: string) => Promise<ChannelViewFilterSchemeResponse>
  filterScheme: FilterScheme
  sources: ChannelViewFilterSchemeResponse["sources"]
  className?: string
}