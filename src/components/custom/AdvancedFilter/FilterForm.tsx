import { CustomCalendar } from "@/components/custom/CustomCalendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { convertToISODate, formatTimeToString, parseTimeString } from "@/lib/time-utilts"
import { cn } from "@/lib/utils"
import type {
  DataType,
  Field,
  Filter,
  FilterFormData,
  FilterFormProps,
  RangeValue
} from "@/types/components/custom-advanced-input-filter.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { filterFormSchema } from "@/components/schemas/advanced-filter.schema"
import { getDataType, parseRangeValue } from "@/lib/filters-utils"
import { SelectOption } from "@/types/components/custom-select.types"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { CustomSelect } from "../CustomSelect"
import { TimePicker } from "../CustomTimePicker"

const FilterForm = ({ initialFilter, onSubmit, filterScheme, sources }: FilterFormProps) => {
  const isGenericFilter = initialFilter?.source === "*" && initialFilter?.field === "*"

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: useMemo(() => {
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

  const sourceOptions = useMemo(
    () => sources.map((source) => ({ value: source.source, label: source.display })),
    [sources],
  )

  const fieldOptions = useMemo(() => {
    const source = sources.find((s) => s.source === selectedSource)
    return Object.entries(source?.fields || {}).map(
      ([key, field]: [string, Field]): SelectOption => ({
        value: key,
        label: field.display,
      }),
    )
  }, [selectedSource, sources])

  const operatorOptions = useMemo(() => {
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

  useEffect(() => {
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

  const renderValueInput = () => {
    if (!selectedSource || !selectedField || !selectedOperator) {
      return null
    }

    const source = sources.find((s) => s.source === selectedSource)
    const field = source?.fields[selectedField]
    if (!field) return null

    const dataType = filterScheme.data_types[field.data_type]
    if (!dataType) return null

    const operator = dataType.filtering_operators[selectedOperator]
    if (!operator) return null

    if (operator.range) {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Controller
            name="value"
            control={control}
            render={({ field }) => {
              const rangeValue = parseRangeValue(field.value)
              return (
                <>
                  <div>
                    {renderRangeInput(dataType, "from", rangeValue, (value) => {
                      field.onChange({ ...rangeValue, from: value })
                    })}
                  </div>
                  <div>
                    {renderRangeInput(dataType, "to", rangeValue, (value) => {
                      field.onChange({ ...rangeValue, to: value })
                    })}
                  </div>
                </>
              )
            }}
          />
        </div>
      )
    }

    return renderSingleInput(dataType)
  }

  const renderRangeInput = (
    dataType: DataType,
    rangeType: "from" | "to",
    value: RangeValue,
    onChange: (value: string | number | null) => void,
  ) => {
    const currentValue = rangeType === "from" ? value.from : value.to

    switch (dataType.scope) {
      case "time": {
        const timeValue = parseTimeString(currentValue as string) || { hours: 12, minutes: 0, seconds: 0, period: "AM" }
        return (
          <TimePicker
            value={timeValue}
            onChange={(time) => {
              const formattedTime = formatTimeToString(time)
              onChange(formattedTime)
            }}
            format="12h"
          />
        )
      }
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !currentValue && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {rangeType === "from" ? "Desde" : "Hasta"}
                {currentValue ? `: ${String(currentValue)}` : ""}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CustomCalendar
                selected={currentValue ? new Date(convertToISODate(currentValue as string)) : undefined}
                onSelect={(date) => onChange(date ? format(date, "dd-MM-yyyy") : null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )
      default:
        return (
          <Input
            placeholder={`${rangeType === "from" ? "Desde" : "Hasta"}${currentValue ? `: ${String(currentValue)}` : ""}`}
            value={String(currentValue || "")}
            onChange={(e) => onChange(e.target.value)}
            type={dataType.primitive === "number" ? "number" : "text"}
          />
        )
    }
  }

  const renderSingleInput = (dataType: DataType) => (
    <Controller
      name="value"
      control={control}
      render={({ field }) => {
        switch (dataType.scope) {
          case "time": {
            const timeValue = parseTimeString(field.value as string) || {
              hours: 12,
              minutes: 0,
              seconds: 0,
              period: "AM",
            }
            return (
              <TimePicker
                value={timeValue}
                onChange={(time) => {
                  const formattedTime = formatTimeToString(time)
                  field.onChange(formattedTime)
                }}
                format="12h"
              />
            )
          }
          case "date":
            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Seleccionar fecha{field.value ? `: ${String(field.value)}` : ""}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CustomCalendar
                    selected={field.value ? new Date(convertToISODate(field.value as string)) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, "dd-MM-yyyy") : null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )
          case "option":
            if (dataType.options) {
              const options = Object.entries(dataType.options).map(([key, value]) => ({
                value: key,
                label: value,
              }))
              return (
                <CustomSelect
                  options={options}
                  value={String(field.value || "")}
                  onValueChange={field.onChange}
                  placeholder={`Seleccionar opción${field.value ? `: ${dataType.options?.[field.value as string] || ""}` : ""}`}
                />
              )
            }
            return (
              <Input
                {...field}
                value={String(field.value || "")}
                type={dataType.primitive === "number" ? "number" : "text"}
                placeholder={`Valor${field.value ? `: ${field.value}` : ""}`}
              />
            )
          default:
            return (
              <Input
                {...field}
                value={String(field.value || "")}
                type={dataType.primitive === "number" ? "number" : "text"}
                placeholder={`Valor${field.value ? `: ${field.value}` : ""}`}
              />
            )
        }
      }}
    />
  )

  const handleFormSubmit = handleSubmit((data: FilterFormData) => {
    const filter: Filter = {
      source: data.source,
      field: data.field,
      operator: data.operator,
      value: "", // Initialize with empty string
    }

    const dataType = getDataType(data.source, data.field, sources, filterScheme)
    if (dataType?.scope === "time") {
      const operator = dataType.filtering_operators[data.operator]
      if (operator?.range && typeof data.value === "object" && data.value !== null) {
        const rangeValue = data.value as RangeValue
        const fromTime = parseTimeString(rangeValue.from as string)
        const toTime = parseTimeString(rangeValue.to as string)

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
        filter.value = JSON.stringify(data.value)
      } else {
        filter.value = String(data.value || "")
      }
    } else {
      // For all other types, ensure we convert to string
      if (typeof data.value === "object" && data.value !== null) {
        filter.value = JSON.stringify(data.value)
      } else {
        filter.value = String(data.value || "")
      }
    }

    onSubmit(filter)
  })

  if (isGenericFilter) {
    return (
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="value">Valor</Label>
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={String(field.value || "")}
                placeholder="Buscar en todos los campos..."
                className="w-full"
              />
            )}
          />
          {errors.value && (
            <p className="text-sm text-destructive">
              {typeof errors.value.message === "string" ? errors.value.message : "Error en el valor"}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Actualizar filtro
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="source">Fuente</Label>
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <CustomSelect
              options={sourceOptions}
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value)
                setValue("field", "")
                setValue("operator", "")
                setValue("value", "")
              }}
              placeholder="Seleccionar fuente"
            />
          )}
        />
        {errors.source && (
          <p className="text-sm text-destructive">{errors.source.message || "Seleccione una fuente"}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="field">Campo</Label>
        <Controller
          name="field"
          control={control}
          render={({ field }) => (
            <CustomSelect
              options={fieldOptions}
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value)
                setValue("operator", "")
                setValue("value", "")
              }}
              placeholder="Seleccionar campo"
              disabled={!selectedSource}
            />
          )}
        />
        {errors.field && <p className="text-sm text-destructive">{errors.field.message || "Seleccione un campo"}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="operator">Operador</Label>
        <Controller
          name="operator"
          control={control}
          render={({ field }) => (
            <CustomSelect
              options={operatorOptions}
              value={field.value || ""}
              onValueChange={field.onChange}
              placeholder="Seleccionar operador"
              disabled={!selectedField}
            />
          )}
        />
        {errors.operator && (
          <p className="text-sm text-destructive">{errors.operator.message || "Seleccione un operador"}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor</Label>
        {renderValueInput()}
        {errors.value && <p className="text-sm text-destructive">{errors.value.message || "El valor es requerido"}</p>}
      </div>

      <Button type="submit" className="w-full">
        {initialFilter ? "Actualizar filtro" : "Agregar filtro"}
      </Button>
    </form>
  )
}



export { FilterForm }

