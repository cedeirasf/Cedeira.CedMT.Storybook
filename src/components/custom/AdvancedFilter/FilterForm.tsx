import { CustomCalendar } from "@/components/custom/CustomCalendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { FilterFormData, filterFormSchema, type Filter, type FilterFormProps } from "@/types/components/custom-advanced-input-filter.type"
import { SelectOption } from "@/types/components/custom-select.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, isValid, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { CustomSelect } from "../CustomSelect"

export function FilterForm({ initialFilter, onSubmit, filterScheme, sources }: FilterFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const previousFieldRef = useRef<string>("")

  const isGenericFilter = initialFilter?.source === "*" && initialFilter?.field === "*"

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      source: initialFilter?.source || "",
      field: initialFilter?.field || "",
      operator: initialFilter?.operator || "",
      value: initialFilter?.value?.toString() || "",
    },
  })

  const watchedSource = watch("source")
  const watchedField = watch("field")

  const selectedSource = useMemo(() => sources.find((s) => s.source === watchedSource), [sources, watchedSource])

  const selectedField = useMemo(() => selectedSource?.fields[watchedField], [selectedSource, watchedField])

  const selectedDataType = useMemo(
    () => (selectedField ? filterScheme.data_types[selectedField.data_type] : null),
    [selectedField, filterScheme],
  )

  // Reset value when field changes to prevent type mismatches
  useEffect(() => {
    if (watchedField !== previousFieldRef.current) {
      setValue("value", "")
      setValue("operator", "")
      previousFieldRef.current = watchedField
    }
  }, [watchedField, setValue])

  const sourceOptions = useMemo(
    () =>
      sources.map(
        (source): SelectOption => ({
          value: source.source,
          label: source.display,
        }),
      ),
    [sources],
  )

  const fieldOptions = useMemo(
    () =>
      selectedSource
        ? Object.entries(selectedSource.fields).map(
            ([key, field]): SelectOption => ({
              value: key,
              label: field.display,
            }),
          )
        : [],
    [selectedSource],
  )

  const operatorOptions = useMemo(
    () =>
      selectedDataType
        ? Object.entries(selectedDataType.filtering_operators).map(
            ([key, operator]): SelectOption => ({
              value: key,
              label: operator.display,
            }),
          )
        : [],
    [selectedDataType],
  )

  const valueOptions = useMemo(
    () =>
      selectedDataType?.options
        ? Object.entries(selectedDataType.options).map(
            ([value, label]): SelectOption => ({
              value,
              label: label.toString(),
            }),
          )
        : [],
    [selectedDataType],
  )

  useEffect(() => {
    if (!initialFilter) return

    if (initialFilter.source === "*" && initialFilter.field === "*") {
      setValue("source", initialFilter.source)
      setValue("field", initialFilter.field)
      setValue("operator", initialFilter.operator)
      setValue("value", initialFilter.value?.toString() || "")
      return
    }

    startTransition(() => {
      const source = sources.find((s) => s.source === initialFilter.source)
      const field = source?.fields[initialFilter.field]
      const dataType = field ? filterScheme.data_types[field.data_type] : null

      setValue("source", initialFilter.source)
      setValue("field", initialFilter.field)
      setValue("operator", initialFilter.operator)

      if (dataType?.primitive === "date" && initialFilter.value) {
        try {
          const date = parseISO(initialFilter.value.toString())
          if (isValid(date)) {
            setValue("value", date.toISOString())
          } else {
            setValue("value", "")
          }
        } catch (error) {
          console.error("Error parsing date:", error)
          setValue("value", "")
        }
      } else {
        setValue("value", initialFilter.value?.toString() || "")
      }
    })
  }, [initialFilter, setValue, sources, filterScheme])

  const handleFormSubmit = useCallback(
    (data: FilterFormData) => {
      if (!data.source || !data.field || !data.operator || data.value === undefined) {
        return
      }

      const filter: Filter = {
        source: data.source,
        field: data.field,
        operator: data.operator,
        value: data.value.toString(),
      }

      startTransition(() => {
        onSubmit(filter)
      })
    },
    [onSubmit],
  )

  const renderValueInput = useCallback(() => {
    if (watchedSource === "*" && watchedField === "*") {
      return (
        <Controller
          name="value"
          control={control}
          render={({ field }) => <Input {...field} type="text" placeholder="Ingrese un valor" />}
        />
      )
    }

    if (!selectedDataType) return null

    if (selectedDataType.primitive === "date") {
      return (
        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value && isValid(parseISO(field.value.toString())) ? (
                    format(parseISO(field.value.toString()), "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomCalendar
                
                  selected={field.value && isValid(parseISO(field.value.toString())) ? parseISO(field.value.toString()) : undefined}
                  onSelect={(date) => {
                    field.onChange(date ? date.toISOString() : "")
                    setIsCalendarOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
      )
    }

    if (selectedDataType.options) {
      return (
        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <CustomSelect
              options={valueOptions}
              placeholder="Seleccionar valor"
              value={field.value?.toString() || ""}
              onValueChange={field.onChange}
              disabled={isPending}
            />
          )}
        />
      )
    }

    if (selectedDataType.primitive === "number") {
      return (
        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
              placeholder="Ingrese un número"
              disabled={isPending}
            />
          )}
        />
      )
    }

    return (
      <Controller
        name="value"
        control={control}
        render={({ field }) => <Input {...field} type="text" placeholder="Ingrese un valor" disabled={isPending} />}
      />
    )
  }, [watchedSource, watchedField, selectedDataType, control, isCalendarOpen, valueOptions, isPending])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {!isGenericFilter && (
        <>
          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-medium">
              Fuente
            </Label>
            <div className="w-full">
              <Controller
                name="source"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={sourceOptions}
                    placeholder="Seleccionar fuente"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  />
                )}
              />
            </div>
            {errors.source && <p className="text-sm text-destructive">{errors.source.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="field" className="text-sm font-medium">
              Campo
            </Label>
            <div className="w-full">
              <Controller
                name="field"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={fieldOptions}
                    placeholder="Seleccionar campo"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!watchedSource || isPending}
                  />
                )}
              />
            </div>
            {errors.field && <p className="text-sm text-destructive">{errors.field.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="operator" className="text-sm font-medium">
              Operador
            </Label>
            <div className="w-full">
              <Controller
                name="operator"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={operatorOptions}
                    placeholder="Seleccionar operador"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!watchedField || isPending}
                  />
                )}
              />
            </div>
            {errors.operator && <p className="text-sm text-destructive">{errors.operator.message}</p>}
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="value" className="text-sm font-medium">
          {isGenericFilter ? "Buscar por" : "Valor"}
        </Label>
        <div className="w-full">{renderValueInput()}</div>
        {errors.value && <p className="text-sm text-destructive">{errors.value.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {initialFilter ? "Actualizar filtro" : "Crear filtro"}
      </Button>
    </form>
  )
}

