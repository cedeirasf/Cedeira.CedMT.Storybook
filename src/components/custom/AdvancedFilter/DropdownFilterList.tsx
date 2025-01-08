import React from 'react'
import { Button } from '../../ui/button'
import { ScrollArea } from '../../ui/scroll-area'
import { FilterOption } from '@/types/components/advanced-input-filter.type'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'


interface DropdownFilterListProps {
  filters: FilterOption[]
  onSelect?: (filter: FilterOption) => void
  onRemove?: (filterId: string) => void
  isLoading?: boolean
  className?: string
  variant?: 'grid' | 'list'
}

export const DropdownFilterList: React.FC<DropdownFilterListProps> = ({
  filters,
  onSelect,
  onRemove,
  isLoading,
  className,
  variant = 'list'
}) => {
  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Cargando...
      </div>
    )
  }

  if (filters.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground dark:text-muted-foreground">
        No se encontraron resultados
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex flex-col space-y-1 p-2">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground dark:text-foreground"
            >
              <button
                className="flex-1 text-left"
                onClick={() => onSelect?.(filter)}
              >
                {filter.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="h-[320px]">
        <div className="grid grid-cols-2 gap-2 p-3">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
            >
              <button
                className="flex-1 truncate text-left"
                onClick={() => onSelect?.(filter)}
              >
                {filter.label}
              </button>
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-5 w-5 shrink-0 rounded-full p-0 hover:bg-gray-400/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(filter.id)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

