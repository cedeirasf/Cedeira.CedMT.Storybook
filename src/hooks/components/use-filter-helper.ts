import * as React from "react"
import type {
  Filter,
  FilterScheme,
  ChannelViewFilterSchemeResponse,
  RangeValue,
} from "@/types/components/custom-advanced-input-filter.type"
import { parseISO, isValid } from "date-fns"

export function useFilterHelpers(filterScheme: FilterScheme, sources: ChannelViewFilterSchemeResponse["sources"]) {
  const getFieldDataType = React.useCallback(
    (filter: Filter): string | null => {
      if (filter.source === "*" && filter.field === "*") return "string"

      const source = sources.find((s) => s.source === filter.source)
      if (!source) return null

      const field = source.fields[filter.field]
      if (!field) return null

      return field.data_type
    },
    [sources],
  )

  const normalizeFilterValue = React.useCallback(
    (value: string | number | RangeValue, filter: Filter): string => {
      const dataType = getFieldDataType(filter)
      if (!dataType) return JSON.stringify(value)

      const typeConfig = filterScheme.data_types[dataType]
      if (!typeConfig) return JSON.stringify(value)

      const operator = typeConfig.filtering_operators[filter.operator]

      if (operator?.range && typeof value === "object" && "from" in value && "to" in value) {
        return JSON.stringify(value)
      }

      // Normalización específica por tipo de dato
      switch (typeConfig.scope) {
        case "date":
          try {
            const date = parseISO(value.toString())
            return isValid(date) ? date.toISOString() : value.toString().toLowerCase().trim()
          } catch {
            return value.toString().toLowerCase().trim()
          }
        case "time":
          return value.toString().toLowerCase().trim()
        case "number":
          return Number(value).toString()
        case "option":
          if (typeConfig.options && typeof value === "string") {
            return (typeConfig.options[value] || value).toString().toLowerCase().trim()
          }
          return value.toString().toLowerCase().trim()
        default:
          return value.toString().toLowerCase().trim()
      }
    },
    [filterScheme, getFieldDataType],
  )

  const isFilterDuplicate = React.useCallback(
    (newFilter: Filter, existingFilters: Filter[]): boolean => {
      return existingFilters.some((f) => {
        // Para filtros genéricos, comparar case-insensitive
        if (f.source === "*" && f.field === "*" && newFilter.source === "*" && newFilter.field === "*") {
          return normalizeFilterValue(f.value, f) === normalizeFilterValue(newFilter.value, newFilter)
        }

        // Para otros filtros, comparar todos los campos
        if (f.source === newFilter.source && f.field === newFilter.field && f.operator === newFilter.operator) {
          return normalizeFilterValue(f.value, f) === normalizeFilterValue(newFilter.value, newFilter)
        }

        return false
      })
    },
    [normalizeFilterValue],
  )

  return {
    getFieldDataType,
    normalizeFilterValue,
    isFilterDuplicate,
  }
}

