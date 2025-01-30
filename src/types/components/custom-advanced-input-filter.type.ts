import { filterFormSchema } from "@/components/schemas/advanced-filter.schema"
import { z } from "zod"
import { Time } from "./custom-times.types"


export interface RangeValue {
  from: string
  to: string
}

export interface Filter {
  source: string
  field: string
  operator: string
  value: string  // Puede ser un string, un número o un objeto RangeValue (from, to) pero siempre se guarda como string
}

export type TimeValue = Time | null | undefined

export interface FilteringOperator {
  expression: string
  display: string
  range?: boolean
}

export interface DataType {
  primitive: string
  scope: string
  filtering_operators: Record<string, FilteringOperator>
  options?: Record<string, string>
}

export interface Field {
  display: string
  data_type: string
  filteringTips?: Array<{
    tip: string
    filtering_operator: string
  }>
}

export interface Source {
  source: string
  display: string
  fields: Record<string, Field>
}

export interface FilterScheme {
  data_types: Record<string, DataType>
}

export interface ChannelViewFilterSchemeResponse {
  filters: Filter[]
  scheme: FilterScheme
  sources: Source[]


}

export type FilterFormData = z.infer<typeof filterFormSchema>

export interface FilterFormProps {
  initialFilter: Filter | null
  onSubmit: (filter: Filter) => void
  filterScheme: FilterScheme
  sources: Source[]
}

export interface Suggestion {
  source: string
  sourceDisplay: string
  field: string
  fieldDisplay: string
  operator: string
  operatorDisplay: string
  tip: string
  dataType: string
  defaultValue: string
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
  selectedFilters?: Filter[]
}

export interface DefaultValues {
  TIME_DEFAULT: string
  DATE_FORMAT: string
  EMPTY_VALUE: string
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

