import { ScrollArea } from "@/components/ui/scroll-area"
import { formatTime, parseTimeRange, parseTimeString } from "@/lib/time-utilts"
import { cn } from "@/lib/utils"
import type {
  ChannelViewFilterSchemeResponse,
  Filter,
  FilterScheme,
} from "@/types/components/custom-advanced-input-filter.type"
import { Calendar, Clock, CreditCard, Database, DollarSign, FileText, Hash, Tag } from "lucide-react"

import { memo, useCallback } from "react"
import TagFilter from "../CustomTagFilter"
import { CustomTooltip } from "../CustomTooltip"
import { FilterTagTooltip } from "./FilterTagTooltip"

interface DropdownFilterListProps {
  filters: Filter[]
  onSelect?: (filter: Filter) => void
  onRemove?: (filter: Filter) => void
  variant?: "grid" | "list"
  filterScheme: FilterScheme
  sources: ChannelViewFilterSchemeResponse["sources"]
  className?: string
}


export function DropdownFilterList({
  filters,
  onSelect,
  onRemove,
  variant = "list",
  filterScheme,
  sources,
  className,
}: DropdownFilterListProps) {
  const getValueIcon = useCallback((dataType: string) => {
    switch (dataType) {
      case "fecha":
        return Calendar
      case "horario":
        return Clock
      case "cbu":
        return CreditCard
      case "number":
      case "number-nullable":
        return DollarSign
      case "combo-tipo-mov":
        return Hash
      case "texto":
        return FileText
      default:
        return Tag
    }
  }, [])

  const getFilterDisplayText = useCallback(
    (
      filter: Filter,
    ): { label: string; fullValue: string; source: string; field: string; value: string; dataType: string } => {
      if (filter.source === "*" && filter.field === "*") {
        return {
          label: `Contiene: ${filter.value || ""}`,
          fullValue: `Contiene: ${filter.value || ""}`,
          source: "Global",
          field: "Todos los campos",
          value: filter.value?.toString() || "",
          dataType: "texto",
        }
      }

      const source = sources.find((s) => s.source === filter.source)
      if (!source)
        return {
          label: filter.value?.toString() || "",
          fullValue: filter.value?.toString() || "",
          source: filter.source,
          field: filter.field,
          value: filter.value?.toString() || "",
          dataType: "texto",
        }

      const field = source.fields[filter.field]
      if (!field)
        return {
          label: `${filter.value || ""}`,
          fullValue: filter.value?.toString() || "",
          source: source.display,
          field: filter.field,
          value: filter.value?.toString() || "",
          dataType: "texto",
        }

      const dataType = filterScheme.data_types[field.data_type]
      if (!dataType)
        return {
          label: `${field.display} - ${filter.value || ""}`,
          fullValue: filter.value?.toString() || "",
          source: source.display,
          field: field.display,
          value: filter.value?.toString() || "",
          dataType: "texto",
        }

      const operator = dataType.filtering_operators[filter.operator]
      if (!operator)
        return {
          label: `${field.display} ${filter.operator} ${filter.value || ""}`,
          fullValue: filter.value?.toString() || "",
          source: source.display,
          field: field.display,
          value: filter.value?.toString() || "",
          dataType: field.data_type,
        }

      let valueDisplay = ""
      let fullValueDisplay = ""

      try {
        if (operator.range && typeof filter.value === "string" && filter.value) {
          if (dataType.scope === "time") {
            const { from, to } = parseTimeRange(filter.value)
            if (from && to) {
              valueDisplay = `${formatTime(from, "24h")} y ${formatTime(to, "24h")}`
              fullValueDisplay = `${formatTime(from, "24h")} hasta ${formatTime(to, "24h")}`
            } else {
              valueDisplay = filter.value
              fullValueDisplay = filter.value
            }
          } else {
            try {
              const rangeValue = JSON.parse(filter.value)
              if (rangeValue && typeof rangeValue === "object") {
                const { from, to } = rangeValue
                valueDisplay = `${from || ""} y ${to || ""}`
                fullValueDisplay = `${from || ""} hasta ${to || ""}`
              } else {
                valueDisplay = filter.value
                fullValueDisplay = filter.value
              }
            } catch {
              valueDisplay = filter.value
              fullValueDisplay = filter.value
            }
          }
        } else if (dataType.scope === "time" && typeof filter.value === "string" && filter.value) {
          const time = parseTimeString(filter.value)
          valueDisplay = time ? formatTime(time, "24h") : filter.value
          fullValueDisplay = valueDisplay
        } else if (dataType.options && typeof filter.value === "string" && dataType.options[filter.value]) {
          valueDisplay = dataType.options[filter.value]
          fullValueDisplay = valueDisplay
        } else {
          valueDisplay = filter.value?.toString() || ""
          fullValueDisplay = valueDisplay
        }
      } catch (error) {
        console.error("Error parsing value:", error)
        valueDisplay = filter.value?.toString() || ""
        fullValueDisplay = valueDisplay
      }

      const label = operator.range
        ? `${field.display} está entre ${valueDisplay}`
        : `${field.display} ${operator.display} ${valueDisplay}`

      return {
        label,
        fullValue: fullValueDisplay,
        source: source.display,
        field: field.display,
        value: fullValueDisplay,
        dataType: field.data_type,
      }
    },
    [filterScheme, sources],
  )

  const TooltipContent = memo(
    ({
      source,
      field,
      value,
      dataType,
    }: {
      source: string
      field: string
      value: string
      dataType: string
    }) => {
      const ValueIcon = getValueIcon(dataType)

      return (
        <div className="max-w-[280px] space-y-2 p-1">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <div className="font-medium text-sm">{source}</div>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">{field}</div>
          </div>
          <div className="flex items-center gap-2">
            <ValueIcon className="h-4 w-4 text-foreground" />
            <div className="text-sm">{value}</div>
          </div>
        </div>
      )
    },
  )
  TooltipContent.displayName = "TooltipContent"

  if (filters.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">No hay filtros para mostrar</div>
  }

  if (variant === "list") {
    return (
      <ScrollArea className={cn("max-h-[320px] w-full", className)} scrollHideDelay={0}>
        <div className="p-1 pr-4">
          {filters.map((filter, index) => {
            return (
              <FilterTagTooltip
                key={`filter-${filter.source}-${filter.field}-${filter.value}-${index}`}
                filter={filter}
                filterScheme={filterScheme}
                sources={sources}
              >
                <div className="w-full">
                  <TagFilter
                    label={getFilterDisplayText(filter).label}
                    onClick={() => onSelect?.(filter)}
                    onRemove={onRemove ? () => onRemove(filter) : undefined}
                    color="neutral"
                    size="md"
                    rounded="md"
                    className="w-full bg-secondary hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80"
                    truncate
                  />
                </div>
              </FilterTagTooltip>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className={cn("max-h-[320px] w-full", className)} scrollHideDelay={0}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
        {filters.map((filter, index) => {
          const { label, source, field, value, dataType } = getFilterDisplayText(filter)
          return (
            <CustomTooltip
              key={`filter-${filter.source}-${filter.field}-${filter.value}-${index}`}
              trigger={
                <div className="w-full">
                  <TagFilter
                    label={label}
                    onClick={() => onSelect?.(filter)}
                    onRemove={onRemove ? () => onRemove(filter) : undefined}
                    color="neutral"
                    size="md"
                    rounded="md"
                    className="w-full bg-secondary hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80"
                    truncate
                  />
                </div>
              }
              variant="info"
              side="top"
              align="center"
            >
              <TooltipContent source={source} field={field} value={value} dataType={dataType} />
            </CustomTooltip>
          )
        })}
      </div>
    </ScrollArea>
  )
}

