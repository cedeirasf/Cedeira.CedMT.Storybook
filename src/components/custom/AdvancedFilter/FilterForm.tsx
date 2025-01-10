import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fields, operators, sources } from '@/mocks/filter-data'
import { Field, FilterFormData, filterFormSchema, FilterOption } from '@/types/components/advanced-input-filter.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CustomCalendar } from '../../custom/CustomCalendar'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

interface FilterFormProps {
  initialData?: FilterOption;
  onSubmit: (data: FilterFormData) => void;
  formId?: string;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  initialData,
  onSubmit,
  formId = 'filter-form'
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      source: initialData?.source || '',
      field: initialData?.field || '',
      operator: initialData?.operator || '',
      value: formatInitialValue(initialData) || '',
    }
  })

  const watchedField = watch('field')
  const selectedField = fields.find(f => f.id === watchedField)

  function formatInitialValue(data?: FilterOption): string {
    if (!data || data.value === undefined) return ''

    if (data.type === 'date') {
      if (typeof data.value === 'string' && data.value.startsWith('today')) {
        const [, time] = data.value.split(' ')
        const now = new Date()
        now.setHours(parseInt(time.split(':')[0], 10))
        now.setMinutes(parseInt(time.split(':')[1], 10))
        return now.toISOString().slice(0, 16)
      }

      try {
        const date = new Date(data.value)
        return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16)
      } catch (error) {
        console.error('Error formatting date:', error)
        return ''
      }
    }

    return data.value.toString()
  }

  useEffect(() => {
    if (initialData) {
      setValue('source', initialData.source || '')
      setValue('field', initialData.field || '')
      setValue('operator', initialData.operator || '')
      setValue('value', formatInitialValue(initialData))
    }
  }, [initialData, setValue])

  const availableOperators = selectedField
    ? operators.filter(op => selectedField.operators.includes(op.id))
    : operators

  const handleChange = (field: keyof FilterFormData, value: string) => {
    setValue(field, value)
    if (field === 'field') {
      setValue('operator', '')
      setValue('value', '')
    }
  }

  const isValueDisabled = watch('operator') === '5' || watch('operator') === '6'

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().slice(0, 16)
      setValue('value', formattedDate)
      setIsCalendarOpen(false)
    }
  }

  const getInputType = (field: Field | undefined) => {
    if (!field) return 'text'
    switch (field.type) {
      case 'date':
        return 'date'
      case 'number':
        return 'number'
      default:
        return 'text'
    }
  }

  return (
    <form
      id={formId}
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="source">Origen</Label>
        <Select
          onValueChange={(value) => handleChange('source', value)}
          defaultValue={watch('source')}
        >
          <SelectTrigger id="source">
            <SelectValue placeholder="Seleccionar origen" />
          </SelectTrigger>
          <SelectContent>
            {sources.map((source) => (
              <SelectItem key={source.id} value={source.id}>
                <span className="truncate">{source.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.source && <p className="text-sm text-red-500">{errors.source.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="field">Campo</Label>
        <Select
          onValueChange={(value) => handleChange('field', value)}
          defaultValue={watch('field')}
        >
          <SelectTrigger id="field">
            <SelectValue placeholder="Seleccionar campo" />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                <span className="truncate">{field.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.field && <p className="text-sm text-red-500">{errors.field.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="operator">Operador</Label>
        <Select
          onValueChange={(value) => handleChange('operator', value)}
          defaultValue={watch('operator')}
          disabled={!watch('field')}
        >
          <SelectTrigger id="operator">
            <SelectValue placeholder="Seleccionar operador" />
          </SelectTrigger>
          <SelectContent>
            {availableOperators.map((operator) => (
              <SelectItem key={operator.id} value={operator.id}>
                <span className="truncate">{operator.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.operator && <p className="text-sm text-red-500">{errors.operator.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor</Label>
        {selectedField && selectedField.type === 'date' ? (
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={`w-full justify-between text-left font-normal ${!watch('value') && "text-muted-foreground"
                  }`}
              >
                {(() => {
                  const value = watch('value');
                  if (value && typeof value === 'string') {
                    return format(new Date(value), "dd/MM/yyyy", { locale: es });
                  }
                  return <span>Seleccionar fecha</span>;
                })()}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CustomCalendar
                selected={(() => {
                  const value = watch('value');
                  return value && typeof value === 'string' ? new Date(value) : undefined;
                })()}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          <Input
            id="value"
            type={getInputType(selectedField)}
            {...register('value')}
            placeholder={selectedField?.type === 'date' ? 'Seleccionar fecha' : 'Ingrese un valor'}
            disabled={isValueDisabled}
          />
        )}
        {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
      </div>
    </form>
  )
}

