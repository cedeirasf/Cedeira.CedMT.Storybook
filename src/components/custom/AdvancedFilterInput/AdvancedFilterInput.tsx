import { fields, operators, sources } from '@/mocks/filter-data'
import { FilterFormData, FilterOption } from '@/types/components/advanced-input-filter.type'
import { Filter, Loader2, Plus, Search, Trash2 } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useDebounce from '../../../hooks/use-debounce'
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

const DEBOUNCE_DELAY = 300

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
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY)
  const [suggestions, setSuggestions] = useState<FilterOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | undefined>(undefined)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>(initialFilters)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSelectedFilters(initialFilters)
  }, [initialFilters])

  const handleSearch = useCallback(async () => {
    if (!debouncedQuery) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const results = await onSearch(debouncedQuery)
      setSuggestions(results)
    } catch (error) {
      console.error('Error searching:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery, onSearch])

  useEffect(() => {
    handleSearch()
  }, [debouncedQuery, handleSearch])

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

  const formatDateForDisplay = (value: string | number | Date): string => {
    if (value === 'today') {
      const now = new Date()
      return `Hoy ${now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`
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
        return `Hoy ${date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`
      }
      
      return date.toLocaleString('es', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date for display:', error)
      return String(value)
    }
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
          value = 'today'
        } else {
          value = inputDate.toISOString()
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
    
    if (value === 'today') {
      const now = new Date()
      return now.toISOString().slice(0, 16)
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
      <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Search input section */}
        <div className="flex min-w-[180px] flex-1 items-center gap-2 px-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                e.preventDefault()
                handleCreateTextFilter(query.trim())
              }
            }}
            className="w-full min-w-[120px] bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
            placeholder="Filtrar por..."
          />
        </div>

        {/* Tags section */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-1 items-center gap-2 px-2">
            <div className="flex items-center gap-2">
              <CustomTagFilter
                key={`visible-${selectedFilters[0].id}`}
                label={selectedFilters[0].label}
                onClick={() => handleFilterEdit(selectedFilters[0])}
                onRemove={() => handleRemoveFilter(selectedFilters[0].id)}
                color="neutral"
                size="sm"
                rounded="md"
                className="shrink-0 bg-gray-200 text-sm hover:bg-gray-300 max-w-[180px] truncate"
              />
              {selectedFilters.length > 1 && (
                <CustomTagFilter
                  key={`visible-${selectedFilters[1].id}`}
                  label={selectedFilters[1].label}
                  onClick={() => handleFilterEdit(selectedFilters[1])}
                  onRemove={() => handleRemoveFilter(selectedFilters[1].id)}
                  color="neutral"
                  size="sm"
                  rounded="md"
                  className="shrink-0 bg-gray-200 text-sm hover:bg-gray-300 max-w-[180px] truncate"
                />
              )}
            </div>
          </div>
        )}

        {/* Filter button section */}
        <div className="flex h-full shrink-0 items-center border-l border-gray-200 pl-1 pr-2 relative">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Filter className="h-4 w-4 text-gray-600" />
                {selectedFilters.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-medium text-white">
                    {selectedFilters.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[480px] p-0" 
              sideOffset={8}
            >
              <DropdownFilterList
                filters={selectedFilters}
                onSelect={handleFilterEdit}
                onRemove={handleRemoveFilter}
                variant="grid"
              />
              <div className="flex justify-end gap-2 border-t border-gray-100 p-2">
                <Button
                  size="sm"
                  onClick={handleAddNewFilter}
                  variant="default"
                  className="h-8 bg-green-500 text-white hover:bg-green-600"
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

      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-sm">
          <DropdownFilterList
            filters={suggestions}
            onSelect={handleSuggestionSelect}
            className="max-h-[240px]"
            variant="list"
          />
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
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

