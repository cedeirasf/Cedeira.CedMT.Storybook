import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilterForm } from "@/hooks/use-filter-form";
import { parseRangeValue } from "@/lib/filters-utils";
import {
  convertToISODate,
  formatTimeToString,
  parseTimeString,
} from "@/lib/time-utilts";
import { cn } from "@/lib/utils";
import {
  DataType,
  FilterFormData,
  FilterFormProps,
  RangeValue,
} from "@/types/components/custom-advanced-input-filter.type";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CustomCalendar } from "../CustomCalendar";
import { CustomSelect } from "../CustomSelect";
import { TimePicker } from "../CustomTimePicker";

export function FilterForm({
  initialFilter,
  onSubmit,
  filterScheme,
  sources,
}: FilterFormProps) {
  const {
    control,
    handleSubmit,
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
  } = useFilterForm({ initialFilter, onSubmit, filterScheme, sources });

  if (isGenericFilter) {
    return (
      <GenericFilterForm
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Fuente" name="source" errors={errors}>
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <CustomSelect
              options={sourceOptions}
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
                setValue("field", "");
                setValue("operator", "");
                setValue("value", "");
              }}
              placeholder="Seleccionar fuente"
            />
          )}
        />
      </FormField>

      <FormField label="Campo" name="field" errors={errors}>
        <Controller
          name="field"
          control={control}
          render={({ field }) => (
            <CustomSelect
              options={fieldOptions}
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
                setValue("operator", "");
                setValue("value", "");
              }}
              placeholder="Seleccionar campo"
              disabled={!selectedSource}
            />
          )}
        />
      </FormField>

      <FormField label="Operador" name="operator" errors={errors}>
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
      </FormField>

      <FormField label="Valor" name="value" errors={errors}>
        <ValueInput
          control={control}
          dataType={getDataTypeForSelectedField()}
          operator={selectedOperator}
        />
      </FormField>

      <Button type="submit" className="w-full">
        {initialFilter ? "Actualizar filtro" : "Agregar filtro"}
      </Button>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  errors: FieldErrors<FilterFormData>;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  errors,
  children,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    {children}
    {errors[name as keyof FilterFormData] && (
      <p className="text-sm text-destructive">
        {errors[name as keyof FilterFormData]?.message}
      </p>
    )}
  </div>
);

interface GenericFilterFormProps {
  control: Control<FilterFormData>;
  errors: FieldErrors<FilterFormData>;
  handleSubmit: () => void;
}

const GenericFilterForm: React.FC<GenericFilterFormProps> = ({
  control,
  errors,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <FormField label="Valor" name="value" errors={errors}>
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
    </FormField>
    <Button type="submit" className="w-full">
      Actualizar filtro
    </Button>
  </form>
);

interface ValueInputProps {
  control: Control<FilterFormData>;
  dataType: DataType | null;
  operator: string;
}

function ValueInput({ control, dataType, operator }: ValueInputProps) {
  if (!dataType || !operator) return null;

  const operatorConfig = dataType.filtering_operators[operator];
  if (!operatorConfig) return null;

  if (operatorConfig.range) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Controller
          name="value"
          control={control}
          render={({ field }) => {
            const rangeValue = parseRangeValue(field.value);
            return (
              <>
                <div>
                  {renderRangeInput(dataType, "from", rangeValue, (value) => {
                    field.onChange({ ...rangeValue, from: value });
                  })}
                </div>
                <div>
                  {renderRangeInput(dataType, "to", rangeValue, (value) => {
                    field.onChange({ ...rangeValue, to: value });
                  })}
                </div>
              </>
            );
          }}
        />
      </div>
    );
  }

  return renderSingleInput(dataType, control);
}

function renderRangeInput(
  dataType: DataType,
  rangeType: "from" | "to",
  value: RangeValue,
  onChange: (value: string | number | null) => void
) {
  const currentValue = rangeType === "from" ? value.from : value.to;

  switch (dataType.scope) {
    case "time": {
      const timeValue = parseTimeString(currentValue as string) || {
        hours: 12,
        minutes: 0,
        seconds: 0,
        period: "AM",
      };
      return (
        <TimePicker
          value={timeValue}
          onChange={(time) => {
            const formattedTime = formatTimeToString(time);
            onChange(formattedTime);
          }}
          format="24h"
        />
      );
    }
    case "date":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !currentValue && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {rangeType === "from" ? "Desde" : "Hasta"}
              {currentValue
                ? `: ${format(
                    new Date(convertToISODate(currentValue as string)),
                    "dd-MM-yyyy"
                  )}`
                : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CustomCalendar
              selected={
                currentValue
                  ? new Date(convertToISODate(currentValue as string))
                  : undefined
              }
              onSelect={(date) =>
                onChange(date ? format(date, "dd-MM-yyyy") : null)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    default:
      return (
        <Input
          placeholder={`${rangeType === "from" ? "Desde" : "Hasta"}${
            currentValue ? `: ${String(currentValue)}` : ""
          }`}
          value={String(currentValue || "")}
          onChange={(e) => onChange(e.target.value)}
          type={dataType.primitive === "number" ? "number" : "text"}
        />
      );
  }
}

function renderSingleInput(
  dataType: DataType,
  control: Control<FilterFormData>
) {
  return (
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
            };
            return (
              <TimePicker
                value={timeValue}
                onChange={(time) => {
                  const formattedTime = formatTimeToString(time);
                  field.onChange(formattedTime);
                }}
                format="24h"
              />
            );
          }
          case "date":
            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Seleccionar fecha
                    {field.value
                      ? `: ${format(
                          new Date(convertToISODate(field.value as string)),
                          "dd-MM-yyyy"
                        )}`
                      : ""}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CustomCalendar
                    selected={
                      field.value
                        ? new Date(convertToISODate(field.value as string))
                        : undefined
                    }
                    onSelect={(date) =>
                      field.onChange(date ? format(date, "dd-MM-yyyy") : null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            );
          case "option":
            if (dataType.options) {
              const options = Object.entries(dataType.options).map(
                ([key, value]) => ({
                  value: key,
                  label: value,
                })
              );
              return (
                <CustomSelect
                  options={options}
                  value={String(field.value || "")}
                  onValueChange={field.onChange}
                  placeholder={`Seleccionar opción${
                    field.value
                      ? `: ${dataType.options?.[field.value as string] || ""}`
                      : ""
                  }`}
                />
              );
            }
            return (
              <Input
                {...field}
                value={String(field.value || "")}
                type={dataType.primitive === "number" ? "number" : "text"}
                placeholder={`Valor${field.value ? `: ${field.value}` : ""}`}
              />
            );
          default:
            return (
              <Input
                {...field}
                value={String(field.value || "")}
                type={dataType.primitive === "number" ? "number" : "text"}
                placeholder={`Valor${field.value ? `: ${field.value}` : ""}`}
              />
            );
        }
      }}
    />
  );
}

export default FilterForm;
