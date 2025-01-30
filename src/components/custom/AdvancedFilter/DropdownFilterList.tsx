import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatTime, parseTimeRange, parseTimeString } from "@/lib/time-utilts"
import { cn } from "@/lib/utils"
import type {
  DropdownFilterListProps,
  Filter
} from "@/types/components/custom-advanced-input-filter.type"
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
        return `Contiene: ${filter.value || ""}`
      }

      const source = sources.find((s) => s.source === filter.source)
      if (!source) return filter.value?.toString() || ""

      const field = source.fields[filter.field]
      if (!field) return `${source.display}: ${filter.value || ""}`

      const dataType = filterScheme.data_types[field.data_type]
      if (!dataType) return `${source.display}: ${field.display} - ${filter.value || ""}`

      const operator = dataType.filtering_operators[filter.operator]
      if (!operator) return `${source.display}: ${field.display} ${filter.operator} ${filter.value || ""}`

      let valueDisplay = ""

      try {
        if (operator.range && typeof filter.value === "string" && filter.value) {
          if (dataType.scope === "time") {
            const { from, to } = parseTimeRange(filter.value)
            if (from && to) {
              valueDisplay = `${formatTime(from, "24h")} y ${formatTime(to, "24h")}`
            } else {
              valueDisplay = filter.value
            }
          } else {
            try {
              const rangeValue = JSON.parse(filter.value)
              if (rangeValue && typeof rangeValue === "object") {
                const { from, to } = rangeValue
                valueDisplay = `${from || ""} y ${to || ""}`
              } else {
                valueDisplay = filter.value
              }
            } catch {
              valueDisplay = filter.value
            }
          }
        } else if (dataType.scope === "time" && typeof filter.value === "string" && filter.value) {
          const time = parseTimeString(filter.value)
          valueDisplay = time ? formatTime(time, "24h") : filter.value
        } else if (dataType.options && typeof filter.value === "string" && dataType.options[filter.value]) {
          valueDisplay = dataType.options[filter.value]
        } else {
          valueDisplay = filter.value?.toString() || ""
        }
      } catch (error) {
        console.error("Error parsing value:", error)
        valueDisplay = filter.value?.toString() || ""
      }

      if (operator.range) {
        return `${source.display}: ${field.display} está entre ${valueDisplay}`
          .replace(/está entre(\S)/g, "está entre $1")
          .replace(/(\S)$/g, " $1")
      }

      return `${source.display}: ${field.display} ${operator.display} ${valueDisplay}`.replace(/(\S)$/g, " $1")
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

