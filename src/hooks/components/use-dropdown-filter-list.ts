import * as React from "react"
import type {
  Filter,
  FilterScheme,
  ChannelViewFilterSchemeResponse,
} from "@/types/components/custom-advanced-input-filter.type"
import { formatTime, parseTimeRange, parseTimeString } from "@/lib/time-utilts";
 

export function useDropdownFilterList(filterScheme: FilterScheme, sources: ChannelViewFilterSchemeResponse["sources"]) {
  const getFilterDisplayText = React.useCallback(
    (filter: Filter): { label: string; source: string; field: string; value: string; dataType: string } => {
      if (filter.source === "*" && filter.field === "*") {
        return {
          label: `Contiene: ${filter.value || ""}`,
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
          source: filter.source,
          field: filter.field,
          value: filter.value?.toString() || "",
          dataType: "texto",
        }

      const field = source.fields[filter.field]
      if (!field)
        return {
          label: `${source.display}: ${filter.value || ""}`,
          source: source.display,
          field: filter.field,
          value: filter.value?.toString() || "",
          dataType: "texto",
        }

      const dataType = filterScheme.data_types[field.data_type]
      if (!dataType)
        return {
          label: `${source.display}: ${field.display} - ${filter.value || ""}`,
          source: source.display,
          field: field.display,
          value: filter.value?.toString() || "",
          dataType: "texto",
        }

      const operator = dataType.filtering_operators[filter.operator]
      if (!operator)
        return {
          label: `${source.display}: ${field.display} ${filter.operator} ${filter.value || ""}`,
          source: source.display,
          field: field.display,
          value: filter.value?.toString() || "",
          dataType: field.data_type,
        }

      let valueDisplay = ""

      try {
        if (operator.range && typeof filter.value === "string" && filter.value) {
          if (dataType.scope === "time") {
            const { from, to } = parseTimeRange(filter.value)
            if (from && to) {
              valueDisplay = `${formatTime(from, "24h")} hasta ${formatTime(to, "24h")}`
            } else {
              valueDisplay = filter.value
            }
          } else {
            try {
              const rangeValue = JSON.parse(filter.value)
              if (rangeValue && typeof rangeValue === "object") {
                const { from, to } = rangeValue
                valueDisplay = `${from || ""} hasta ${to || ""}`
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

      const label = operator.range
        ? `${source.display}: ${field.display} está entre ${valueDisplay}`
        : `${source.display}: ${field.display} ${operator.display} ${valueDisplay}`

      return {
        label,
        source: source.display,
        field: field.display,
        value: valueDisplay,
        dataType: field.data_type,
      }
    },
    [filterScheme, sources],
  )

  return {
    getFilterDisplayText,
  }
}

