import * as React from "react"
import type {
  Filter,
  FilterScheme,
  ChannelViewFilterSchemeResponse,
} from "@/types/components/custom-advanced-input-filter.type"
import { useFilterHelpers } from "./use-filter-helper"
 

export function useFilterLogic(filterScheme: FilterScheme, sources: ChannelViewFilterSchemeResponse["sources"]) {
  const { isFilterDuplicate, normalizeFilterValue } = useFilterHelpers(filterScheme, sources)

  const addFilter = React.useCallback(
    (newFilter: Filter, currentFilters: Filter[]) => {
      if (!isFilterDuplicate(newFilter, currentFilters)) {
        return [...currentFilters, newFilter]
      }
      return currentFilters
    },
    [isFilterDuplicate],
  )

  const updateFilter = React.useCallback(
    (updatedFilter: Filter, currentFilters: Filter[]) => {
      return currentFilters.map((filter) =>
        filter.source === updatedFilter.source &&
        filter.field === updatedFilter.field &&
        filter.operator === updatedFilter.operator &&
        normalizeFilterValue(filter.value, filter) === normalizeFilterValue(updatedFilter.value, updatedFilter)
          ? updatedFilter
          : filter,
      )
    },
    [normalizeFilterValue],
  )

  const removeFilter = React.useCallback(
    (filterToRemove: Filter, currentFilters: Filter[]) => {
      return currentFilters.filter(
        (filter) =>
          filter.source !== filterToRemove.source ||
          filter.field !== filterToRemove.field ||
          filter.operator !== filterToRemove.operator ||
          normalizeFilterValue(filter.value, filter) !== normalizeFilterValue(filterToRemove.value, filterToRemove),
      )
    },
    [normalizeFilterValue],
  )

  return {
    addFilter,
    updateFilter,
    removeFilter,
  }
}

