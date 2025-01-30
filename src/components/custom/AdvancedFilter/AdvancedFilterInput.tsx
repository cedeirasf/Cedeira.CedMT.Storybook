import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/custom/CustomSheet"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { AdvancedFilterInputProps, Filter } from "@/types/components/custom-advanced-input-filter.type"
import { isValid, parseISO } from "date-fns"
import { FilterIcon, Plus, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState, useTransition } from "react"
import TagFilter from "../CustomTagFilter"
import { DropdownFilterList } from "./DropdownFilterList"

import { FilterForm } from "./FilterForm"
import { InputDebounce } from "./InputDebounce"


export function AdvancedFilterInput({
  selectedFilters,
  onFiltersChange,
  onSearch,
  filterScheme,
  sources,
  className,
}: AdvancedFilterInputProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<Partial<Filter> | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<Filter[]>(selectedFilters)
  const [localSources, setLocalSources] = useState(sources)
  const [localFilterScheme, setLocalFilterScheme] = useState(filterScheme)
  const [searchQuery, setSearchQuery] = useState("")

  const [isPending, startTransition] = useTransition()

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

  const getFieldDataType = useCallback(
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

  const normalizeFilterValue = useCallback(
    (value: string | number, filter: Filter): string => {
      const dataType = getFieldDataType(filter)
      if (!dataType) return value.toString().toLowerCase().trim()

      const typeConfig = filterScheme.data_types[dataType]
      if (!typeConfig) return value.toString().toLowerCase().trim()

      // Normalización específica por tipo de dato
      switch (typeConfig.primitive) {
        case "date":
          try {
            const date = parseISO(value.toString())
            return isValid(date) ? date.toISOString() : value.toString().toLowerCase().trim()
          } catch {
            return value.toString().toLowerCase().trim()
          }
        case "number":
          return Number(value).toString()
        case "string":
          // Para tipos combo, normalizar usando las opciones si están disponibles
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

  const isFilterDuplicate = useCallback(
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

  const handleFilterSelect = useCallback(
    (filter: Partial<Filter>) => {
      if (filter.value !== undefined) {
        // Si el filtro ya tiene un valor, verificamos que no sea duplicado
        const newFilter = filter as Filter
        startTransition(() => {
          if (!isFilterDuplicate(newFilter, localFilters)) {
            const updatedFilters = [...localFilters, newFilter]
            setLocalFilters(updatedFilters)
            onFiltersChange(updatedFilters)
          }
        })
      } else {
        // Si el filtro no tiene valor, abrimos el formulario para completarlo
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
        // Verificar si el filtro es un duplicado antes de agregarlo o actualizarlo
        if (!isFilterDuplicate(filter, localFilters)) {
          let updatedFilters: Filter[]

          if (selectedFilter && selectedFilter.source && selectedFilter.field) {
            // Editando un filtro existente
            updatedFilters = localFilters.map((f) => {
              if (
                f.source === selectedFilter.source &&
                f.field === selectedFilter.field &&
                f.operator === selectedFilter.operator &&
                normalizeFilterValue(f.value, f) ===
                normalizeFilterValue(selectedFilter.value || "", {
                  ...selectedFilter,
                  value: selectedFilter.value || "",
                } as Filter)
              ) {
                return filter
              }
              return f
            })

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
        const updatedFilters = localFilters.filter((filter) => {
          // Para filtros genéricos, comparar case-insensitive
          if (
            filter.source === "*" &&
            filter.field === "*" &&
            filterToRemove.source === "*" &&
            filterToRemove.field === "*"
          ) {
            return (
              normalizeFilterValue(filter.value, filter) !== normalizeFilterValue(filterToRemove.value, filterToRemove)
            )
          }

          // Para otros filtros, comparar todos los campos
          return (
            filter.source !== filterToRemove.source ||
            filter.field !== filterToRemove.field ||
            filter.operator !== filterToRemove.operator ||
            normalizeFilterValue(filter.value, filter) !== normalizeFilterValue(filterToRemove.value, filterToRemove)
          )
        })
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

      let valueDisplay = filter.value || ""
      if (dataType.options && typeof filter.value === "string" && dataType.options[filter.value]) {
        valueDisplay = dataType.options[filter.value]
      }

      return `${source.display}: ${field.display} ${operator.display} ${valueDisplay}`
    },
    [localFilterScheme, localSources],
  )

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="relative">
        <InputDebounce
          value={searchQuery}
          onSearch={handleSearch}
          onSelect={handleFilterSelect}
          placeholder="Buscar filtros..."
          className="pl-10 pr-[90px]"
          filterScheme={localFilterScheme}
          sources={localSources}
          isLoading={isPending}
          selectedFilters={localFilters}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {localFilters.length > 0 && (
            <div className="flex items-center gap-1">
              {localFilters.slice(0, 2).map((filter, index) => (
                <TagFilter
                  key={`filter-${filter.source}-${filter.field}-${filter.value}-${index}`}
                  label={getFilterDisplayText(filter)}
                  onClick={() => handleFilterEdit(filter)}
                  onRemove={() => handleRemoveFilter(filter)}
                  color="neutral"
                  size="sm"
                  rounded="md"
                  className="shrink-0 bg-secondary/80 text-xs hover:bg-secondary max-w-[100px]"
                  truncate
                />
              ))}
            </div>
          )}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-secondary hover:bg-secondary/80">
                <FilterIcon className="h-4 w-4" />
                {localFilters.length > 2 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {localFilters.length - 2}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] sm:w-[480px] p-0" sideOffset={8}>
              <div className="flex flex-col h-[300px]">
                <ScrollArea className="flex-1">
                  <DropdownFilterList
                    filters={localFilters}
                    onSelect={handleFilterEdit}
                    onRemove={handleRemoveFilter}
                    variant="grid"
                    filterScheme={localFilterScheme}
                    sources={localSources}
                  />
                </ScrollArea>
                <div className="flex justify-end gap-2 border-t p-2 bg-popover">
                  <Button size="sm" onClick={handleAddNewFilter} variant="default" className="h-8">
                    <Plus className="mr-2 h-3 w-3" />
                    Agregar
                  </Button>
                  {localFilters.length > 0 && (
                    <Button size="sm" onClick={handleClearAll} variant="destructive" className="h-8">
                      <Trash2 className="mr-2 h-3 w-3" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedFilter ? "Editar filtro" : "Nuevo filtro"}</SheetTitle>
            <SheetDescription>
              {selectedFilter ? "Modifica los valores del filtro" : "Configura un nuevo filtro"}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <FilterForm
              key={selectedFilter ? `edit-${JSON.stringify(selectedFilter)}` : "new"}
              initialFilter={selectedFilter as Filter | null}
              onSubmit={handleFilterSubmit}
              filterScheme={localFilterScheme}
              sources={localSources}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

