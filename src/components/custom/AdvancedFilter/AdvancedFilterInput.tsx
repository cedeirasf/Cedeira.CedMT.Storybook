import { fields, operators, sources } from '@/mocks/filter-data'
import { FilterFormData, FilterOption } from '@/types/components/advanced-input-filter.type'
import { Filter, Plus, Trash2 } from 'lucide-react'
import React, { useCallback, useRef, useState } from 'react'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../CustomSheet'
import CustomTagFilter from '../CustomTagFilter'
import { DropdownFilterList } from './DropdownFilterList'
import { FilterForm } from './FilterForm'
import { InputDebounce } from './InputDebounce'

interface AdvancedFilterInputProps {
  onAddFilter: (filter: FilterOption) => void
  onRemoveFilter: (filterId: string) => void
  onClearAll: () => void
  onSearch: (query: string) => Promise<FilterOption[]>
  selectedFilters?: FilterOption[]
}

export const AdvancedFilterInput: React.FC<AdvancedFilterInputProps> = ({
  onAddFilter,
  onRemoveFilter,
  onClearAll,
  onSearch,
  selectedFilters: initialFilters = [],
}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<FilterOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | undefined>(undefined)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>(initialFilters)
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setSuggestions([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const results = await onSearch(searchQuery)
      setSuggestions(results)
    } catch (error) {
      console.error('Error searching:', error)
      setSuggestions([])
      setError('Ocurrió un error durante la búsqueda. Por favor, intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }, [onSearch])

  const formatDateForDisplay = (value: string | number | Date): string => {
    if (typeof value === 'string' && value.startsWith('today')) {
      const [, time] = value.split(' ')
      const now = new Date()
      return `Hoy ${time || now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`
    }
    try {
      const date = new Date(value)
      if (isNaN(date.getTime())) return String(value)
      
      const today = new Date()
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        return `Hoy ${date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`
      }
      
      return date.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date for display:', error)
      return String(value)
    }
  }

  const getFilterDisplayText = (filter: Partial<FilterOption>): string => {
    if (!filter.field || !filter.operator) return '';
    
    const fieldLabel = fields.find(f => f.id === filter.field)?.label || ''
    const operatorLabel = operators.find(o => o.id === filter.operator)?.label || ''
    const sourceLabel = filter.source ? sources.find(s => s.id === filter.source)?.label || '' : ''

    if (filter.operator === '5') return `${fieldLabel} está vacío`
    if (filter.operator === '6') return `${fieldLabel} no está vacío`

    let displayValue = filter.value
    if (filter.type === 'date' && filter.value) {
      displayValue = formatDateForDisplay(filter.value)
    }

    return `${sourceLabel ? `${sourceLabel}: ` : ''}${fieldLabel} ${operatorLabel.toLowerCase()} ${displayValue || ''}`
  }

  const handleFormSubmit = (data: FilterFormData) => {
    const field = fields.find(f => f.id === data.field)
    let value = data.value

    if (field?.type === 'date' && value) {
      try {
        const inputDate = new Date(value)
        const today = new Date()
        
        if (
          inputDate.getFullYear() === today.getFullYear() &&
          inputDate.getMonth() === today.getMonth() &&
          inputDate.getDate() === today.getDate()
        ) {
          value = `today ${inputDate.toTimeString().slice(0, 5)}` // Store as "today HH:MM"
        } else {
          value = inputDate.toISOString() // Store full ISO string
        }
      } catch (error) {
        console.error('Error processing date value:', error)
      }
    }

    const newFilter: FilterOption = {
      id: selectedFilter?.id || `new-${Date.now()}`,
      type: field?.type || 'text',
      label: getFilterDisplayText({
        ...data,
        type: field?.type || 'text',
        value,
      }),
      ...data,
      value,
    }

    setSelectedFilters(prev => {
      const existingFilterIndex = prev.findIndex(f => f.id === newFilter.id)
      if (existingFilterIndex !== -1) {
        return prev.map((f, index) => index === existingFilterIndex ? newFilter : f)
      } else {
        return [...prev, newFilter]
      }
    })
    onAddFilter(newFilter)
    setIsSheetOpen(false)
    setSelectedFilter(undefined)
    setQuery('')
    setIsDropdownOpen(false)
  }

  const handleSuggestionSelect = (filter: FilterOption) => {
    setSelectedFilter(filter)
    setIsSheetOpen(true)
    setSuggestions([])
  }

  const handleAddNewFilter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedFilter(undefined)
    setIsSheetOpen(true)
    setIsDropdownOpen(false)
  }

  const handleFilterEdit = (filter: FilterOption) => {
    const editingFilter = selectedFilters.find(f => f.id === filter.id)
    if (editingFilter) {
      setSelectedFilter({
        ...editingFilter,
        value: editingFilter.type === 'date' 
          ? formatDateForInput(editingFilter.value)
          : editingFilter.value?.toString() || '',
      })
      setIsSheetOpen(true)
      setIsDropdownOpen(false)
    }
  }

  const formatDateForInput = (value: string | number | Date | undefined): string => {
    if (!value) return ''
    
    if (typeof value === 'string') {
      if (value.startsWith('today')) {
        const [, time = '00:00'] = value.split(' ')
        const [hours, minutes] = time.split(':')
        const now = new Date()
        now.setHours(parseInt(hours, 10))
        now.setMinutes(parseInt(minutes, 10))
        return now.toISOString().slice(0, 16)
      } else if (value.includes('T')) {
        // It's likely an ISO string, so we can return it as is
        return value.slice(0, 16)
      }
    }
    
    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16)
    } catch (error) {
      console.error('Error formatting date for input:', error)
      return ''
    }
  }

  const handleRemoveFilter = (filterId: string) => {
    setSelectedFilters(prev => prev.filter(filter => filter.id !== filterId))
    onRemoveFilter(filterId)
  }

  const handleClearAll = () => {
    setSelectedFilters([])
    onClearAll()
    setIsDropdownOpen(false)
  }

  const handleCreateTextFilter = (text: string) => {
    const newFilter: FilterOption = {
      id: `text-${Date.now()}`,
      label: text,
      type: 'text',
      value: text
    }
    setSelectedFilters(prev => [...prev, newFilter])
    onAddFilter(newFilter)
    setQuery('')
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <InputDebounce
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              e.preventDefault()
              handleCreateTextFilter(query.trim())
            }
          }}
          onSearch={handleSearch}
          isLoading={isLoading}
          className="pr-[90px]"
          placeholder="Filtrar por..."
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {selectedFilters.length > 0 && (
            <div className="flex items-center gap-1">
              {selectedFilters.slice(0, 2).map((filter) => (
                <CustomTagFilter
                  key={`visible-${filter.id}`}
                  label={filter.label}
                  onClick={() => handleFilterEdit(filter)}
                  onRemove={() => handleRemoveFilter(filter.id)}
                  color="neutral"
                  size="sm"
                  rounded="md"
                  className="shrink-0 bg-secondary/80 text-xs hover:bg-secondary max-w-[100px] truncate dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                />
              ))}
            </div>
          )}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-secondary hover:bg-secondary/80 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
              >
                <Filter className="h-4 w-4 text-foreground" />
                {selectedFilters.length > 2 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {selectedFilters.length - 2}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[280px] sm:w-[480px] p-0"
              sideOffset={8}
            >
              <DropdownFilterList
                filters={selectedFilters}
                onSelect={handleFilterEdit}
                onRemove={handleRemoveFilter}
                variant="grid"
              />
              <div className="flex justify-end gap-2 border-t border-border p-2">
                <Button
                  size="sm"
                  onClick={handleAddNewFilter}
                  variant="default"
                  className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Agregar
                </Button>
                {selectedFilters.length > 0 && (
                  <Button
                    size="sm"
                    onClick={handleClearAll}
                    variant="destructive"
                    className="h-8"
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Limpiar
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-background shadow-sm dark:bg-card">
          <DropdownFilterList
            filters={suggestions}
            onSelect={handleSuggestionSelect}
            className="max-h-[240px]"
            variant="list"
          />
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[100dvw] sm:w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {selectedFilter ? 'Editar filtro' : 'Agregar nuevo filtro'}
            </SheetTitle>
            <SheetDescription>
              Agregar filtros para refinar tus resultados.
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            <FilterForm
              key={`filter-form-${selectedFilter?.id || 'new'}`}
              initialData={selectedFilter}
              onSubmit={handleFormSubmit}
            />
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                variant="outline"
                onClick={() => setIsDropdownOpen(false)}
              >
                Cancelar
              </Button>
            </SheetClose>
            <Button
              type="submit"
              form="filter-form"
            >
              {selectedFilter ? 'Actualizar' : 'Crear Filtro'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

