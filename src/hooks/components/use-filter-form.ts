import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import type {
  Filter,
  FilterFormData,
  FilterFormProps,
  RangeValue,

  DataType,
} from "@/types/components/custom-advanced-input-filter.type"
import { filterFormSchema } from "@/components/schemas/advanced-filter.schema"
import { getDataType, parseRangeValue } from "@/lib/filters-utils"
import { SelectOption } from "@/types/components/custom-select.types"
import { convertToISODate, formatTimeToString, parseTimeString } from "@/lib/time-utilts"



export function useFilterForm({ initialFilter, onSubmit, filterScheme, sources }: FilterFormProps) {
  const isGenericFilter = initialFilter?.source === "*" && initialFilter?.field === "*"

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: React.useMemo(() => {
      if (!initialFilter) return {} as FilterFormData

      if (isGenericFilter) {
        return {
          source: "*",
          field: "*",
          operator: "contains",
          value: initialFilter.value || "",
        } as FilterFormData
      }

      const dataType = getDataType(initialFilter.source, initialFilter.field, sources, filterScheme)
      if (!dataType) return initialFilter as FilterFormData

      const operator = dataType.filtering_operators[initialFilter.operator]
      if (!operator) return initialFilter as FilterFormData

      if (operator.range) {
        try {
          const rangeValue = JSON.parse(initialFilter.value)
          return {
            ...initialFilter,
            value: {
              from: rangeValue.from || "",
              to: rangeValue.to || "",
            },
          } as FilterFormData
        } catch (error) {
          console.error("Error parsing range value:", error)
          return {
            ...initialFilter,
            value: { from: "", to: "" },
          } as FilterFormData
        }
      }

      return initialFilter as FilterFormData
    }, [initialFilter, sources, filterScheme, isGenericFilter]),
  })

  const selectedSource = watch("source")
  const selectedField = watch("field")
  const selectedOperator = watch("operator")

  const sourceOptions = React.useMemo(
    () => sources.map((source) => ({ value: source.source, label: source.display })),
    [sources],
  )

  const fieldOptions = React.useMemo(() => {
    const source = sources.find((s) => s.source === selectedSource)
    return Object.entries(source?.fields || {}).map(
      ([key, field]): SelectOption => ({
        value: key,
        label: field.display,
      }),
    )
  }, [selectedSource, sources])

  const operatorOptions = React.useMemo(() => {
    const source = sources.find((s) => s.source === selectedSource)
    const field = source?.fields[selectedField]
    if (!field) return []
    const dataType = filterScheme.data_types[field.data_type]
    if (!dataType) return []

    return Object.entries(dataType.filtering_operators).map(
      ([key, operator]): SelectOption => ({
        value: key,
        label: operator.display,
      }),
    )
  }, [selectedSource, selectedField, sources, filterScheme])

  React.useEffect(() => {
    if (isGenericFilter) return

    const dataType = getDataType(selectedSource, selectedField, sources, filterScheme)
    if (!dataType) return

    const operator = dataType.filtering_operators[selectedOperator]
    if (!operator) return

    const currentValue = watch("value")

    if (operator.range) {
      setValue("value", parseRangeValue(currentValue))
    } else {
      if (typeof currentValue === "object" && currentValue !== null) {
        setValue("value", (currentValue as RangeValue).from?.toString() || "")
      } else if (typeof currentValue !== "string") {
        setValue("value", "")
      }
    }
  }, [selectedOperator, selectedSource, selectedField, sources, filterScheme, watch, setValue, isGenericFilter])

  const handleFormSubmit = handleSubmit((data: FilterFormData) => {
    const filter: Filter = {
      source: data.source,
      field: data.field,
      operator: data.operator,
      value: "", // We'll set this based on the data type
    }

    const dataType = getDataType(data.source, data.field, sources, filterScheme)
    if (dataType?.scope === "time") {
      const operator = dataType.filtering_operators[data.operator]
      if (operator?.range && typeof data.value === "object" && data.value !== null) {
        const rangeValue = data.value as RangeValue
        const fromTime = typeof rangeValue.from === "string" ? parseTimeString(rangeValue.from) : null
        const toTime = typeof rangeValue.to === "string" ? parseTimeString(rangeValue.to) : null

        filter.value = JSON.stringify({
          from: fromTime ? formatTimeToString(fromTime) : "",
          to: toTime ? formatTimeToString(toTime) : "",
        })
      } else {
        const timeValue = parseTimeString(data.value as string)
        filter.value = timeValue ? formatTimeToString(timeValue) : ""
      }
    } else if (dataType?.scope === "date") {
      const operator = dataType.filtering_operators[data.operator]
      if (operator?.range && typeof data.value === "object" && data.value !== null) {
        const rangeValue = data.value as RangeValue
        // Ensure dates are in DD-MM-YYYY format
        filter.value = JSON.stringify({
          from: rangeValue.from ? format(new Date(convertToISODate(rangeValue.from)), "dd-MM-yyyy") : "",
          to: rangeValue.to ? format(new Date(convertToISODate(rangeValue.to)), "dd-MM-yyyy") : "",
        })
      } else {
        // Format single date
        filter.value = data.value ? format(new Date(convertToISODate(data.value as string)), "dd-MM-yyyy") : ""
      }
    } else {
      // For all other types, convert to string
      if (typeof data.value === "object" && data.value !== null) {
        filter.value = JSON.stringify(data.value)
      } else {
        filter.value = String(data.value || "")
      }
    }

    onSubmit(filter)
  })

  const getDataTypeForSelectedField = (): DataType | null => {
    if (!selectedSource || !selectedField) return null
    return getDataType(selectedSource, selectedField, sources, filterScheme) || null
  }

  return {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    errors,
    isGenericFilter,
    sourceOptions,
    fieldOptions,
    operatorOptions,
    selectedSource,
    selectedField,
    selectedOperator,
    getDataTypeForSelectedField,
  }
}
