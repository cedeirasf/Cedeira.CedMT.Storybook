import type {
  Filter,
  FilterScheme,
  ChannelViewFilterSchemeResponse,
} from "@/types/components/custom-advanced-input-filter.type"
import { useCallback, useState, useTransition, useEffect } from "react"
 
import { format, parseISO, isValid } from "date-fns"
import { es } from "date-fns/locale"
import { useFilterHelpers } from "./use-filter-helper"

interface UseAdvancedFilterProps {
  selectedFilters: Filter[]
  onFiltersChange: (filters: Filter[]) => void
  onSearch: (query: string) => Promise<ChannelViewFilterSchemeResponse>
  filterScheme: FilterScheme
  sources: ChannelViewFilterSchemeResponse["sources"]
}

export function useAdvancedFilter({
  selectedFilters,
  onFiltersChange,
  onSearch,
  filterScheme,
  sources,
}: UseAdvancedFilterProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<Partial<Filter> | null>(null)
  const [localFilters, setLocalFilters] = useState<Filter[]>(selectedFilters)
  const [localSources, setLocalSources] = useState(sources)
  const [localFilterScheme, setLocalFilterScheme] = useState(filterScheme)
  const [searchQuery, setSearchQuery] = useState("")

  const [isPending, startTransition] = useTransition()

  const { isFilterDuplicate, normalizeFilterValue } = useFilterHelpers(localFilterScheme, localSources)

  useEffect(() => {
    setLocalFilters(selectedFilters)
  }, [selectedFilters])

  useEffect(() => {
    setLocalFilterScheme(filterScheme)
  }, [filterScheme])

  useEffect(() => {
    setLocalSources(sources)
  }, [sources])

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query)
      startTransition(async () => {
        try {
          const results = await onSearch(query)
          setLocalSources(results.sources)
          setLocalFilterScheme(results.scheme)
        } catch (error) {
          console.error("Error during search:", error)
        }
      })
    },
    [onSearch],
  )

  const handleFilterSelect = useCallback(
    (filter: Partial<Filter>) => {
      if (filter.value !== undefined) {
        const newFilter = filter as Filter
        startTransition(() => {
          if (!isFilterDuplicate(newFilter, localFilters)) {
            const updatedFilters = [...localFilters, newFilter]
            setLocalFilters(updatedFilters)
            onFiltersChange(updatedFilters)
          }
        })
      } else {
        setSelectedFilter(filter)
        setIsSheetOpen(true)
      }
    },
    [localFilters, onFiltersChange, isFilterDuplicate],
  )

  const handleAddNewFilter = useCallback(() => {
    setSelectedFilter(null)
    setIsSheetOpen(true)
    setIsDropdownOpen(false)
  }, [])

  const handleFilterSubmit = useCallback(
    (filter: Filter) => {
      startTransition(() => {
        if (!isFilterDuplicate(filter, localFilters)) {
          let updatedFilters: Filter[]

          if (selectedFilter && selectedFilter.source && selectedFilter.field) {
            updatedFilters = localFilters.map((f) =>
              f.source === selectedFilter.source &&
              f.field === selectedFilter.field &&
              f.operator === selectedFilter.operator &&
              normalizeFilterValue(f.value, f) ===
                normalizeFilterValue(selectedFilter.value || "", {
                  ...selectedFilter,
                  value: selectedFilter.value || "",
                } as Filter)
                ? filter
                : f,
            )

            // Si no se encontró el filtro para actualizar, agregarlo como nuevo
            if (!updatedFilters.some((f) => f === filter)) {
              updatedFilters.push(filter)
            }
          } else {
            // Agregando un nuevo filtro
            updatedFilters = [...localFilters, filter]
          }

          setLocalFilters(updatedFilters)
          onFiltersChange(updatedFilters)
        }

        setIsSheetOpen(false)
        setSelectedFilter(null)
      })
    },
    [localFilters, onFiltersChange, selectedFilter, isFilterDuplicate, normalizeFilterValue],
  )

  const handleFilterEdit = useCallback((filter: Filter) => {
    setSelectedFilter(filter)
    setIsSheetOpen(true)
  }, [])

  const handleRemoveFilter = useCallback(
    (filterToRemove: Filter) => {
      startTransition(() => {
        const updatedFilters = localFilters.filter(
          (filter) =>
            filter.source !== filterToRemove.source ||
            filter.field !== filterToRemove.field ||
            filter.operator !== filterToRemove.operator ||
            normalizeFilterValue(filter.value, filter) !== normalizeFilterValue(filterToRemove.value, filterToRemove),
        )
        setLocalFilters(updatedFilters)
        onFiltersChange(updatedFilters)
      })
    },
    [localFilters, onFiltersChange, normalizeFilterValue],
  )

  const handleClearAll = useCallback(() => {
    startTransition(() => {
      setLocalFilters([])
      onFiltersChange([])
    })
  }, [onFiltersChange])

  const getFilterDisplayText = useCallback(
    (filter: Filter): string => {
      if (filter.source === "*" && filter.field === "*") {
        return `Contiene: ${filter.value || ""}`
      }

      const source = localSources.find((s) => s.source === filter.source)
      if (!source) return `${filter.source}: ${filter.value || ""}`

      const field = source.fields[filter.field]
      if (!field) return `${source.display}: ${filter.field} - ${filter.value || ""}`

      const dataType = localFilterScheme.data_types[field.data_type]
      if (!dataType) return `${source.display}: ${field.display} - ${filter.value || ""}`

      const operator = dataType.filtering_operators[filter.operator]
      if (!operator) return `${source.display}: ${field.display} ${filter.operator} ${filter.value || ""}`

      let valueDisplay = ""
      if (operator.range && typeof filter.value === "string") {
        try {
          const { from, to } = JSON.parse(filter.value)
          valueDisplay = `${from} - ${to}`
        } catch (error) {
          console.error("Error parsing range value:", error)
          valueDisplay = filter.value
        }
      } else if (dataType.options && typeof filter.value === "string" && dataType.options[filter.value]) {
        valueDisplay = dataType.options[filter.value]
      } else {
        valueDisplay = filter.value?.toString() || ""
      }

      if (dataType.scope === "date" && isValid(parseISO(valueDisplay))) {
        valueDisplay = format(parseISO(valueDisplay), "PPP", { locale: es })
      }

      if (operator.range) {
        const [from, to] = valueDisplay.split(" - ")
        return `${source.display}: ${field.display} ${operator.display.replace("{0}", from).replace("{1}", to)}`
      }

      return `${source.display}: ${field.display} ${operator.display} ${valueDisplay}`
    },
    [localFilterScheme, localSources],
  )

  return {
    isSheetOpen,
    setIsSheetOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedFilter,
    setSelectedFilter,
    localFilters,
    localSources,
    localFilterScheme,
    searchQuery,
    isPending,
    handleSearch,
    handleFilterSelect,
    handleAddNewFilter,
    handleFilterSubmit,
    handleFilterEdit,
    handleRemoveFilter,
    handleClearAll,
    getFilterDisplayText,
  }
}

