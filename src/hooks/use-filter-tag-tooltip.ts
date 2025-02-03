import * as React from "react"
import { Tag, Hash, Calendar, Clock, CreditCard, DollarSign, FileText } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type {
  Filter,
  FilterScheme,
  ChannelViewFilterSchemeResponse,
} from "@/types/components/custom-advanced-input-filter.type"
import { formatTime, parseTimeRange, parseTimeString } from "@/lib/time-utilts"

const DEFAULT_ICON_MAPPING: Record<string, LucideIcon> = {
  fecha: Calendar,
  horario: Clock,
  cbu: CreditCard,
  number: DollarSign,
  "number-nullable": DollarSign,
  "combo-tipo-mov": Hash,
  texto: FileText,
}

export function useFilterTagTooltip(
  filter: Filter,
  filterScheme: FilterScheme,
  sources: ChannelViewFilterSchemeResponse["sources"],
  customIconMapping: Record<string, LucideIcon> = {},
) {
  const getFilterDisplayText = React.useCallback(() => {
    if (filter.source === "*" && filter.field === "*") {
      return {
        source: "Global",
        field: "Todos los campos",
        value: filter.value?.toString() || "",
        dataType: "texto",
      }
    }

    const source = sources.find((s) => s.source === filter.source)
    if (!source)
      return {
        source: filter.source,
        field: filter.field,
        value: filter.value?.toString() || "",
        dataType: "texto",
      }

    const field = source.fields[filter.field]
    if (!field)
      return {
        source: source.display,
        field: filter.field,
        value: filter.value?.toString() || "",
        dataType: "texto",
      }

    const dataType = filterScheme.data_types[field.data_type]
    if (!dataType)
      return {
        source: source.display,
        field: field.display,
        value: filter.value?.toString() || "",
        dataType: "texto",
      }

    const operator = dataType.filtering_operators[filter.operator]
    if (!operator)
      return {
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

    return {
      source: source.display,
      field: field.display,
      value: valueDisplay,
      dataType: field.data_type,
    }
  }, [filter, filterScheme, sources])

  const getValueIcon = React.useCallback(
    (dataType: string): LucideIcon => {
      const finalIconMapping = { ...DEFAULT_ICON_MAPPING, ...customIconMapping }
      return finalIconMapping[dataType] || Tag
    },
    [customIconMapping],
  )

  const displayData = getFilterDisplayText()

  return {
    displayData,
    getValueIcon,
  }
}

