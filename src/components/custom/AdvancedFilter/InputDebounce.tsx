import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type {
  Filter,
  InputDebounceProps,
  Suggestion,
} from "@/types/components/custom-advanced-input-filter.type"
import { Loader2, Search } from "lucide-react"
import * as React from "react"
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react"


export function InputDebounce({
  onSearch,
  onSelect,
  placeholder = "Buscar...",
  className,
  filterScheme,
  sources,
  size = "medium",
  isLoading: externalLoading = false,
  value: externalValue = "",
  selectedFilters = [], // Valor por defecto array vacío
}: InputDebounceProps) {
  const [query, setQuery] = useState(externalValue)
  const deferredQuery = useDeferredValue(query)
  const [isPending, startTransition] = useTransition()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const selectedItemRef = useRef<HTMLButtonElement>(null)

  // Función auxiliar para verificar si un filtro ya existe
  const isFilterDuplicate = useCallback(
    (newFilter: Partial<Filter>): boolean => {
      return selectedFilters.some((existingFilter) => {
        // Si el nuevo filtro no tiene todos los campos necesarios, no es un duplicado
        if (!newFilter.source || !newFilter.field || !newFilter.operator || !newFilter.value) {
          return false
        }

        // Para filtros genéricos, comparar case-insensitive
        if (
          existingFilter.source === "*" &&
          existingFilter.field === "*" &&
          newFilter.source === "*" &&
          newFilter.field === "*"
        ) {
          return existingFilter.value.toString().toLowerCase() === newFilter.value.toString().toLowerCase()
        }

        // Para otros filtros, comparar todos los campos
        const areValuesEqual =
          typeof existingFilter.value === "string" && typeof newFilter.value === "string"
            ? existingFilter.value.toLowerCase() === newFilter.value.toLowerCase()
            : existingFilter.value === newFilter.value

        return (
          existingFilter.source === newFilter.source &&
          existingFilter.field === newFilter.field &&
          existingFilter.operator === newFilter.operator &&
          areValuesEqual
        )
      })
    },
    [selectedFilters],
  )

  const suggestions = useMemo(() => {
    if (!deferredQuery) return [] as Suggestion[]

    const validSuggestions: Suggestion[] = []

    sources.forEach((source) => {
      Object.entries(source.fields ?? {}).forEach(([fieldKey, field]) => {
        ;(field.filteringTips ?? []).forEach((tip) => {
          if (!tip.tip?.toLowerCase().includes(deferredQuery.toLowerCase())) return

          const dataType = filterScheme.data_types[field.data_type]
          const operator = dataType?.filtering_operators[tip.filtering_operator]

          if (!operator) return

          let defaultValue: string | undefined
          if (dataType?.options) {
            const tipLower = tip.tip.toLowerCase()
            Object.entries(dataType.options).some(([key, value]) => {
              if (tipLower.includes(value.toLowerCase())) {
                defaultValue = key
                return true
              }
              return false
            })
          }

          // Crear el filtro potencial
          const potentialFilter = {
            source: source.source,
            field: fieldKey,
            operator: tip.filtering_operator,
            value: defaultValue,
          }

          // Solo agregar la sugerencia si no resultaría en un duplicado
          if (!isFilterDuplicate(potentialFilter)) {
            validSuggestions.push({
              source: source.source,
              sourceDisplay: source.display,
              field: fieldKey,
              fieldDisplay: field.display,
              operator: tip.filtering_operator,
              operatorDisplay: operator.display,
              tip: tip.tip,
              dataType: field.data_type,
              defaultValue,
            })
          }
        })
      })
    })

    return validSuggestions
  }, [deferredQuery, sources, filterScheme, isFilterDuplicate])

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current && suggestionsRef.current) {
      const container = suggestionsRef.current
      const item = selectedItemRef.current
      const containerRect = container.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()

      if (itemRect.bottom > containerRect.bottom) {
        container.scrollTop += itemRect.bottom - containerRect.bottom
      } else if (itemRect.top < containerRect.top) {
        container.scrollTop -= containerRect.top - itemRect.top
      }
    }
  }, [selectedIndex])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setQuery(newValue)
      setShowSuggestions(true)

      startTransition(() => {
        onSearch(newValue)
      })
    },
    [onSearch],
  )

  const handleSelect = useCallback(
    (suggestion: Suggestion) => {
      const filter: Partial<Filter> = {
        source: suggestion.source,
        field: suggestion.field,
        operator: suggestion.operator,
        value: suggestion.defaultValue,
      }

      // Solo seleccionar si no es un duplicado
      if (!isFilterDuplicate(filter)) {
        onSelect(filter)
        setQuery("")
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    },
    [onSelect, isFilterDuplicate],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelect(suggestions[selectedIndex])
          } else if (query.trim()) {
            const genericFilter = {
              source: "*",
              field: "*",
              operator: "contains",
              value: query.trim(),
            }
            // Solo seleccionar si no es un duplicado
            if (!isFilterDuplicate(genericFilter)) {
              onSelect(genericFilter)
              setQuery("")
              setShowSuggestions(false)
              setSelectedIndex(-1)
            }
          }
          break
        case "Escape":
          setShowSuggestions(false)
          setSelectedIndex(-1)
          break
      }
    },
    [showSuggestions, suggestions, selectedIndex, query, handleSelect, onSelect, isFilterDuplicate],
  )

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".suggestions-container")) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative suggestions-container">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        {externalLoading || isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <Input
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        className={cn("pl-10", className)}
        placeholder={placeholder}
        size={size}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div ref={suggestionsRef} className="max-h-[300px] overflow-auto p-1 space-y-0.5">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.source}-${suggestion.field}-${suggestion.operator}-${suggestion.defaultValue}-${index}`}
                ref={index === selectedIndex ? selectedItemRef : null}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full flex-col items-start gap-1 rounded-sm p-2 text-left transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  index === selectedIndex && "bg-accent text-accent-foreground",
                )}
              >
                <div className="text-sm font-medium">{suggestion.tip}</div>
                <div className="text-xs text-muted-foreground">
                  {suggestion.sourceDisplay}: {suggestion.fieldDisplay} {suggestion.operatorDisplay}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && query && !externalLoading && !isPending && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-4 shadow-md">
          <p className="text-sm text-muted-foreground">Presiona Enter para buscar "{query}" en todos los campos</p>
        </div>
      )}
    </div>
  )
}

