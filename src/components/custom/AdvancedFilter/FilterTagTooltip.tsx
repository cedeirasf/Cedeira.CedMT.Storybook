import * as React from "react"
import { Database, Tag, Hash, Calendar, Clock, CreditCard, DollarSign, FileText } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type {
  Filter,
  FilterScheme,
  ChannelViewFilterSchemeResponse,
} from "@/types/components/custom-advanced-input-filter.type"

import { cn } from "@/lib/utils"
import { formatTime, parseTimeRange, parseTimeString } from "@/lib/time-utilts"
import { CustomTooltip } from "../CustomTooltip"

interface IconMapping {
  [key: string]: LucideIcon
}

interface FilterTagTooltipProps {
  filter: Filter
  filterScheme: FilterScheme
  sources: ChannelViewFilterSchemeResponse["sources"]
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  /** Mapa personalizado de iconos por tipo de dato */
  iconMapping?: IconMapping
  /** Icono por defecto cuando no se encuentra un mapeo */
  defaultIcon?: LucideIcon
  /** Icono personalizado para la fuente */
  sourceIcon?: LucideIcon
  /** Icono personalizado para el campo */
  fieldIcon?: LucideIcon
  /** Clases CSS personalizadas para el contenedor del tooltip */
  tooltipContentClassName?: string
  /** Clases CSS personalizadas para cada sección */
  sectionClassNames?: {
    source?: string
    field?: string
    value?: string
  }
}

// Mapeo predeterminado de iconos
const DEFAULT_ICON_MAPPING: IconMapping = {
  fecha: Calendar,
  horario: Clock,
  cbu: CreditCard,
  number: DollarSign,
  "number-nullable": DollarSign,
  "combo-tipo-mov": Hash,
  texto: FileText,
}

const TooltipContent = React.memo(
  ({
    source,
    field,
    value,
    dataType,
    iconMapping = {},
    defaultIcon = Tag,
    sourceIcon: SourceIcon = Database,
    fieldIcon: FieldIcon = Tag,
    tooltipContentClassName = "",
    sectionClassNames = {},
  }: {
    source: string
    field: string
    value: string
    dataType: string
    iconMapping?: IconMapping
    defaultIcon?: LucideIcon
    sourceIcon?: LucideIcon
    fieldIcon?: LucideIcon
    tooltipContentClassName?: string
    sectionClassNames?: {
      source?: string
      field?: string
      value?: string
    }
  }) => {
    // Combinar el mapeo predeterminado con el personalizado
    const finalIconMapping = { ...DEFAULT_ICON_MAPPING, ...iconMapping }
    const ValueIcon = finalIconMapping[dataType] || defaultIcon

    return (
      <div className={cn("max-w-[280px] space-y-2 p-1", tooltipContentClassName)}>
        <div className={cn("flex items-center gap-2", sectionClassNames.source)}>
          <SourceIcon className="h-4 w-4 text-primary" />
          <div className="font-medium text-sm">{source}</div>
        </div>
        <div className={cn("flex items-center gap-2", sectionClassNames.field)}>
          <FieldIcon className="h-4 w-4 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">{field}</div>
        </div>
        <div className={cn("flex items-center gap-2", sectionClassNames.value)}>
          <ValueIcon className="h-4 w-4 text-foreground" />
          <div className="text-sm">{value}</div>
        </div>
      </div>
    )
  },
)
TooltipContent.displayName = "TooltipContent"

export function FilterTagTooltip({
  filter,
  filterScheme,
  sources,
  children,
  side = "top",
  align = "center",
  iconMapping = {},
  defaultIcon,
  sourceIcon,
  fieldIcon,
  tooltipContentClassName,
  sectionClassNames,
}: FilterTagTooltipProps) {
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

  const displayData = getFilterDisplayText()

  return (
    <CustomTooltip
      trigger={children}
      variant="info"
      side={side}
      align={align}
      delayDuration={0}
      disableHoverableContent={false}
    >
      <TooltipContent
        {...displayData}
        iconMapping={iconMapping}
        defaultIcon={defaultIcon}
        sourceIcon={sourceIcon}
        fieldIcon={fieldIcon}
        tooltipContentClassName={tooltipContentClassName}
        sectionClassNames={sectionClassNames}
      />
    </CustomTooltip>
  )
}

