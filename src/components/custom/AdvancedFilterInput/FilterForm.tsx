import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { sources, fields, operators } from '@/mocks/filter-data'
import { FilterFormData, FilterOption } from '@/types/components/advanced-input-filter.type'


interface FilterFormProps {
  initialData?: FilterOption;
  onSubmit: (data: FilterFormData) => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FilterFormData>(() => ({
    source: initialData?.source || '',
    field: initialData?.field || '',
    operator: initialData?.operator || '',
    value: formatInitialValue(initialData) || '',
  }))

  function formatInitialValue(data?: FilterOption): string {
    if (!data || data.value === undefined) return ''
    
    if (data.type === 'date') {
      // Preserve the 'today' special value
      if (data.value === 'today') {
        const now = new Date()
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
      setFormData({
        source: initialData.source || '',
        field: initialData.field || '',
        operator: initialData.operator || '',
        value: formatInitialValue(initialData),
      })
    } else {
      setFormData({
        source: '',
        field: '',
        operator: '',
        value: '',
      })
    }
  }, [initialData])

  const selectedField = fields.find(f => f.id === formData.field)

  const availableOperators = selectedField
    ? operators.filter(op => selectedField.operators.includes(op.id))
    : operators

  const handleChange = (field: keyof FilterFormData, value: string) => {
    if (field === 'field') {
      const newField = fields.find(f => f.id === value)
      setFormData(prev => ({
        ...prev,
        [field]: value,
        operator: '',
        value: newField?.type === 'date' ? '' : prev.value,
      }))
    } else if (field === 'value' && selectedField?.type === 'date') {
      // For date fields, store the actual value
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isValueDisabled = formData.operator === '5' || formData.operator === '6'

  const getInputType = () => {
    if (!selectedField) return 'text'
    switch (selectedField.type) {
      case 'date':
        return 'datetime-local'
      case 'number':
        return 'number'
      default:
        return 'text'
    }
  }

  return (
    <form 
      id="filter-form" 
      className="space-y-4" 
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="source">Origen</Label>
        <Select
          value={formData.source}
          onValueChange={(value) => handleChange('source', value)}
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="field">Campo</Label>
        <Select
          value={formData.field}
          onValueChange={(value) => handleChange('field', value)}
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="operator">Operador</Label>
        <Select
          value={formData.operator}
          onValueChange={(value) => handleChange('operator', value)}
          disabled={!formData.field}
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor</Label>
        <Input
          id="value"
          type={getInputType()}
          value={formData.value}
          onChange={(e) => handleChange('value', e.target.value)}
          placeholder={selectedField?.type === 'date' ? 'Seleccionar fecha y hora' : 'Ingrese un valor'}
          disabled={isValueDisabled}
        />
      </div>
    </form>
  )
}

