import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { DropdownFilterListProps, Filter } from "@/types/components/custom-advanced-input-filter.type"
import { X } from "lucide-react"
import * as React from "react"


export function DropdownFilterList({
  filters,
  onSelect,
  onRemove,
  variant = "list",
  filterScheme,
  sources,
  className,
}: DropdownFilterListProps) {
  const getFilterDisplayText = React.useCallback(
    (filter: Filter): string => {
      if (filter.source === "*" && filter.field === "*") {
        return `Contiene: ${filter.value}`
      }

      const source = sources.find((s) => s.source === filter.source)
      if (!source) return filter.value.toString()

      const field = source.fields[filter.field]
      if (!field) return `${source.display}: ${filter.value}`

      const dataType = filterScheme.data_types[field.data_type]
      if (!dataType) return `${source.display}: ${field.display} - ${filter.value}`

      const operator = dataType.filtering_operators[filter.operator]
      if (!operator) return `${source.display}: ${field.display} ${filter.operator} ${filter.value}`

      let valueDisplay = filter.value
      if (dataType.options && typeof filter.value === "string") {
        valueDisplay = dataType.options[filter.value] || filter.value
      }

      return `${source.display}: ${field.display} ${operator.display} ${valueDisplay}`
    },
    [filterScheme, sources],
  )

  if (filters.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">No hay filtros para mostrar</div>
  }

  if (variant === "list") {
    return (
      <ScrollArea className={cn("max-h-[240px]", className)} scrollHideDelay={0}>
        <div className="p-1 pr-4">
          {filters.map((filter, index) => (
            <button
              key={`filter-${filter.source}-${filter.field}-${filter.value}-${index}`}
              onClick={() => onSelect?.(filter)}
              className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
            >
              {getFilterDisplayText(filter)}
            </button>
          ))}
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className={cn("max-h-[320px]", className)} scrollHideDelay={0}>
      <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 pr-4">
        {filters.map((filter, index) => (
          <div
            key={`filter-${filter.source}-${filter.field}-${filter.value}-${index}`}
            className="group relative flex items-center gap-2 rounded-md bg-secondary p-2 pr-8 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-pointer"
            onClick={() => onSelect?.(filter)}
          >
            <span className="truncate">{getFilterDisplayText(filter)}</span>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove?.(filter)
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Eliminar filtro</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

